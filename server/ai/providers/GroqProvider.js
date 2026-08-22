import Groq from "groq-sdk";
import { ProviderError, normalizeProviderError, parseStructuredResponse, validateStructured } from "./providerUtils.js";

export class GroqProvider {
  /**
   * @param {object} [opts]
   * @param {string} [opts.apiKey] - defaults to process.env.GROQ_API_KEY
   * @param {string} [opts.model]  - defaults to process.env.GROQ_MODEL || "llama-3.1-8b-instant"
   * @param {object} [opts.client] - injected client for tests (must expose chat.completions.create)
   */
  constructor({ apiKey = process.env.GROQ_API_KEY, model, client } = {}) {
    this.apiKey = apiKey;
    this.client = client || (apiKey ? new Groq({ apiKey }) : null);
    this.name = "Groq";
    this.keyEnv = "GROQ_API_KEY";
    this.modelEnv = "GROQ_MODEL";
    this.defaultModel = model || process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    this.costPer1kInput = 0.00059;
    this.costPer1kOutput = 0.00079;
  }

  isAvailable() {
    return Boolean(this.client);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2000, temperature = 0.3 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("Groq API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const jsonInstruction = "You MUST respond with valid raw JSON only. Do not include markdown code block markers (like ```json), commentary, or leading/trailing text.";
    const messages = [
      { role: "system", content: `${systemPrompt}\n\n${jsonInstruction}` },
      { role: "user", content: prompt },
    ];

    let completion;
    try {
      completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      });
    } catch (err) {
      throw normalizeProviderError(err, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
    }

    const duration = Date.now() - startTime;
    const rawContent = completion.choices?.[0]?.message?.content || "";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const estimatedCost =
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput;

    // parseStructuredResponse / validateStructured throw typed ProviderErrors
    // (parse / schema_validation) that the router handles via its repair path.
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

  async generateText({ systemPrompt, prompt, model = this.defaultModel, maxTokens = 1500, temperature = 0.4 }) {
    if (!this.isAvailable()) {
      throw new ProviderError("Groq API key not configured.", { code: "auth", retryable: false, provider: this.name, envVar: this.keyEnv });
    }

    const startTime = Date.now();
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt },
    ];

    let completion;
    try {
      completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });
    } catch (err) {
      throw normalizeProviderError(err, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
    }

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
