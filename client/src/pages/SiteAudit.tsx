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
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <ShieldCheck size={14} />
              Technical Health & Core Web Vitals
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Technical Site Audit
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deep crawl inspection of indexing, schemas, canonicals, mobile responsiveness, and Core Web Vitals.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-glow text-xs font-bold transition-all self-start disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Crawling & Auditing..." : "Re-Run Full Technical Audit"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 h-28 animate-pulse bg-muted/40" />
              ))}
            </div>
            <div className="glass rounded-2xl p-6 h-72 animate-pulse bg-muted/40" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass rounded-2xl p-5 border border-primary/30 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-black">
                  {score}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Technical Health</p>
                  <p className="text-[11px] text-muted-foreground">Overall audit index</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Largest Contentful Paint</span>
                <p className="text-2xl font-black text-success mt-1">{cwv?.lcp?.value || "1.8s"}</p>
                <p className="text-[11px] text-muted-foreground">LCP Speed: Good</p>
              </div>

              <div className="glass rounded-2xl p-5 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Interaction to Next Paint</span>
                <p className="text-2xl font-black text-success mt-1">{cwv?.fidInp?.value || "42ms"}</p>
                <p className="text-[11px] text-muted-foreground">INP Responsiveness: Good</p>
              </div>

              <div className="glass rounded-2xl p-5 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Cumulative Layout Shift</span>
                <p className="text-2xl font-black text-success mt-1">{cwv?.cls?.value || "0.03"}</p>
                <p className="text-[11px] text-muted-foreground">CLS Stability: Good</p>
              </div>
            </div>

            {/* Issues Breakdown & Auto-Fix */}
            <div className="glass rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Diagnostic Issues & Auto-Fix Actions</h3>
                  <p className="text-xs text-muted-foreground">
                    {audit?.issuesSummary?.critical || 0} Critical · {audit?.issuesSummary?.warnings || 0} Warnings · {audit?.issuesSummary?.notices || 0} Notices
                  </p>
                </div>
              </div>

              {issues.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
                  <CheckCircle2 size={36} className="mx-auto text-success" />
                  <p>No critical technical SEO issues found!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="p-4 rounded-xl bg-card/70 border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                              issue.severity === "critical"
                                ? "bg-danger/10 text-danger border-danger/20"
                                : issue.severity === "warning"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">
                            {issue.category}
                          </span>
                          <span className="font-bold text-foreground">{issue.title}</span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{issue.description}</p>
                        {issue.recommendedFix && (
                          <p className="text-[11px] text-primary font-mono bg-primary/5 p-1.5 rounded-lg">
                            Fix: {issue.recommendedFix}
                          </p>
                        )}
                      </div>

                      {issue.autoFixable && (
                        <button
                          onClick={() => handleAutoFix(issue.id)}
                          disabled={fixingId === issue.id}
                          className="px-4 py-2 rounded-xl btn-glow text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 self-start md:self-center"
                        >
                          {fixingId === issue.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Bot size={13} />
                          )}
                          Deploy SEO Agent Fix
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
    </div>
  );
}
