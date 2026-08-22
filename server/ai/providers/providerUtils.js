/**
 * Shared provider utilities: structured-response parsing, error normalization,
 * and retryable-error classification.
 *
 * Design goals (see plan §E / §D):
 *  - Distinguish FATAL config errors (bad key / bad model / malformed request)
 *    from RETRYABLE transport errors (429 / 5xx / network) so the router can
 *    stop cascading through providers on a config problem.
 *  - Never leak API keys, headers, or endpoint URLs in thrown messages.
 */

/** A typed error carrying enough metadata for the router to decide policy. */
export class ProviderError extends Error {
  constructor(message, { code, retryable = false, provider = null, envVar = null, status = null, detail = null } = {}) {
    super(message);
    this.name = "ProviderError";
    this.code = code;              // auth | model | bad_request | rate_limit | server | network | schema_validation | parse | unknown
    this.retryable = retryable;    // whether the router may try the next provider
    this.provider = provider;      // "Groq" | "Gemini" | "OpenRouter"
    this.envVar = envVar;          // actionable env var to check, when applicable
    this.status = status;          // HTTP status if known
    this.detail = detail;          // short extra context (never secrets)
  }
}

// Transport-level codes that justify falling through to the next provider.
const RETRYABLE_CODES = new Set(["rate_limit", "server", "network"]);

/**
 * Whether an error should trigger a transport fallback to the next provider.
 * Content problems (schema_validation / parse) are handled by the router's
 * repair branch, not here, so they are intentionally NOT retryable transports.
 */
export function isRetryableProviderError(err) {
  if (!err) return false;
  if (typeof err.retryable === "boolean" && err.code && RETRYABLE_CODES.has(err.code)) return true;
  if (err.code && RETRYABLE_CODES.has(err.code)) return true;
  return false;
}

/**
 * Map any thrown provider/transport error into a common ProviderError shape.
 * Idempotent: a ProviderError passes through unchanged.
 */
export function normalizeProviderError(error, { provider = "Provider", keyEnv = null, modelEnv = null } = {}) {
  if (error instanceof ProviderError) return error;

  const status = error?.status ?? error?.statusCode ?? error?.response?.status ?? null;
  const rawMsg =
    error?.error?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    String(error ?? "Unknown error");
  const lower = String(rawMsg).toLowerCase();
  const errName = error?.name || "";
  const errCode = error?.code || error?.error?.code || "";

  const mk = (code, retryable, message) =>
    new ProviderError(message, {
      code,
      retryable,
      provider,
      envVar: code === "auth" ? keyEnv : code === "model" ? modelEnv : null,
      status,
      detail: rawMsg.slice(0, 300),
    });

  // --- Network / timeout (fetch threw; usually no HTTP status) ---
  const networkCodes = ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "EPIPE", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT"];
  if (
    errName === "AbortError" ||
    networkCodes.includes(errCode) ||
    (errName === "TypeError" && lower.includes("fetch failed")) ||
    lower.includes("network") ||
    lower.includes("timed out") ||
    lower.includes("timeout") ||
    lower.includes("connection reset")
  ) {
    return mk("network", true, `${provider} network error or timeout.`);
  }

  // --- Auth (fatal) ---
  if (
    status === 401 || status === 403 ||
    lower.includes("api key") || lower.includes("api_key") ||
    lower.includes("unauthorized") || lower.includes("invalid key") ||
    lower.includes("user not found") || lower.includes("no auth credentials") ||
    lower.includes("authentication")
  ) {
    return mk("auth", false, `${provider} authentication failed. Check ${keyEnv || "the API key"}.`);
  }

  // --- Model unavailable / decommissioned (fatal) ---
  if (
    status === 404 ||
    errCode === "model_not_found" || errCode === "model_decommissioned" ||
    (lower.includes("model") &&
      (lower.includes("does not exist") || lower.includes("not found") ||
        lower.includes("decommission") || lower.includes("unavailable") ||
        lower.includes("invalid")))
  ) {
    return mk("model", false, `${provider} is enabled but the configured model is unavailable. Check ${modelEnv || "the model setting"}.`);
  }

  // --- Rate limit (retryable) ---
  if (status === 429 || lower.includes("rate limit") || lower.includes("too many requests")) {
    return mk("rate_limit", true, `${provider} is rate limited (429).`);
  }

  // --- Request timeout / server errors (retryable) ---
  if (status === 408) return mk("network", true, `${provider} request timed out (408).`);
  if (status && status >= 500) return mk("server", true, `${provider} server error (${status}).`);

  // --- Malformed request (fatal) ---
  if (status === 400) return mk("bad_request", false, `${provider} rejected the request as malformed.`);

  // --- Unknown → treat as fatal to avoid blind cascading (plan §D) ---
  return mk("unknown", false, `${provider} request failed: ${rawMsg.slice(0, 200)}`);
}

/**
 * Parse a model's text response into JSON, tolerating markdown code fences and
 * surrounding prose. Throws a ProviderError('parse') when unrecoverable.
 */
export function parseStructuredResponse(text) {
  if (text == null || String(text).trim() === "") {
    throw new ProviderError("Empty response from provider.", { code: "parse", retryable: false });
  }
  let s = String(text).trim();

  // Strip a full ```json ... ``` / ``` ... ``` wrapper, else leading/trailing fences.
  const fenceMatch = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) {
    s = fenceMatch[1].trim();
  } else {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }

  // 1) Direct parse.
  try {
    return JSON.parse(s);
  } catch (_) {}

  // 2) Trim to the outermost JSON object/array and retry.
  const firstObj = s.indexOf("{");
  const firstArr = s.indexOf("[");
  let start;
  if (firstObj === -1) start = firstArr;
  else if (firstArr === -1) start = firstObj;
  else start = Math.min(firstObj, firstArr);

  const end = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));

  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(s.slice(start, end + 1));
    } catch (_) {}
  }

  throw new ProviderError("Failed to parse structured JSON from provider response.", { code: "parse", retryable: false });
}

/**
 * Validate parsed data against a Zod schema. Returns validated data, or throws
 * ProviderError('schema_validation') listing failing field paths (no values).
 */
export function validateStructured(schema, parsed, provider = "Provider") {
  if (!schema) return parsed;
  const result = schema.safeParse(parsed);
  if (result.success) return result.data;

  const issues = (result.error?.issues || [])
    .slice(0, 8)
    .map((i) => `${(i.path || []).join(".") || "(root)"}: ${i.message}`)
    .join("; ");

  throw new ProviderError(`${provider} returned data that failed schema validation.`, {
    code: "schema_validation",
    retryable: false,
    provider,
    detail: issues.slice(0, 300),
  });
}
