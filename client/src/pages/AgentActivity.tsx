import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Bot,
  Cpu,
  DollarSign,
  CheckCircle2,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AgentActivity() {
  const { currentProject } = useProject();
  const [runs, setRuns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  const fetchActivity = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getAgentActivity(currentProject._id);
      setRuns(res.runs || []);
      setStats(res.stats || null);
    } catch (err: any) {
      toast.error(err.message || "Failed to load agent activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
          <Bot size={13} />
          Execution Observability
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
          Agent Activity & Telemetry Center
        </h1>
        <p className="text-xs text-text-muted mt-1 font-sans">
          Audit log, token consumption, execution latency, and financial accounting for specialized AI agents.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
            <Cpu size={16} />
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-text-primary tabular-nums">{stats?.totalRuns || 0}</p>
            <p className="text-[10px] font-mono text-text-muted uppercase">Agent Runs</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{stats?.completedCount || 0}</p>
            <p className="text-[10px] font-mono text-text-muted uppercase">Completed</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-sky-500">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-text-primary tabular-nums">{stats?.totalTokens?.toLocaleString() || 0}</p>
            <p className="text-[10px] font-mono text-text-muted uppercase">Tokens Ingested</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
            <DollarSign size={16} />
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-text-primary tabular-nums">${stats?.totalCostUSD || "0.0000"}</p>
            <p className="text-[10px] font-mono text-text-muted uppercase">Model Cost (USD)</p>
          </div>
        </div>
      </div>

      {/* Runs List */}
      <div className="bg-surface rounded-xl p-5 border border-border">
        <h3 className="font-sans font-semibold text-sm text-text-primary mb-4 pb-2 border-b border-border">
          Recent Task Telemetry Logs
        </h3>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-raised/40 border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted space-y-1">
            <Bot size={32} className="mx-auto mb-2 opacity-40" />
            <p className="font-medium text-text-primary">No agent runs recorded yet.</p>
            <p className="text-[11px] font-sans">Run a growth scan or deploy a backlog action to populate logs.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {runs.map((run) => (
              <div
                key={run._id}
                className="p-3 rounded-lg bg-surface-raised border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-accent/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent text-[11px]">{run.agentType}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded border border-border bg-surface text-text-secondary font-mono">
                      {run.modelUsed}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      {new Date(run.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-text-primary font-medium text-xs font-sans">{run.taskName}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <div className="text-right text-[11px]">
                    <span className="text-text-muted block text-[10px]">{run.tokensUsed?.total || 0} tokens</span>
                    <span className="font-semibold text-text-primary">${run.estimatedCostUSD || 0}</span>
                  </div>

                  <button
                    onClick={() => setSelectedRun(run)}
                    className="btn-secondary px-2.5 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <Eye size={12} /> Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-accent font-bold uppercase">{selectedRun.agentType}</span>
                <h3 className="text-sm font-semibold text-text-primary mt-1">{selectedRun.taskName}</h3>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface-raised border border-border text-center font-mono text-xs">
              <div>
                <span className="text-text-muted block text-[9px] uppercase">Tokens</span>
                <span className="font-bold text-text-primary tabular-nums">{selectedRun.tokensUsed?.total || 0}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[9px] uppercase">Latency</span>
                <span className="font-bold text-text-primary tabular-nums">{selectedRun.executionTimeMs}ms</span>
              </div>
              <div>
                <span className="text-text-muted block text-[9px] uppercase">Cost</span>
                <span className="font-bold text-text-primary tabular-nums">${selectedRun.estimatedCostUSD}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-mono font-semibold text-text-primary">Structured Output Payload:</p>
              <pre className="p-3.5 rounded-lg bg-surface-raised text-text-primary font-mono text-xs overflow-x-auto border border-border max-h-60 leading-relaxed">
                {JSON.stringify(selectedRun.output, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedRun(null)}
              className="btn-secondary w-full py-2 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
