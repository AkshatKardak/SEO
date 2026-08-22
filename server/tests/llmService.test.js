import { test } from "node:test";
import assert from "node:assert/strict";
import { LLMService } from "../ai/providers/LLMProvider.js";
import { ProviderError } from "../ai/providers/providerUtils.js";

/* ─────────────────────────── test doubles ─────────────────────────── */

/**
 * Programmable provider stub. `structured` / `text` are optional handlers
 * `(args, callIndex) => result` that may return a value or throw. Without a
 * handler the stub returns a canonical success payload tagged with its name.
 */
class StubProvider {
  constructor({ name, model = `${name}-model`, available = true, structured, text } = {}) {
    this.name = name;
    this.defaultModel = model;
    this._available = available;
    this._structured = structured;
    this._text = text;
    this.calls = { structured: 0, text: 0 };
  }
  isAvailable() {
    return this._available;
  }
  async generateStructured(args) {
    const i = this.calls.structured++;
    if (typeof this._structured === "function") return this._structured(args, i);
    return { data: { ok: this.name }, raw: "{}", meta: { provider: this.name, model: this.defaultModel } };
  }
  async generateText(args) {
    const i = this.calls.text++;
    if (typeof this._text === "function") return this._text(args, i);
    return { text: `text:${this.name}`, meta: { provider: this.name, model: this.defaultModel } };
  }
}

const retryable = (code) => () => {
  throw new ProviderError(`${code} transient`, { code, retryable: true });
};
const fatal = (code, envVar) => () => {
  throw new ProviderError(`${code} misconfigured`, { code, retryable: false, envVar });
};
const contentFail = (code) => () => {
  throw new ProviderError(`${code} bad output`, { code, retryable: false });
};

const structuredCall = () => ({ systemPrompt: "s", prompt: "p", schema: { safeParse: () => ({ success: true }) } });

/* ───────────────────────── #1 happy path: only primary is used ───────────────────────── */

test("#1 success on Groq → Gemini/OpenRouter are never attempted", async () => {
  const groq = new StubProvider({ name: "Groq" });
  const gemini = new StubProvider({ name: "Gemini" });
  const openrouter = new StubProvider({ name: "OpenRouter" });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "groq", backoffMs: 0 });

  const res = await svc.generateStructured(structuredCall());

  assert.equal(res.data.ok, "Groq");
  assert.equal(res.meta.provider, "Groq");
  assert.equal(groq.calls.structured, 1);
  assert.equal(gemini.calls.structured, 0, "Gemini must not be attempted after primary success");
  assert.equal(openrouter.calls.structured, 0, "OpenRouter must not be attempted after primary success");
});

/* ───────────────────────── #2 retryable rate_limit → next provider ───────────────────────── */

test("#2 Groq 429 → falls back to Gemini", async () => {
  const groq = new StubProvider({ name: "Groq", structured: retryable("rate_limit") });
  const gemini = new StubProvider({ name: "Gemini" });
  const openrouter = new StubProvider({ name: "OpenRouter" });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "groq", backoffMs: 0 });

  const res = await svc.generateStructured(structuredCall());

  assert.equal(res.meta.provider, "Gemini");
  assert.equal(groq.calls.structured, 1);
  assert.equal(gemini.calls.structured, 1);
  assert.equal(openrouter.calls.structured, 0);
});

/* ───────────────────────── #3 server → network → third provider ───────────────────────── */

test("#3 Groq 500 → Gemini network error → OpenRouter succeeds", async () => {
  const groq = new StubProvider({ name: "Groq", structured: retryable("server") });
  const gemini = new StubProvider({ name: "Gemini", structured: retryable("network") });
  const openrouter = new StubProvider({ name: "OpenRouter" });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "groq", backoffMs: 0 });

  const res = await svc.generateStructured(structuredCall());

  assert.equal(res.meta.provider, "OpenRouter");
  assert.equal(groq.calls.structured, 1);
  assert.equal(gemini.calls.structured, 1);
  assert.equal(openrouter.calls.structured, 1);
});

/* ───────────────────────── #4 no providers configured → one clear error, zero requests ───────────────────────── */

test("#4 no keys → single config error naming all three env vars, zero requests", async () => {
  const groq = new StubProvider({ name: "Groq", available: false });
  const gemini = new StubProvider({ name: "Gemini", available: false });
  const openrouter = new StubProvider({ name: "OpenRouter", available: false });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], backoffMs: 0 });

  await assert.rejects(
    () => svc.generateStructured(structuredCall()),
    (e) => {
      assert.ok(e instanceof ProviderError);
      assert.match(e.message, /GROQ_API_KEY/);
      assert.match(e.message, /GEMINI_API_KEY/);
      assert.match(e.message, /OPENROUTER_API_KEY/);
      return true;
    }
  );
  assert.equal(groq.calls.structured, 0);
  assert.equal(gemini.calls.structured, 0);
  assert.equal(openrouter.calls.structured, 0);
});

/* ───────────────────────── #5 Groq model error → actionable, NO cascade ───────────────────────── */

test("#5 Groq model_not_found → actionable GROQ_MODEL error, no fallback", async () => {
  const groq = new StubProvider({ name: "Groq", structured: fatal("model", "GROQ_MODEL") });
  const gemini = new StubProvider({ name: "Gemini" });
  const openrouter = new StubProvider({ name: "OpenRouter" });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "groq", backoffMs: 0 });

  await assert.rejects(
    () => svc.generateStructured(structuredCall()),
    (e) => {
      assert.equal(e.code, "model");
      assert.match(e.message, /GROQ_MODEL/);
      return true;
    }
  );
  assert.equal(groq.calls.structured, 1);
  assert.equal(gemini.calls.structured, 0, "a model config error must NOT cascade");
  assert.equal(openrouter.calls.structured, 0, "a model config error must NOT cascade");
});

/* ───────────────────────── #6 Gemini auth error → no cascade ───────────────────────── */

test("#6 Gemini auth error (as primary) → actionable, no fallback", async () => {
  const groq = new StubProvider({ name: "Groq" });
  const gemini = new StubProvider({ name: "Gemini", structured: fatal("auth", "GEMINI_API_KEY") });
  const openrouter = new StubProvider({ name: "OpenRouter" });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "gemini", backoffMs: 0 });

  await assert.rejects(
    () => svc.generateStructured(structuredCall()),
    (e) => {
      assert.equal(e.code, "auth");
      assert.match(e.message, /GEMINI_API_KEY/);
      return true;
    }
  );
  assert.equal(gemini.calls.structured, 1);
  assert.equal(groq.calls.structured, 0, "auth error must NOT cascade");
  assert.equal(openrouter.calls.structured, 0, "auth error must NOT cascade");
});

/* ───────────────────────── #7 OpenRouter auth error → no cascade ───────────────────────── */

test("#7 OpenRouter auth error (as primary) → actionable, no fallback", async () => {
  const groq = new StubProvider({ name: "Groq" });
  const gemini = new StubProvider({ name: "Gemini" });
  const openrouter = new StubProvider({ name: "OpenRouter", structured: fatal("auth", "OPENROUTER_API_KEY") });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "openrouter", backoffMs: 0 });

  await assert.rejects(
    () => svc.generateStructured(structuredCall()),
    (e) => {
      assert.equal(e.code, "auth");
      assert.match(e.message, /OPENROUTER_API_KEY/);
      return true;
    }
  );
  assert.equal(openrouter.calls.structured, 1);
  assert.equal(groq.calls.structured, 0);
  assert.equal(gemini.calls.structured, 0);
});

/* ───────────────────────── #8 every provider retryable-fails → one aggregated error ───────────────────────── */

test("#8 all providers fail with retryable errors → single aggregated error", async () => {
  const groq = new StubProvider({ name: "Groq", structured: retryable("server") });
  const gemini = new StubProvider({ name: "Gemini", structured: retryable("rate_limit") });
  const openrouter = new StubProvider({ name: "OpenRouter", structured: retryable("network") });
  const svc = new LLMService({ providers: [groq, gemini, openrouter], primary: "groq", backoffMs: 0 });

  await assert.rejects(
    () => svc.generateStructured(structuredCall()),
    (e) => {
      assert.ok(e instanceof ProviderError);
      assert.match(e.message, /All 3 configured AI providers failed/);
      return true;
    }
  );
  assert.equal(groq.calls.structured, 1);
  assert.equal(gemini.calls.structured, 1);
  assert.equal(openrouter.calls.structured, 1);
});

/* ───────────────────────── #10 schema_validation → repair retry → next → throw ───────────────────────── */

test("#10 schema_validation repairs once on same provider, then falls through, then throws", async () => {
  const groq = new StubProvider({ name: "Groq", structured: contentFail("schema_validation") });
  const gemini = new StubProvider({ name: "Gemini", structured: contentFail("schema_validation") });
  const svc = new LLMService({ providers: [groq, gemini], primary: "groq", backoffMs: 0 });

  await assert.rejects(() => svc.generateStructured(structuredCall()), (e) => e instanceof ProviderError);

  // Each provider is attempted twice: original + one repair retry.
  assert.equal(groq.calls.structured, 2, "Groq should get exactly one repair retry");
  assert.equal(gemini.calls.structured, 2, "Gemini should get exactly one repair retry");
});

test("#10 schema_validation that succeeds on repair returns data without cascading", async () => {
  const groq = new StubProvider({
    name: "Groq",
    structured: (_args, i) => {
      if (i === 0) throw new ProviderError("bad json", { code: "schema_validation", retryable: false });
      return { data: { ok: "Groq-repaired" }, raw: "{}", meta: { provider: "Groq", model: "Groq-model" } };
    },
  });
  const gemini = new StubProvider({ name: "Gemini" });
  const svc = new LLMService({ providers: [groq, gemini], primary: "groq", backoffMs: 0 });

  const res = await svc.generateStructured(structuredCall());

  assert.equal(res.data.ok, "Groq-repaired");
  assert.equal(groq.calls.structured, 2, "original + repair");
  assert.equal(gemini.calls.structured, 0, "successful repair must not cascade");
});

/* ───────────────────────── repair suffix only added on retry (structured) ───────────────────────── */

test("repair retry appends a JSON-repair instruction to the prompt", async () => {
  const prompts = [];
  const groq = new StubProvider({
    name: "Groq",
    structured: (args, i) => {
      prompts.push(args.prompt);
      if (i === 0) throw new ProviderError("bad json", { code: "parse", retryable: false });
      return { data: { ok: "Groq" }, raw: "{}", meta: { provider: "Groq", model: "Groq-model" } };
    },
  });
  const svc = new LLMService({ providers: [groq], primary: "groq", backoffMs: 0 });

  await svc.generateStructured({ systemPrompt: "s", prompt: "ORIGINAL", schema: {} });

  assert.equal(prompts[0], "ORIGINAL");
  assert.match(prompts[1], /ORIGINAL/);
  assert.match(prompts[1], /valid JSON/i, "repair prompt should ask for valid JSON");
});

/* ───────────────────────── generateText does not repair (canRepair=false) ───────────────────────── */

test("generateText: retryable error still cascades, but content errors do not repair", async () => {
  const groq = new StubProvider({ name: "Groq", text: retryable("server") });
  const gemini = new StubProvider({ name: "Gemini" });
  const svc = new LLMService({ providers: [groq, gemini], primary: "groq", backoffMs: 0 });

  const res = await svc.generateText({ prompt: "hi" });

  assert.equal(res.meta.provider, "Gemini");
  assert.equal(groq.calls.text, 1, "no repair retry for generateText");
  assert.equal(gemini.calls.text, 1);
});

/* ───────────────────────── getProviderStatus never leaks secrets (#16) ───────────────────────── */

test("#16 getProviderStatus exposes only provider/enabled/model", () => {
  const groq = new StubProvider({ name: "Groq", available: true });
  const gemini = new StubProvider({ name: "Gemini", available: false });
  const svc = new LLMService({ providers: [groq, gemini], backoffMs: 0 });

  const status = svc.getProviderStatus();
  assert.deepEqual(status, [
    { provider: "Groq", enabled: true, model: "Groq-model" },
    { provider: "Gemini", enabled: false, model: "Gemini-model" },
  ]);
  for (const entry of status) {
    assert.deepEqual(Object.keys(entry).sort(), ["enabled", "model", "provider"]);
  }
});
