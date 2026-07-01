import cron from "node-cron";
import RankTracker from "../models/RankTracker.js";
import User from "../models/User.js";
import { checkRankForTracker } from "../controllers/rankController.js";

export const startRankCron = () => {
  // Daily cron — runs every day at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    console.log("[CRON] Daily rank check started...");
    const users = await User.find({ schedulePreference: "daily" });
    for (const user of users) {
      const trackers = await RankTracker.find({ userId: user._id });
      for (const tracker of trackers) {
        await checkRankForTracker(tracker);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    console.log("[CRON] Daily check done");
  });

  // Weekly cron — runs every Monday at 6:00 AM
  cron.schedule("0 6 * * 1", async () => {
    console.log("[CRON] Weekly rank check started...");
    const users = await User.find({ schedulePreference: "weekly" });
    for (const user of users) {
      const trackers = await RankTracker.find({ userId: user._id });
      for (const tracker of trackers) {
        await checkRankForTracker(tracker);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    console.log("[CRON] Weekly check done");
  });
};