import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["google_analytics_4", "google_search_console", "posthog", "serper", "custom"],
      required: true,
    },
    status: {
      type: String,
      enum: ["connected", "disconnected", "error"],
      default: "connected",
    },
    config: {
      propertyId: { type: String, default: "" },
      siteUrl: { type: String, default: "" },
      apiKey: { type: String, default: "" },
      projectId: { type: String, default: "" },
      host: { type: String, default: "" },
    },
    encryptedTokens: {
      accessToken: { type: String, default: null },
      refreshToken: { type: String, default: null },
      expiryDate: { type: Date, default: null },
    },
    lastSyncedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

integrationSchema.index({ projectId: 1, provider: 1 }, { unique: true });

const Integration = mongoose.model("Integration", integrationSchema);
export default Integration;
