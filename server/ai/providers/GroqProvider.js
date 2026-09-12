import Groq from "groq-sdk";
import { ProviderError, normalizeProviderError, parseStructuredResponse, validateStructured } from "./providerUtils.js";

const MODERN_GROQ_CANDIDATES = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
];

export class GroqProvider {
  /**
   * @param {object} [opts]
   * @param {string} [opts.apiKey] - defaults to process.env.GROQ_API_KEY
   * @param {string} [opts.model]  - defaults to process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
   * @param {object} [opts.client] - injected client for tests (must expose chat.completions.create)
   */
  constructor({ apiKey = process.env.GROQ_API_KEY, model, client } = {}) {
    this.apiKey = apiKey;
    this.client = client || (apiKey ? new Groq({ apiKey }) : null);
    this.name = "Groq";
    this.keyEnv = "GROQ_API_KEY";
    this.modelEnv = "GROQ_MODEL";
    this.defaultModel = model || process.env.GROQ_MODEL || MODERN_GROQ_CANDIDATES[0];
    this.costPer1kInput = 0.00059;
    this.costPer1kOutput = 0.00079;
  }

  isAvailable() {
    return Boolean(this.client);
  }

  async _createChatCompletion(baseParams, requestedModel) {
    const targetModel = requestedModel || this.defaultModel;
    const candidateList =
      !process.env.GROQ_MODEL && targetModel === this.defaultModel
        ? [targetModel, ...MODERN_GROQ_CANDIDATES.filter((m) => m !== targetModel)]
        : [targetModel];

    let lastError = null;

    for (const m of candidateList) {
      try {
        const completion = await this.client.chat.completions.create({
          ...baseParams,
          model: m,
        });
        if (this.defaultModel !== m && !process.env.GROQ_MODEL) {
          this.defaultModel = m;
        }
        return { completion, modelUsed: m };
      } catch (err) {
        lastError = err;
        const msg = String(err?.message || "").toLowerCase();
        const isModelIssue =
          err?.status === 404 ||
          err?.code === "model_not_found" ||
          msg.includes("model") ||
          msg.includes("blocked at the organization level");

        if (!isModelIssue || process.env.GROQ_MODEL) {
          throw normalizeProviderError(err, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
        }
      }
    }

    throw normalizeProviderError(lastError, { provider: this.name, keyEnv: this.keyEnv, modelEnv: this.modelEnv });
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

    const { completion, modelUsed } = await this._createChatCompletion(
      {
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      },
      model
    );

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
        model: modelUsed || model,
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

    const { completion, modelUsed } = await this._createChatCompletion(
      {
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      model
    );

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
        model: modelUsed || model,
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }
}
