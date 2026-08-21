import express from "express";
import projectRoutes from "./projectRoutes.js";
import opportunityRoutes from "./opportunityRoutes.js";
import actionRoutes from "./actionRoutes.js";
import geoRoutes from "./geoRoutes.js";
import agentRoutes from "./agentRoutes.js";
import experimentRoutes from "./experimentRoutes.js";
import memoryRoutes from "./memoryRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import competitorRoutes from "./competitorRoutes.js";
import strategyRoutes from "./strategyRoutes.js";
import siteAuditRoutes from "./siteAuditRoutes.js";
import reportRoutes from "./reportRoutes.js";

const apiV1Router = express.Router();

apiV1Router.use("/projects", projectRoutes);
apiV1Router.use("/opportunities", opportunityRoutes);
apiV1Router.use("/actions", actionRoutes);
apiV1Router.use("/geo", geoRoutes);
apiV1Router.use("/agents", agentRoutes);
apiV1Router.use("/experiments", experimentRoutes);
apiV1Router.use("/memory", memoryRoutes);
apiV1Router.use("/analytics", analyticsRoutes);
apiV1Router.use("/competitors", competitorRoutes);
apiV1Router.use("/strategy", strategyRoutes);
apiV1Router.use("/audit", siteAuditRoutes);
apiV1Router.use("/reports", reportRoutes);

export default apiV1Router;
