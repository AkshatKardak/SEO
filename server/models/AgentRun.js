import mongoose from "mongoose";

const agentRunSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrowthOpportunity",
      default: null,
    },
    agentType: {
      type: String,
      enum: [
        "Growth Brain",
        "Intelligence Agent",
        "SEO Agent",
        "GEO Agent",
        "Content Agent",
        "Growth Analyst",
      ],
      required: true,
      index: true,
    },
    taskName: { type: String, required: true },
    status: {
      type: String,
      enum: ["running", "completed", "failed", "waiting_approval"],
      default: "running",
      index: true,
    },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    modelUsed: { type: String, default: "llama-3.3-70b-versatile" },
    provider: { type: String, default: "Groq" },
    tokensUsed: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    estimatedCostUSD: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

const AgentRun = mongoose.model("AgentRun", agentRunSchema);
export default AgentRun;
