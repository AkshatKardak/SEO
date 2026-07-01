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
seoRouter.post("/analyze-bulk", auth, analyzeBulk);
seoRouter.get("/score-history", auth, getScoreHistory);
seoRouter.post("/:id/share", auth, generateShareLink);
seoRouter.get("/share/:token", getSharedReport);
seoRouter.get("/sitemap-check", auth, checkSitemapRobots);
seoRouter.get("/pagespeed", auth, getPageSpeed);

export default seoRouter;