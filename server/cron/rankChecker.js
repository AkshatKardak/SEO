import cron from "node-cron";
import RankTracker from "../models/RankTracker.js";
import User from "../models/User.js";
import { checkRankForTracker } from "../controllers/rankController.js";
import { sendRankReportEmail } from "../services/emailService.js";

export const startRankCron = () => {
  // Daily cron — runs every day at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    console.log("[CRON] Daily rank check started...");
    try {
      const users = await User.find({ schedulePreference: "daily" });
      for (const user of users) {
        const trackers = await RankTracker.find({ userId: user._id });
        for (const tracker of trackers) {
          await checkRankForTracker(tracker);
          await new Promise((r) => setTimeout(r, 2000));
        }
        // Fetch updated trackers with latest history and send report
        const updatedTrackers = await RankTracker.find({ userId: user._id });
        await sendRankReportEmail({
          name: user.name,
          email: user.email,
          trackers: updatedTrackers,
          frequency: "daily",
        });
      }
      console.log("[CRON] Daily check done");
    } catch (err) {
      console.error("[CRON] Daily cron error:", err.message);
    }
  });

  // Weekly cron — runs every Monday at 6:00 AM
  cron.schedule("0 6 * * 1", async () => {
    console.log("[CRON] Weekly rank check started...");
    try {
      const users = await User.find({ schedulePreference: "weekly" });
      for (const user of users) {
        const trackers = await RankTracker.find({ userId: user._id });
        for (const tracker of trackers) {
          await checkRankForTracker(tracker);
          await new Promise((r) => setTimeout(r, 2000));
        }
        const updatedTrackers = await RankTracker.find({ userId: user._id });
        await sendRankReportEmail({
          name: user.name,
          email: user.email,
          trackers: updatedTrackers,
          frequency: "weekly",
        });
      }
      console.log("[CRON] Weekly check done");
    } catch (err) {
      console.error("[CRON] Weekly cron error:", err.message);
    }
  });
};
