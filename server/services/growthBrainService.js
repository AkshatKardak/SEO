import llm from "../ai/providers/LLMProvider.js";
import { CompanyProfileSchema, OpportunitiesListSchema } from "../ai/schemas/growthSchemas.js";
import GrowthMemory from "../models/GrowthMemory.js";
import Project from "../models/Project.js";
import CompanyProfile from "../models/CompanyProfile.js";
import GrowthOpportunity from "../models/GrowthOpportunity.js";
import AgentRun from "../models/AgentRun.js";

/**
 * Generates CompanyProfile from crawled pages
 */
export async function synthesizeCompanyProfile(project, crawledPages) {
  const pageSummaries = crawledPages.map(p => ({
    url: p.url,
    title: p.title,
    description: p.description,
    h1: p.h1,
    h2: p.h2,
    wordCount: p.wordCount,
    textSnippet: p.bodyTextSnippet.slice(0, 1000),
  }));

  const systemPrompt = `You are an elite Growth Operating System and Chief Strategy Officer.
Analyze the crawled web data for a company website and construct a structured Company Profile and Knowledge Graph.
Extract accurate facts about what the company does, its audience, target personas, main competitors, value proposition, and growth bottlenecks.
Respond with pure JSON strictly conforming to the requested schema.`;

  const prompt = `Domain: ${project.domain}
Growth Goal: ${project.growthGoal}
Crawled Pages Data:
${JSON.stringify(pageSummaries, null, 2)}

Produce a comprehensive JSON Company Profile matching:
- companyName
- industry
- description (2-3 sentences)
- products (array)
- services (array)
- targetAudience (array)
- buyerPersonas (array of { name, role, painPoints, goals })
- competitors (array of { name, domain, differentiation })
- valueProposition
- keywords (array)
- brandEntities (array)
- contentTopics (array)
- growthBottlenecks (array)`;

  const result = await llm.generateStructured({
    systemPrompt,
    prompt,
    schema: CompanyProfileSchema,
    maxTokens: 2500,
    temperature: 0.2,
  });

  const profileData = result.data;

  // Persist CompanyProfile
  const profile = await CompanyProfile.findOneAndUpdate(
    { projectId: project._id },
    {
      projectId: project._id,
      ...profileData,
      rawCrawledPages: crawledPages.map(p => ({
        url: p.url,
        title: p.title,
        description: p.description,
        h1: p.h1?.[0] || "",
        wordCount: p.wordCount,
      })),
    },
    { upsert: true, new: true }
  );

  // Link profile to project
  await Project.findByIdAndUpdate(project._id, { activeProfileId: profile._id });

  // Log Agent Run
  await AgentRun.create({
    projectId: project._id,
    agentType: "Intelligence Agent",
    taskName: `Synthesized Company Knowledge Graph for ${project.domain}`,
    status: "completed",
    input: { domain: project.domain, pagesScanned: crawledPages.length },
    output: { companyName: profile.companyName, industry: profile.industry },
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

  return profile;
}

/**
 * Growth Brain: Generates ICE-ranked opportunities tailored to user's Growth Goal and Memory
 */
export async function runGrowthBrainAnalysis(project, profile, crawledPages) {
  // Fetch existing verified growth memory
  const memoryItems = await GrowthMemory.find({ projectId: project._id }).sort({ impactWeight: -1 }).limit(10);
  const memoryContext = memoryItems.length
    ? memoryItems.map(m => `- [${m.category}] ${m.learning} (Confidence: ${m.confidence})`).join("\n")
    : "No prior experiment memory yet (baseline scan).";

  const systemPrompt = `You are the AI Growth Brain of AI Growth OS.
Your core philosophy: Discover → Prioritize → Execute → Measure → Learn → Repeat.
Instead of generating 100 trivial tips, discover 6-10 highest-leverage, outcome-focused Growth Opportunities.
Rank opportunities strictly based on:
Priority Score = Impact (1-10) × Confidence (0.1-1.0) ÷ Effort (1-10)

Crucial Rule: Adapt priority directly to the user's Growth Goal: "${project.growthGoal}".
- If goal is "Increase SaaS signups" or "Increase revenue", conversion rate optimization, pricing page proof, and high-intent comparison pages MUST rank higher than generic blog traffic.
- Every opportunity must be grounded in specific EVIDENCE found in the crawled pages.
- Specify whether human approval is required (e.g. publishing content, external actions require approval; technical SEO analysis does not).
- Assign each opportunity to one of the 5 execution agents:
  1. Intelligence Agent
  2. SEO Agent
  3. GEO Agent
  4. Content Agent
  5. Growth Analyst`;

  const prompt = `Company Profile:
- Company Name: ${profile.companyName}
- Industry: ${profile.industry}
- Value Prop: ${profile.valueProposition}
- Target Audience: ${profile.targetAudience?.join(", ")}
- Selected Growth Goal: ${project.growthGoal}

Historical Growth Memory:
${memoryContext}

Crawled Pages Overview:
${crawledPages.map(p => `• URL: ${p.url}
  Title: "${p.title}"
  H1: ${JSON.stringify(p.h1)}
  Missing Alt Images: ${p.images?.missingAlt || 0}/${p.images?.total || 0}
  Internal Links: ${p.links?.internal?.length || 0}
  Word Count: ${p.wordCount}
  Schema: ${JSON.stringify(p.schemaTypes)}`).join("\n\n")}

Generate:
1. "opportunities": Array of 6 to 10 prioritized growth opportunities.
2. "overallGrowthHealth": integer score (0-100).
3. "scores": { visibility, seo, geo, conversion, content } (0-100 each).`;

  const result = await llm.generateStructured({
    systemPrompt,
    prompt,
    schema: OpportunitiesListSchema,
    maxTokens: 3000,
    temperature: 0.3,
  });

  const { opportunities, overallGrowthHealth, scores } = result.data;

  // Clear older discovered opportunities that are not in progress
  await GrowthOpportunity.deleteMany({
    projectId: project._id,
    status: "discovered",
  });

  // Insert newly discovered opportunities
  const createdOpportunities = [];
  for (const opp of opportunities) {
    const evidenceArr = Array.isArray(opp.evidence) ? opp.evidence : [opp.evidence];
    const priority = Math.round(((opp.impactScore * opp.confidenceScore) / opp.effortScore) * 10 * 10) / 10;

    const created = await GrowthOpportunity.create({
      projectId: project._id,
      type: opp.type,
      title: opp.title,
      description: opp.description,
      evidence: evidenceArr,
      impactScore: opp.impactScore,
      effortScore: opp.effortScore,
      confidenceScore: opp.confidenceScore,
      priorityScore: priority,
      estimatedValue: opp.estimatedValue,
      status: "discovered",
      recommendedAction: opp.recommendedAction,
      automationLevel: opp.automationLevel,
      requiresApproval: opp.requiresApproval,
      assignedAgent: opp.assignedAgent,
    });
    createdOpportunities.push(created);
  }

  // Update Project scores
  await Project.findByIdAndUpdate(project._id, {
    growthHealthScore: overallGrowthHealth,
    scores,
    status: "analyzed",
    lastAnalyzedAt: new Date(),
  });

  // Log Growth Brain Agent Run
  await AgentRun.create({
    projectId: project._id,
    agentType: "Growth Brain",
    taskName: `Formulated AI Growth Plan (${createdOpportunities.length} opportunities ranked by ICE)`,
    status: "completed",
    input: { goal: project.growthGoal, memoryItemsCount: memoryItems.length },
    output: { opportunitiesCount: createdOpportunities.length, healthScore: overallGrowthHealth },
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

  return {
    opportunities: createdOpportunities,
    overallGrowthHealth,
    scores,
  };
}
