import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Bot,
  FlaskConical,
  RefreshCw,
  Zap,
  CheckSquare,
  X,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";

interface Opportunity {
  _id: string;
  type: string;
  title: string;
  description: string;
  evidence: string[];
  impactScore: number;
  effortScore: number;
  confidenceScore: number;
  priorityScore: number;
  estimatedValue: string;
  status: string;
  recommendedAction: string;
  automationLevel: string;
  requiresApproval: boolean;
  assignedAgent: string;
}

export default function Dashboard() {
  const { currentProject, loading: projectLoading, reanalyzeCurrentProject } = useProject();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [memoryItems, setMemoryItems] = useState<any[]>([]);
  const [selectedOppForEvidence, setSelectedOppForEvidence] = useState<Opportunity | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    if (!currentProject) return;

    try {
      setLoadingOpps(true);
      const [oppsRes, memRes] = await Promise.all([
        growthAPI.getOpportunities(currentProject._id),
        growthAPI.getGrowthMemory(currentProject._id),
      ]);

      setOpportunities(oppsRes.opportunities || []);
      setMemoryItems(memRes.memoryItems || []);
    } catch (err: any) {
      console.warn("Dashboard fetch error:", err);
    } finally {
      setLoadingOpps(false);
    }
  };

  useEffect(() => {
    if (currentProject) {
      fetchDashboardData();
    }
  }, [currentProject]);

  const handleExecute = async (opp: Opportunity) => {
    setExecutingId(opp._id);
    try {
      await growthAPI.executeOpportunity(opp._id);
      toast.success(`${opp.assignedAgent} dispatched for "${opp.title}"`);
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Execution failed");
    } finally {
      setExecutingId(null);
    }
  };

  const handleReanalyze = async () => {
    setRefreshing(true);
    try {
      await reanalyzeCurrentProject();
      await fetchDashboardData();
      toast.success("SerpoAI analysis refreshed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to refresh analysis");
    } finally {
      setRefreshing(false);
    }
  };

  if (!currentProject && !projectLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background bg-grid flex items-center justify-center px-4">
        <div className="glass max-w-lg w-full p-8 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Sparkles size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Welcome to SerpoAI</h2>
          <p className="text-sm text-muted-foreground">
            Connect your website or startup domain to discover the highest-impact opportunities and deploy specialized AI agents.
          </p>
          <Link
            to="/onboarding"
            className="btn-glow px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <Zap size={16} /> Setup Your First Project
          </Link>
        </div>
      </div>
    );
  }

  const top3Opportunities = opportunities.slice(0, 3);
  const healthScore = currentProject?.growthHealthScore || 68;
  const scores = currentProject?.scores || {
    visibility: 72,
    seo: 81,
    geo: 46,
    conversion: 58,
    content: 69,
  };

  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-success border-success/30 bg-success/10";
    if (s >= 50) return "text-warning border-warning/30 bg-warning/10";
    return "text-danger border-danger/30 bg-danger/10";
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Top Overview Bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                SerpoAI · {currentProject?.domain}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                {currentProject?.settings?.executionMode || "Autopilot"} Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              Growth Intelligence Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Goal: <strong className="text-foreground">{currentProject?.growthGoal}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReanalyze}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold glass hover:bg-muted text-foreground transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
              {refreshing ? "Re-analyzing..." : "Run Growth Scan"}
            </button>
            <Link
              to="/actions"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
            >
              <CheckSquare size={14} /> Action Center
            </Link>
          </div>
        </div>

        {/* ── AI Growth Score & 5 Pillars ── */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
          {/* Main Health Gauge */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col justify-between border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Overall Growth Health
                </p>
                <h3 className="text-lg font-bold text-foreground mt-0.5">AI Growth Score</h3>
              </div>
              <span className="text-2xl">⚡</span>
            </div>

            <div className="my-4 flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-3xl font-black ${getScoreColor(healthScore)}`}>
                {healthScore}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {healthScore >= 70 ? "Strong Growth Momentum" : "High Optimization Potential"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Closed-loop system discovered {opportunities.length} ranked opportunities for {currentProject?.domain}.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Philosophy: Discover → Prioritize → Execute → Measure</span>
            </div>
          </div>

          {/* 5 Sub-Pillars */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Visibility", score: scores.visibility, path: "/geo", icon: "👁️" },
              { label: "Technical SEO", score: scores.seo, path: "/opportunities?category=TECHNICAL_SEO", icon: "🔍" },
              { label: "GEO (AI-Search)", score: scores.geo, path: "/geo", icon: "🤖" },
              { label: "Conversion", score: scores.conversion, path: "/opportunities?category=CONVERSION", icon: "🎯" },
              { label: "Content Depth", score: scores.content, path: "/content", icon: "📄" },
            ].map((pillar) => (
              <Link
                key={pillar.label}
                to={pillar.path}
                className="glass rounded-xl p-4 flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pillar.icon}</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
                <div className="my-2">
                  <p className={`text-2xl font-black ${getScoreColor(pillar.score).split(" ")[0]}`}>
                    {pillar.score}
                  </p>
                  <p className="text-[11px] font-bold text-foreground mt-0.5">{pillar.label}</p>
                </div>
                <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Section: "What Should I Do Today?" Top 3 Opportunities ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <Sparkles size={14} />
                Strategic Growth Engine
              </div>
              <h2 className="text-xl font-bold text-foreground">What should I do today?</h2>
              <p className="text-xs text-muted-foreground">
                Top 3 highest-value actions ranked by ICE formula ($$Impact \times Confidence \div Effort$$)
              </p>
            </div>

            <Link
              to="/opportunities"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              View Backlog ({opportunities.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loadingOpps ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 h-56 animate-pulse bg-muted/40" />
              ))}
            </div>
          ) : top3Opportunities.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <Lightbulb size={36} className="mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm font-semibold text-foreground">No pending opportunities</p>
              <p className="text-xs text-muted-foreground mt-1">Run a new scan to discover new avenues.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3Opportunities.map((opp, idx) => (
                <div
                  key={opp._id}
                  className="glass rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all border border-border/80 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Rank Header */}
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                          ICE: {opp.priorityScore}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {opp.assignedAgent}
                        </span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    {/* ICE Badges */}
                    <div className="grid grid-cols-3 gap-1.5 py-1 text-center bg-card/60 rounded-xl p-2 border border-border/50 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block">Impact</span>
                        <span className="font-extrabold text-foreground">{opp.impactScore}/10</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Effort</span>
                        <span className="font-extrabold text-foreground">{opp.effortScore}/10</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Confidence</span>
                        <span className="font-extrabold text-foreground">{Math.round(opp.confidenceScore * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setSelectedOppForEvidence(opp)}
                      className="flex-1 py-2 px-3 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      Evidence
                    </button>
                    <button
                      onClick={() => handleExecute(opp)}
                      disabled={executingId === opp._id || opp.status === "executed"}
                      className="flex-1 py-2 px-3 rounded-xl btn-glow text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      {executingId === opp._id ? (
                        "Dispatching..."
                      ) : opp.status === "executed" ? (
                        "Executed"
                      ) : (
                        <>
                          <Play size={12} fill="currentColor" /> Execute
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Active Agents Ticker & Growth Memory ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Agents */}
          <div className="glass rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">Specialized AI Execution Agents</h3>
              </div>
              <Link to="/agents" className="text-xs text-primary font-bold hover:underline">
                Agent Activity →
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Growth Brain", role: "Strategy, ICE prioritization & Goal alignment", status: "Active" },
                { name: "Intelligence Agent", role: "Company profile, audience & competitor teardowns", status: "Active" },
                { name: "SEO Agent", role: "Technical crawls, metadata fixes & schema tags", status: "Ready" },
                { name: "GEO Agent", role: "AI-search visibility & citation gap analysis", status: "Ready" },
                { name: "Content Agent", role: "Comparison pages, briefs & conversion copy", status: "Ready" },
                { name: "Growth Analyst", role: "Measures experiment outcomes & stores learnings", status: "Active" },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="p-2.5 rounded-xl bg-card/70 border border-border/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground">{agent.name}</span>
                    <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Memory */}
          <div className="glass rounded-2xl p-6 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FlaskConical size={18} className="text-accent" />
                  <h3 className="text-sm font-bold text-foreground">Persistent Growth Memory</h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Closed-Loop Learning</span>
              </div>

              {memoryItems.length === 0 ? (
                <div className="p-6 rounded-xl bg-card/60 text-center text-xs text-muted-foreground border border-border/50">
                  <p>No experiments completed yet.</p>
                  <p className="mt-1">
                    When you run and measure experiments, SerpoAI permanently retains what worked vs. what failed to refine future strategies.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memoryItems.slice(0, 4).map((item) => (
                    <div
                      key={item._id}
                      className="p-3 rounded-xl bg-card/70 border border-border/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-primary">[{item.category}]</span>
                        <span className="text-muted-foreground font-semibold">Confidence: {item.confidence}</span>
                      </div>
                      <p className="text-foreground font-medium">{item.learning}</p>
                      <span className="text-[10px] text-muted-foreground block">Source: {item.source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Goal: Optimize for business outcomes, not sheer AI output.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Evidence Inspection Modal ── */}
      {selectedOppForEvidence && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {selectedOppForEvidence.type}
                </span>
                <h3 className="text-base font-bold text-foreground mt-2">
                  {selectedOppForEvidence.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedOppForEvidence.description}
            </p>

            {/* Evidence Block */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
              <p className="text-xs font-bold text-foreground">Verified Evidence & Signals:</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {selectedOppForEvidence.evidence?.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
              <p className="font-bold text-primary mb-1">Recommended Action:</p>
              <p className="text-foreground">{selectedOppForEvidence.recommendedAction}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="flex-1 py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExecute(selectedOppForEvidence);
                  setSelectedOppForEvidence(null);
                }}
                className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Play size={12} fill="currentColor" /> Deploy {selectedOppForEvidence.assignedAgent}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}