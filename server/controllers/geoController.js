import GEOQuery from "../models/GEOQuery.js";
import Project from "../models/Project.js";
import CompanyProfile from "../models/CompanyProfile.js";
import { runGEOAnalysis } from "../services/geoService.js";

export const getGEOQueries = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const queries = await GEOQuery.find({ projectId }).sort({ createdAt: -1 });

    // Calculate aggregated brand mention rate
    let totalMentions = 0;
    let totalEnginesChecked = 0;

    queries.forEach(q => {
      if (q.engines.chatgpt?.mentioned) totalMentions++;
      if (q.engines.perplexity?.mentioned) totalMentions++;
      if (q.engines.gemini?.mentioned) totalMentions++;
      if (q.engines.google_ai?.mentioned) totalMentions++;
      totalEnginesChecked += 4;
    });

    const mentionRate = totalEnginesChecked > 0 ? Math.round((totalMentions / totalEnginesChecked) * 100) : 0;

    res.json({
      success: true,
      geoScore: project.scores?.geo || 50,
      mentionRate,
      totalQueries: queries.length,
      queries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const triggerGEOAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const profile = await CompanyProfile.findOne({ projectId: project._id });
    const geoData = await runGEOAnalysis(project, profile);

    res.json({ success: true, geoData });
  } catch (error) {
    console.error("GEO Analysis error:", error);
    res.status(500).json({ success: false, message: error.message || "GEO analysis failed" });
  }
};
