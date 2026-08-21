import Project from "../models/Project.js";
import CompanyProfile from "../models/CompanyProfile.js";
import GrowthOpportunity from "../models/GrowthOpportunity.js";
import GrowthExperiment from "../models/GrowthExperiment.js";
import GrowthAction from "../models/GrowthAction.js";
import AgentRun from "../models/AgentRun.js";
import GEOQuery from "../models/GEOQuery.js";
import { crawlWebsite } from "../services/crawlerService.js";
import { synthesizeCompanyProfile, runGrowthBrainAnalysis } from "../services/growthBrainService.js";
import { runGEOAnalysis } from "../services/geoService.js";

/**
 * Normalizes input URL and extracts domain
 */
function extractDomainAndUrl(inputUrl) {
  let cleanUrl = inputUrl.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }
  const parsed = new URL(cleanUrl);
  const domain = parsed.hostname.replace(/^www\./, "").toLowerCase();
  return { domain, url: cleanUrl };
}

export const createProject = async (req, res) => {
  try {
    const { url, name, growthGoal = "Increase SaaS signups" } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: "Website URL is required" });
    }

    const { domain, url: normalizedUrl } = extractDomainAndUrl(url);
    const projectName = name?.trim() || domain.charAt(0).toUpperCase() + domain.slice(1);

    // Check if project already exists for user
    let project = await Project.findOne({ userId: req.userId, domain });
    if (!project) {
      project = await Project.create({
        userId: req.userId,
        name: projectName,
        domain,
        url: normalizedUrl,
        growthGoal,
        status: "crawling",
      });
    } else {
      project.growthGoal = growthGoal;
      project.status = "crawling";
      await project.save();
    }

    // Step 1: Crawl website (SSRF safe)
    let crawlResult;
    try {
      crawlResult = await crawlWebsite(normalizedUrl, 4);
    } catch (crawlErr) {
      project.status = "failed";
      await project.save();
      return res.status(400).json({ success: false, message: `Website analysis failed: ${crawlErr.message}` });
    }

    // Step 2: Synthesize Company Profile & Knowledge Graph via Intelligence Agent
    const profile = await synthesizeCompanyProfile(project, crawlResult.pages);

    // Step 3: Run Growth Brain Prioritization & Opportunity Discovery
    const brainResult = await runGrowthBrainAnalysis(project, profile, crawlResult.pages);

    // Step 4: Run Initial GEO Analysis
    try {
      await runGEOAnalysis(project, profile);
    } catch (geoErr) {
      console.warn("[ProjectController] GEO analysis warning:", geoErr.message);
    }

    const fullProject = await Project.findById(project._id).populate("activeProfileId");

    res.status(201).json({
      success: true,
      project: fullProject,
      profile,
      opportunities: brainResult.opportunities,
      scores: brainResult.scores,
      growthHealthScore: brainResult.overallGrowthHealth,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create project" });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .populate("activeProfileId")
      .sort({ updatedAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId })
      .populate("activeProfileId");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Fetch quick summary data
    const [topOpportunities, recentActions, activeExperiments] = await Promise.all([
      GrowthOpportunity.find({ projectId: project._id, status: { $ne: "dismissed" } })
        .sort({ priorityScore: -1 })
        .limit(3),
      GrowthAction.find({ projectId: project._id }).sort({ createdAt: -1 }).limit(5),
      GrowthExperiment.find({ projectId: project._id, status: "running" }).limit(5),
    ]);

    res.json({
      success: true,
      project,
      profile: project.activeProfileId,
      topOpportunities,
      recentActions,
      activeExperiments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProjectGoal = async (req, res) => {
  try {
    const { growthGoal, executionMode } = req.body;
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (growthGoal) project.growthGoal = growthGoal;
    if (executionMode) project.settings.executionMode = executionMode;
    await project.save();

    // Re-evaluate opportunities priority based on the new goal
    const profile = await CompanyProfile.findOne({ projectId: project._id });
    if (profile && profile.rawCrawledPages?.length) {
      await runGrowthBrainAnalysis(project, profile, profile.rawCrawledPages.map(p => ({
        url: p.url,
        title: p.title,
        description: p.description,
        h1: [p.h1],
        wordCount: p.wordCount,
        bodyTextSnippet: "",
        images: { total: 0, missingAlt: 0 },
        links: { internal: [] },
        schemaTypes: [],
      })));
    }

    const updated = await Project.findById(project._id).populate("activeProfileId");
    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reanalyzeProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.status = "crawling";
    await project.save();

    const crawlResult = await crawlWebsite(project.url, 4);
    const profile = await synthesizeCompanyProfile(project, crawlResult.pages);
    const brainResult = await runGrowthBrainAnalysis(project, profile, crawlResult.pages);
    await runGEOAnalysis(project, profile);

    const updatedProject = await Project.findById(project._id).populate("activeProfileId");

    res.json({
      success: true,
      project: updatedProject,
      profile,
      opportunities: brainResult.opportunities,
      scores: brainResult.scores,
    });
  } catch (error) {
    console.error("Reanalyze error:", error);
    res.status(500).json({ success: false, message: error.message || "Re-analysis failed" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await Promise.all([
      CompanyProfile.deleteMany({ projectId: project._id }),
      GrowthOpportunity.deleteMany({ projectId: project._id }),
      GrowthAction.deleteMany({ projectId: project._id }),
      GrowthExperiment.deleteMany({ projectId: project._id }),
      AgentRun.deleteMany({ projectId: project._id }),
      GEOQuery.deleteMany({ projectId: project._id }),
    ]);

    res.json({ success: true, message: "Project and all associated intelligence removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
