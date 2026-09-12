import GrowthStrategy from "../models/GrowthStrategy.js";
import CompanyProfile from "../models/CompanyProfile.js";
import GrowthMemory from "../models/GrowthMemory.js";
import Project from "../models/Project.js";
import llm from "../ai/providers/LLMProvider.js";

/**
 * Synthesizes or retrieves the 30-60-90 Day Strategic Growth Plan
 */
export async function getOrGenerateStrategy(projectId) {
  let strategy = await GrowthStrategy.findOne({ projectId });

  if (!strategy) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    const [profile, memoryItems] = await Promise.all([
      CompanyProfile.findOne({ projectId }),
      GrowthMemory.find({ projectId }).limit(5),
    ]);

    const systemPrompt = `You are a Principal Growth Strategist and Chief Growth Officer.
Create an ambitious, rigorous 30-60-90 Day Growth Strategy Plan.
Crucial Rule: Emphasize business outcome generation, conversion optimization, high-intent comparison assets, and Generative Engine Optimization (GEO).
Respond with JSON matching:
- "northStarMetric": { "name": string, "currentValue": string, "target90Day": string }
- "executiveSummary": string (2-3 paragraphs of strategic direction)
- "strategicThemes": array of { "name", "objective", "targetQuarter", "priority" }
- "roadmapPhases": {
    "days30": array of { "task", "ownerAgent", "expectedImpact", "status": "pending" },
    "days60": array of { "task", "ownerAgent", "expectedImpact", "status": "pending" },
    "days90": array of { "task", "ownerAgent", "expectedImpact", "status": "pending" }
  }`;

    const prompt = `Project: ${project.domain}
Primary Goal: ${project.growthGoal}
Company Industry: ${profile?.industry || "SaaS"}
Value Prop: ${profile?.valueProposition || "Modern automated software"}
Identified Bottlenecks: ${profile?.growthBottlenecks?.join("; ") || "Low conversion on pricing page"}
Target Personas: ${profile?.buyerPersonas?.map(p => p.name).join(", ") || "Founders and Growth Marketers"}
Growth Memory Learnings: ${memoryItems.map(m => m.insight).join("; ") || "Comparison pages outperform generic guides by 3x in qualified signups."}

Generate the comprehensive 30-60-90 day strategic roadmap.`;

    const res = await llm.generateStructured({
      systemPrompt,
      prompt,
      maxTokens: 3000,
      temperature: 0.3,
    });

    const data = res.data;

    strategy = await GrowthStrategy.create({
      projectId,
      northStarMetric: data.northStarMetric || {
        name: "Monthly Qualified SaaS Signups",
        currentValue: "72/mo",
        target90Day: "250/mo",
      },
      executiveSummary: data.executiveSummary || "Focus initial 30 days on conversion funnel fixes and high-intent competitor comparison pages before expanding top-of-funnel traffic.",
      strategicThemes: data.strategicThemes || [
        { name: "Conversion Rate Optimization", objective: "Lift signup rate from 1.8% to 2.5%", targetQuarter: "Q1", priority: "High" },
        { name: "Generative Engine Authority (GEO)", objective: "Increase AI citation rate to 70%+", targetQuarter: "Q1-Q2", priority: "High" },
        { name: "Commercial Content Dominance", objective: "Capture comparison and alternatives search traffic", targetQuarter: "Q2", priority: "Medium" },
      ],
      roadmapPhases: data.roadmapPhases || {
        days30: [
          { task: "Deploy Pricing Page Social Proof & ROI Calculator", ownerAgent: "SEO Agent", expectedImpact: "+25% signup conversion", status: "pending" },
          { task: "Create Top 3 Competitor Comparison Matrices", ownerAgent: "Content Agent", expectedImpact: "+40 high-intent visitors/day", status: "pending" },
        ],
        days60: [
          { task: "Publish GEO Data-Dense Resource Guides for AI Search & Citations", ownerAgent: "GEO Agent", expectedImpact: "+50% AI citation authority", status: "pending" },
          { task: "Optimize Structured Data and JSON-LD Entity Graph", ownerAgent: "SEO Agent", expectedImpact: "Rich snippets in SERPs", status: "pending" },
        ],
        days90: [
          { task: "Scale Automated Programmatic Comparison Hubs", ownerAgent: "Content Agent", expectedImpact: "+120 organic signups/mo", status: "pending" },
          { task: "Deploy Churn-Prevention and Activation Email Workflows", ownerAgent: "Growth Analyst", expectedImpact: "+15% user activation", status: "pending" },
        ],
      },
      lastGeneratedAt: new Date(),
    });
  }

  return strategy;
}
