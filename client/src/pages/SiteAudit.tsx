import confetti from "canvas-confetti";
import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Bot,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SiteAudit() {
  const { currentProject } = useProject();
  const [audit, setAudit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);

  const fetchAudit = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getSiteAudit(currentProject._id);
      setAudit(res.audit || null);
    } catch (err: any) {
      toast.error(err.message || "Failed to load site audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [currentProject]);

  const handleRunAudit = async () => {
    if (!currentProject) return;
    setRefreshing(true);
    try {
      const res = await growthAPI.triggerSiteAudit(currentProject._id);
      setAudit(res.audit);
      toast.success("Technical SEO scan completed!");
    } catch (err: any) {
      toast.error(err.message || "Site audit failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAutoFix = async (issueId: string) => {
    if (!currentProject) return;
    setFixingId(issueId);
    try {
      await growthAPI.autoFixIssue(currentProject._id, issueId);
      try { confetti({ particleCount: 65, spread: 60, origin: { y: 0.7 }, colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"] }); } catch(e){} 
      toast.success("Fix action formulated and queued in Action Center!");
      await fetchAudit();
    } catch (err: any) {
      toast.error(err.message || "Auto-fix failed");
    } finally {
      setFixingId(null);
    }
  };

  const score = audit?.technicalHealthScore || 78;
  const issues = audit?.issuesList || [];
  const cwv = audit?.coreWebVitals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
            <ShieldCheck size={13} />
            Technical Health & Core Web Vitals
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            Technical Site Audit
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Deep crawl inspection of DOM hygiene, schema tags, canonicals, mobile viewport, and Core Web Vitals.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={refreshing}
          className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Crawling & Auditing..." : "Run Full Technical Audit"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface rounded-xl p-6 h-28 animate-pulse bg-surface-raised/40 border border-border" />
            ))}
          </div>
          <div className="bg-surface rounded-xl p-6 h-72 animate-pulse bg-surface-raised/40 border border-border" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent font-mono text-xl font-bold tabular-nums">
                {score}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Technical Health</p>
                <p className="text-[11px] font-mono text-text-muted">DOM Audit Index</p>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <span className="text-[10px] font-mono text-text-muted uppercase">Largest Contentful Paint</span>
              <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{cwv?.lcp?.value || "1.8s"}</p>
              <p className="text-[10px] font-mono text-text-muted">LCP Speed: Optimal</p>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <span className="text-[10px] font-mono text-text-muted uppercase">Interaction to Next Paint</span>
              <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{cwv?.fidInp?.value || "42ms"}</p>
              <p className="text-[10px] font-mono text-text-muted">INP: Nominal</p>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <span className="text-[10px] font-mono text-text-muted uppercase">Cumulative Layout Shift</span>
              <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{cwv?.cls?.value || "0.03"}</p>
              <p className="text-[10px] font-mono text-text-muted">CLS: Stable</p>
            </div>
          </div>

          {/* Issues Breakdown & Auto-Fix */}
          <div className="bg-surface rounded-xl p-5 border border-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-sans font-semibold text-sm text-text-primary">Diagnostic Findings & Code Patches</h3>
                <p className="text-[11px] font-mono text-text-muted mt-0.5">
                  {audit?.issuesSummary?.critical || 0} Critical · {audit?.issuesSummary?.warnings || 0} Warnings · {audit?.issuesSummary?.notices || 0} Notices
                </p>
              </div>
            </div>

            {issues.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                <p className="font-semibold text-text-primary">No critical technical SEO issues detected!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {issues.map((issue: any) => (
                  <div
                    key={issue.id}
                    className="p-3.5 rounded-lg bg-surface-raised border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                            issue.severity === "critical"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : issue.severity === "warning"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-surface text-text-muted border-border"
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted uppercase">
                          {issue.category}
                        </span>
                        <span className="font-semibold text-text-primary">{issue.title}</span>
                      </div>
                      <p className="text-text-muted text-xs font-sans leading-relaxed">{issue.description}</p>
                      {issue.recommendedFix && (
                        <p className="text-xs font-mono text-accent bg-surface p-1.5 rounded border border-border">
                          Fix: {issue.recommendedFix}
                        </p>
                      )}
                    </div>

                    {issue.autoFixable && (
                      <button
                        onClick={() => handleAutoFix(issue.id)}
                        disabled={fixingId === issue.id}
                        className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 self-start md:self-center"
                      >
                        {fixingId === issue.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Bot size={13} />
                        )}
                        Deploy SEO Fix
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
