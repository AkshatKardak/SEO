import confetti from "canvas-confetti";
import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Sparkles,
  Bot,
  RefreshCw,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function GEOIntelligence() {
  const { currentProject } = useProject();
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGEO = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getGEOQueries(currentProject._id);
      setGeoData(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load GEO analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentProject) {
      fetchGEO();
    }
  }, [currentProject]);

  const handleRunGEO = async () => {
    if (!currentProject) return;
    setRefreshing(true);
    try {
      await growthAPI.triggerGEOAnalysis(currentProject._id);
      await fetchGEO();
      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.7 },
          colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
        });
      } catch (e) {}
      toast.success("AI Search Visibility simulation completed!");
    } catch (err: any) {
      toast.error(err.message || "GEO scan failed");
    } finally {
      setRefreshing(false);
    }
  };

  const queries = geoData?.queries || [];
  const geoScore = geoData?.geoScore || currentProject?.scores?.geo || 50;
  const mentionRate = geoData?.brandMentionRate || geoData?.mentionRate || 40;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent">
              <Sparkles size={13} />
              Generative Engine Optimization (GEO)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
              AI Search Radar
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            AI-Search Visibility Engine
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-3xl leading-relaxed font-sans">
            Simulate and evaluate brand citations across Google AI Overviews, Gemini, ChatGPT, and Perplexity.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-text-muted bg-surface-raised px-2.5 py-0.5 rounded border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Intelligence Telemetry · {currentProject?.domain || "Target Domain"}
            </span>
          </div>
        </div>

        <button
          onClick={handleRunGEO}
          disabled={refreshing}
          className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Simulating AI Engines..." : "Run AI Query Simulation"}
        </button>
      </div>

      {/* ── 3 High-Impact KPI Metrics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: GEO Visibility Score */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              GEO Visibility Score
            </span>
            <Bot size={14} className="text-sky-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-sky-500 tabular-nums">{geoScore}</span>
            <span className="text-xs font-mono text-text-muted">/100</span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded border border-sky-500/20 text-sky-500 bg-sky-500/5">
              {geoScore >= 70 ? "High Citations" : "Opt Required"}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, geoScore)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-muted mt-2 block">
            Composite AI citation authority index
          </span>
        </div>

        {/* Metric 2: Brand Mention Rate */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Brand Mention Rate
            </span>
            <Sparkles size={14} className="text-accent" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-accent tabular-nums">{mentionRate}%</span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              Across Citations
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, mentionRate)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-muted mt-2 block">
            Commercial prompt citation frequency
          </span>
        </div>

        {/* Metric 3: Tested AI Search Queries */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Tested AI Prompts
            </span>
            <Zap size={14} className="text-violet-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-violet-500 tabular-nums">{queries.length}</span>
            <span className="text-xs font-mono text-text-muted">Search Queries</span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded border border-violet-500/20 text-violet-500 bg-violet-500/5">
              4 AI Engines
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: queries.length > 0 ? "100%" : "0%" }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-muted mt-2 block">
            Google AI, Gemini, ChatGPT & Perplexity
          </span>
        </div>
      </div>

      {/* ── AI Search System Query Coverage Deck ── */}
      <div className="bg-surface rounded-xl p-5 border border-border space-y-5">
        {/* Section Header with Engine Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-sans font-semibold text-sm text-text-primary flex items-center gap-2">
              <Bot size={15} className="text-accent" />
              AI Search System Query Coverage
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5 font-sans">
              Commercial prompt evaluations with citation positioning and competitor signals
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {["Google AI Overviews", "Gemini", "ChatGPT", "Perplexity"].map((name) => (
              <span key={name} className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
                {name}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface-raised/40 border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-surface-raised border border-border max-w-lg mx-auto space-y-3 my-2">
            <div className="w-10 h-10 rounded-lg bg-surface border border-border text-accent flex items-center justify-center mx-auto">
              <Bot size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">No AI Queries Simulated Yet</h4>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-sans">
                Run the simulation to inspect your brand citations, rank positions, and competitor mentions across Google AI Overviews, Gemini, ChatGPT, and Perplexity.
              </p>
            </div>
            <button
              onClick={handleRunGEO}
              disabled={refreshing}
              className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Simulating AI Search Queries..." : "Run AI Query Simulation"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((q: any, idx: number) => (
              <div
                key={q._id || idx}
                className="bg-surface rounded-xl p-4 sm:p-5 border border-border space-y-3 hover:border-accent/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded border border-border bg-surface-raised text-text-primary font-mono font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <p className="text-xs font-mono font-semibold text-text-primary">
                      "{q.query}"
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted self-start sm:self-auto">
                    Last tested: {new Date(q.lastTestedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {/* 4-Engine Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  {[
                    { name: "Google AI Overviews", data: q.engines?.google_ai, icon: "🔍" },
                    { name: "Gemini Search", data: q.engines?.gemini, icon: "✨" },
                    { name: "ChatGPT Citations", data: q.engines?.chatgpt, icon: "💬" },
                    { name: "Perplexity Citations", data: q.engines?.perplexity, icon: "🌐" },
                  ].map((eng) => (
                    <div
                      key={eng.name}
                      className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2 ${
                        eng.data?.mentioned
                          ? "bg-emerald-500/5 border-emerald-500/30 text-text-primary"
                          : "bg-surface-raised border-border text-text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] text-text-primary flex items-center gap-1.5 truncate">
                          <span>{eng.icon}</span> {eng.name}
                        </span>
                        {eng.data?.mentioned ? (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0">
                            #{eng.data.position || 1} Mentioned
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-border text-text-muted shrink-0">
                            Not Cited
                          </span>
                        )}
                      </div>
                      {eng.data?.snippet && (
                        <p className="text-[11px] text-text-muted line-clamp-2 italic leading-relaxed font-sans">
                          "{eng.data.snippet}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Missing topics & competitor citations */}
                {(q.missingTopics?.length > 0 || q.competitorMentions?.length > 0) && (
                  <div className="pt-2.5 border-t border-border flex flex-wrap items-center gap-2.5 text-xs font-mono">
                    {q.competitorMentions?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-text-muted text-[10px]">Competitors cited:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {q.competitorMentions.map((comp: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded border border-border bg-surface-raised text-text-primary text-[10px]">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {q.missingTopics?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-500 text-[10px]">· Missing topics:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {q.missingTopics.map((top: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded border border-amber-500/20 text-amber-500 bg-amber-500/5 text-[10px]">
                              {top}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Insight Educational Callout ── */}
      <div className="bg-surface-raised rounded-xl p-5 border border-border flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-surface border border-border text-accent flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
            Generative Engine Optimization Mechanics
          </h4>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            AI answer engines synthesize source entities rather than simple keywords. To maximize citations across Google AI Overviews, Gemini, ChatGPT, and Perplexity, SerpoAI automatically prepares structured Q&A comparison matrices, schema markup, and verifiable entity definitions that LLMs cite as canonical ground truth.
          </p>
        </div>
      </div>
    </div>
  );
}
