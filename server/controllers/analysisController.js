import { isSafeUrl } from "../services/crawlerService.js";
import { runAnalyses } from "../services/analysisService.js";
import { ANALYSIS_TYPES } from "../ai/schemas/analysisSchemas.js";
import { llm } from "../ai/providers/LLMProvider.js";

const MAX_ANALYSES = ANALYSIS_TYPES.length;

/** POST /api/analysis/url  { url, analyses?: string[] } */
export const analyzeUrl = async (req, res) => {
  try {
    const { url, analyses } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, message: "A 'url' string is required." });
    }

    // --- Validate / dedupe / cap the requested analysis types (§I) ---
    let types;
    if (analyses === undefined || analyses === null) {
      types = [...ANALYSIS_TYPES]; // default to the full set
    } else if (!Array.isArray(analyses)) {
      return res.status(400).json({ success: false, message: "'analyses' must be an array of analysis types." });
    } else {
      const deduped = [...new Set(analyses.map((a) => String(a).trim()).filter(Boolean))];
      if (deduped.length === 0) {
        types = [...ANALYSIS_TYPES];
      } else {
        const unknown = deduped.filter((t) => !ANALYSIS_TYPES.includes(t));
        if (unknown.length) {
          return res.status(400).json({
            success: false,
            message: `Unknown analysis type(s): ${unknown.join(", ")}. Valid types: ${ANALYSIS_TYPES.join(", ")}.`,
          });
        }
        types = deduped.slice(0, MAX_ANALYSES);
      }
    }

    // --- SSRF-safe URL validation (http/https only; private/metadata blocked) ---
    const safe = await isSafeUrl(url);
    if (!safe.safe) {
      return res.status(400).json({ success: false, message: `URL rejected: ${safe.reason}` });
    }

    // --- Run analyses (partial results; one failure does not kill the rest) ---
    const report = await runAnalyses(safe.url, types);
    const anyOk = report.results.some((r) => r.status === "completed");

    // 200 when at least one analysis succeeded; 502 when they all failed
    // (e.g. no provider configured) so the client can show the actionable error.
    return res.status(anyOk ? 200 : 502).json({ success: anyOk, ...report });
  } catch (error) {
    const msg = String(error?.message || "Analysis failed.");
    if (/SSRF/i.test(msg)) {
      return res.status(400).json({ success: false, message: `URL rejected: ${msg}` });
    }
    console.error("[analysis] error:", msg);
    return res.status(500).json({ success: false, message: msg.slice(0, 300) });
  }
};

/** GET /api/analysis/status → provider enablement + model (never keys). */
export const getProviderStatus = (_req, res) => {
  try {
    return res.json({ success: true, providers: llm.getProviderStatus(), availableTypes: ANALYSIS_TYPES });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not read provider status." });
  }
};
