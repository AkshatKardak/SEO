import llm from "../ai/providers/LLMProvider.js";
import GrowthExperiment from "../models/GrowthExperiment.js";
import GrowthMemory from "../models/GrowthMemory.js";
import AgentRun from "../models/AgentRun.js";
import Project from "../models/Project.js";

/**
 * Evaluates an ongoing experiment and extracts strategic learnings into persistent Growth Memory
 */
export async function evaluateExperiment(experimentId, { currentValue, winnerOverride = null }) {
  const experiment = await GrowthExperiment.findById(experimentId);
  if (!experiment) throw new Error("Experiment not found");

  const project = await Project.findById(experiment.projectId);

  const systemPrompt = `You are an elite Growth Experiment Evaluation Analyst.
Analyze the experiment results vs baseline and formulate a high-confidence, strategic organizational learning for future decision-making.
Explain clearly:
1. Did the experiment win or lose?
2. What is the verified percentage improvement or degradation?
3. What is the concise, generalizable learning that future Growth Brain strategy must remember?`;

  const prompt = `Experiment Title: ${experiment.title}
Hypothesis: ${experiment.hypothesis}
Target Metric: ${experiment.metric}
Baseline: ${experiment.baselineValue}
Target: ${experiment.targetValue}
Observed Current Value: ${currentValue || experiment.currentValue}
Type: ${experiment.type}`;

  const res = await llm.generateStructured({
    systemPrompt,
    prompt,
    maxTokens: 1200,
    temperature: 0.2,
  });

  const evaluation = res.data;

  // Determine winner
  let winner = winnerOverride || "Variant B (AI Growth)";
  if (evaluation.winner) {
    winner = evaluation.winner;
  }

  // Update experiment
  experiment.currentValue = currentValue || experiment.currentValue;
  experiment.status = "completed";
  experiment.endDate = new Date();
  experiment.winner = winner;
  experiment.learnings = evaluation.learning || `Verified improvement from ${experiment.baselineValue} to ${currentValue} on ${experiment.metric}.`;
  await experiment.save();

  // Create persistent Growth Memory item
  const memoryItem = await GrowthMemory.create({
    projectId: experiment.projectId,
    category: experiment.type.includes("Content") ? "CONTENT" : experiment.type.includes("Pricing") || experiment.type.includes("CTA") ? "CONVERSION" : "SEO",
    learning: experiment.learnings,
    confidence: "High",
    source: `Completed Experiment: ${experiment.title}`,
    sourceExperimentId: experiment._id,
    impactWeight: winner.includes("Variant B") ? 1.5 : 0.8,
  });

  // Log Growth Analyst Agent Run
  await AgentRun.create({
    projectId: experiment.projectId,
    agentType: "Growth Analyst",
    taskName: `Evaluated Experiment "${experiment.title}" and extracted organizational memory`,
    status: "completed",
    input: { experimentId: experiment._id, baseline: experiment.baselineValue, observed: currentValue },
    output: { winner, learning: experiment.learnings, memoryId: memoryItem._id },
    modelUsed: res.meta.model,
    provider: res.meta.provider,
    tokensUsed: {
      input: res.meta.inputTokens,
      output: res.meta.outputTokens,
      total: res.meta.totalTokens,
    },
    estimatedCostUSD: res.meta.estimatedCost,
    executionTimeMs: res.meta.durationMs,
  });

  return {
    experiment,
    memoryItem,
  };
}
