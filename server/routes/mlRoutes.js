import express from "express";
import {
  rankProjectOpportunities,
  detectProjectAnomalies,
  getGrowthForecast,
  evaluateSerpoBotPatch,
  dispatchSerpoBotPR,
  getProjectCannibalization,
  applyCannibalizationFix,
  getProjectGSCQuickWins,
  optimizeGSCQuickWin
} from "../controllers/mlController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/rank/:projectId", auth, rankProjectOpportunities);
router.get("/anomalies/:projectId", auth, detectProjectAnomalies);
router.get("/forecast/:projectId", auth, getGrowthForecast);
router.get("/public-forecast", getGrowthForecast);

// ── 3 Unique ML Feature Endpoints ──
router.post("/serpo-bot/evaluate-patch", auth, evaluateSerpoBotPatch);
router.post("/serpo-bot/dispatch-pr", auth, dispatchSerpoBotPR);

router.get("/cannibalization/:projectId", auth, getProjectCannibalization);
router.post("/cannibalization/apply-fix", auth, applyCannibalizationFix);

router.get("/gsc-quick-wins/:projectId", auth, getProjectGSCQuickWins);
router.post("/gsc-quick-wins/optimize", auth, optimizeGSCQuickWin);

export default router;
