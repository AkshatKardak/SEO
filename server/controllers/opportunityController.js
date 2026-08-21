import GrowthOpportunity from "../models/GrowthOpportunity.js";
import Project from "../models/Project.js";
import { executeAgentForOpportunity } from "../services/agentService.js";

export const getOpportunities = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, minImpact, requiresApproval } = req.query;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const filter = { projectId };
    if (category) filter.type = category;
    if (minImpact) filter.impactScore = { $gte: Number(minImpact) };
    if (requiresApproval !== undefined) filter.requiresApproval = requiresApproval === "true";

    const opportunities = await GrowthOpportunity.find(filter)
      .populate("actionId")
      .sort({ priorityScore: -1 });

    res.json({ success: true, opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOpportunity = async (req, res) => {
  try {
    const opportunity = await GrowthOpportunity.findById(req.params.id)
      .populate("projectId")
      .populate("actionId");

    if (!opportunity) return res.status(404).json({ success: false, message: "Opportunity not found" });
    if (String(opportunity.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const executeOpportunity = async (req, res) => {
  try {
    const opportunity = await GrowthOpportunity.findById(req.params.id).populate("projectId");
    if (!opportunity) return res.status(404).json({ success: false, message: "Opportunity not found" });

    if (String(opportunity.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { executionMode } = req.body;
    const result = await executeAgentForOpportunity(opportunity._id, executionMode);

    res.json({
      success: true,
      message: `${opportunity.assignedAgent} dispatched successfully`,
      action: result.action,
      agentRun: result.agentRun,
    });
  } catch (error) {
    console.error("Execute opportunity error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to execute opportunity" });
  }
};

export const dismissOpportunity = async (req, res) => {
  try {
    const opportunity = await GrowthOpportunity.findById(req.params.id).populate("projectId");
    if (!opportunity) return res.status(404).json({ success: false, message: "Opportunity not found" });

    if (String(opportunity.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    opportunity.status = "dismissed";
    await opportunity.save();

    res.json({ success: true, message: "Opportunity dismissed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
