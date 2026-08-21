import mongoose from "mongoose";

const buyerPersonaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    painPoints: [{ type: String }],
    goals: [{ type: String }],
  },
  { _id: false }
);

const competitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: { type: String, default: "" },
    differentiation: { type: String, default: "" },
  },
  { _id: false }
);

const companyProfileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    companyName: { type: String, required: true },
    industry: { type: String, default: "Technology / SaaS" },
    description: { type: String, default: "" },
    products: [{ type: String }],
    services: [{ type: String }],
    targetAudience: [{ type: String }],
    buyerPersonas: [buyerPersonaSchema],
    competitors: [competitorSchema],
    valueProposition: { type: String, default: "" },
    keywords: [{ type: String }],
    brandEntities: [{ type: String }],
    contentTopics: [{ type: String }],
    growthBottlenecks: [{ type: String }],
    rawCrawledPages: [
      {
        url: String,
        title: String,
        description: String,
        h1: String,
        wordCount: Number,
      },
    ],
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);
export default CompanyProfile;
