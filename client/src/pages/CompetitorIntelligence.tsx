import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Users,
  Sparkles,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CompetitorIntelligence() {
  const { currentProject } = useProject();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCompetitorDomain, setNewCompetitorDomain] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);

  const fetchCompetitors = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getCompetitors(currentProject._id);
      setAnalyses(res.analyses || []);
      if (res.analyses?.length) {
        setSelectedAnalysis(res.analyses[0]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load competitor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [currentProject]);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !newCompetitorDomain.trim()) return;

    setAnalyzing(true);
    try {
      const res = await growthAPI.runCompetitorAnalysis(currentProject._id, newCompetitorDomain.trim());
      toast.success(`Competitor analysis completed for ${newCompetitorDomain}!`);
      setNewCompetitorDomain("");
      await fetchCompetitors();
      if (res.analysis) setSelectedAnalysis(res.analysis);
    } catch (err: any) {
      toast.error(err.message || "Competitor analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent mb-1">
              <Users size={14} />
              Competitive Strategy & Content Gaps
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Competitor Intelligence
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Formula: (Competitor Coverage + Customer Demand) − Your Coverage = High-ROI Growth Opportunities.
            </p>
          </div>

          {/* Add Competitor Form */}
          <form onSubmit={handleAddCompetitor} className="flex items-center gap-2 self-start">
            <input
              type="text"
              value={newCompetitorDomain}
              onChange={(e) => setNewCompetitorDomain(e.target.value)}
              placeholder="competitor.com"
              className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground outline-none w-44 sm:w-56"
            />
            <button
              type="submit"
              disabled={analyzing || !newCompetitorDomain.trim()}
              className="px-4 py-2 rounded-xl btn-glow text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {analyzing ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
              Analyze
            </button>
          </form>
        </div>

        {/* Competitor Selector Tabs */}
        {analyses.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {analyses.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelectedAnalysis(a)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  selectedAnalysis?._id === a._id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "glass text-foreground hover:border-border/80"
                }`}
              >
                {a.competitorName || a.competitorDomain}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="surface-card hover-lift rounded-2xl p-6 h-28 animate-pulse bg-muted/40" />
              ))}
            </div>
            <div className="glass rounded-2xl p-8 h-72 animate-pulse bg-muted/40" />
          </div>
        ) : !selectedAnalysis ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3">
            <Users size={40} className="mx-auto text-accent mb-2 opacity-50" />
            <h3 className="text-base font-bold text-foreground">No Competitor Analysis Yet</h3>
            <p className="text-xs text-muted-foreground">
              Enter a competitor domain above to extract content gaps and keyword opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 border border-primary/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Authority</span>
                <p className="text-2xl font-black text-primary mt-1">{selectedAnalysis.domainAuthorityEst}/100</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Domain strength signal</p>
              </div>

              <div className="glass rounded-2xl p-5 border border-accent/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Content Velocity</span>
                <p className="text-lg font-black text-accent mt-1">{selectedAnalysis.contentVelocityEst}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Publishing cadence</p>
              </div>

              <div className="glass rounded-2xl p-5 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Identified Content Gaps</span>
                <p className="text-2xl font-black text-foreground mt-1">{selectedAnalysis.contentGaps?.length || 0}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Uncovered high-value topics</p>
              </div>
            </div>

            {/* Content Gaps Table */}
            <div className="surface-card hover-lift rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Uncovered Content & Topic Gaps</h3>
                  <p className="text-xs text-muted-foreground">
                    Topics {selectedAnalysis.competitorName} currently ranks for that your website lacks dedicated assets for.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(selectedAnalysis.contentGaps || []).map((gap: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-card/70 border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{gap.topic}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {gap.searchIntent}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Business Impact: <strong className="text-foreground">{gap.businessImpact}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-[11px]">
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[10px]">Est. Search Volume</span>
                        <span className="font-bold text-foreground">{gap.estimatedVolume || "1.2k/mo"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[10px]">Difficulty</span>
                        <span className="font-bold text-primary">{gap.difficulty || "Medium"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths vs Vulnerabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="surface-card hover-lift rounded-2xl p-6 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Competitor Core Strengths
                </h3>
                <ul className="space-y-2 text-xs text-foreground">
                  {(selectedAnalysis.keyStrengths || []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-card hover-lift rounded-2xl p-6 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Competitor Vulnerabilities (Your Angle)
                </h3>
                <ul className="space-y-2 text-xs text-foreground">
                  {(selectedAnalysis.vulnerabilities || []).map((v: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
