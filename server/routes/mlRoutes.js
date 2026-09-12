import express from "express";
import { rankProjectOpportunities, detectProjectAnomalies, getGrowthForecast } from "../controllers/mlController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/rank/:projectId", auth, rankProjectOpportunities);
router.get("/anomalies/:projectId", auth, detectProjectAnomalies);
router.get("/forecast/:projectId", auth, getGrowthForecast);
router.get("/public-forecast", getGrowthForecast);

export default router;
