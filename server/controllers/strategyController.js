import Project from "../models/Project.js";
import { getOrGenerateStrategy } from "../services/strategyService.js";

export const getProjectStrategy = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const strategy = await getOrGenerateStrategy(projectId);
    res.json({ success: true, strategy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
