import mongoose from "mongoose";

const siteAuditReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
    },
    technicalHealthScore: {
      type: Number,
      default: 78,
    },
    coreWebVitals: {
      lcp: { value: String, status: String }, // e.g. "1.8s", "GOOD"
      fidInp: { value: String, status: String }, // e.g. "45ms", "GOOD"
      cls: { value: String, status: String }, // e.g. "0.04", "GOOD"
      mobilePerformanceScore: { type: Number, default: 82 },
    },
    issuesSummary: {
      critical: { type: Number, default: 0 },
      warnings: { type: Number, default: 0 },
      notices: { type: Number, default: 0 },
    },
    issuesList: [
      {
        id: String,
        severity: { type: String, enum: ["critical", "warning", "notice"] },
        category: { type: String, enum: ["performance", "indexing", "metadata", "security", "schema", "mobile"] },
        title: String,
        description: String,
        affectedUrl: String,
        recommendedFix: String,
        autoFixable: { type: Boolean, default: true },
        status: { type: String, enum: ["open", "in_review", "fixed"], default: "open" },
      },
    ],
    pagesCrawled: { type: Number, default: 1 },
    lastAuditedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SiteAuditReport = mongoose.model("SiteAuditReport", siteAuditReportSchema);
export default SiteAuditReport;
