import express from "express";
import { getActions, approveAction, rejectAction } from "../controllers/actionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getActions);
router.post("/:id/approve", approveAction);
router.post("/:id/reject", rejectAction);

export default router;
