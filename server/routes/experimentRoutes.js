import express from "express";
import {
  getExperiments,
  createExperiment,
  evaluateExperimentResult,
} from "../controllers/experimentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getExperiments);
router.post("/project/:projectId", createExperiment);
router.put("/:id/evaluate", evaluateExperimentResult);

export default router;
