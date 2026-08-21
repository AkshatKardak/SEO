import mongoose from "mongoose";

const geoQuerySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    query: { type: String, required: true },
    engines: {
      chatgpt: {
        mentioned: { type: Boolean, default: false },
        position: { type: Number, default: null },
        snippet: { type: String, default: "" },
      },
      perplexity: {
        mentioned: { type: Boolean, default: false },
        position: { type: Number, default: null },
        snippet: { type: String, default: "" },
      },
      gemini: {
        mentioned: { type: Boolean, default: false },
        position: { type: Number, default: null },
        snippet: { type: String, default: "" },
      },
      google_ai: {
        mentioned: { type: Boolean, default: false },
        position: { type: Number, default: null },
        snippet: { type: String, default: "" },
      },
    },
    competitorMentions: [{ type: String }],
    missingTopics: [{ type: String }],
    suggestedCitationSources: [{ type: String }],
    lastTestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GEOQuery = mongoose.model("GEOQuery", geoQuerySchema);
export default GEOQuery;
