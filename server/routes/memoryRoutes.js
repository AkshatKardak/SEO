import express from "express";
import { getGrowthMemory } from "../controllers/memoryController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getGrowthMemory);

export default router;
