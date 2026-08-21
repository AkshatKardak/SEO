import mongoose from "mongoose";

const growthOpportunitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "TECHNICAL_SEO",
        "ON_PAGE_SEO",
        "CONTENT",
        "GEO",
        "CONVERSION",
        "COMPETITOR",
        "BACKLINK",
        "SOCIAL",
        "OUTREACH",
        "EXPERIMENT",
        "RETENTION",
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    evidence: [{ type: String }],
    impactScore: { type: Number, min: 1, max: 10, default: 5 },
    effortScore: { type: Number, min: 1, max: 10, default: 5 },
    confidenceScore: { type: Number, min: 0.0, max: 1.0, default: 0.7 },
    priorityScore: { type: Number, default: 0, index: true },
    estimatedValue: { type: String, default: "High Impact" },
    status: {
      type: String,
      enum: ["discovered", "in_progress", "pending_approval", "approved", "executed", "dismissed", "completed"],
      default: "discovered",
      index: true,
    },
    recommendedAction: { type: String, required: true },
    automationLevel: {
      type: String,
      enum: ["Copilot", "Autopilot", "Autonomous"],
      default: "Autopilot",
    },
    requiresApproval: { type: Boolean, default: true },
    assignedAgent: {
      type: String,
      enum: [
        "Intelligence Agent",
        "SEO Agent",
        "GEO Agent",
        "Content Agent",
        "Growth Analyst",
      ],
      default: "Growth Analyst",
    },
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrowthAction",
      default: null,
    },
    metricsAfter: {
      measuredAt: Date,
      impactObserved: String,
      verified: Boolean,
    },
  },
  { timestamps: true }
);

growthOpportunitySchema.pre("save", function (next) {
  if (this.effortScore > 0) {
    // Priority Score formula: (Impact * Confidence / Effort) * 10
    this.priorityScore = Math.round(((this.impactScore * this.confidenceScore) / this.effortScore) * 10 * 10) / 10;
  }
  next();
});

const GrowthOpportunity = mongoose.model("GrowthOpportunity", growthOpportunitySchema);
export default GrowthOpportunity;
