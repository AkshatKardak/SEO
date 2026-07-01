import { Stagehand } from "@browserbasehq/stagehand";
import RankTracker from "../models/RankTracker.js";

// Add a keyword to track
// Add a keyword to track
export const addKeyword = async (req, res) => {
  try {
    const { keyword, targetUrl } = req.body;
    if (!keyword || !targetUrl)
      return res.status(400).json({ success: false, message: "Keyword and URL are required" });

    const existing = await RankTracker.findOne({
      userId: req.userId,
      keyword: keyword.toLowerCase(),
      targetUrl,
    });
    if (existing)
      return res.status(400).json({ success: false, message: "Already tracking this keyword" });

    const tracker = await RankTracker.create({
      userId: req.userId,
      keyword: keyword.toLowerCase(),
      targetUrl,
      history: [],
    });

    // Run first check immediately
    await checkRankForTracker(tracker);
    const updated = await RankTracker.findById(tracker._id);
    res.status(201).json({ success: true, tracker: updated });

  } catch (error) {
    console.error("Add keyword error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const refreshKeyword = async (req, res) => {
  try {
    const tracker = await RankTracker.findOne({ _id: req.params.id, userId: req.userId });
    if (!tracker) return res.status(404).json({ success: false, message: "Tracker not found" });

    await checkRankForTracker(tracker);
    const updated = await RankTracker.findById(tracker._id);
    res.json({ success: true, tracker: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all tracked keywords for user
export const getKeywords = async (req, res) => {
  try {
    const trackers = await RankTracker.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, trackers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a tracked keyword
export const deleteKeyword = async (req, res) => {
  try {
    await RankTracker.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: "Keyword removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Core rank checking function (also used by cron)
export const checkRankForTracker = async (tracker) => {
  try {
    const apiKey = process.env.GOOGLE_CSE_API_KEY;
    const cx = process.env.GOOGLE_CSE_CX;

    if (!apiKey || !cx) {
      console.warn("[RankChecker] Missing GOOGLE_CSE_API_KEY or GOOGLE_CSE_CX — skipping rank check");
      return;
    }

    const targetDomain = new URL(tracker.targetUrl).hostname.replace("www.", "");
    let position = null;

    // Fetch up to 3 pages (30 results) to find rank within top 30
    for (let start = 1; start <= 21; start += 10) {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(tracker.keyword)}&start=${start}&num=10`;

      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await response.json();

      if (data.error) {
        console.error("[RankChecker] Google CSE error:", data.error.message);
        break;
      }

      const items = data.items || [];
      for (let i = 0; i < items.length; i++) {
        try {
          const resultDomain = new URL(items[i].link).hostname.replace("www.", "");
          if (resultDomain.includes(targetDomain) || targetDomain.includes(resultDomain)) {
            position = start + i; // absolute position (1-indexed)
            break;
          }
        } catch (_) {}
      }

      if (position !== null) break;
    }

    await RankTracker.findByIdAndUpdate(tracker._id, {
      $push: { history: { date: new Date(), position } },
      lastChecked: new Date(),
    });

    console.log(`[RankChecker] "${tracker.keyword}" → position ${position ?? "not found (>30)"}`);

  } catch (error) {
    console.error(`[RankChecker] Failed for "${tracker.keyword}":`, error.message);
  }
};