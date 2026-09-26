import axios from "axios";
import {
  rankOpportunities as inProcessRankOpportunities,
  detectAnomalies as inProcessDetectAnomalies,
  forecastGrowth as inProcessForecastGrowth,
  analyzeCannibalization as inProcessAnalyzeCannibalization,
  analyzeStrikingDistance as inProcessAnalyzeStrikingDistance,
  verifyPatch as inProcessVerifyPatch,
} from "../ml/index.js";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// ─── Exported Client API ───────────────────────────────────────────────────

export async function rankOpportunitiesWithML(domain, growthGoal, opportunities, historyCount = 0) {
  // If an external microservice URL is explicitly provided, attempt it; otherwise use native in-process engine
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/predictions/rank-opportunities`,
        { domain, growthGoal, opportunities, historicalExperimentCount: historyCount },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessRankOpportunities(domain, growthGoal, opportunities, historyCount);
}

export async function detectAnomaliesWithML(domain, metricName, history, currentValue, contextSignals = []) {
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/anomalies/detect`,
        { domain, metricName, history, currentValue, contextSignals },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessDetectAnomalies(domain, metricName, history, currentValue, contextSignals);
}

export async function forecastGrowthWithML(domain, metricName, historicalData, forecastDays = 30, confidenceInterval = 0.95) {
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/forecasts/growth`,
        { domain, metricName, historicalData, forecastDays, confidenceInterval },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessForecastGrowth(domain, metricName, historicalData, forecastDays, confidenceInterval);
}

export async function verifyPatchWithML(opportunityId, patchCode, targetFile = "src/pages/index.tsx") {
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/verify-patch`,
        { opportunityId, patchCode, targetFile },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessVerifyPatch(opportunityId, patchCode, targetFile);
}

export async function analyzeCannibalizationWithML(domain, pairs = null) {
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/cannibalization`,
        { domain, pairs },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessAnalyzeCannibalization(domain, pairs);
}

export async function analyzeGSCQuickWinsWithML(domain) {
  if (ML_SERVICE_URL && !ML_SERVICE_URL.includes("localhost:8000")) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/gsc-quick-wins`,
        { domain },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      // Fall through to in-process engine
    }
  }
  return inProcessAnalyzeStrikingDistance(domain);
}
