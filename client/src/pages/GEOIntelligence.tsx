import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Sparkles,
  Bot,
  RefreshCw,
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
    fetchGEO();
  }, [currentProject]);

  const handleRunGEO = async () => {
    if (!currentProject) return;
    setRefreshing(true);
    try {
      await growthAPI.triggerGEOAnalysis(currentProject._id);
      await fetchGEO();
      toast.success("AI Search Visibility analysis completed!");
    } catch (err: any) {
      toast.error(err.message || "GEO scan failed");
    } finally {
      setRefreshing(false);
    }
  };

  const queries = geoData?.queries || [];
  const geoScore = geoData?.geoScore || currentProject?.scores?.geo || 46;
  const mentionRate = geoData?.mentionRate || 40;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent mb-1">
              <Sparkles size={14} />
              Generative Engine Optimization (GEO)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              AI-Search Visibility Engine
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evaluate how your brand is cited and positioned across modern AI answer engines (ChatGPT, Perplexity, Gemini, Google AI).
            </p>
          </div>

          <button
            onClick={handleRunGEO}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-glow text-xs font-bold transition-all self-start disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Scanning AI Engines..." : "Run AI Query Simulation"}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-primary/20">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-black">
              {geoScore}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">GEO Visibility Score</p>
              <p className="text-[11px] text-muted-foreground">Composite AI citation authority index</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-accent/20">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-black">
              {mentionRate}%
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Brand Mention Rate</p>
              <p className="text-[11px] text-muted-foreground">Frequency brand appears in commercial AI queries</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-border">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground text-2xl font-black">
              {queries.length}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Tested AI Search Queries</p>
              <p className="text-[11px] text-muted-foreground">Tracked commercial search prompts</p>
            </div>
          </div>
        </div>

        {/* AI Queries Breakdown */}
        <div className="glass rounded-2xl p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">AI Search System Query Coverage</h3>
            <span className="text-xs text-muted-foreground">ChatGPT · Perplexity · Gemini · Google AI</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              <Bot size={36} className="mx-auto mb-2 opacity-50" />
              <p>No queries tested yet. Click "Run AI Query Simulation" above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((q: any) => (
                <div
                  key={q._id}
                  className="p-4 rounded-xl bg-card/60 border border-border/70 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground font-mono">
                      "{q.query}"
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      Last tested: {new Date(q.lastTestedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Engine Results Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { name: "ChatGPT Search", data: q.engines?.chatgpt },
                      { name: "Perplexity", data: q.engines?.perplexity },
                      { name: "Gemini", data: q.engines?.gemini },
                      { name: "Google AI Overviews", data: q.engines?.google_ai },
                    ].map((eng) => (
                      <div
                        key={eng.name}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          eng.data?.mentioned
                            ? "bg-success/10 border-success/30 text-success"
                            : "bg-muted/40 border-border text-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{eng.name}</span>
                        <div className="flex items-center gap-1">
                          {eng.data?.mentioned ? (
                            <span className="text-[10px] font-bold">
                              #{eng.data.position || 1} Mentioned
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Not Mentioned</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Missing topics & competitor citations */}
                  {(q.missingTopics?.length > 0 || q.competitorMentions?.length > 0) && (
                    <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-2 text-[11px]">
                      {q.competitorMentions?.length > 0 && (
                        <span className="text-muted-foreground">
                          Competitors cited: <strong className="text-foreground">{q.competitorMentions.join(", ")}</strong>
                        </span>
                      )}
                      {q.missingTopics?.length > 0 && (
                        <span className="text-amber-500 font-medium">
                          · Missing topic signals: {q.missingTopics.join(", ")}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insight Callout */}
        <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Sparkles size={20} className="text-accent shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-foreground">Why Generative Engine Optimization Matters</h4>
            <p className="text-muted-foreground leading-relaxed">
              AI answer engines don't just index keywords — they synthesize authoritative source entities. To increase citation rates, SerpoAI automatically generates comparison matrices, expert documentation, and data-dense definitions that LLMs frequently cite as primary sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
