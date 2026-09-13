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
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <Sparkles size={14} />
                Generative Engine Optimization (GEO)
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary font-bold">
                AI Search Radar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mt-2">
              AI-Search Visibility Engine
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              Simulate and measure how your brand is cited and positioned across leading generative answer engines: Google AI Overviews, Gemini, ChatGPT, and Perplexity.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected Intelligence Engine · {currentProject?.domain || "Target Domain"}
              </span>
            </div>
          </div>

          <button
            onClick={handleRunGEO}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-glow text-xs font-bold transition-all self-start sm:self-center disabled:opacity-50 hover-lift shrink-0"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Simulating AI Engines..." : "Run AI Query Simulation"}
          </button>
        </div>

        {/* ── 3 High-Impact KPI Metrics Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Metric 1: GEO Visibility Score */}
          <div className="surface-card hover-lift p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                GEO Visibility Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
                <Bot size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-sky-500">{geoScore}</span>
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
              <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                {geoScore >= 70 ? "High Visibility" : "Optimization Req"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, geoScore)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground mt-2.5 block">
              Composite AI citation authority index
            </span>
          </div>

          {/* Metric 2: Brand Mention Rate */}
          <div className="surface-card hover-lift p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Brand Mention Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-emerald-500">{mentionRate}%</span>
              <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Across Citations
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, mentionRate)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground mt-2.5 block">
              Frequency brand appears in commercial AI queries
            </span>
          </div>

          {/* Metric 3: Tested AI Search Queries */}
          <div className="surface-card hover-lift p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Tested AI Prompts
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center border border-violet-500/20">
                <Zap size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-violet-500">{queries.length}</span>
              <span className="text-xs font-bold text-muted-foreground">Search Queries</span>
              <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                4 AI Engines
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: queries.length > 0 ? "100%" : "0%" }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground mt-2.5 block">
              Google AI, Gemini, ChatGPT & Perplexity
            </span>
          </div>
        </div>

        {/* ── AI Search System Query Coverage Deck ── */}
        <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border space-y-6 shadow-sm">
          {/* Section Header with Engine Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                AI Search System Query Coverage
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluation across commercial prompts with citation positioning and competitor presence
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
                Google AI Overviews
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
                Gemini
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
                ChatGPT
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
                Perplexity
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-muted/20 border border-dashed border-border/80 max-w-lg mx-auto space-y-4 my-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
                <Bot size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-foreground">No AI Queries Simulated Yet</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Run the simulation to inspect your brand citations, rank positions, and competitor mentions across Google AI Overviews, Gemini, ChatGPT, and Perplexity.
                </p>
              </div>
              <button
                onClick={handleRunGEO}
                disabled={refreshing}
                className="btn-glow px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all hover-lift disabled:opacity-50"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Simulating AI Search Queries..." : "Run AI Query Simulation Now"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {queries.map((q: any, idx: number) => (
                <div
                  key={q._id || idx}
                  className="surface-card hover-lift p-5 sm:p-6 rounded-2xl border border-border space-y-4 bg-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
                        #{idx + 1}
                      </span>
                      <p className="text-sm font-bold text-foreground font-mono">
                        "{q.query}"
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-md border border-border self-start sm:self-auto">
                      Last tested: {new Date(q.lastTestedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 4-Engine Results Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {[
                      { name: "Google AI Overviews", data: q.engines?.google_ai, icon: "🔍" },
                      { name: "Gemini AI Search", data: q.engines?.gemini, icon: "✨" },
                      { name: "ChatGPT Citations", data: q.engines?.chatgpt, icon: "💬" },
                      { name: "Perplexity Citations", data: q.engines?.perplexity, icon: "🌐" },
                    ].map((eng) => (
                      <div
                        key={eng.name}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                          eng.data?.mentioned
                            ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                            : "bg-muted/30 border-border text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[11px] text-foreground flex items-center gap-1.5 truncate">
                            <span>{eng.icon}</span> {eng.name}
                          </span>
                          {eng.data?.mentioned ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shrink-0">
                              #{eng.data.position || 1} Mentioned
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0 border border-border/50">
                              Not Cited
                            </span>
                          )}
                        </div>
                        {eng.data?.snippet && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 italic leading-relaxed">
                            "{eng.data.snippet}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Missing topics & competitor citations */}
                  {(q.missingTopics?.length > 0 || q.competitorMentions?.length > 0) && (
                    <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-3 text-xs">
                      {q.competitorMentions?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-muted-foreground font-medium text-[11px]">Competitors cited:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {q.competitorMentions.map((comp: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold text-[11px] border border-border">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {q.missingTopics?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-amber-500 font-medium text-[11px]">· Missing topic signals:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {q.missingTopics.map((top: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-semibold">
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
        <div className="surface-card hover-lift p-6 sm:p-7 rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 flex flex-col sm:flex-row sm:items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-foreground">
              Why Generative Engine Optimization (GEO) Matters
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              AI answer engines don't just index keywords — they synthesize authoritative source entities. To increase citation rates across Google AI Overviews, Gemini, ChatGPT, and Perplexity, SerpoAI automatically generates structured Q&A comparison matrices, schema markup, and authoritative knowledge definitions that LLMs frequently extract and cite as ground-truth sources.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
