import mongoose from "mongoose";

const seoAnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    scores: {
        performance: { type: Number, default: 0 },
        accessibility: { type: Number, default: 0 },
        seo: { type: Number, default: 0 },
        bestPractices: { type: Number, default: 0 },
    },
    // unique + sparse defined at schema index level below — NOT inline
    // This prevents E11000 duplicate key error for multiple null shareTokens
    shareToken: { type: String, default: null },
    metaTags: {
        title: String,
        description: String,
        hasViewport: Boolean,
        hasCanonical: Boolean,
    },
    imagesMissingAlt: { type: Number, default: 0 },
    brokenLinks: { type: Number, default: 0 },
    aiReport: { type: String, default: "" },
}, { timestamps: true });

// sparse: true means null values are excluded from the index entirely
// so multiple documents with shareToken: null do NOT conflict
seoAnalysisSchema.index({ shareToken: 1 }, { unique: true, sparse: true });

const SeoAnalysis = mongoose.model("SeoAnalysis", seoAnalysisSchema);
export default SeoAnalysis;
