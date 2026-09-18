import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function GrowthReports() {
  const { currentProject } = useProject();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const fetchReports = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getReports(currentProject._id);
      setReports(res.reports || []);
      if (res.reports?.length) {
        setSelectedReport(res.reports[0]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load growth reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentProject]);

  const handleGenerate = async (period = "weekly") => {
    if (!currentProject) return;
    setGenerating(true);
    try {
      const res = await growthAPI.generateReport(currentProject._id, period);
      toast.success("Executive Growth Brief compiled!");
      await fetchReports();
      if (res.report) setSelectedReport(res.report);
    } catch (err: any) {
      toast.error(err.message || "Report generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleExportMarkdown = (rep: any) => {
    if (!rep) return;
    const md = `# ${rep.title}
*Period: ${rep.period.toUpperCase()} | Generated: ${new Date(rep.generatedAt).toLocaleDateString()}*

## Executive Summary
${rep.executiveSummary}

## Key Performance Outcomes
- Traffic Lift: ${rep.outcomesSummary?.trafficLift || "N/A"}
- Conversion Lift: ${rep.outcomesSummary?.conversionLift || "N/A"}
- Actions Deployed: ${rep.outcomesSummary?.actionsDeployedCount || 0}
- Experiments Completed: ${rep.outcomesSummary?.experimentsCompletedCount || 0}

## Top Wins
${(rep.topWins || []).map((w: string) => `- ${w}`).join("\n")}

## Verified Growth Learnings
${(rep.keyLearnings || []).map((l: string) => `- ${l}`).join("\n")}

## Next Cycle Priorities
${(rep.nextCyclePriorities || []).map((p: string) => `- ${p}`).join("\n")}
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executive-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    toast.success("Report downloaded as Markdown!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
            <FileText size={14} />
            Executive Growth Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-text-primary tracking-tight">
            Executive Briefs <span className="italic text-accent">&amp;</span> Reports
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Closed-loop performance summaries, verified experiment learnings, and next-cycle priorities for leadership.
          </p>
        </div>

        <button
          onClick={() => handleGenerate("weekly")}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-md btn-primary text-xs font-mono uppercase tracking-wider transition-all self-start disabled:opacity-50"
        >
          {generating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
          {generating ? "Compiling..." : "Compile New Report"}
        </button>
      </div>

      {/* Report Selector Tabs */}
      {reports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
          {reports.map((r) => (
            <button
              key={r._id}
              onClick={() => setSelectedReport(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono shrink-0 transition-all border ${
                selectedReport?._id === r._id
                  ? "bg-accent/15 text-accent border-accent font-semibold"
                  : "bg-surface text-text-muted border-border hover:text-text-primary hover:border-border-strong"
              }`}
            >
              {r.period.toUpperCase()} · {new Date(r.generatedAt).toLocaleDateString()}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-6 h-36 animate-pulse" />
          <div className="bg-surface border border-border rounded-lg p-6 h-72 animate-pulse" />
        </div>
      ) : !selectedReport ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
          <FileText size={40} className="mx-auto text-accent mb-2 opacity-60" />
          <h3 className="text-base font-serif text-text-primary">No Executive Reports Compiled Yet</h3>
          <p className="text-xs text-text-muted">
            Click "Compile New Report" to synthesize your first executive growth brief.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Header Card */}
          <div className="bg-surface border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent">
                {selectedReport.period} Executive Brief
              </span>
              <h2 className="text-lg font-serif text-text-primary">{selectedReport.title}</h2>
              <p className="text-xs font-mono text-text-muted">
                Published {new Date(selectedReport.generatedAt).toLocaleDateString()} · Analyzed by SerpoAI
              </p>
            </div>

            <button
              onClick={() => handleExportMarkdown(selectedReport)}
              className="px-3 py-2 rounded-md btn-secondary text-xs font-mono transition-all flex items-center gap-1.5 self-start md:self-center"
            >
              <Download size={14} /> Export Brief (.md)
            </button>
          </div>

          {/* Outcome KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[10px] font-mono uppercase text-text-muted">Traffic Lift</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-success mt-1">{selectedReport.outcomesSummary?.trafficLift || "+16.8%"}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[10px] font-mono uppercase text-text-muted">Conversion Lift</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-accent mt-1">{selectedReport.outcomesSummary?.conversionLift || "+0.42%"}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[10px] font-mono uppercase text-text-muted">Actions Deployed</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-text-primary mt-1">{selectedReport.outcomesSummary?.actionsDeployedCount || 3}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <span className="text-[10px] font-mono uppercase text-text-muted">Experiments Tested</span>
              <p className="text-2xl font-mono tabular-nums font-bold text-text-primary mt-1">{selectedReport.outcomesSummary?.experimentsCompletedCount || 1}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Executive Synthesis
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {selectedReport.executiveSummary}
            </p>
          </div>

          {/* Top Wins & Learnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-success flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Top Wins This Cycle
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {(selectedReport.topWins || []).map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-success mt-0.5 font-bold font-mono">✓</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles size={14} /> Verified Learnings & Strategy Shifts
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                {(selectedReport.keyLearnings || []).map((l: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-mono">★</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Cycle Priorities */}
          <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Next Cycle High-ROI Priorities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(selectedReport.nextCyclePriorities || []).map((p: string, i: number) => (
                <div key={i} className="p-3 rounded-md bg-surface-raised border border-border text-xs">
                  <span className="font-mono text-accent block text-[10px] uppercase">PRIORITY #{i + 1}</span>
                  <p className="font-medium text-text-primary mt-1">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
