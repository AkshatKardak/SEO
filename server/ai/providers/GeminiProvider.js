export class GeminiProvider {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.apiKey = apiKey;
    this.name = "Gemini";
    this.defaultModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    this.costPer1kInput = 0.0001;
    this.costPer1kOutput = 0.0004;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2000, temperature = 0.2 }) {
    if (!this.isAvailable()) {
      throw new Error("Gemini API key not configured");
    }

    const startTime = Date.now();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nTask:\n${prompt}` }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const rawContent = completion.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const usageMetadata = completion.usageMetadata || {};

    const inputTokens = usageMetadata.promptTokenCount || 0;
    const outputTokens = usageMetadata.candidatesTokenCount || 0;
    const totalTokens = usageMetadata.totalTokenCount || (inputTokens + outputTokens);

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
        console.warn("[GeminiProvider] Schema warning:", result.error.format());
        validated = parsed;
      }
    }

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: "Gemini",
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
      throw new Error("Gemini API key not configured");
    }

    const startTime = Date.now();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt ? systemPrompt + "\n\n" : ""}${prompt}` }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${err.error?.message || res.statusText}`);
    }

    const completion = await res.json();
    const duration = Date.now() - startTime;
    const content = completion.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usageMetadata = completion.usageMetadata || {};

    const inputTokens = usageMetadata.promptTokenCount || 0;
    const outputTokens = usageMetadata.candidatesTokenCount || 0;
    const totalTokens = usageMetadata.totalTokenCount || (inputTokens + outputTokens);

    const estimatedCost = (
      (inputTokens / 1000) * this.costPer1kInput +
      (outputTokens / 1000) * this.costPer1kOutput
    );

    return {
      text: content,
      meta: {
        provider: "Gemini",
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
