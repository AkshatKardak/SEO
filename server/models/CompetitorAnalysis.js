import mongoose from "mongoose";

const competitorAnalysisSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    competitorDomain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    competitorName: {
      type: String,
      required: true,
    },
    domainAuthorityEst: {
      type: Number,
      default: 50,
    },
    contentVelocityEst: {
      type: String,
      default: "4-8 articles/month",
    },
    aiVisibilityScore: {
      type: Number,
      default: 60,
    },
    contentGaps: [
      {
        topic: String,
        searchIntent: String,
        estimatedVolume: String,
        difficulty: String,
        competitorUrl: String,
        businessImpact: String,
      },
    ],
    keywordOverlap: [
      {
        keyword: String,
        competitorRank: Number,
        userRank: Number,
        opportunity: String,
      },
    ],
    keyStrengths: [{ type: String }],
    vulnerabilities: [{ type: String }],
    lastAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CompetitorAnalysis = mongoose.model("CompetitorAnalysis", competitorAnalysisSchema);
export default CompetitorAnalysis;
