import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    growthGoal: {
      type: String,
      enum: [
        "Increase organic traffic",
        "Increase qualified leads",
        "Increase SaaS signups",
        "Increase conversion rate",
        "Increase revenue",
        "Improve AI visibility",
        "Increase brand awareness",
        "Beat competitors",
      ],
      default: "Increase SaaS signups",
    },
    status: {
      type: String,
      enum: ["pending", "crawling", "analyzed", "failed"],
      default: "pending",
    },
    activeProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      default: null,
    },
    growthHealthScore: {
      type: Number,
      default: 0,
    },
    scores: {
      visibility: { type: Number, default: 0 },
      seo: { type: Number, default: 0 },
      geo: { type: Number, default: 0 },
      conversion: { type: Number, default: 0 },
      content: { type: Number, default: 0 },
    },
    lastAnalyzedAt: {
      type: Date,
      default: null,
    },
    settings: {
      executionMode: {
        type: String,
        enum: ["Copilot", "Autopilot", "Autonomous"],
        default: "Autopilot",
      },
      autoExecuteLowRisk: { type: Boolean, default: true },
      budgetMonthlyUSD: { type: Number, default: 50 },
    },
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1, domain: 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
