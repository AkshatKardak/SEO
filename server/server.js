import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import seoRouter from "./routes/seoRoutes.js";
import rankRouter from "./routes/rankRoutes.js";
import { startRankCron } from "./cron/rankChecker.js";

import apiV1Router from "./routes/apiV1Router.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => res.send("AI Growth OS Server is running ✅"));
app.use("/api/auth", authRouter);
app.use("/api/seo", seoRouter);
app.use("/api/rank", rankRouter);
app.use("/api/v1", apiV1Router);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  startRankCron();
  app.listen(PORT, () => console.log(`🚀 SerpoAI server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ DB connection failed:", err.message);
  process.exit(1);
});
