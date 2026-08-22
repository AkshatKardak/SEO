import { ProviderError, normalizeProviderError, parseStructuredResponse, validateStructured } from "./providerUtils.js";

export class OpenRouterProvider {
  /**
   * @param {object} [opts]
   * @param {string}   [opts.apiKey]    - defaults to process.env.OPENROUTER_API_KEY
   * @param {string}   [opts.model]     - defaults to process.env.OPENROUTER_MODEL || "openrouter/free"
   * @param {Function} [opts.fetchImpl] - injected fetch for tests
   */
  constructor({ apiKey = process.env.OPENROUTER_API_KEY, model, fetchImpl } = {}) {
    this.apiKey = apiKey;
    this.name = "OpenRouter";
    this.keyEnv = "OPENROUTER_API_KEY";
    this.modelEnv = "OPENROUTER_MODEL";
    this.defaultModel = model || process.env.OPENROUTER_MODEL || "openrouter/free";
    this.fetchImpl = fetchImpl || fetch;
    this.endpoint = "https://openrouter.ai/api/v1/chat/completions";
    this.costPer1kInput = 0.0005;
    this.costPer1kOutput = 0.0015;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  get _headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "HTTP-Referer": "https://serpoai.dev",
      "X-Title": "SerpoAI",
    };
  }

  /** Perform the chat call, mapping any failure to a normalized ProviderError. */
  async _call(body) {
    let res;
    try {
      res = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw normalizeProviderError(err, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const synthetic = new Error(errBody?.error?.message || res.statusText || "OpenRouter request failed");
      synthetic.status = res.status;
      synthetic.code = errBody?.error?.code;
      throw normalizeProviderError(synthetic, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
    }

    return res.json();
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2500, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("OpenRouter API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nRespond strictly with a valid raw JSON object. Do not include explanation outside JSON.` },
      { role: "user", content: prompt },
    ];

    const completion = await this._call({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });

    const duration = Date.now() - startTime;
    const rawContent = completion.choices?.[0]?.message?.content || "";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const estimatedCost =
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput;

    const parsed = parseStructuredResponse(rawContent);
    const validated = validateStructured(schema, parsed, this.name);

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: this.name,
        model,
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }

  async generateText({ systemPrompt, prompt, model = this.defaultModel, maxTokens = 2000, temperature = 0.4 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("OpenRouter API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt },
    ];

    const completion = await this._call({ model, messages, temperature, max_tokens: maxTokens });

    const duration = Date.now() - startTime;
    const content = completion.choices?.[0]?.message?.content || "";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const estimatedCost =
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput;

    return {
      text: content,
      meta: {
        provider: this.name,
        model,
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }
}
