import AgentRun from "../models/AgentRun.js";
import Project from "../models/Project.js";
import CompanyProfile from "../models/CompanyProfile.js";
import GrowthMemory from "../models/GrowthMemory.js";
import llm from "../ai/providers/LLMProvider.js";

export const getAgentActivity = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const runs = await AgentRun.find({ projectId })
      .populate("opportunityId")
      .sort({ createdAt: -1 })
      .limit(30);

    // Compute observability totals
    const totalTokens = runs.reduce((sum, r) => sum + (r.tokensUsed?.total || 0), 0);
    const totalCostUSD = runs.reduce((sum, r) => sum + (r.estimatedCostUSD || 0), 0);
    const completedCount = runs.filter(r => r.status === "completed").length;

    res.json({
      success: true,
      stats: {
        totalRuns: runs.length,
        completedCount,
        totalTokens,
        totalCostUSD: Number(totalCostUSD.toFixed(4)),
      },
      runs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const chatWithAgentCoPilot = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, history } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const [profile, memories] = await Promise.all([
      CompanyProfile.findOne({ projectId }),
      GrowthMemory.find({ projectId }).limit(5),
    ]);

    const systemPrompt = `You are AI Growth OS Co-Pilot — an elite Growth Architect and Autonomous Agent Coordinator.
You assist founders and growth engineers in diagnosing bottlenecks, refining SEO/GEO strategies, planning conversion experiments, and answering strategic questions.
Project Domain: ${project.domain}
Primary Growth Goal: ${project.growthGoal}
Value Proposition: ${profile?.valueProposition || "Software solution"}
Target Audience: ${profile?.buyerPersonas?.map(p => p.name).join(", ") || "Founders"}
Growth Memory Learnings: ${memories.map(m => m.insight).join("; ") || "Comparison pages outperform generic guides."}

Be sharp, concise, actionable, and data-driven. Do not provide vague advice. Give concrete tactical steps.`;

    const prompt = `User Query: "${message}"\n\nProvide the strategic response as an AI Growth OS Co-Pilot.`;

    const completion = await llm.complete({
      systemPrompt,
      prompt,
      maxTokens: 1000,
      temperature: 0.4,
    });

    res.json({
      success: true,
      reply: completion.content,
      agent: "AI Growth Co-Pilot",
      model: completion.model,
      tokensUsed: completion.usage.totalTokens,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Chat failed" });
  }
};
