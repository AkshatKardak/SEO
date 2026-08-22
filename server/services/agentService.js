import llm from "../ai/providers/LLMProvider.js";
import { ContentBriefSchema, ExperimentPlanSchema } from "../ai/schemas/growthSchemas.js";
import AgentRun from "../models/AgentRun.js";
import GrowthAction from "../models/GrowthAction.js";
import GrowthOpportunity from "../models/GrowthOpportunity.js";
import GrowthExperiment from "../models/GrowthExperiment.js";
import CompanyProfile from "../models/CompanyProfile.js";
import Project from "../models/Project.js";

/**
 * Dispatches an opportunity to its specialized AI agent for execution or action drafting
 */
export async function executeAgentForOpportunity(opportunityId, userExecutionMode = null) {
  const opportunity = await GrowthOpportunity.findById(opportunityId).populate("projectId");
  if (!opportunity) throw new Error("Opportunity not found");

  const project = opportunity.projectId;
  const profile = await CompanyProfile.findOne({ projectId: project._id });
  const agentType = opportunity.assignedAgent;

  // Determine execution mode (Project setting or override)
  const mode = userExecutionMode || project.settings?.executionMode || "Autopilot";

  const startTime = Date.now();

  let runResult = null;
  let actionCreated = null;

  switch (agentType) {
    case "SEO Agent": {
      // Generates concrete technical fix or structured data schema
      const systemPrompt = `You are an elite Senior Technical SEO Agent.
Generate a concrete, production-ready fix for the identified SEO issue.
Provide JSON with:
- "title": Clear title
- "summary": 2 sentence explanation of the technical change
- "diff": Specific code diff, meta tag, or robots/sitemap change
- "targetPage": Specific URL or template path
- "expectedImpact": Expected ranking/indexing benefit`;

      const prompt = `Opportunity Title: ${opportunity.title}
Description: ${opportunity.description}
Evidence: ${opportunity.evidence?.join("; ")}
Domain: ${project.domain}
Recommended Action: ${opportunity.recommendedAction}`;

      const res = await llm.generateStructured({
        systemPrompt,
        prompt,
        maxTokens: 1800,
        temperature: 0.2,
      });

      runResult = res;

      // Create GrowthAction for Action Center
      actionCreated = await GrowthAction.create({
        projectId: project._id,
        opportunityId: opportunity._id,
        title: `SEO Fix: ${opportunity.title}`,
        description: res.data.summary || opportunity.recommendedAction,
        actionType: "APPLY_SEO_FIX",
        status: mode === "Autonomous" && !opportunity.requiresApproval ? "executed" : "pending_approval",
        riskLevel: "LOW",
        proposedChanges: {
          summary: res.data.summary,
          diff: res.data.diff,
          targetPage: res.data.targetPage || project.url,
          payload: res.data,
        },
        expectedImpact: res.data.expectedImpact || opportunity.estimatedValue,
        executedAt: mode === "Autonomous" && !opportunity.requiresApproval ? new Date() : null,
      });
      break;
    }

    case "Content Agent": {
      // Generates high-quality Content Brief or Draft optimized for SEO & GEO
      const systemPrompt = `You are an elite Content Strategy Agent.
Produce a comprehensive, conversion-focused Content Opportunity Brief and Draft Outline.
Favor originality, clear search intent, GEO citation signals, and first-hand value over generic filler.`;

      const prompt = `Opportunity Title: ${opportunity.title}
Description: ${opportunity.description}
Company: ${profile?.companyName || project.domain}
Value Prop: ${profile?.valueProposition}
Target Audience: ${profile?.targetAudience?.join(", ")}
Recommended Action: ${opportunity.recommendedAction}`;

      const res = await llm.generateStructured({
        systemPrompt,
        prompt,
        schema: ContentBriefSchema,
        maxTokens: 2500,
        temperature: 0.3,
      });

      runResult = res;

      // Create Content Growth Action
      actionCreated = await GrowthAction.create({
        projectId: project._id,
        opportunityId: opportunity._id,
        title: `Content Draft: ${res.data.title || opportunity.title}`,
        description: `High-value ${res.data.recommendedFormat || 'article'} targeting "${res.data.primaryKeyword}". Search intent: ${res.data.searchIntent}`,
        actionType: "PUBLISH_CONTENT",
        status: "pending_approval", // Content always requires human review
        riskLevel: "LOW",
        proposedChanges: {
          summary: `Publish new piece targeting keyword "${res.data.primaryKeyword}" with CTA: "${res.data.cta}"`,
          targetPage: `/blog/${res.data.primaryKeyword.toLowerCase().replace(/\s+/g, "-")}`,
          payload: res.data,
        },
        expectedImpact: res.data.businessValue || opportunity.estimatedValue,
      });
      break;
    }

    case "GEO Agent": {
      // Generates GEO Authority & Citation Strategy
      const systemPrompt = `You are an elite Generative Engine Optimization Agent.
Create an action plan to capture citations in AI answers across ChatGPT, Perplexity, and Gemini.`;

      const prompt = `Opportunity: ${opportunity.title}
Evidence: ${opportunity.evidence?.join("; ")}
Competitors: ${profile?.competitors?.map(c => c.name).join(", ")}
Recommended Action: ${opportunity.recommendedAction}`;

      const res = await llm.generateStructured({
        systemPrompt,
        prompt,
        maxTokens: 1800,
        temperature: 0.2,
      });

      runResult = res;

      actionCreated = await GrowthAction.create({
        projectId: project._id,
        opportunityId: opportunity._id,
        title: `GEO Optimization: ${opportunity.title}`,
        description: res.data.summary || opportunity.recommendedAction,
        actionType: "GEO_CITATION_UPDATE",
        status: "pending_approval",
        riskLevel: "LOW",
        proposedChanges: {
          summary: res.data.summary || "Build authoritative entity hub to capture AI answer citations",
          payload: res.data,
        },
        expectedImpact: "Increase AI answer brand mention rate by 25%+",
      });
      break;
    }

    case "Growth Analyst":
    default: {
      // Converts opportunity into a testable Growth Experiment
      const systemPrompt = `You are a Senior Growth Experimentation Analyst.
Convert this growth opportunity into a structured, measurable Growth Experiment with clear hypothesis, baseline, target, and statistical success metrics.`;

      const prompt = `Opportunity: ${opportunity.title}
Evidence: ${opportunity.evidence?.join("; ")}
Goal: ${project.growthGoal}
Recommended Action: ${opportunity.recommendedAction}`;

      const res = await llm.generateStructured({
        systemPrompt,
        prompt,
        schema: ExperimentPlanSchema,
        maxTokens: 1800,
        temperature: 0.2,
      });

      runResult = res;

      const expData = res.data;

      // Create GrowthExperiment
      const experiment = await GrowthExperiment.create({
        projectId: project._id,
        opportunityId: opportunity._id,
        title: `Experiment: ${opportunity.title}`,
        type: expData.type || "Landing page test",
        hypothesis: expData.hypothesis,
        metric: expData.metric,
        baselineValue: expData.baseline,
        targetValue: expData.target,
        currentValue: expData.baseline,
        expectedImpact: expData.expectedImpact,
        status: "running",
        confidence: Math.round(opportunity.confidenceScore * 100),
      });

      actionCreated = await GrowthAction.create({
        projectId: project._id,
        opportunityId: opportunity._id,
        title: `Launch Experiment: ${opportunity.title}`,
        description: expData.hypothesis,
        actionType: "EXECUTE_EXPERIMENT",
        status: mode === "Autonomous" ? "executed" : "approved",
        riskLevel: "LOW",
        proposedChanges: {
          summary: `Test hypothesis: "${expData.hypothesis}" targeting metric "${expData.metric}" (${expData.baseline} → ${expData.target})`,
          payload: { experimentId: experiment._id, ...expData },
        },
        expectedImpact: expData.expectedImpact,
        executedAt: new Date(),
      });
      break;
    }
  }

  // Update opportunity status
  await GrowthOpportunity.findByIdAndUpdate(opportunity._id, {
    status: actionCreated.status === "executed" ? "executed" : "in_progress",
    actionId: actionCreated._id,
  });

  // Log Agent Run
  const agentRun = await AgentRun.create({
    projectId: project._id,
    opportunityId: opportunity._id,
    agentType,
    taskName: `Executed ${agentType} for "${opportunity.title}"`,
    status: "completed",
    input: { opportunityTitle: opportunity.title, action: opportunity.recommendedAction },
    output: runResult?.data || {},
    modelUsed: runResult?.meta?.model || "unknown",
    provider: runResult?.meta?.provider || "Groq",
    tokensUsed: {
      input: runResult?.meta?.inputTokens || 0,
      output: runResult?.meta?.outputTokens || 0,
      total: runResult?.meta?.totalTokens || 0,
    },
    estimatedCostUSD: runResult?.meta?.estimatedCost || 0,
    executionTimeMs: Date.now() - startTime,
  });

  // Attach agentRun to action
  if (actionCreated) {
    actionCreated.agentRunId = agentRun._id;
    await actionCreated.save();
  }

  return {
    agentRun,
    action: actionCreated,
    opportunity,
  };
}
