import express from "express";
import { analyzeUrl, getAnalyses, getAnalysis } from "../controllers/seoController.js";
import auth from "../middleware/auth.js";
import { analyzeBulk } from "../controllers/seoController.js";
import { generateShareLink, getSharedReport } from "../controllers/seoController.js";
import { checkSitemapRobots } from "../controllers/seoController.js";
import { getPageSpeed } from "../controllers/seoController.js";

const seoRouter = express.Router();

seoRouter.post("/analyze", auth, analyzeUrl);
seoRouter.get("/analyses", auth, getAnalyses);
seoRouter.get("/analysis/:id", auth, getAnalysis);
router.post("/analyze-bulk", protect, analyzeBulk);
router.get("/score-history", protect, getScoreHistory);
router.post("/:id/share", protect, generateShareLink);
router.get("/share/:token", getSharedReport);
router.get("/sitemap-check", protect, checkSitemapRobots);
router.get("/pagespeed", protect, getPageSpeed);

export default seoRouter;