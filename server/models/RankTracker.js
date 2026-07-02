import mongoose from "mongoose";

// Single merged rankEntrySchema — includes competitors for full rank data
const rankEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  position: { type: Number, default: null },
  competitors: [
    {
      position: Number,
      url: String,
      domain: String,
      title: String,
      snippet: String,
    },
  ],
});

const rankTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    keyword: { type: String, required: true },
    targetUrl: { type: String, required: true },
    history: [rankEntrySchema],
    lastChecked: { type: Date, default: null },
  },
  { timestamps: true }
);

const RankTracker = mongoose.model("RankTracker", rankTrackerSchema);
export default RankTracker;
