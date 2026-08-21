import express from "express";
import {
  getCompetitorAnalyses,
  runCompetitorAnalysis,
} from "../controllers/competitorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getCompetitorAnalyses);
router.post("/project/:projectId/analyze", runCompetitorAnalysis);

export default router;
