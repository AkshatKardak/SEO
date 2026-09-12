import { ProviderError, normalizeProviderError, parseStructuredResponse, validateStructured } from "./providerUtils.js";

const MODERN_GEMINI_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

export class GeminiProvider {
  /**
   * @param {object} [opts]
   * @param {string}   [opts.apiKey]    - defaults to process.env.GEMINI_API_KEY
   * @param {string}   [opts.model]     - defaults to process.env.GEMINI_MODEL || "gemini-3.6-flash"
   * @param {Function} [opts.fetchImpl] - injected fetch for tests
   */
  constructor({ apiKey = process.env.GEMINI_API_KEY, model, fetchImpl } = {}) {
    this.apiKey = apiKey;
    this.name = "Gemini";
    this.keyEnv = "GEMINI_API_KEY";
    this.modelEnv = "GEMINI_MODEL";
    this.defaultModel = model || process.env.GEMINI_MODEL || MODERN_GEMINI_CANDIDATES[0];
    this.fetchImpl = fetchImpl || fetch;
    this.costPer1kInput = 0.0001;
    this.costPer1kOutput = 0.0004;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  /** Perform the REST call, mapping any failure to a normalized ProviderError. */
  async _call({ model, body }) {
    const targetModel = model || this.defaultModel;
    const candidateList =
      !process.env.GEMINI_MODEL && targetModel === this.defaultModel
        ? [targetModel, ...MODERN_GEMINI_CANDIDATES.filter((m) => m !== targetModel)]
        : [targetModel];

    let lastError = null;

    for (const m of candidateList) {
      // The key travels in the query string; never surface the endpoint in errors.
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${this.apiKey}`;
      let res;
      try {
        res = await this.fetchImpl(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        throw normalizeProviderError(err, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
      }

      if (res.ok) {
        if (this.defaultModel !== m && !process.env.GEMINI_MODEL) {
          this.defaultModel = m;
        }
        return res.json();
      }

      const errBody = await res.json().catch(() => ({}));
      const rawMsg = errBody?.error?.message || res.statusText || "Gemini request failed";
      const synthetic = new Error(rawMsg);
      synthetic.status = res.status;
      synthetic.code = errBody?.error?.status;
      lastError = synthetic;
      console.warn(`[GeminiProvider] Candidate ${m} failed (${res.status}): ${rawMsg}`);

      const isModelError =
        res.status === 404 ||
        rawMsg.toLowerCase().includes("model") ||
        rawMsg.toLowerCase().includes("not available") ||
        rawMsg.toLowerCase().includes("not found");
      if (!isModelError) {
        throw normalizeProviderError(synthetic, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
      }
    }

    throw normalizeProviderError(lastError, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2000, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("Gemini API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const completion = await this._call({
      model,
      body: {
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nTask:\n${prompt}` }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens, responseMimeType: "application/json" },
      },
    });

    const duration = Date.now() - startTime;
    const rawContent = completion.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usageMetadata = completion.usageMetadata || {};
    const inputTokens = usageMetadata.promptTokenCount || 0;
    const outputTokens = usageMetadata.candidatesTokenCount || 0;
    const totalTokens = usageMetadata.totalTokenCount || inputTokens + outputTokens;
    const estimatedCost = (inputTokens / 1000) * this.costPer1kInput + (outputTokens / 1000) * this.costPer1kOutput;

    const parsed = parseStructuredResponse(rawContent);
    const validated = validateStructured(schema, parsed, this.name);

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: this.name,
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }

  async generateText({ systemPrompt, prompt, model = this.defaultModel, maxTokens = 1500, temperature = 0.4 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("Gemini API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const completion = await this._call({
      model,
      body: {
        contents: [{ role: "user", parts: [{ text: `${systemPrompt ? systemPrompt + "\n\n" : ""}${prompt}` }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      },
    });

    const duration = Date.now() - startTime;
    const content = completion.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usageMetadata = completion.usageMetadata || {};
    const inputTokens = usageMetadata.promptTokenCount || 0;
    const outputTokens = usageMetadata.candidatesTokenCount || 0;
    const totalTokens = usageMetadata.totalTokenCount || inputTokens + outputTokens;
    const estimatedCost = (inputTokens / 1000) * this.costPer1kInput + (outputTokens / 1000) * this.costPer1kOutput;

    return {
      text: content,
      meta: {
        provider: this.name,
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }
}
