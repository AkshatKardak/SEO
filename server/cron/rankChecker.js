import cron from "node-cron";
import RankTracker from "../models/RankTracker.js";
import { checkRankForTracker } from "../controllers/rankController.js";

// Run every day at 6:00 AM
export const startRankCron = () => {
  cron.schedule("0 6 * * *", async () => {
    console.log("Running daily rank check cron...");
    const trackers = await RankTracker.find({});
    for (const tracker of trackers) {
      await checkRankForTracker(tracker);
      await new Promise((r) => setTimeout(r, 2000)); // 2s delay between requests
    }
    console.log(`Rank check done for ${trackers.length} trackers`);
  });
};