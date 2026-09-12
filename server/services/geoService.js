import llm from "../ai/providers/LLMProvider.js";
import { GEOResultsSchema } from "../ai/schemas/growthSchemas.js";
import GEOQuery from "../models/GEOQuery.js";
import AgentRun from "../models/AgentRun.js";
import Project from "../models/Project.js";

/**
 * Generates and analyzes Generative Engine Optimization (GEO) search queries
 */
export async function runGEOAnalysis(project, profile) {
  const competitorsList = profile?.competitors?.map(c => c.name).join(", ") || "Industry competitors";
  const productThemes = profile?.products?.concat(profile?.services || []).join(", ") || profile?.industry;

  const systemPrompt = `You are a Generative Engine Optimization (GEO) and AI-Search Visibility Intelligence Specialist.
Your task is to analyze how visible this brand is across modern AI search channels (Google AI Overviews, Gemini, and Generative Answer Engines like ChatGPT & Perplexity).
Simulate realistic AI answer query coverage based on current industry authority, brand entities, and topic depth using SerpoAI's connected AI intelligence.
Analyze:
1. Brand mention rates and positions in answer summaries for 4-6 commercial high-intent search queries.
2. Direct competitor citations vs. brand citations.
3. Missing topic authority signals and high-impact citation domains.
4. Provide realistic scores (0-100) for geoScore, citationScore, brandVisibilityScore, and competitorVisibilityScore.`;

  const prompt = `Brand: ${profile?.companyName || project.domain}
Domain: ${project.domain}
Industry: ${profile?.industry || "SaaS"}
Value Proposition: ${profile?.valueProposition || "Growth Software"}
Key Products/Services: ${productThemes}
Competitors: ${competitorsList}

Generate a comprehensive GEO report with:
- 4 to 6 realistic user AI search queries (e.g. "Best ${profile?.industry || 'software'} tools for...")
- Per query: simulated results across generative engines (ChatGPT/Copilot, Perplexity/Research, Gemini, Google AI Overviews) including mentioned (boolean), position (number or null), competitor mentions, missing topics.
- Top citation domains in this space
- Missing authority signals

Respond strictly in valid JSON matching this exact structure:
{
  "geoScore": 65,
  "citationScore": 55,
  "brandVisibilityScore": 60,
  "competitorVisibilityScore": 75,
  "brandMentionRate": 45,
  "queries": [
    {
      "query": "Best software for...",
      "chatgpt": { "mentioned": true, "position": 2 },
      "perplexity": { "mentioned": false, "position": null },
      "gemini": { "mentioned": true, "position": 1 },
      "google_ai": { "mentioned": true, "position": 2 },
      "competitorMentions": ["Competitor A"],
      "missingTopics": ["Topic X"]
    }
  ],
  "citationDomains": [
    { "domain": "g2.com", "authority": "High", "count": 8 }
  ],
  "missingAuthoritySignals": ["Independent benchmark data"]
}`;

  const result = await llm.generateStructured({
    systemPrompt,
    prompt,
    schema: GEOResultsSchema,
    maxTokens: 2500,
    temperature: 0.3,
  });

  const geoData = result.data;

  // Clear older queries for project
  await GEOQuery.deleteMany({ projectId: project._id });

  // Save new queries
  for (const q of geoData.queries) {
    await GEOQuery.create({
      projectId: project._id,
      query: q.query,
      engines: {
        chatgpt: q.chatgpt,
        perplexity: q.perplexity,
        gemini: q.gemini,
        google_ai: q.google_ai,
      },
      competitorMentions: q.competitorMentions,
      missingTopics: q.missingTopics,
      suggestedCitationSources: geoData.citationDomains.map(d => d.domain),
    });
  }

  // Update Project GEO score
  await Project.findByIdAndUpdate(project._id, {
    "scores.geo": geoData.geoScore,
  });

  // Log GEO Agent Run
  await AgentRun.create({
    projectId: project._id,
    agentType: "GEO Agent",
    taskName: `Analyzed AI Search Visibility across ${geoData.queries.length} commercial queries`,
    status: "completed",
    input: { domain: project.domain, queriesCount: geoData.queries.length },
    output: {
      geoScore: geoData.geoScore,
      brandMentionRate: geoData.brandMentionRate,
      topCitingCompetitors: competitorsList,
    },
    modelUsed: result.meta.model,
    provider: result.meta.provider,
    tokensUsed: {
      input: result.meta.inputTokens,
      output: result.meta.outputTokens,
      total: result.meta.totalTokens,
    },
    estimatedCostUSD: result.meta.estimatedCost,
    executionTimeMs: result.meta.durationMs,
  });

  return geoData;
}
