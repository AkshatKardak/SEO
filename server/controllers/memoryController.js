import GrowthMemory from "../models/GrowthMemory.js";
import Project from "../models/Project.js";

export const getGrowthMemory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const memoryItems = await GrowthMemory.find({ projectId })
      .populate("sourceExperimentId")
      .sort({ impactWeight: -1, createdAt: -1 });

    res.json({ success: true, memoryItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
