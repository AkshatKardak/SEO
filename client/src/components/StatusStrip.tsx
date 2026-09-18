import { useLocation, Link } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { Plus, RefreshCw, Bot } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ROUTE_NAMES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/opportunities": "ICE Opportunities",
  "/actions": "Action Center",
  "/geo": "GEO Intelligence",
  "/analytics": "Analytics & Funnel",
  "/competitors": "Competitor Gaps",
  "/strategy": "Strategy Roadmap",
  "/knowledge-graph": "Knowledge Graph",
  "/site-audit": "Technical Site Audit",
  "/reports": "Executive Reports",
  "/agents": "Agent Activity",
  "/experiments": "Growth Experiments",
  "/content": "Content Studio",
  "/analyze": "URL Deep Scan",
  "/rank-tracker": "Rank Tracker",
  "/history": "Scan History",
  "/onboarding": "Connect Domain / Staging",
};

export default function StatusStrip({ onOpenSerpoBot }: { onOpenSerpoBot?: () => void }) {
  const location = useLocation();
  const { currentProject, reanalyzeCurrentProject } = useProject();
  const [refreshing, setRefreshing] = useState(false);

  const pageTitle = ROUTE_NAMES[location.pathname] || "Telemetry";

  const cleanDomain = (url?: string) => {
    if (!url) return "serpo.ai";
    try {
      return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  const handleQuickScan = async () => {
    if (!currentProject?._id) {
      toast.error("Select or add a website first");
      return;
    }
    setRefreshing(true);
    try {
      await reanalyzeCurrentProject();
      toast.success("Telemetry scan completed");
    } catch {
      toast.error("Telemetry scan failed");
    } finally {
      setRefreshing(false);
    }
  };

  // Timestamp formatting
  const now = new Date();
  const timeString = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")} ${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;

  return (
    <header className="h-12 border-b border-border bg-surface/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 select-none">
      {/* ── Left: Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono text-text-muted truncate max-w-[140px] sm:max-w-[200px]">
          {cleanDomain(currentProject?.url)}
        </span>
        <span className="text-text-muted">/</span>
        <span className="font-sans font-medium text-text-primary tracking-tight">
          {pageTitle}
        </span>
      </div>

      {/* ── Right: Live System Cluster ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Engine Status Dot */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono" title="Growth Engine Loop Active">
          <div className="w-2 h-2 rounded-full bg-accent animate-engine-breath" />
          <span className="hidden sm:inline text-[11px]">Engine online</span>
        </div>

        {/* Scan Timestamp */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-text-muted tabular-nums">
          <span className="text-[10px] uppercase text-text-muted/70">SCAN:</span>
          <span>{timeString}</span>
        </div>

        {/* Action: Serpo Bot, Quick Re-scan or Add Website */}
        <div className="flex items-center gap-1.5">
          {onOpenSerpoBot && (
            <button
              type="button"
              onClick={onOpenSerpoBot}
              title="Open Serpo Bot"
              className="hidden sm:flex items-center gap-1.5 h-7 px-2 rounded border border-border bg-surface-muted hover:bg-surface text-text-secondary hover:text-text-primary text-[11px] font-mono transition-colors"
            >
              <Bot size={13} className="text-accent" />
              <span>Serpo Bot</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickScan}
            disabled={refreshing || !currentProject}
            aria-label="Refresh telemetry"
            title="Trigger Telemetry Re-scan"
            className="w-7 h-7 rounded border border-border bg-surface-muted hover:bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-accent" : ""} />
          </button>

          <Link
            to="/onboarding"
            className="btn-primary text-xs px-2.5 py-1 gap-1 h-7"
            title="Add Website or Connect Private Repo"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Website</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
