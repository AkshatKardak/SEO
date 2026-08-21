import Project from "../models/Project.js";
import Integration from "../models/Integration.js";
import { getOrGenerateSnapshot, analyzeClosedLoopImpact } from "../services/analyticsService.js";

export const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const [impactData, integrations] = await Promise.all([
      analyzeClosedLoopImpact(projectId),
      Integration.find({ projectId }),
    ]);

    res.json({
      success: true,
      snapshot: impactData.snapshot,
      closedLoopInsights: impactData.closedLoopInsights,
      executedActionsCount: impactData.executedActionsCount,
      integrations,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const connectIntegration = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { provider, propertyId, siteUrl, apiKey, projectId: externalProjId } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const integration = await Integration.findOneAndUpdate(
      { projectId, provider },
      {
        projectId,
        provider,
        status: "connected",
        config: { propertyId, siteUrl, apiKey, projectId: externalProjId },
        lastSyncedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: `${provider} connected successfully`, integration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disconnectIntegration = async (req, res) => {
  try {
    const { projectId, provider } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await Integration.findOneAndDelete({ projectId, provider });
    res.json({ success: true, message: `${provider} disconnected` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
