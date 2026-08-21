import { GroqProvider } from "./GroqProvider.js";
import { OpenAIProvider } from "./OpenAIProvider.js";
import { GeminiProvider } from "./GeminiProvider.js";
import { DeepSeekProvider } from "./DeepSeekProvider.js";
import { OpenRouterProvider } from "./OpenRouterProvider.js";
import { AnthropicProvider } from "./AnthropicProvider.js";

class LLMService {
  constructor() {
    this.groq = new GroqProvider();
    this.deepseek = new DeepSeekProvider();
    this.anthropic = new AnthropicProvider();
    this.openrouter = new OpenRouterProvider();
    this.openai = new OpenAIProvider();
    this.gemini = new GeminiProvider();
  }

  /**
   * Returns list of currently configured and available providers
   */
  getAvailableProviders() {
    const list = [];
    if (this.groq.isAvailable()) list.push("Groq");
    if (this.deepseek.isAvailable()) list.push("DeepSeek");
    if (this.anthropic.isAvailable()) list.push("Anthropic");
    if (this.openrouter.isAvailable()) list.push("OpenRouter");
    if (this.openai.isAvailable()) list.push("OpenAI");
    if (this.gemini.isAvailable()) list.push("Gemini");
    return list;
  }

  /**
   * Primary provider selection with fallback cascade
   */
  getPrimaryProvider(preferred = null) {
    if (preferred === "deepseek" && this.deepseek.isAvailable()) return this.deepseek;
    if (preferred === "anthropic" && this.anthropic.isAvailable()) return this.anthropic;
    if (preferred === "openrouter" && this.openrouter.isAvailable()) return this.openrouter;
    if (preferred === "openai" && this.openai.isAvailable()) return this.openai;
    if (preferred === "gemini" && this.gemini.isAvailable()) return this.gemini;
    if (preferred === "groq" && this.groq.isAvailable()) return this.groq;

    // Automatic priority cascade
    if (this.groq.isAvailable()) return this.groq;
    if (this.deepseek.isAvailable()) return this.deepseek;
    if (this.anthropic.isAvailable()) return this.anthropic;
    if (this.openrouter.isAvailable()) return this.openrouter;
    if (this.openai.isAvailable()) return this.openai;
    if (this.gemini.isAvailable()) return this.gemini;

    throw new Error(
      "No AI LLM provider is configured. Please provide at least one API key: GROQ_API_KEY, DEEPSEEK_API_KEY, ANTHROPIC_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY."
    );
  }

  getFallbackProviders(current) {
    const all = [this.groq, this.deepseek, this.anthropic, this.openrouter, this.openai, this.gemini];
    return all.filter((p) => p !== current && p.isAvailable());
  }

  async generateStructured({ systemPrompt, prompt, schema, preferredProvider = null, maxTokens = 2500, temperature = 0.2 }) {
    const primary = this.getPrimaryProvider(preferredProvider);
    const fallbacks = this.getFallbackProviders(primary);

    try {
      return await primary.generateStructured({ systemPrompt, prompt, schema, maxTokens, temperature });
    } catch (primaryErr) {
      console.warn(`[LLMService] Primary provider (${primary.name}) failed:`, primaryErr.message);

      for (const fallback of fallbacks) {
        try {
          console.log(`[LLMService] Attempting fallback with ${fallback.name}...`);
          return await fallback.generateStructured({ systemPrompt, prompt, schema, maxTokens, temperature });
        } catch (fallbackErr) {
          console.warn(`[LLMService] Fallback provider (${fallback.name}) failed:`, fallbackErr.message);
        }
      }

      throw primaryErr;
    }
  }

  async generateText({ systemPrompt, prompt, preferredProvider = null, maxTokens = 2000, temperature = 0.4 }) {
    const primary = this.getPrimaryProvider(preferredProvider);
    const fallbacks = this.getFallbackProviders(primary);

    try {
      return await primary.generateText({ systemPrompt, prompt, maxTokens, temperature });
    } catch (primaryErr) {
      console.warn(`[LLMService] Primary provider (${primary.name}) failed:`, primaryErr.message);

      for (const fallback of fallbacks) {
        try {
          console.log(`[LLMService] Attempting fallback with ${fallback.name}...`);
          return await fallback.generateText({ systemPrompt, prompt, maxTokens, temperature });
        } catch (fallbackErr) {
          console.warn(`[LLMService] Fallback provider (${fallback.name}) failed:`, fallbackErr.message);
        }
      }

      throw primaryErr;
    }
  }
}

export const llm = new LLMService();
export default llm;
