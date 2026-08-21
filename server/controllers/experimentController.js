import GrowthExperiment from "../models/GrowthExperiment.js";
import Project from "../models/Project.js";
import { evaluateExperiment } from "../services/experimentService.js";

export const getExperiments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const experiments = await GrowthExperiment.find({ projectId })
      .populate("opportunityId")
      .sort({ createdAt: -1 });

    const runningCount = experiments.filter(e => e.status === "running").length;
    const completedCount = experiments.filter(e => e.status === "completed").length;

    res.json({
      success: true,
      stats: { total: experiments.length, runningCount, completedCount },
      experiments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createExperiment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, type, hypothesis, metric, baselineValue, targetValue, expectedImpact } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (!title || !hypothesis || !metric || !baselineValue || !targetValue) {
      return res.status(400).json({ success: false, message: "All experiment fields are required" });
    }

    const experiment = await GrowthExperiment.create({
      projectId,
      title,
      type: type || "Landing page test",
      hypothesis,
      metric,
      baselineValue,
      targetValue,
      currentValue: baselineValue,
      expectedImpact: expectedImpact || "+20%",
      status: "running",
    });

    res.status(201).json({ success: true, experiment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const evaluateExperimentResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentValue, winner } = req.body;

    const experiment = await GrowthExperiment.findById(id).populate("projectId");
    if (!experiment) return res.status(404).json({ success: false, message: "Experiment not found" });

    if (String(experiment.projectId.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const result = await evaluateExperiment(experiment._id, {
      currentValue,
      winnerOverride: winner,
    });

    res.json({
      success: true,
      message: "Experiment evaluated and learning persisted to Growth Memory",
      experiment: result.experiment,
      memoryItem: result.memoryItem,
    });
  } catch (error) {
    console.error("Evaluate experiment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
