import GrowthAction from "../models/GrowthAction.js";
import GrowthOpportunity from "../models/GrowthOpportunity.js";
import Project from "../models/Project.js";

export const getActions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const actions = await GrowthAction.find({ projectId })
      .populate("opportunityId")
      .populate("agentRunId")
      .sort({ createdAt: -1 });

    const pendingCount = actions.filter(a => a.status === "pending_approval").length;

    res.json({ success: true, actions, pendingCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveAction = async (req, res) => {
  try {
    const action = await GrowthAction.findById(req.params.id).populate("projectId");
    if (!action) return res.status(404).json({ success: false, message: "Action not found" });

    if (String(action.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    action.status = "approved";
    action.approvedAt = new Date();
    action.executedAt = new Date();
    action.executionResult = {
      message: "Action approved by human and marked for deployment/execution",
      status: "SUCCESS",
      executedAt: new Date(),
    };
    await action.save();

    if (action.opportunityId) {
      await GrowthOpportunity.findByIdAndUpdate(action.opportunityId, {
        status: "executed",
      });
    }

    res.json({ success: true, message: "Action approved and applied", action });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectAction = async (req, res) => {
  try {
    const { reason } = req.body;
    const action = await GrowthAction.findById(req.params.id).populate("projectId");
    if (!action) return res.status(404).json({ success: false, message: "Action not found" });

    if (String(action.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    action.status = "rejected";
    action.rejectedAt = new Date();
    action.rejectionReason = reason || "Declined by user";
    await action.save();

    if (action.opportunityId) {
      await GrowthOpportunity.findByIdAndUpdate(action.opportunityId, {
        status: "dismissed",
      });
    }

    res.json({ success: true, message: "Action rejected", action });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
