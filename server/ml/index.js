/**
 * SerpoAI In-Server ML Engine Barrel Export
 * Full mathematical, statistical & decision-engine suite running in-process in Node.js.
 */

export { rankOpportunities, predictOpportunity } from "./opportunityRanker.js";
export { detectAnomalies } from "./anomalyDetector.js";
export { forecastGrowth } from "./trafficForecaster.js";
export { analyzeCannibalization } from "./cannibalizationEngine.js";
export { analyzeStrikingDistance, predictCTR } from "./gscCtrEngine.js";
export { verifyPatch } from "./patchVerifier.js";
