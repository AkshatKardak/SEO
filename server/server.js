import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import seoRouter from "./routes/seoRoutes.js";
import rankRouter from "./routes/rankRoutes.js";
import { startRankCron } from "./cron/rankChecker.js";

connectDB();
startRankCron();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRouter);
app.use("/api/seo", seoRouter);
app.use("/api/rank", rankRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));