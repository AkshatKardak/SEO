import Project from "../models/Project.js";
import SiteAuditReport from "../models/SiteAuditReport.js";
import { runTechnicalSiteAudit, createFixActionForIssue } from "../services/siteAuditService.js";

export const getSiteAudit = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    let audit = await SiteAuditReport.findOne({ projectId });
    if (!audit) {
      audit = await runTechnicalSiteAudit(projectId);
    }

    res.json({ success: true, audit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const triggerSiteAudit = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const audit = await runTechnicalSiteAudit(projectId);
    res.json({ success: true, audit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Audit failed" });
  }
};

export const autoFixIssue = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { issueId } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const action = await createFixActionForIssue(projectId, issueId);
    res.json({ success: true, message: "Fix queued to Action Center", action });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Fix failed" });
  }
};
