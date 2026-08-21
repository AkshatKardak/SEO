import mongoose from "mongoose";

const growthReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "on_demand"],
      default: "weekly",
    },
    executiveSummary: {
      type: String,
      required: true,
    },
    growthScoreSnapshot: {
      overall: Number,
      visibility: Number,
      seo: Number,
      geo: Number,
      conversion: Number,
      content: Number,
    },
    outcomesSummary: {
      trafficLift: String,
      conversionLift: String,
      actionsDeployedCount: Number,
      experimentsCompletedCount: Number,
    },
    topWins: [{ type: String }],
    keyLearnings: [{ type: String }],
    nextCyclePriorities: [{ type: String }],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const GrowthReport = mongoose.model("GrowthReport", growthReportSchema);
export default GrowthReport;
