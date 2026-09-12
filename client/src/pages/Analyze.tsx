/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Gauge, ClipboardCheck, Wrench, TrendingUp, FileText, KeyRound,
  Users, Sparkles, Loader2, AlertCircle, CheckCircle2, RefreshCw,
  ArrowRight, Zap, LayoutGrid, ListTree,
} from "lucide-react";
import { analysisAPI } from "../services/api";
import toast from "react-hot-toast";

type AnalysisType =
  | "ai_growth_score" | "site_audit" | "technical_seo" | "seo_opportunities"
  | "content_analysis" | "keyword_ideas" | "competitor_strategy" | "geo_visibility";

interface AnalysisResult {
  type: AnalysisType;
  status: "completed" | "failed";
  provider?: string | null;
  model?: string | null;
  data?: any;
  error?: string;
}

interface AnalysisReport {
  url: string;
  pagesScanned: number;
  scraped: boolean;
  evidence: Record<string, any>;
  results: AnalysisResult[];
}

const ANALYSIS_OPTIONS: { type: AnalysisType; label: string; icon: any; desc: string }[] = [
  { type: "ai_growth_score", label: "AI Growth Score", icon: Gauge, desc: "Weighted 0–100 score across 5 categories" },
  { type: "site_audit", label: "Site Audit", icon: ClipboardCheck, desc: "Overall health, issues & passed checks" },
  { type: "technical_seo", label: "Technical SEO", icon: Wrench, desc: "Crawlability, indexing, HTTPS, schema" },
  { type: "seo_opportunities", label: "SEO Opportunities", icon: TrendingUp, desc: "Ranked, actionable improvements" },
  { type: "content_analysis", label: "Content Analysis", icon: FileText, desc: "Readability, gaps & E-E-A-T signals" },
  { type: "keyword_ideas", label: "Keyword Ideas", icon: KeyRound, desc: "Keyword & topic-cluster suggestions" },
  { type: "competitor_strategy", label: "Competitor Strategy", icon: Users, desc: "Likely competitors & differentiation" },
  { type: "geo_visibility", label: "GEO / AI Visibility", icon: Sparkles, desc: "Answer-engine & local readiness" },
];

const LABELS: Record<AnalysisType, string> = ANALYSIS_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.type]: o.label }), {} as Record<AnalysisType, string>
);
const ALL_TYPES = ANALYSIS_OPTIONS.map((o) => o.type);
const EXAMPLES = ["stripe.com", "vercel.com", "github.com"];

const scoreColor = (n: number) => (n >= 70 ? "text-success" : n >= 50 ? "text-warning" : "text-danger");
const scoreBg = (n: number) => (n >= 70 ? "score-bg-good" : n >= 50 ? "score-bg-medium" : "score-bg-poor");

export default function Analyze() {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<Set<AnalysisType>>(new Set(ALL_TYPES));
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [lastUrl, setLastUrl] = useState("");
  const [searchParams] = useSearchParams();

  const allSelected = selected.size === ALL_TYPES.length;

  const toggleType = (t: AnalysisType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(ALL_TYPES));

  const runAnalysis = async (submitUrl?: string) => {
    const target = (submitUrl || url).trim();
    if (!target) return;
    if (selected.size === 0) {
      toast.error("Select at least one analysis.");
      return;
    }
    const fullUrl = target.startsWith("http") ? target : `https://${target}`;

    setError("");
    setPhase("running");
    setReport(null);
    setLastUrl(fullUrl);

    try {
      const data = await analysisAPI.analyzeUrl(fullUrl, [...selected]);
      setReport(data as AnalysisReport);
      setActiveTab("overview");
      setPhase("done");
    } catch (err: any) {
      const msg = err?.message || "Analysis failed. Please try again.";
      setError(msg);
      setPhase("idle");
      toast.error(msg);
    }
  };

  const retryOne = async (type: AnalysisType) => {
    if (!lastUrl) return;
    setRetrying((prev) => new Set(prev).add(type));
    try {
      const data = await analysisAPI.analyzeUrl(lastUrl, [type]);
      const fresh = (data.results || []).find((r: AnalysisResult) => r.type === type);
      if (fresh) {
        setReport((prev) =>
          prev ? { ...prev, results: prev.results.map((r) => (r.type === type ? fresh : r)) } : prev
        );
        if (fresh.status === "completed") toast.success(`${LABELS[type]} refreshed.`);
        else toast.error(fresh.error || "Retry failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Retry failed.");
    } finally {
      setRetrying((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    }
  };

  useEffect(() => {
    const prefill = searchParams.get("url");
    if (prefill) {
      setUrl(prefill);
      setTimeout(() => runAnalysis(prefill), 400);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis();
  };

  const resultByType = (t: AnalysisType) => report?.results.find((r) => r.type === t);
  const growth = resultByType("ai_growth_score");
  const providerUsed = report?.results.find((r) => r.status === "completed" && r.provider)?.provider;

  // Build tab list: Overview + one per completed/attempted analysis + Raw evidence
  const dynamicTabs = report
    ? [
        { id: "overview", label: "Overview", icon: LayoutGrid },
        ...report.results.map((r) => {
          const opt = ANALYSIS_OPTIONS.find((o) => o.type === r.type)!;
          return { id: r.type, label: opt.label, icon: opt.icon };
        }),
        { id: "evidence", label: "Raw Evidence", icon: ListTree },
      ]
    : [];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-background bg-grid overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-8 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Zap size={12} />
            AI-Powered Website Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-foreground mb-3">
            Analyze <span className="gradient-text">Any Website</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pick the analyses you need and get a structured, evidence-based report — including a weighted AI Growth Score.
          </p>
        </div>

        {/* ── URL Form ── */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="border border-primary/25 rounded-2xl p-1.5 px-2 flex items-center gap-2 bg-card shadow-lg shadow-black/10 focus-within:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 px-3 min-w-0">
              <Search size={20} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-3 min-w-0"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim() || phase === "running" || selected.size === 0}
              className="btn-glow px-5 sm:px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shrink-0"
            >
              {phase === "running" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              <span className="hidden sm:inline">Analyze</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Try:{" "}
          {EXAMPLES.map((ex, i) => (
            <span key={ex}>
              <button onClick={() => setUrl(ex)} className="text-primary hover:underline">{ex}</button>
              {i < EXAMPLES.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>

        {/* ── Analysis Selection ── */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Choose analyses</h2>
            <button
              onClick={toggleAll}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                allSelected
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {allSelected ? "Full analysis ✓" : "Select all"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ANALYSIS_OPTIONS.map((opt) => {
              const active = selected.has(opt.type);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.type}
                  onClick={() => toggleType(opt.type)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    active
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{opt.label}</p>
                      {active && <CheckCircle2 size={13} className="text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mt-6 px-4 py-3 rounded-xl severity-critical text-sm flex items-start gap-2 max-w-2xl mx-auto">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Running State ── */}
        {phase === "running" && (
          <div className="mt-8 max-w-2xl mx-auto space-y-2">
            {[...selected].map((t) => {
              const opt = ANALYSIS_OPTIONS.find((o) => o.type === t)!;
              const Icon = opt.icon;
              return (
                <div key={t} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-primary/20">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm text-foreground flex-1">{opt.label}</span>
                  <Loader2 size={16} className="text-primary animate-spin" />
                </div>
              );
            })}
            <p className="text-center text-xs text-muted-foreground pt-2">
              Crawling the site and running {selected.size} {selected.size === 1 ? "analysis" : "analyses"}…
            </p>
          </div>
        )}

        {/* ── Results ── */}
        {phase === "done" && report && (
          <div className="mt-10">
            {/* summary bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center text-xs text-muted-foreground mb-5">
              <span className="font-mono text-foreground truncate max-w-[280px]">{report.url}</span>
              <span>·</span>
              <span>{report.pagesScanned} page(s) scanned</span>
              {providerUsed && (<><span>·</span><span>Analyzed by <span className="text-primary font-semibold">{providerUsed}</span></span></>)}
              {!report.scraped && (<><span>·</span><span className="text-warning">Limited content (JS-only or blocked)</span></>)}
            </div>

            {/* tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 border-b border-border">
              {dynamicTabs.map((tab) => {
                const r = report.results.find((x) => x.type === tab.id);
                const failed = r?.status === "failed";
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                    {failed && <AlertCircle size={12} className="text-danger" />}
                  </button>
                );
              })}
            </div>

            {/* tab content */}
            <div className="max-w-3xl mx-auto">
              {activeTab === "overview" && <OverviewTab report={report} growth={growth} onJump={setActiveTab} />}
              {activeTab === "evidence" && <EvidenceTab evidence={report.evidence} />}
              {report.results.map((r) =>
                activeTab === r.type ? (
                  <ResultPanel key={r.type} result={r} retrying={retrying.has(r.type)} onRetry={() => retryOne(r.type)} />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="glass p-5 mb-4">
      {title && <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>}
      {children}
    </div>
  );
}

function BulletList({ items, tone = "default" }: { items?: string[]; tone?: "default" | "good" | "warn" | "bad" }) {
  if (!items?.length) return <p className="text-xs text-muted-foreground italic">None reported.</p>;
  const dot = tone === "good" ? "bg-success" : tone === "warn" ? "bg-warning" : tone === "bad" ? "bg-danger" : "bg-primary";
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
          <span className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: string }) {
  const cls =
    tone === "High" ? "severity-critical" :
    tone === "Medium" ? "severity-warning" :
    tone === "Low" ? "severity-info" :
    tone === "pass" ? "severity-success" :
    tone === "fail" ? "severity-critical" :
    tone === "warn" ? "severity-warning" : "severity-info";
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{children}</span>;
}

function ScoreDonut({ score, label }: { score: number; label?: string }) {
  const color = score >= 70 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)` }}
      >
        <div className="w-[86px] h-[86px] rounded-full bg-card flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-semibold text-foreground">{label}</span>}
    </div>
  );
}

function CategoryBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${scoreColor(value)}`}>{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: value >= 70 ? "var(--success)" : value >= 50 ? "var(--warning)" : "var(--danger)" }} />
      </div>
    </div>
  );
}

function OverviewTab({ report, growth, onJump }: { report: AnalysisReport; growth?: AnalysisResult; onJump: (t: string) => void }) {
  const g = growth?.status === "completed" ? growth.data : null;
  const completed = report.results.filter((r) => r.status === "completed").length;
  const failed = report.results.filter((r) => r.status === "failed").length;

  return (
    <div>
      {g && (
        <Card>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreDonut score={g.overallScore ?? 0} label={g.scoreLabel} />
            <div className="flex-1 w-full space-y-2.5">
              <p className="text-xs text-muted-foreground mb-1">Weighted across five categories</p>
              <CategoryBar label="Technical SEO (25%)" value={g.categoryScores?.technicalSeo ?? 0} />
              <CategoryBar label="On-Page SEO (25%)" value={g.categoryScores?.onPageSeo ?? 0} />
              <CategoryBar label="Content Quality (20%)" value={g.categoryScores?.contentQuality ?? 0} />
              <CategoryBar label="Discoverability (15%)" value={g.categoryScores?.discoverability ?? 0} />
              <CategoryBar label="Conversion Readiness (15%)" value={g.categoryScores?.conversionReadiness ?? 0} />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Analyses" value={report.results.length} />
        <Stat label="Completed" value={completed} tone="good" />
        <Stat label="Failed" value={failed} tone={failed ? "bad" : "default"} />
        <Stat label="Pages" value={report.pagesScanned} />
      </div>

      <Card title="Jump to a report">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {report.results.map((r) => {
            const opt = ANALYSIS_OPTIONS.find((o) => o.type === r.type)!;
            return (
              <button
                key={r.type}
                onClick={() => onJump(r.type)}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors text-left"
              >
                <span className="text-sm text-foreground">{opt.label}</span>
                {r.status === "completed"
                  ? <CheckCircle2 size={15} className="text-success shrink-0" />
                  : <AlertCircle size={15} className="text-danger shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: string }) {
  const color = tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground";
  return (
    <div className="glass p-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function ResultPanel({ result, retrying, onRetry }: { result: AnalysisResult; retrying: boolean; onRetry: () => void }) {
  if (result.status === "failed") {
    return (
      <Card>
        <div className="text-center py-6">
          <AlertCircle size={28} className="text-danger mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground mb-1">This analysis couldn’t be completed</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">{result.error || "Unknown error."}</p>
          <button
            onClick={onRetry}
            disabled={retrying}
            className="btn-glow px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            {retrying ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry this analysis
          </button>
        </div>
      </Card>
    );
  }

  const d = result.data || {};
  return (
    <div>
      {(result.provider || result.model) && (
        <p className="text-[11px] text-muted-foreground mb-3">
          Generated by <span className="text-primary font-semibold">{result.provider}</span>
          {result.model ? ` · ${result.model}` : ""}
        </p>
      )}
      {renderAnalysis(result.type, d)}
    </div>
  );
}

function renderAnalysis(type: AnalysisType, d: any) {
  switch (type) {
    case "ai_growth_score":
      return (
        <>
          {d.strengths?.length ? <Card title="Strengths"><BulletList items={d.strengths} tone="good" /></Card> : null}
          {d.weaknesses?.length ? <Card title="Weaknesses"><BulletList items={d.weaknesses} tone="bad" /></Card> : null}
          {d.quickWins?.length ? <Card title="Quick Wins"><BulletList items={d.quickWins} tone="warn" /></Card> : null}
          {d.prioritizedActions?.length ? (
            <Card title="Prioritized Actions">
              <div className="space-y-3">
                {d.prioritizedActions.map((a: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-primary">#{a.priority}</span>
                      <span className="text-sm font-semibold text-foreground">{a.issue}</span>
                      <Pill tone={a.impact}>Impact: {a.impact}</Pill>
                      <Pill tone={a.effort}>Effort: {a.effort}</Pill>
                    </div>
                    <p className="text-sm text-foreground/85">{a.recommendation}</p>
                    {a.reason && <p className="text-xs text-muted-foreground mt-1">{a.reason}</p>}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          {d.limitations?.length ? <Card title="Limitations"><BulletList items={d.limitations} /></Card> : null}
          {d.evidence?.length ? <Card title="Evidence"><BulletList items={d.evidence} /></Card> : null}
        </>
      );

    case "site_audit":
      return (
        <>
          <Card>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-3 rounded-xl ${scoreBg(d.healthScore ?? 0)}`}>
                <div className={`text-2xl font-bold ${scoreColor(d.healthScore ?? 0)}`}>{d.healthScore ?? "—"}</div>
                <div className="text-[10px] text-muted-foreground">Health</div>
              </div>
              <p className="text-sm text-foreground/90 flex-1">{d.summary}</p>
            </div>
          </Card>
          {d.criticalIssues?.length ? <Card title="Critical Issues"><BulletList items={d.criticalIssues} tone="bad" /></Card> : null}
          {d.warnings?.length ? <Card title="Warnings"><BulletList items={d.warnings} tone="warn" /></Card> : null}
          {d.passedChecks?.length ? <Card title="Passed Checks"><BulletList items={d.passedChecks} tone="good" /></Card> : null}
          {d.recommendations?.length ? <Card title="Recommendations"><BulletList items={d.recommendations} /></Card> : null}
        </>
      );

    case "technical_seo":
      return (
        <>
          {d.summary && <Card><p className="text-sm text-foreground/90">{d.summary}</p></Card>}
          {d.findings?.length ? (
            <Card title="Findings">
              <div className="space-y-2.5">
                {d.findings.map((f: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Pill tone={f.status}>{(f.status || "warn").toUpperCase()}</Pill>
                      <span className="text-sm font-semibold text-foreground">{f.area}</span>
                    </div>
                    {f.detail && <p className="text-sm text-foreground/80">{f.detail}</p>}
                    {f.fix && <p className="text-xs text-primary mt-1">Fix: {f.fix}</p>}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          {d.indexabilityNotes?.length ? <Card title="Indexability"><BulletList items={d.indexabilityNotes} /></Card> : null}
          {d.recommendations?.length ? <Card title="Recommendations"><BulletList items={d.recommendations} /></Card> : null}
        </>
      );

    case "seo_opportunities":
      return (
        <>
          {d.summary && <Card><p className="text-sm text-foreground/90">{d.summary}</p></Card>}
          {d.opportunities?.length ? (
            <Card title="Opportunities">
              <div className="space-y-2.5">
                {d.opportunities.map((o: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{o.title}</span>
                      <Pill>{o.category}</Pill>
                      <Pill tone={o.impact}>Impact: {o.impact}</Pill>
                      <Pill tone={o.effort}>Effort: {o.effort}</Pill>
                    </div>
                    {o.description && <p className="text-sm text-foreground/80">{o.description}</p>}
                    {o.recommendedAction && <p className="text-xs text-primary mt-1">→ {o.recommendedAction}</p>}
                  </div>
                ))}
              </div>
            </Card>
          ) : <Card><p className="text-sm text-muted-foreground">No opportunities returned.</p></Card>}
        </>
      );

    case "content_analysis":
      return (
        <>
          {d.summary && <Card><p className="text-sm text-foreground/90">{d.summary}</p></Card>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {d.readability && <Card title="Readability"><p className="text-sm text-foreground/85">{d.readability}</p></Card>}
            {d.tone && <Card title="Tone"><p className="text-sm text-foreground/85">{d.tone}</p></Card>}
          </div>
          {d.contentGaps?.length ? <Card title="Content Gaps"><BulletList items={d.contentGaps} tone="warn" /></Card> : null}
          {d.topicSuggestions?.length ? <Card title="Topic Suggestions"><BulletList items={d.topicSuggestions} /></Card> : null}
          {d.eeatSignals?.length ? <Card title="E-E-A-T Signals"><BulletList items={d.eeatSignals} /></Card> : null}
          {d.recommendations?.length ? <Card title="Recommendations"><BulletList items={d.recommendations} /></Card> : null}
        </>
      );

    case "keyword_ideas":
      return (
        <>
          {d.seedThemes?.length ? (
            <Card title="Seed Themes">
              <div className="flex flex-wrap gap-1.5">
                {d.seedThemes.map((t: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                ))}
              </div>
            </Card>
          ) : null}
          {d.keywords?.length ? (
            <Card title="Keyword Ideas">
              <div className="space-y-2">
                {d.keywords.map((k: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-sm font-medium text-foreground flex-1 min-w-[120px]">{k.keyword}</span>
                    <Pill>{k.intent}</Pill>
                    <Pill tone={k.priority}>{k.priority}</Pill>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          {d.questions?.length ? <Card title="Question Queries"><BulletList items={d.questions} /></Card> : null}
          {d.clusters?.length ? (
            <Card title="Topic Clusters">
              <div className="space-y-2">
                {d.clusters.map((c: any, i: number) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-foreground">{c.cluster}</p>
                    <p className="text-xs text-muted-foreground">{(c.keywords || []).join(", ")}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </>
      );

    case "competitor_strategy":
      return (
        <>
          {d.summary && <Card><p className="text-sm text-foreground/90">{d.summary}</p></Card>}
          {d.likelyCompetitors?.length ? (
            <Card title="Likely Competitors (inferred)">
              <div className="space-y-2">
                {d.likelyCompetitors.map((c: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      {c.domain && <span className="text-xs text-muted-foreground">{c.domain}</span>}
                    </div>
                    {c.why && <p className="text-xs text-foreground/75 mt-0.5">{c.why}</p>}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          {d.differentiationOpportunities?.length ? <Card title="Differentiation Opportunities"><BulletList items={d.differentiationOpportunities} tone="good" /></Card> : null}
          {d.contentAngles?.length ? <Card title="Content Angles"><BulletList items={d.contentAngles} /></Card> : null}
          {d.recommendations?.length ? <Card title="Recommendations"><BulletList items={d.recommendations} /></Card> : null}
        </>
      );

    case "geo_visibility":
      return (
        <>
          <Card>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-3 rounded-xl ${scoreBg(d.geoReadinessScore ?? 0)}`}>
                <div className={`text-2xl font-bold ${scoreColor(d.geoReadinessScore ?? 0)}`}>{d.geoReadinessScore ?? "—"}</div>
                <div className="text-[10px] text-muted-foreground">GEO ready</div>
              </div>
              <p className="text-sm text-foreground/90 flex-1">{d.summary}</p>
            </div>
          </Card>
          {d.entityClarity?.length ? <Card title="Entity Clarity"><BulletList items={d.entityClarity} /></Card> : null}
          {d.citationsNeeded?.length ? <Card title="Citations Needed"><BulletList items={d.citationsNeeded} tone="warn" /></Card> : null}
          {d.structuredDataGaps?.length ? <Card title="Structured-Data Gaps"><BulletList items={d.structuredDataGaps} tone="warn" /></Card> : null}
          {d.recommendations?.length ? <Card title="Recommendations"><BulletList items={d.recommendations} /></Card> : null}
        </>
      );

    default:
      return <Card><pre className="text-xs text-muted-foreground overflow-x-auto">{JSON.stringify(d, null, 2)}</pre></Card>;
  }
}

function EvidenceTab({ evidence }: { evidence: Record<string, any> }) {
  const entries = Object.entries(evidence || {});
  return (
    <Card title="Deterministic evidence (extracted directly from the page)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/60">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="text-xs font-mono text-foreground text-right break-all max-w-[60%]">
              {Array.isArray(v) ? (v.length ? v.join(", ") : "—") : String(v)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
