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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
            <Users size={14} />
            Competitive Strategy & Content Gaps
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-text-primary tracking-tight">
            Competitor <span className="italic text-accent">Intelligence</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
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
            className="px-3 py-2 rounded-md bg-surface-raised border border-border text-xs font-mono text-text-primary outline-none focus:border-accent w-44 sm:w-56"
          />
          <button
            type="submit"
            disabled={analyzing || !newCompetitorDomain.trim()}
            className="px-3 py-2 rounded-md btn-primary text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            {analyzing ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
            Analyze
          </button>
        </form>
      </div>

      {/* Competitor Selector Tabs */}
      {analyses.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
          {analyses.map((a) => (
            <button
              key={a._id}
              onClick={() => setSelectedAnalysis(a)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono shrink-0 transition-all border ${
                selectedAnalysis?._id === a._id
                  ? "bg-accent/15 text-accent border-accent font-semibold"
                  : "bg-surface text-text-muted border-border hover:text-text-primary hover:border-border-strong"
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
              <div key={i} className="bg-surface border border-border rounded-lg p-6 h-28 animate-pulse" />
            ))}
          </div>
          <div className="bg-surface border border-border rounded-lg p-8 h-72 animate-pulse" />
        </div>
      ) : !selectedAnalysis ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
          <Users size={40} className="mx-auto text-accent mb-2 opacity-50" />
          <h3 className="text-base font-serif text-text-primary">No Competitor Analysis Yet</h3>
          <p className="text-xs text-text-muted">
            Enter a competitor domain above to extract content gaps and keyword opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <span className="text-[10px] font-mono uppercase text-text-muted">Estimated Authority</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-accent mt-1">{selectedAnalysis.domainAuthorityEst}/100</p>
              <p className="text-[11px] text-text-muted mt-0.5">Domain strength signal</p>
            </div>

            <div className="bg-surface rounded-lg p-4 border border-border">
              <span className="text-[10px] font-mono uppercase text-text-muted">Content Velocity</span>
              <p className="text-lg font-mono font-bold text-text-primary mt-1">{selectedAnalysis.contentVelocityEst}</p>
              <p className="text-[11px] text-text-muted mt-0.5">Publishing cadence</p>
            </div>

            <div className="bg-surface rounded-lg p-4 border border-border">
              <span className="text-[10px] font-mono uppercase text-text-muted">Identified Content Gaps</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-text-primary mt-1">{selectedAnalysis.contentGaps?.length || 0}</p>
              <p className="text-[11px] text-text-muted mt-0.5">Uncovered high-value topics</p>
            </div>
          </div>

          {/* Content Gaps Table */}
          <div className="bg-surface rounded-lg p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">Uncovered Content & Topic Gaps</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Topics {selectedAnalysis.competitorName} currently ranks for that your website lacks dedicated assets for.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(selectedAnalysis.contentGaps || []).map((gap: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-md bg-surface-raised border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-sm">{gap.topic}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                        {gap.searchIntent}
                      </span>
                    </div>
                    <p className="text-text-muted text-[11px]">
                      Business Impact: <strong className="text-text-primary">{gap.businessImpact}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-[11px] font-mono tabular-nums">
                    <div className="text-right">
                      <span className="text-text-muted block text-[10px] uppercase">Est. Search Volume</span>
                      <span className="font-semibold text-text-primary">{gap.estimatedVolume || "1.2k/mo"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-text-muted block text-[10px] uppercase">Difficulty</span>
                      <span className="font-semibold text-accent">{gap.difficulty || "Medium"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths vs Vulnerabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-lg p-5 border border-border">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                Competitor Core Strengths
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {(selectedAnalysis.keyStrengths || []).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface rounded-lg p-5 border border-border">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                Competitor Vulnerabilities (Your Angle)
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {(selectedAnalysis.vulnerabilities || []).map((v: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
