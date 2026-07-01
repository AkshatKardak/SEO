import mongoose from "mongoose";

const seoAnalysisSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
    url: { type: String, required: true},
    scores: {
        performance: { type: Number, default:0},
        accessibility: {type: Number, default:0},
        seo: {type: Number, default: 0},
        bestPractices: {type: Number, default: 0},
    },
    metaTags: {
        title: String,
        description: String,
        hasViewport: Boolean,
        hasCanonical: Boolean,
    },
    imagesMissingAlt: {type: Number, default: 0},
    brokenLinks: {type: Number, default:0},
    aiReport: {type: String, default: ""},
}, {timestamps: true});

const SeoAnalysis = mongoose.model("SeoAnalysis", seoAnalysisSchema);
export default SeoAnalysis;