import express from "express";
import { getReports, createReport } from "../controllers/reportController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getReports);
router.post("/project/:projectId/generate", createReport);

export default router;
