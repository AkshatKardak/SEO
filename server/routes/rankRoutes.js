import express from "express";
import { addKeyword, getKeywords, deleteKeyword } from "../controllers/rankController.js";
import auth from "../middleware/auth.js";

const rankRouter = express.Router();

rankRouter.post("/add", auth, addKeyword);
rankRouter.get("/list", auth, getKeywords);
rankRouter.delete("/:id", auth, deleteKeyword);

export default rankRouter;