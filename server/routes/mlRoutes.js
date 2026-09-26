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
  optimizeGSCQuickWin,
} from "../controllers/mlController.js";
import auth from "../middleware/auth.js";
import {
  rankOpportunities,
  detectAnomalies,
  forecastGrowth,
  verifyPatch,
  analyzeCannibalization,
  analyzeStrikingDistance,
} from "../ml/index.js";

const router = express.Router();

// ── Project-Scoped Endpoints (Authenticated) ──
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

// ── Direct In-Process ML Microservice Endpoints (API Parity) ──
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "serpo-integrated-ml-engine",
    capabilities: [
      "Smart Opportunity Ranking (ICE + ML Lift)",
      "SEO Anomaly Radar (EWMA + Z-Score)",
      "30-Day Growth Forecasting (Autoregressive + Confidence Bands)",
      "Keyword & URL Cannibalization Engine",
      "GSC CTR Striking Distance & Quick Wins",
      "Serpo Bot AST & Schema Patch Verifier",
    ],
  });
});

router.post("/predictions/rank-opportunities", (req, res) => {
  try {
    const { domain, growthGoal, opportunities, historicalExperimentCount } = req.body;
    const result = rankOpportunities(domain, growthGoal, opportunities || [], historicalExperimentCount || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/anomalies/detect", (req, res) => {
  try {
    const { domain, metricName, history, currentValue, contextSignals } = req.body;
    const result = detectAnomalies(domain, metricName, history || [], currentValue || 0, contextSignals || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forecasts/growth", (req, res) => {
  try {
    const { domain, metricName, historicalData, forecastDays, confidenceInterval } = req.body;
    const result = forecastGrowth(domain, metricName, historicalData || [], forecastDays || 30, confidenceInterval || 0.95);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-patch", (req, res) => {
  try {
    const { opportunityId, patchCode, targetFile } = req.body;
    const result = verifyPatch(opportunityId, patchCode, targetFile);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/cannibalization", (req, res) => {
  try {
    const { domain, pairs } = req.body;
    const result = analyzeCannibalization(domain, pairs);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/gsc-quick-wins", (req, res) => {
  try {
    const { domain } = req.body;
    const result = analyzeStrikingDistance(domain);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
