import express from "express";
import { analyzeUrl, getProviderStatus } from "../controllers/analysisController.js";
import auth from "../middleware/auth.js";

const analysisRouter = express.Router();

analysisRouter.post("/url", auth, analyzeUrl);
analysisRouter.get("/status", auth, getProviderStatus);

export default analysisRouter;
