import mongoose from "mongoose";

const growthStrategySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    northStarMetric: {
      name: { type: String, default: "Monthly Qualified SaaS Signups" },
      currentValue: { type: String, default: "72/mo" },
      target90Day: { type: String, default: "250/mo" },
    },
    executiveSummary: {
      type: String,
      default: "",
    },
    strategicThemes: [
      {
        name: String,
        objective: String,
        targetQuarter: String,
        priority: String,
      },
    ],
    roadmapPhases: {
      days30: [
        {
          task: String,
          ownerAgent: String,
          expectedImpact: String,
          status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
        },
      ],
      days60: [
        {
          task: String,
          ownerAgent: String,
          expectedImpact: String,
          status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
        },
      ],
      days90: [
        {
          task: String,
          ownerAgent: String,
          expectedImpact: String,
          status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
        },
      ],
    },
    lastGeneratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const GrowthStrategy = mongoose.model("GrowthStrategy", growthStrategySchema);
export default GrowthStrategy;
