export class OpenRouterProvider {
  constructor(apiKey = process.env.OPENROUTER_API_KEY) {
    this.apiKey = apiKey;
    this.name = "OpenRouter";
    this.defaultModel = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
    this.costPer1kInput = 0.0005;
    this.costPer1kOutput = 0.0015;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2500, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new Error("OpenRouter API key not configured");
    }

    const startTime = Date.now();
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nRespond strictly with valid raw JSON object. Do not include explanation outside JSON.` },
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://aigrowthos.com",
        "X-Title": "AI Growth OS",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const rawContent = completion.choices?.[0]?.message?.content || "{}";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const estimatedCost = (
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput
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
        console.warn("[OpenRouterProvider] Schema warning:", result.error.format());
        validated = parsed;
      }
    }

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: "OpenRouter",
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
      throw new Error("OpenRouter API key not configured");
    }

    const startTime = Date.now();
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://aigrowthos.com",
        "X-Title": "AI Growth OS",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const content = completion.choices?.[0]?.message?.content || "";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const estimatedCost = (
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput
    );

    return {
      text: content,
      meta: {
        provider: "OpenRouter",
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
