import { useState } from "react";
import { Check, Eye } from "lucide-react";

interface ActionTask {
  id: string;
  risk: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  title: string;
  agent: string;
  targetFile: string;
  status: "Ready for Approval" | "Approved" | "Rejected";
  diffBefore: string;
  diffAfter: string;
}

const SAMPLE_ACTIONS: ActionTask[] = [
  {
    id: "act-1",
    risk: "LOW RISK",
    title: "Inject SoftwareApplication JSON-LD structured data on pricing page",
    agent: "SEO Agent",
    targetFile: "src/pages/Pricing.tsx",
    status: "Ready for Approval",
    diffBefore: `<!-- Before: Missing structured schema -->
<head>
  <title>Pricing Plans | SerpoAI</title>
</head>`,
    diffAfter: `<!-- After: Injected SoftwareApplication Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SerpoAI",
  "applicationCategory": "BusinessApplication",
  "offers": { "@type": "Offer", "price": "49", "priceCurrency": "USD" }
}
</script>`,
  },
  {
    id: "act-2",
    risk: "MEDIUM RISK",
    title: "Optimize Meta Title & H1 tag for high-intent search queries",
    agent: "SEO Agent",
    targetFile: "src/pages/Home.tsx",
    status: "Ready for Approval",
    diffBefore: `<title>Home - Modern AI Platform</title>
<h1>Supercharge Your Workflow</h1>`,
    diffAfter: `<title>SerpoAI: Autonomous Search Growth Operating System</title>
<h1>Turn Search Data Into Measurable Growth</h1>`,
  },
  {
    id: "act-3",
    risk: "HIGH RISK",
    title: "Consolidate legacy category URLs with 301 redirects",
    agent: "SEO Agent",
    targetFile: "vercel.json / nginx.conf",
    status: "Ready for Approval",
    diffBefore: `// 4 duplicate URL variations receiving split authority`,
    diffAfter: `"redirects": [
  { "source": "/features/seo-engine", "destination": "/seo-tools", "permanent": true },
  { "source": "/v1/audit", "destination": "/site-audit", "permanent": true }
]`,
  },
];

export default function ActionCenterSection() {
  const [selectedTask, setSelectedTask] = useState<ActionTask>(SAMPLE_ACTIONS[0]);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          High-Trust Execution & Human-in-the-Loop Action Center
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Review verified code diffs before anything deploys.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Autonomous doesn't mean reckless. High-risk changes always require explicit human approval, while low-risk hygiene fixes deploy safely in 1 click with rollback protection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* ── Left: Action Queue ── */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            PENDING ACTION QUEUE ({SAMPLE_ACTIONS.length})
          </span>

          {SAMPLE_ACTIONS.map((task) => {
            const isSelected = selectedTask.id === task.id;
            const isApproved = approvedIds.includes(task.id);

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 hover-slide-right ${
                  isSelected
                    ? "bg-card border-primary shadow-sm ring-1 ring-primary/30"
                    : "bg-surface-elevated border-border hover:bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      task.risk === "LOW RISK"
                        ? "bg-primary/10 text-primary"
                        : task.risk === "MEDIUM RISK"
                        ? "bg-warning/10 text-warning"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {task.risk}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {isApproved ? "Approved ✓" : "Pending Approval"}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-foreground leading-snug">{task.title}</h4>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1">
                  <span>{task.agent}</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Eye size={12} /> View Diff
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right: Code Diff & Approval Panel ── */}
        <div className="lg:col-span-7 surface-card p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 hover-lift transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Target File: {selectedTask.targetFile}
              </span>
              <h3 className="text-xs font-bold text-foreground">{selectedTask.title}</h3>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                selectedTask.risk === "LOW RISK"
                  ? "bg-primary/10 text-primary"
                  : selectedTask.risk === "MEDIUM RISK"
                  ? "bg-warning/10 text-warning"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {selectedTask.risk}
            </span>
          </div>

          {/* Diff Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Generated Code Diff:
            </span>
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-700/80 font-mono text-xs overflow-x-auto max-h-56 space-y-3 shadow-inner">
              <div>
                <span className="text-red-400 text-[11px] block font-bold">- CURRENT DOM:</span>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap">{selectedTask.diffBefore}</pre>
              </div>
              <div className="pt-2 border-t border-slate-700/80">
                <span className="text-emerald-400 text-[11px] block font-bold">+ VERIFIED PATCH:</span>
                <pre className="text-slate-100 text-[11px] whitespace-pre-wrap">{selectedTask.diffAfter}</pre>
              </div>
            </div>
          </div>

          {/* Action Approval Buttons */}
          <div className="pt-2 flex items-center gap-3">
            {approvedIds.includes(selectedTask.id) ? (
              <div className="w-full py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/30 text-xs font-bold font-mono text-center flex items-center justify-center gap-2">
                <Check size={14} /> Action Approved & Staged for Deployment
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleApprove(selectedTask.id)}
                  className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={14} /> Approve & Deploy Patch
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold text-muted-foreground hover:text-danger cursor-pointer"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
