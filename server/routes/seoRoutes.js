import express from "express";
import {
  analyzeUrl,
  getAnalyses,
  getAnalysis,
  analyzeBulk,
  getScoreHistory,
  generateShareLink,
  getSharedReport,
  checkSitemapRobots,
  getPageSpeed,
} from "../controllers/seoController.js";
import auth from "../middleware/auth.js";

const seoRouter = express.Router();

seoRouter.post("/analyze", auth, analyzeUrl);
seoRouter.get("/analyses", auth, getAnalyses);
seoRouter.get("/analysis/:id", auth, getAnalysis);
seoRouter.post("/analyze-bulk", auth, analyzeBulk);
seoRouter.get("/score-history", auth, getScoreHistory);
seoRouter.post("/:id/share", auth, generateShareLink);
seoRouter.get("/share/:token", getSharedReport);
seoRouter.get("/sitemap-check", auth, checkSitemapRobots);
seoRouter.get("/pagespeed", auth, getPageSpeed);

export default seoRouter;
