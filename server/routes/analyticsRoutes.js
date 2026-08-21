import express from "express";
import {
  getProjectAnalytics,
  connectIntegration,
  disconnectIntegration,
} from "../controllers/analyticsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getProjectAnalytics);
router.post("/project/:projectId/connect", connectIntegration);
router.post("/project/:projectId/disconnect", disconnectIntegration);

export default router;
