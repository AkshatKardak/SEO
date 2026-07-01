import { Stagehand } from "@browserbasehq/stagehand";
import RankTracker from "../models/RankTracker.js";

// Add a keyword to track
export const addKeyword = async (req, res) => {
  try {
    const { keyword, targetUrl } = req.body;
    if (!keyword || !targetUrl)
      return res.status(400).json({ success: false, message: "Keyword and URL are required" });

    const existing = await RankTracker.findOne({
      userId: req.userId, keyword: keyword.toLowerCase(), targetUrl,
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
    const stagehand = new Stagehand({
      env: "BROWSERBASE",
      apiKey: process.env.BROWSERBASE_API_KEY,
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    });
    await stagehand.init();
    const page = stagehand.page;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(tracker.keyword)}&num=100`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]"))
        .map((a) => a.href)
        .filter((href) => href.startsWith("http") && !href.includes("google.com"));
    });

    await stagehand.close();

    const targetDomain = new URL(tracker.targetUrl).hostname.replace("www.", "");
    let position = null;

    for (let i = 0; i < results.length; i++) {
      try {
        const resultDomain = new URL(results[i]).hostname.replace("www.", "");
        if (resultDomain.includes(targetDomain) || targetDomain.includes(resultDomain)) {
          position = i + 1;
          break;
        }
      } catch (_) {}
    }

    await RankTracker.findByIdAndUpdate(tracker._id, {
      $push: { history: { date: new Date(), position } },
      lastChecked: new Date(),
    });

  } catch (error) {
    console.error(`Rank check failed for ${tracker.keyword}:`, error.message);
  }
};