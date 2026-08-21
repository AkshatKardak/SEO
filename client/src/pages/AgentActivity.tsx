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
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
            <Bot size={14} />
            Execution Observability
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Agent Activity & Cost Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit log, token consumption, execution latency, and financial accounting for all specialized AI agents.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats?.totalRuns || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Agent Runs</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats?.completedCount || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Completed Tasks</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats?.totalTokens?.toLocaleString() || 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Tokens</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${stats?.totalCostUSD || "0.0000"}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Estimated Cost (USD)</p>
            </div>
          </div>
        </div>

        {/* Runs List */}
        <div className="glass rounded-2xl p-6 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Recent Task Logs</h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : runs.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              <Bot size={36} className="mx-auto mb-2 opacity-50" />
              <p>No agent runs recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <div
                  key={run._id}
                  className="p-3.5 rounded-xl bg-card/70 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{run.agentType}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                        {run.modelUsed}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(run.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-foreground font-medium">{run.taskName}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-[11px]">
                      <span className="text-muted-foreground block">{run.tokensUsed?.total || 0} tokens</span>
                      <span className="font-semibold text-foreground">${run.estimatedCostUSD || 0}</span>
                    </div>

                    <button
                      onClick={() => setSelectedRun(run)}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] font-semibold hover:bg-muted text-foreground flex items-center gap-1"
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {selectedRun.agentType}
                </span>
                <h3 className="text-sm font-bold text-foreground mt-1">{selectedRun.taskName}</h3>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-muted/40">
              <div>
                <span className="text-muted-foreground block text-[10px]">Model</span>
                <span className="font-bold text-foreground font-mono">{selectedRun.modelUsed}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Execution Time</span>
                <span className="font-bold text-foreground">{selectedRun.executionTimeMs}ms</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Total Cost</span>
                <span className="font-bold text-foreground">${selectedRun.estimatedCostUSD}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground">Structured Output Payload:</p>
              <pre className="p-4 rounded-xl bg-muted/60 text-foreground font-mono text-xs overflow-x-auto border border-border max-h-60">
                {JSON.stringify(selectedRun.output, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedRun(null)}
              className="w-full py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
