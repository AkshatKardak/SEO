import mongoose from "mongoose";

const growthMemorySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["CONTENT", "SEO", "GEO", "CONVERSION", "AUDIENCE", "PRICING", "GENERAL"],
      default: "GENERAL",
    },
    learning: { type: String, required: true },
    confidence: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "High",
    },
    source: { type: String, default: "Experiment & Analytics Data" },
    sourceExperimentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrowthExperiment",
      default: null,
    },
    impactWeight: { type: Number, default: 1.0 },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GrowthMemory = mongoose.model("GrowthMemory", growthMemorySchema);
export default GrowthMemory;
