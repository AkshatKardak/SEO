import { GroqProvider } from "./GroqProvider.js";
import { GeminiProvider } from "./GeminiProvider.js";
import { OpenRouterProvider } from "./OpenRouterProvider.js";
import { ProviderError, normalizeProviderError } from "./providerUtils.js";

/**
 * Router across the three supported providers: Groq -> Gemini -> OpenRouter.
 *
 * Design (plan §C / §D):
 *  - Only providers whose key is present are ever used. DeepSeek / Anthropic /
 *    OpenAI are never imported or instantiated.
 *  - Fallback happens ONLY for retryable transport errors (rate_limit / server /
 *    network). A fatal config error (auth / model / bad_request / unknown) is
 *    surfaced immediately with an actionable message and does NOT cascade.
 *  - schema_validation / parse failures get one repair retry on the same
 *    provider, then fall through to the next provider; invalid data is never
 *    returned.
 *  - Logs carry provider + code/status only. Never keys, headers, or prompts.
 */
export class LLMService {
  /**
   * @param {object} [opts]
   * @param {Array}   [opts.providers]       - injected providers (test seam); defaults to Groq/Gemini/OpenRouter
   * @param {string}  [opts.primary]         - preferred primary provider name; defaults to AI_PRIMARY_PROVIDER || "groq"
   * @param {boolean} [opts.fallbackEnabled] - defaults to AI_FALLBACK_ENABLED !== "false"
   * @param {number}  [opts.backoffMs]       - optional backoff before a post-429 retry; defaults to AI_RETRY_BACKOFF_MS || 0
   */
  constructor({ providers, primary, fallbackEnabled, backoffMs } = {}) {
    // Construct all three kept providers (cheap, no network / no key needed).
    // isAvailable() gates actual use, so a keyless provider is simply reported
    // disabled rather than attempted.
    // Default provider precedence: Gemini -> OpenRouter -> Groq
    this.allProviders = providers || [new GeminiProvider(), new OpenRouterProvider(), new GroqProvider()];

    this.defaultPrimary = (primary || process.env.AI_PRIMARY_PROVIDER || "gemini").toString().toLowerCase();
    this.fallbackEnabled =
      typeof fallbackEnabled === "boolean"
        ? fallbackEnabled
        : String(process.env.AI_FALLBACK_ENABLED ?? "true").toLowerCase() !== "false";
    this.backoffMs = typeof backoffMs === "number" ? backoffMs : Number(process.env.AI_RETRY_BACKOFF_MS ?? 0);
  }

  /** Enabled providers, in fixed priority order. */
  _enabled() {
    return this.allProviders.filter((p) => p && typeof p.isAvailable === "function" && p.isAvailable());
  }

  /** Choose the primary provider from the enabled set, honoring the preference. */
  _pickPrimary(enabled, preferred) {
    const want = (preferred || this.defaultPrimary || "").toString().toLowerCase();
    if (want) {
      const match = enabled.find((p) => (p.name || "").toLowerCase() === want);
      if (match) return match;
    }
    return enabled[0];
  }

  /** Ordered attempt chain: primary first, then the other enabled providers. */
  _providerChain(preferred) {
    const enabled = this._enabled();
    if (enabled.length === 0) return [];

    const primary = this._pickPrimary(enabled, preferred);
    const rest = enabled.filter((p) => p !== primary);
    return [primary, ...rest];
  }

  /** Sleep helper for retry backoff. */
  _sleep(ms) {
    return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();
  }

  /** Guarantee a fatal config error names the env var to check (plan §D). */
  _enrich(norm) {
    if (norm && norm.envVar && typeof norm.message === "string" && !norm.message.includes(norm.envVar)) {
      norm.message = `${norm.message} (check ${norm.envVar})`;
    }
    return norm;
  }

  /**
   * Public: provider status for a status endpoint / UI. No secrets.
   * @returns {Array<{ provider: string, enabled: boolean, model: string }>}
   */
  getProviderStatus() {
    return this.allProviders.map((p) => ({
      provider: p.name,
      enabled: typeof p.isAvailable === "function" ? p.isAvailable() : false,
      model: p.defaultModel || null,
    }));
  }

  /** Back-compat: list of enabled provider names. */
  getAvailableProviders() {
    return this._enabled().map((p) => p.name);
  }

  _noProviderError() {
    return new ProviderError(
      "No AI provider is configured. Set at least one of GEMINI_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY.",
      { code: "auth", retryable: false }
    );
  }

  /**
   * Run one provider attempt. For structured calls, a schema_validation / parse
   * failure triggers exactly one repair retry on the SAME provider before the
   * error is propagated to the router's cross-provider loop.
   */
  async _attempt(provider, invoke, canRepair) {
    try {
      return await invoke(provider, {});
    } catch (err) {
      const norm = err instanceof ProviderError ? err : normalizeProviderError(err, { provider: provider.name });
      if (canRepair && (norm.code === "schema_validation" || norm.code === "parse")) {
        console.warn(`[LLMService] ${provider.name} returned ${norm.code}; attempting one repair retry.`);
        // If the repair attempt also throws, it propagates to the router loop,
        // which then moves on to the next provider (or fails).
        return await invoke(provider, { repair: true });
      }
      throw norm;
    }
  }

  /**
   * Core router loop shared by generateStructured / generateText.
   * @param {object} cfg
   * @param {string} [cfg.preferredProvider]
   * @param {(provider, ctx:{repair?:boolean}) => Promise<any>} cfg.invoke
   * @param {boolean} cfg.canRepair
   */
  async _execute({ preferredProvider, invoke, canRepair }) {
    const chain = this._providerChain(preferredProvider);
    if (chain.length === 0) throw this._noProviderError();

    let lastError = null;

    for (let i = 0; i < chain.length; i++) {
      const provider = chain[i];
      const hasNext = i < chain.length - 1;

      try {
        return await this._attempt(provider, invoke, canRepair);
      } catch (rawErr) {
        const norm = rawErr instanceof ProviderError ? rawErr : normalizeProviderError(rawErr, { provider: provider.name });
        lastError = this._enrich(norm);
        const where = `${norm.code}${norm.status ? " " + norm.status : ""}`;

        // Fatal config errors on the primary provider never cascade (preserves test #5, #6, #7):
        // a bad key / bad model / malformed request is surfaced immediately.
        // If already in a fallback attempt (i > 0), continue trying any remaining enabled providers.
        const isContentFail = norm.code === "schema_validation" || norm.code === "parse";
        const isFatalPrimary = !norm.retryable && !isContentFail && i === 0;
        if (isFatalPrimary) {
          console.warn(`[LLMService] ${provider.name} failed (${where}); fatal config error, not falling back.`);
          throw this._enrich(norm);
        }

        // Retryable transport error, or a content failure that survived its
        // repair retry: move to the next enabled provider if allowed.
        if (!this.fallbackEnabled || !hasNext) {
          console.warn(`[LLMService] ${provider.name} failed (${where}); ${hasNext ? "fallback disabled" : "no more providers"}.`);
          break;
        }

        const next = chain[i + 1];
        console.warn(`[LLMService] ${provider.name} failed (${where}); trying ${next.name}.`);
        if (norm.code === "rate_limit") await this._sleep(this.backoffMs);
      }
    }

    // Exhausted the chain on retryable/content errors.
    if (chain.length > 1) {
      const agg = new ProviderError(
        `All ${chain.length} configured AI providers failed. Last: ${lastError?.message || "unknown error"}`,
        { code: lastError?.code || "unknown", retryable: false, provider: lastError?.provider, envVar: lastError?.envVar, status: lastError?.status }
      );
      throw agg;
    }
    throw lastError || this._noProviderError();
  }

  async generateStructured({ systemPrompt, prompt, schema, preferredProvider = null, maxTokens = 2500, temperature = 0.2 }) {
    const repairSuffix =
      "\n\nIMPORTANT: your previous reply was not valid JSON matching the required schema. Reply again with ONLY one valid JSON object that strictly matches the schema. No markdown, no code fences, no commentary.";
    return this._execute({
      preferredProvider,
      canRepair: Boolean(schema),
      invoke: (provider, { repair } = {}) =>
        provider.generateStructured({
          systemPrompt,
          prompt: repair ? `${prompt}${repairSuffix}` : prompt,
          schema,
          maxTokens,
          temperature,
        }),
    });
  }

  async generateText({ systemPrompt, prompt, preferredProvider = null, maxTokens = 2000, temperature = 0.4 }) {
    return this._execute({
      preferredProvider,
      canRepair: false,
      invoke: (provider) => provider.generateText({ systemPrompt, prompt, maxTokens, temperature }),
    });
  }
}

export const llm = new LLMService();
export default llm;
