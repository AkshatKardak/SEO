import express from "express";
import {
  createProject,
  getUserProjects,
  getProject,
  updateProjectGoal,
  reanalyzeProject,
  deleteProject,
} from "../controllers/projectController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.post("/", createProject);
router.get("/", getUserProjects);
router.get("/:id", getProject);
router.put("/:id/goal", updateProjectGoal);
router.post("/:id/analyze", reanalyzeProject);
router.delete("/:id", deleteProject);

export default router;
