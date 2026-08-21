import mongoose from "mongoose";

const growthActionSchema = new mongoose.Schema(
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
    agentRunId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentRun",
      default: null,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    actionType: {
      type: String,
      enum: [
        "PUBLISH_CONTENT",
        "APPLY_SEO_FIX",
        "OPTIMIZE_CONVERSION",
        "CREATE_COMPARISON_PAGE",
        "EXECUTE_EXPERIMENT",
        "GEO_CITATION_UPDATE",
        "TECHNICAL_IMPROVEMENT",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_approval", "approved", "rejected", "executed", "reverted"],
      default: "pending_approval",
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    proposedChanges: {
      summary: String,
      diff: String,
      targetPage: String,
      payload: mongoose.Schema.Types.Mixed,
    },
    expectedImpact: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    executedAt: { type: Date, default: null },
    executionResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const GrowthAction = mongoose.model("GrowthAction", growthActionSchema);
export default GrowthAction;
