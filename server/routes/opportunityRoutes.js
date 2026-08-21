import express from "express";
import {
  getOpportunities,
  getOpportunity,
  executeOpportunity,
  dismissOpportunity,
} from "../controllers/opportunityController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getOpportunities);
router.get("/:id", getOpportunity);
router.post("/:id/execute", executeOpportunity);
router.post("/:id/dismiss", dismissOpportunity);

export default router;
