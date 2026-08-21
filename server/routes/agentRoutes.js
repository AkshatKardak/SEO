import { getAgentActivity, chatWithAgentCoPilot } from "../controllers/agentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/project/:projectId/activity", getAgentActivity);
router.post("/project/:projectId/chat", chatWithAgentCoPilot);

export default router;
