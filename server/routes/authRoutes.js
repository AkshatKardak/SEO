import express from "express";
import { getUser, login, register } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { updateSchedule } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/user', auth, getUser);
router.put("/schedule", protect, updateSchedule);

export default authRouter;