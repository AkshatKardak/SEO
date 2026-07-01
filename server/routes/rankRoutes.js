import express from "express";
import {
  addKeyword,
  getKeywords,
  getTracker,
  deleteKeyword,
  refreshKeyword,
} from "../controllers/rankController.js";
import auth from "../middleware/auth.js";

const rankRouter = express.Router();

rankRouter.post("/add", auth, addKeyword);
rankRouter.get("/list", auth, getKeywords);
rankRouter.get("/:id", auth, getTracker);
rankRouter.post("/:id/refresh", auth, refreshKeyword);
rankRouter.delete("/:id", auth, deleteKeyword);

export default rankRouter;
