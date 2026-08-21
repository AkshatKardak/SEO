import mongoose from "mongoose";

const growthExperimentSchema = new mongoose.Schema(
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
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Landing page test",
        "CTA test",
        "Content test",
        "SEO test",
        "Internal-linking test",
        "GEO content test",
        "Pricing-page test",
      ],
      default: "Landing page test",
    },
    hypothesis: { type: String, required: true },
    metric: { type: String, required: true },
    baselineValue: { type: String, required: true },
    targetValue: { type: String, required: true },
    currentValue: { type: String, default: "" },
    expectedImpact: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "running", "completed", "inconclusive", "failed"],
      default: "running",
      index: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    trafficSample: { type: Number, default: 0 },
    confidence: { type: Number, min: 0, max: 100, default: 80 },
    winner: {
      type: String,
      enum: ["Variant A (Original)", "Variant B (AI Growth)", "Inconclusive", "None"],
      default: "None",
    },
    learnings: { type: String, default: "" },
  },
  { timestamps: true }
);

const GrowthExperiment = mongoose.model("GrowthExperiment", growthExperimentSchema);
export default GrowthExperiment;
