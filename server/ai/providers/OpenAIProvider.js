export class OpenAIProvider {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.apiKey = apiKey;
    this.name = "OpenAI";
    this.defaultModel = process.env.OPENAI_MODEL || "gpt-4o";
    this.costPer1kInput = 0.0025; // gpt-4o standard rate
    this.costPer1kOutput = 0.01;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2000, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new Error("OpenAI API key not configured");
    }

    const startTime = Date.now();
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nRespond with valid raw JSON only.` },
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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
      throw new Error(`OpenAI API error: ${err.error?.message || res.statusText}`);
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
        console.warn("[OpenAIProvider] Schema warning:", result.error.format());
        validated = parsed;
      }
    }

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: "OpenAI",
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
      throw new Error("OpenAI API key not configured");
    }

    const startTime = Date.now();
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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
      throw new Error(`OpenAI API error: ${err.error?.message || res.statusText}`);
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
        provider: "OpenAI",
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
