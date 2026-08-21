import CompetitorAnalysis from "../models/CompetitorAnalysis.js";
import CompanyProfile from "../models/CompanyProfile.js";
import Project from "../models/Project.js";
import llm from "../ai/providers/LLMProvider.js";

/**
 * Runs Content Gap and Competitor Intelligence Analysis
 */
export async function analyzeCompetitorGaps(projectId, competitorDomain = null) {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const profile = await CompanyProfile.findOne({ projectId });
  const targetCompetitor = competitorDomain || profile?.competitors?.[0]?.domain || profile?.competitors?.[0]?.name || "rival-brand.com";
  const competitorName = profile?.competitors?.[0]?.name || targetCompetitor.replace(/^www\./, "").split(".")[0];

  const systemPrompt = `You are an elite Competitive SEO and Product Positioning Intelligence Specialist.
Perform a high-accuracy Content Gap Analysis:
Formula: (Topics competitors cover) + (Topics customers search) - (Topics user covers) = Content Opportunities.
Identify the highest-impact gaps where the competitor is winning traffic/customers that the user does not adequately address.
Respond with JSON matching:
- "domainAuthorityEst": number (1-100)
- "contentVelocityEst": string (e.g. "6-10 articles/month")
- "aiVisibilityScore": number (1-100)
- "contentGaps": array of { "topic", "searchIntent", "estimatedVolume", "difficulty", "competitorUrl", "businessImpact" }
- "keywordOverlap": array of { "keyword", "competitorRank", "userRank", "opportunity" }
- "keyStrengths": array of strings
- "vulnerabilities": array of strings`;

  const prompt = `User Brand: ${profile?.companyName || project.domain}
User Industry: ${profile?.industry || "SaaS"}
User Value Prop: ${profile?.valueProposition}
User Covered Topics: ${profile?.contentTopics?.join(", ") || "General product features"}
User Keywords: ${profile?.keywords?.join(", ") || "software tools"}

Competitor to Analyze: ${competitorName} (${targetCompetitor})

Identify 4-6 specific, high-leverage content gaps and keyword overlap opportunities.`;

  const res = await llm.generateStructured({
    systemPrompt,
    prompt,
    maxTokens: 2500,
    temperature: 0.3,
  });

  const gapData = res.data;

  // Persist in CompetitorAnalysis collection
  const analysis = await CompetitorAnalysis.findOneAndUpdate(
    { projectId, competitorDomain: targetCompetitor.toLowerCase() },
    {
      projectId,
      competitorDomain: targetCompetitor.toLowerCase(),
      competitorName,
      domainAuthorityEst: gapData.domainAuthorityEst || 65,
      contentVelocityEst: gapData.contentVelocityEst || "6 articles/month",
      aiVisibilityScore: gapData.aiVisibilityScore || 70,
      contentGaps: gapData.contentGaps || [],
      keywordOverlap: gapData.keywordOverlap || [],
      keyStrengths: gapData.keyStrengths || [],
      vulnerabilities: gapData.vulnerabilities || [],
      lastAnalyzedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return analysis;
}
