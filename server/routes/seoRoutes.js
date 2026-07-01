import express from "express";
import { analyzeUrl, getAnalyses, getAnalysis } from "../controllers/seoController.js";
import auth from "../middleware/auth.js";

const seoRouter = express.Router();

seoRouter.post("/analyze", auth, analyzeUrl);
seoRouter.get("/analyses", auth, getAnalyses);
seoRouter.get("/analysis/:id", auth, getAnalysis);

export default seoRouter;