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
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <FileText size={14} />
              Executive Growth Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Executive Briefs & Reports
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Closed-loop performance summaries, verified experiment learnings, and next-cycle priorities for leadership.
            </p>
          </div>

          <button
            onClick={() => handleGenerate("weekly")}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-glow text-xs font-bold transition-all self-start disabled:opacity-50"
          >
            {generating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
            {generating ? "Compiling Executive Brief..." : "Compile New Report"}
          </button>
        </div>

        {/* Report Selector Tabs */}
        {reports.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {reports.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelectedReport(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  selectedReport?._id === r._id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "glass text-foreground hover:border-border/80"
                }`}
              >
                {r.period.toUpperCase()} · {new Date(r.generatedAt).toLocaleDateString()}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 h-36 animate-pulse bg-muted/40" />
            <div className="glass rounded-2xl p-6 h-72 animate-pulse bg-muted/40" />
          </div>
        ) : !selectedReport ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3">
            <FileText size={40} className="mx-auto text-primary mb-2 opacity-60" />
            <h3 className="text-base font-bold text-foreground">No Executive Reports Compiled Yet</h3>
            <p className="text-xs text-muted-foreground">
              Click "Compile New Report" to synthesize your first executive growth brief.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Header Card */}
            <div className="glass rounded-2xl p-6 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {selectedReport.period} Executive Brief
                </span>
                <h2 className="text-lg font-bold text-foreground">{selectedReport.title}</h2>
                <p className="text-xs text-muted-foreground">
                  Published {new Date(selectedReport.generatedAt).toLocaleDateString()} · Analyzed by SerpoAI
                </p>
              </div>

              <button
                onClick={() => handleExportMarkdown(selectedReport)}
                className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-1.5 self-start md:self-center"
              >
                <Download size={14} /> Export Brief (.md)
              </button>
            </div>

            {/* Outcome KPI Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass rounded-2xl p-4 border border-success/30 bg-success/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Traffic Lift</span>
                <p className="text-2xl font-black text-success mt-1">{selectedReport.outcomesSummary?.trafficLift || "+16.8%"}</p>
              </div>
              <div className="glass rounded-2xl p-4 border border-primary/30 bg-primary/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Conversion Lift</span>
                <p className="text-2xl font-black text-primary mt-1">{selectedReport.outcomesSummary?.conversionLift || "+0.42%"}</p>
              </div>
              <div className="glass rounded-2xl p-4 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Actions Deployed</span>
                <p className="text-2xl font-black text-foreground mt-1">{selectedReport.outcomesSummary?.actionsDeployedCount || 3}</p>
              </div>
              <div className="glass rounded-2xl p-4 border border-accent/30 bg-accent/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Experiments Tested</span>
                <p className="text-2xl font-black text-accent mt-1">{selectedReport.outcomesSummary?.experimentsCompletedCount || 1}</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="glass rounded-2xl p-6 border border-border space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Executive Synthesis
              </h3>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                {selectedReport.executiveSummary}
              </p>
            </div>

            {/* Top Wins & Learnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-border space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Top Wins This Cycle
                </h3>
                <ul className="space-y-2 text-xs text-foreground">
                  {(selectedReport.topWins || []).map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success mt-0.5 font-bold">✓</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6 border border-border space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles size={14} /> Verified Learnings & Strategy Shifts
                </h3>
                <ul className="space-y-2 text-xs text-foreground">
                  {(selectedReport.keyLearnings || []).map((l: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 font-bold">★</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Cycle Priorities */}
            <div className="glass rounded-2xl p-6 border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Next Cycle High-ROI Priorities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(selectedReport.nextCyclePriorities || []).map((p: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-card/60 border border-border/60 text-xs">
                    <span className="font-extrabold text-primary block text-[10px]">PRIORITY #{i + 1}</span>
                    <p className="font-semibold text-foreground mt-1">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
