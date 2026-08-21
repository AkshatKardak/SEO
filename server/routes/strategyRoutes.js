import express from "express";
import { getProjectStrategy } from "../controllers/strategyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getProjectStrategy);

export default router;
