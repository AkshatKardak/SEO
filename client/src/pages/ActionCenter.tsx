import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  ShieldCheck,
  CheckCircle2,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ActionCenter() {
  const { currentProject } = useProject();
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [previewAction, setPreviewAction] = useState<any | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchActions = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getActions(currentProject._id);
      setActions(res.actions || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load actions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [currentProject]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await growthAPI.approveAction(id);
      toast.success("Action approved and deployed successfully!");
      if (previewAction?._id === id) setPreviewAction(null);
      await fetchActions();
    } catch (err: any) {
      toast.error(err.message || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await growthAPI.rejectAction(id, rejectReason);
      toast.success("Action rejected");
      setRejectingId(null);
      setRejectReason("");
      if (previewAction?._id === id) setPreviewAction(null);
      await fetchActions();
    } catch (err: any) {
      toast.error(err.message || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingActions = actions.filter((a) => a.status === "pending_approval");
  const historyActions = actions.filter((a) => a.status !== "pending_approval");

  const getRiskBadge = (risk: string) => {
    if (risk === "HIGH") return "text-danger bg-danger/10 border-danger/30";
    if (risk === "MEDIUM") return "text-warning bg-warning/10 border-warning/30";
    return "text-success bg-success/10 border-success/30";
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <ShieldCheck size={14} />
              Human-In-The-Loop Approval System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Action Center
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and authorize high-impact changes prepared by specialized AI agents before they affect production.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pending"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending Authorization ({pendingActions.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "history"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              Action History ({historyActions.length})
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 h-32 animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : activeTab === "pending" && pendingActions.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-2">
            <CheckCircle2 size={40} className="mx-auto text-success mb-2" />
            <h3 className="text-base font-bold text-foreground">All Clear! No Pending Actions</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When agents formulate code diffs, SEO changes, or content drafts requiring approval, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === "pending" ? pendingActions : historyActions).map((action) => (
              <div
                key={action._id}
                className="glass rounded-2xl p-5 border border-border/80 hover:border-primary/40 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Title & info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {action.actionType?.replace("_", " ")}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRiskBadge(action.riskLevel)}`}>
                        Risk: {action.riskLevel || "LOW"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(action.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{action.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewAction(action)}
                      className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Preview Diff
                    </button>

                    {action.status === "pending_approval" ? (
                      <>
                        <button
                          onClick={() => setRejectingId(action._id)}
                          className="px-3.5 py-2 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(action._id)}
                          disabled={processingId === action._id}
                          className="px-4 py-2 rounded-xl btn-glow text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                        >
                          {processingId === action._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Approve
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl capitalize ${
                          action.status === "approved" || action.status === "executed"
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {action.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expected Impact callout */}
                {action.expectedImpact && (
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-xs flex items-center justify-between text-muted-foreground">
                    <span>
                      Expected Impact: <strong className="text-foreground">{action.expectedImpact}</strong>
                    </span>
                    <span className="text-[10px]">Audit Log Verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview & Diff Modal */}
      {previewAction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {previewAction.actionType}
                </span>
                <h3 className="text-base font-bold text-foreground mt-2">{previewAction.title}</h3>
              </div>
              <button
                onClick={() => setPreviewAction(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">{previewAction.description}</p>

            {/* Proposed changes payload display */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground">Proposed Payload & Code Diff:</p>
              <pre className="p-4 rounded-xl bg-muted/70 text-foreground font-mono text-xs overflow-x-auto border border-border/80 max-h-72">
                {JSON.stringify(previewAction.proposedChanges || previewAction, null, 2)}
              </pre>
            </div>

            {/* Rejection input if active */}
            {rejectingId === previewAction._id && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 space-y-2">
                <label className="text-xs font-bold text-danger block">Rejection Feedback:</label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this action is rejected to update Growth Memory..."
                  className="w-full px-3 py-2 rounded-lg bg-card border border-danger/30 text-xs text-foreground outline-none"
                />
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center gap-2 pt-3">
              <button
                onClick={() => setPreviewAction(null)}
                className="py-2.5 px-4 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted"
              >
                Close
              </button>

              {previewAction.status === "pending_approval" && (
                <>
                  <button
                    onClick={() => handleReject(previewAction._id)}
                    className="py-2.5 px-4 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(previewAction._id)}
                    className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Authorize & Deploy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
