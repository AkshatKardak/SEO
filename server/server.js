import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import seoRouter from "./routes/seoRoutes.js";
import rankRouter from "./routes/rankRoutes.js";
import analysisRouter from "./routes/analysisRoutes.js";
import { startRankCron } from "./cron/rankChecker.js";
import apiV1Router from "./routes/apiV1Router.js";

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));
app.use(express.json());

// Health check endpoints
app.get("/", (req, res) => res.json({ status: "online", message: "SerpoAI Growth OS Server is running ✅", time: new Date().toISOString() }));
app.get("/health", (req, res) => res.json({ status: "healthy", service: "serpo-server", time: new Date().toISOString() }));
app.get("/api/health", (req, res) => res.json({ status: "healthy", service: "serpo-server", time: new Date().toISOString() }));

app.use("/api/auth", authRouter);
app.use("/api/seo", seoRouter);
app.use("/api/rank", rankRouter);
app.use("/api/analysis", analysisRouter);
app.use("/api", apiV1Router);
app.use("/api/v1", apiV1Router);

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately so port 5000 is always reachable
const server = app.listen(PORT, () => {
  console.log(`🚀 SerpoAI server running on http://localhost:${PORT}`);
});

// Asynchronously connect to MongoDB with automatic retry; never crash the server process
async function initDatabaseWithRetry(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectDB();
      console.log("✅ MongoDB successfully connected.");
      startRankCron();
      return;
    } catch (err) {
      console.warn(`⚠️ MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error("❌ MongoDB connection failed after all attempts. Server remains online in fallback mode.");
      }
    }
  }
}

initDatabaseWithRetry();

export default app;
