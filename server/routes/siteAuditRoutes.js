import express from "express";
import {
  getSiteAudit,
  triggerSiteAudit,
  autoFixIssue,
} from "../controllers/siteAuditController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId", getSiteAudit);
router.post("/project/:projectId/audit", triggerSiteAudit);
router.post("/project/:projectId/fix", autoFixIssue);

export default router;
