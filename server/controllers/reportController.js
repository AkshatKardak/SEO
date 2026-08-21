import Project from "../models/Project.js";
import { generateExecutiveReport, getProjectReports } from "../services/reportService.js";

export const getReports = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const reports = await getProjectReports(projectId);
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const createReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { period } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const report = await generateExecutiveReport(projectId, period || "on_demand");
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Report generation failed" });
  }
};
