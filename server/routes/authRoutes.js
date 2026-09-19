import express from "express";
import { getUser, login, register, updateSchedule, clerkSync } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/clerk-sync', clerkSync);
authRouter.get('/user', auth, getUser);
authRouter.put("/schedule", auth, updateSchedule);

export default authRouter;

