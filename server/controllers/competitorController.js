import CompetitorAnalysis from "../models/CompetitorAnalysis.js";
import Project from "../models/Project.js";
import CompanyProfile from "../models/CompanyProfile.js";
import { analyzeCompetitorGaps } from "../services/competitorService.js";

export const getCompetitorAnalyses = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    let analyses = await CompetitorAnalysis.find({ projectId }).sort({ updatedAt: -1 });

    // If none analyzed yet, automatically analyze primary competitor from profile
    if (analyses.length === 0) {
      const profile = await CompanyProfile.findOne({ projectId });
      if (profile) {
        const initial = await analyzeCompetitorGaps(projectId);
        analyses = [initial];
      }
    }

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const runCompetitorAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { competitorDomain } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const analysis = await analyzeCompetitorGaps(projectId, competitorDomain);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Competitor analysis error:", error);
    res.status(500).json({ success: false, message: error.message || "Analysis failed" });
  }
};
