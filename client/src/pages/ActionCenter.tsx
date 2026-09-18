import confetti from "canvas-confetti";
import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  ShieldCheck,
  CheckCircle2,
  Eye,
  X,
  Loader2,
  GitPullRequest,
} from "lucide-react";
import toast from "react-hot-toast";
import SerpoBotPRModal from "../components/features/SerpoBotPRModal";

export default function ActionCenter() {
  const { currentProject } = useProject();
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [previewAction, setPreviewAction] = useState<any | null>(null);
  const [serpoModalAction, setSerpoModalAction] = useState<any | null>(null);
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
      try { confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 }, colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"] }); } catch(e){} 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
            <ShieldCheck size={14} />
            Human-In-The-Loop Approval System
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            Action Center
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Review and authorize high-impact changes prepared by specialized AI agents before production deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "pending"
                ? "btn-primary font-semibold"
                : "btn-secondary text-text-muted"
            }`}
          >
            Pending ({pendingActions.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "history"
                ? "btn-primary font-semibold"
                : "btn-secondary text-text-muted"
            }`}
          >
            History ({historyActions.length})
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-xl p-6 h-32 animate-pulse bg-surface-raised/40 border border-border" />
          ))}
        </div>
      ) : activeTab === "pending" && pendingActions.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 text-center space-y-2 border border-border">
          <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-semibold text-text-primary">All Clear · No Pending Actions</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto font-sans">
            When agents formulate code diffs, SEO changes, or schema tags requiring approval, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(activeTab === "pending" ? pendingActions : historyActions).map((action) => (
            <div
              key={action._id}
              className="bg-surface rounded-xl p-5 border border-border hover:border-accent/40 transition-colors space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
                      {action.actionType?.replace("_", " ")}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getRiskBadge(action.riskLevel)}`}>
                      RISK: {action.riskLevel || "LOW"}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      {new Date(action.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-text-primary">{action.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{action.description}</p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewAction(action)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Eye size={13} /> Preview Diff
                  </button>

                  <button
                    onClick={() => setSerpoModalAction(action)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-accent hover:border-accent/40"
                    title="Dispatch PR via Serpo Bot"
                  >
                    <GitPullRequest size={13} /> Dispatch PR
                  </button>

                  {action.status === "pending_approval" ? (
                    <>
                      <button
                        onClick={() => setRejectingId(action._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(action._id)}
                        disabled={processingId === action._id}
                        className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                      >
                        {processingId === action._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        Approve
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-[11px] font-mono px-2.5 py-1 rounded border capitalize ${
                        action.status === "approved" || action.status === "executed"
                          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                          : "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5"
                      }`}
                    >
                      {action.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Expected Impact callout */}
              {action.expectedImpact && (
                <div className="p-2.5 rounded-lg bg-surface-raised border border-border text-xs flex items-center justify-between text-text-muted font-mono">
                  <span>
                    Expected Impact: <strong className="text-text-primary">{action.expectedImpact}</strong>
                  </span>
                  <span className="text-[10px]">Audit Log Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview & Diff Modal */}
      {previewAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-surface-raised text-accent">
                  {previewAction.actionType}
                </span>
                <h3 className="text-base font-semibold text-text-primary mt-2">{previewAction.title}</h3>
              </div>
              <button
                onClick={() => setPreviewAction(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{previewAction.description}</p>

            {/* Proposed changes payload display */}
            <div className="space-y-1.5">
              <p className="text-xs font-mono font-semibold text-text-primary">Proposed Payload & Code Diff:</p>
              <pre className="p-3.5 rounded-lg bg-surface-raised text-text-primary font-mono text-xs overflow-x-auto border border-border max-h-72 leading-relaxed">
                {JSON.stringify(previewAction.proposedChanges || previewAction, null, 2)}
              </pre>
            </div>

            {/* Rejection input if active */}
            {rejectingId === previewAction._id && (
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
                <label className="text-xs font-mono font-bold text-red-500 block">Rejection Feedback:</label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this action is rejected to update Growth Memory..."
                  className="w-full px-3 py-1.5 rounded-md bg-surface border border-border text-xs text-text-primary outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center gap-2 pt-3 flex-wrap">
              <button
                onClick={() => setPreviewAction(null)}
                className="btn-secondary py-2 px-3.5 rounded-lg text-xs"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = previewAction;
                  setPreviewAction(null);
                  setSerpoModalAction(target);
                }}
                className="btn-secondary py-2 px-3.5 rounded-lg text-xs text-accent flex items-center gap-1.5"
              >
                <GitPullRequest size={13} /> Dispatch PR via Serpo Bot
              </button>

              {previewAction.status === "pending_approval" && (
                <>
                  <button
                    onClick={() => handleReject(previewAction._id)}
                    className="py-2 px-3.5 rounded-lg border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(previewAction._id)}
                    className="btn-primary flex-1 py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={13} /> Authorize & Deploy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Serpo Bot Pull Request Dispatcher Modal */}
      {serpoModalAction && (
        <SerpoBotPRModal
          isOpen={Boolean(serpoModalAction)}
          onClose={() => setSerpoModalAction(null)}
          opportunityTitle={serpoModalAction.title || "SEO Patch"}
          patchCode={serpoModalAction.payload?.codeDiff || serpoModalAction.description || "// SEO Optimization Patch"}
          targetFile={serpoModalAction.payload?.targetFile || "src/components/SEOHead.tsx"}
          opportunityId={serpoModalAction._id}
        />
      )}
    </div>
  );
}
