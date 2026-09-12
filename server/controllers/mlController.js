import { rankOpportunitiesWithML, detectAnomaliesWithML, forecastGrowthWithML } from "../services/mlClientService.js";
import GrowthOpportunity from "../models/GrowthOpportunity.js";
import AnalyticsSnapshot from "../models/AnalyticsSnapshot.js";
import Project from "../models/Project.js";

export async function rankProjectOpportunities(req, res) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const opportunities = await GrowthOpportunity.find({ projectId });
    const formatted = opportunities.map(o => ({
      id: o._id.toString(),
      title: o.title,
      type: o.type,
      impactScore: o.impactScore,
      effortScore: o.effortScore,
      confidenceScore: o.confidenceScore,
    }));

    const result = await rankOpportunitiesWithML(project.domain, project.growthGoal, formatted, 3);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to rank opportunities with ML" });
  }
}

export async function detectProjectAnomalies(req, res) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const metricName = req.query.metric || "organic_traffic";
    const currentValue = Number(req.query.currentValue) || 31400;

    // Build mock 14-day history for baseline
    const history = [];
    const now = new Date();
    for (let i = 14; i >= 1; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      history.push({
        timestamp: d.toISOString().split("T")[0],
        value: 40000 + Math.sin(i) * 3000 + (i > 3 ? 2000 : -4000),
      });
    }

    const result = await detectAnomaliesWithML(project.domain, metricName, history, currentValue);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to detect anomalies" });
  }
}

export async function getGrowthForecast(req, res) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    const domain = project ? project.domain : (req.query.domain || "example.com");
    const metricName = req.query.metric || "organic_traffic";

    const history = [];
    const now = new Date();
    for (let i = 21; i >= 0; i -= 3) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      history.push({
        date: d.toISOString().split("T")[0],
        value: 26000 + (21 - i) * 350 + Math.round(Math.random() * 500),
      });
    }

    const result = await forecastGrowthWithML(domain, metricName, history, 30);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to forecast growth" });
  }
}
