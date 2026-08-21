export class AnthropicProvider {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    this.apiKey = apiKey;
    this.name = "Anthropic";
    this.defaultModel = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
    this.costPer1kInput = 0.003;
    this.costPer1kOutput = 0.015;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2500, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new Error("Anthropic API key not configured");
    }

    const startTime = Date.now();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: `${systemPrompt}\n\nCRITICAL: Respond ONLY with valid raw JSON. Never include explanations or markdown codeblocks around the JSON.`,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const rawContent = completion.content?.[0]?.text || "{}";
    const usage = completion.usage || { input_tokens: 0, output_tokens: 0 };

    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const estimatedCost = (
      (inputTokens / 1000) * this.costPer1kInput +
      (outputTokens / 1000) * this.costPer1kOutput
    );

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      const cleaned = rawContent.replace(/^[^{[]*/, "").replace(/[^}\]]*$/, "");
      parsed = JSON.parse(cleaned);
    }

    let validated = parsed;
    if (schema) {
      const result = schema.safeParse(parsed);
      if (result.success) {
        validated = result.data;
      } else {
        console.warn("[AnthropicProvider] Schema warning:", result.error.format());
        validated = parsed;
      }
    }

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: "Anthropic",
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost: Number(estimatedCost.toFixed(5)),
        durationMs: duration,
      },
    };
  }

  async generateText({ systemPrompt, prompt, model = this.defaultModel, maxTokens = 2000, temperature = 0.4 }) {
    if (!this.isAvailable()) {
      throw new Error("Anthropic API key not configured");
    }

    const startTime = Date.now();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt || undefined,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const content = completion.content?.[0]?.text || "";
    const usage = completion.usage || { input_tokens: 0, output_tokens: 0 };

    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const estimatedCost = (
      (inputTokens / 1000) * this.costPer1kInput +
      (outputTokens / 1000) * this.costPer1kOutput
    );

    return {
      text: content,
      meta: {
        provider: "Anthropic",
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
