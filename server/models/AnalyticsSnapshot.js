import mongoose from "mongoose";

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    funnel: {
      visibilityImpressions: { type: Number, default: 0 },
      organicTrafficSessions: { type: Number, default: 0 },
      engagedSessions: { type: Number, default: 0 },
      signupsCount: { type: Number, default: 0 },
      activationsCount: { type: Number, default: 0 },
      mrrRevenueUSD: { type: Number, default: 0 },
    },
    rates: {
      clickThroughRateCTR: { type: Number, default: 0 },
      signupConversionRate: { type: Number, default: 0 },
      activationRate: { type: Number, default: 0 },
      averagePosition: { type: Number, default: 0 },
    },
    topLandingPages: [
      {
        path: String,
        sessions: Number,
        conversions: Number,
      },
    ],
    topSearchQueries: [
      {
        query: String,
        clicks: Number,
        impressions: Number,
        position: Number,
        ctr: Number,
      },
    ],
    sourceAttribution: [
      {
        channel: String,
        percentage: Number,
      },
    ],
  },
  { timestamps: true }
);

const AnalyticsSnapshot = mongoose.model("AnalyticsSnapshot", analyticsSnapshotSchema);
export default AnalyticsSnapshot;
