import express from "express";
import { getGEOQueries, triggerGEOAnalysis } from "../controllers/geoController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getGEOQueries);
router.post("/project/:projectId/analyze", triggerGEOAnalysis);

export default router;
