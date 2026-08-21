import Groq from "groq-sdk";

export class GroqProvider {
  constructor(apiKey = process.env.GROQ_API_KEY) {
    this.apiKey = apiKey;
    this.client = apiKey ? new Groq({ apiKey }) : null;
    this.name = "Groq";
    this.defaultModel = "llama-3.3-70b-versatile";
    this.costPer1kInput = 0.00059;
    this.costPer1kOutput = 0.00079;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.client);
  }

  async generateStructured({ systemPrompt, prompt, schema, model = this.defaultModel, maxTokens = 2000, temperature = 0.3 }) {
    if (!this.isAvailable()) {
      throw new Error("Groq API key not configured");
    }

    const startTime = Date.now();
    const jsonInstruction = "You MUST respond with valid raw JSON only. Do not include markdown code block markers (like ```json), commentary, or leading/trailing text.";

    const messages = [
      { role: "system", content: `${systemPrompt}\n\n${jsonInstruction}` },
      { role: "user", content: prompt },
    ];

    const completion = await this.client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });

    const duration = Date.now() - startTime;
    const rawContent = completion.choices[0]?.message?.content || "{}";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const estimatedCost = (
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput
    );

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      // Clean possible stray characters
      const cleaned = rawContent.replace(/^[^{[]*/, "").replace(/[^}\]]*$/, "");
      parsed = JSON.parse(cleaned);
    }

    let validated = parsed;
    if (schema) {
      const result = schema.safeParse(parsed);
      if (result.success) {
        validated = result.data;
      } else {
        console.warn("[GroqProvider] Schema validation warning:", result.error.format());
        validated = parsed; // graceful fallback
      }
    }

    return {
      data: validated,
      raw: rawContent,
      meta: {
        provider: "Groq",
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
      throw new Error("Groq API key not configured");
    }

    const startTime = Date.now();
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt },
    ];

    const completion = await this.client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const duration = Date.now() - startTime;
    const content = completion.choices[0]?.message?.content || "";
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const estimatedCost = (
      ((usage.prompt_tokens || 0) / 1000) * this.costPer1kInput +
      ((usage.completion_tokens || 0) / 1000) * this.costPer1kOutput
    );

    return {
      text: content,
      meta: {
        provider: "Groq",
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
