import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ProviderError,
  normalizeProviderError,
  isRetryableProviderError,
  parseStructuredResponse,
  validateStructured,
} from "../ai/providers/providerUtils.js";
import { z } from "zod";

/* ───────────────────────── parseStructuredResponse (#9) ───────────────────────── */

test("#9 parses a ```json fenced block", () => {
  const out = parseStructuredResponse('```json\n{"a":1,"b":"x"}\n```');
  assert.deepEqual(out, { a: 1, b: "x" });
});

test("#9 parses a bare ``` fenced block", () => {
  const out = parseStructuredResponse('```\n{"ok":true}\n```');
  assert.deepEqual(out, { ok: true });
});

test("#9 parses JSON surrounded by prose", () => {
  const out = parseStructuredResponse('Here is your result:\n{"score": 42}\nHope that helps!');
  assert.deepEqual(out, { score: 42 });
});

test("#9 parses plain JSON", () => {
  assert.deepEqual(parseStructuredResponse('{"x":[1,2,3]}'), { x: [1, 2, 3] });
});

test("#9 throws a ProviderError(parse) on empty input", () => {
  assert.throws(() => parseStructuredResponse("   "), (e) => e instanceof ProviderError && e.code === "parse");
});

test("#9 throws a ProviderError(parse) on unrecoverable garbage", () => {
  assert.throws(() => parseStructuredResponse("not json at all <<< >>>"), (e) => e.code === "parse");
});

/* ───────────────────── error classification / retryability (#2 #3 #5) ───────────────────── */

test("#2 429 → rate_limit and retryable", () => {
  const n = normalizeProviderError({ status: 429, message: "Too Many Requests" }, { provider: "Groq" });
  assert.equal(n.code, "rate_limit");
  assert.equal(n.retryable, true);
  assert.equal(isRetryableProviderError(n), true);
});

test("#3 500/502/503/504 → server and retryable", () => {
  for (const status of [500, 502, 503, 504]) {
    const n = normalizeProviderError({ status }, { provider: "Gemini" });
    assert.equal(n.code, "server", `status ${status}`);
    assert.equal(n.retryable, true, `status ${status}`);
  }
});

test("#3 408 → network and retryable", () => {
  const n = normalizeProviderError({ status: 408 }, { provider: "OpenRouter" });
  assert.equal(n.code, "network");
  assert.equal(n.retryable, true);
});

test("#3 network/timeout error codes → network and retryable", () => {
  for (const code of ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"]) {
    const n = normalizeProviderError(Object.assign(new Error("socket"), { code }), { provider: "Groq" });
    assert.equal(n.code, "network", code);
    assert.equal(n.retryable, true, code);
  }
});

test("#5 401/403 → auth and NOT retryable", () => {
  for (const status of [401, 403]) {
    const n = normalizeProviderError({ status }, { provider: "Groq", keyEnv: "GROQ_API_KEY" });
    assert.equal(n.code, "auth", `status ${status}`);
    assert.equal(n.retryable, false, `status ${status}`);
    assert.equal(isRetryableProviderError(n), false);
    assert.equal(n.envVar, "GROQ_API_KEY");
  }
});

test("#5 model_not_found / 404 → model and NOT retryable", () => {
  const byCode = normalizeProviderError(Object.assign(new Error("nope"), { code: "model_not_found" }), {
    provider: "Groq",
    modelEnv: "GROQ_MODEL",
  });
  assert.equal(byCode.code, "model");
  assert.equal(byCode.retryable, false);
  assert.equal(byCode.envVar, "GROQ_MODEL");

  const byStatus = normalizeProviderError({ status: 404 }, { provider: "Groq", modelEnv: "GROQ_MODEL" });
  assert.equal(byStatus.code, "model");
  assert.equal(byStatus.retryable, false);
});

test("#5 400 → bad_request and NOT retryable", () => {
  const n = normalizeProviderError({ status: 400 }, { provider: "OpenRouter" });
  assert.equal(n.code, "bad_request");
  assert.equal(n.retryable, false);
});

test("#5 unknown error → unknown and NOT retryable (no blind cascade)", () => {
  const n = normalizeProviderError(new Error("weird surprise"), { provider: "Groq" });
  assert.equal(n.code, "unknown");
  assert.equal(n.retryable, false);
});

test("normalizeProviderError is idempotent on a ProviderError", () => {
  const original = new ProviderError("x", { code: "auth", retryable: false });
  assert.equal(normalizeProviderError(original, { provider: "Groq" }), original);
});

/* ───────────────────── no secret leakage in messages (#15) ───────────────────── */

test("#15 auth error message names the env var, not the key value", () => {
  const secret = "gsk_SUPERSECRETKEY1234567890";
  const n = normalizeProviderError(
    Object.assign(new Error(`Invalid API key: ${secret}`), { status: 401 }),
    { provider: "Groq", keyEnv: "GROQ_API_KEY" }
  );
  assert.ok(n.message.includes("GROQ_API_KEY"), "should name the env var");
  assert.ok(!n.message.includes(secret), "must not leak the raw key in the message");
});

/* ───────────────────── schema validation (#10 building block) ───────────────────── */

test("validateStructured returns data for a valid object", () => {
  const schema = z.object({ n: z.number() });
  assert.deepEqual(validateStructured(schema, { n: 5 }, "Groq"), { n: 5 });
});

test("validateStructured throws ProviderError(schema_validation) for invalid data", () => {
  const schema = z.object({ n: z.number() });
  assert.throws(
    () => validateStructured(schema, { n: "not-a-number" }, "Groq"),
    (e) => e instanceof ProviderError && e.code === "schema_validation" && e.retryable === false
  );
});
