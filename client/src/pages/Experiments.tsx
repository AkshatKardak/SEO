import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  X,
  Play,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Experiments() {
  const { currentProject } = useProject();
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [evaluatingExp, setEvaluatingExp] = useState<any | null>(null);
  const [observedValue, setObservedValue] = useState("");
  const [winnerChoice, setWinnerChoice] = useState("Variant B (AI Growth)");

  // Form State
  const [newExp, setNewExp] = useState({
    title: "",
    type: "Landing page test",
    hypothesis: "",
    metric: "Signup conversion rate",
    baselineValue: "1.8%",
    targetValue: "2.5%",
    expectedImpact: "+38%",
  });

  const fetchExperiments = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getExperiments(currentProject._id);
      setExperiments(res.experiments || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load experiments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, [currentProject]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    try {
      await growthAPI.createExperiment(currentProject._id, newExp);
      toast.success("Growth experiment launched!");
      setShowCreateModal(false);
      setNewExp({
        title: "",
        type: "Landing page test",
        hypothesis: "",
        metric: "Signup conversion rate",
        baselineValue: "1.8%",
        targetValue: "2.5%",
        expectedImpact: "+38%",
      });
      await fetchExperiments();
    } catch (err: any) {
      toast.error(err.message || "Failed to create experiment");
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingExp) return;

    try {
      await growthAPI.evaluateExperiment(evaluatingExp._id, {
        currentValue: observedValue,
        winner: winnerChoice,
      });
      toast.success("Experiment evaluated & learning stored in Growth Memory!");
      setEvaluatingExp(null);
      setObservedValue("");
      await fetchExperiments();
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate experiment");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent mb-1">
              <FlaskConical size={14} />
              Scientific Growth Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Growth Experiments
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Test hypotheses, measure baseline vs. target metric progression, and continuously store verified learnings in Growth Memory.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-glow text-xs font-bold transition-all self-start"
          >
            <Plus size={16} /> New Growth Experiment
          </button>
        </div>

        {/* Experiments List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : experiments.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3">
            <FlaskConical size={40} className="mx-auto text-accent mb-2 opacity-60" />
            <h3 className="text-base font-bold text-foreground">No active experiments yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create an experiment or execute an opportunity from the Dashboard to begin measuring outcomes.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl btn-glow text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus size={14} /> Launch First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((exp) => (
              <div
                key={exp._id}
                className="glass rounded-2xl p-5 border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {exp.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                        exp.status === "running"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-success/10 text-success border border-success/20"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground italic">
                    Hypothesis: "{exp.hypothesis}"
                  </p>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-card/70 rounded-xl border border-border/50 text-[11px] text-center">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Baseline</span>
                      <span className="font-bold text-foreground">{exp.baselineValue}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Current / Target</span>
                      <span className="font-bold text-primary">
                        {exp.currentValue || exp.baselineValue} → {exp.targetValue}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Expected</span>
                      <span className="font-bold text-success">{exp.expectedImpact || "+20%"}</span>
                    </div>
                  </div>

                  {exp.learnings && (
                    <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-foreground">
                      <span className="font-bold text-accent block text-[10px] uppercase">
                        Stored Growth Learning:
                      </span>
                      {exp.learnings}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Confidence: {exp.confidence || 80}%
                  </span>

                  {exp.status === "running" && (
                    <button
                      onClick={() => setEvaluatingExp(exp)}
                      className="px-3 py-1.5 rounded-xl btn-glow text-xs font-bold flex items-center gap-1.5"
                    >
                      <Award size={12} /> Evaluate Outcome
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Launch Growth Experiment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Experiment Title</label>
                <input
                  type="text"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder='e.g., "Add social proof logos above pricing CTA"'
                  required
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Hypothesis</label>
                <textarea
                  value={newExp.hypothesis}
                  onChange={(e) => setNewExp({ ...newExp, hypothesis: e.target.value })}
                  placeholder="e.g., Adding trusted customer logos will increase visitor confidence and lift signup conversions."
                  required
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Metric</label>
                  <input
                    type="text"
                    value={newExp.metric}
                    onChange={(e) => setNewExp({ ...newExp, metric: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Target Value</label>
                  <input
                    type="text"
                    value={newExp.targetValue}
                    onChange={(e) => setNewExp({ ...newExp, targetValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Play size={12} fill="currentColor" /> Start Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Outcome Modal */}
      {evaluatingExp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Evaluate Experiment Results</h3>
              <button onClick={() => setEvaluatingExp(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Experiment: <strong>"{evaluatingExp.title}"</strong> (Baseline: {evaluatingExp.baselineValue})
            </p>

            <form onSubmit={handleEvaluate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Observed Outcome Metric Value
                </label>
                <input
                  type="text"
                  value={observedValue}
                  onChange={(e) => setObservedValue(e.target.value)}
                  placeholder="e.g., 2.7% conversion"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Result Outcome</label>
                <select
                  value={winnerChoice}
                  onChange={(e) => setWinnerChoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
                >
                  <option value="Variant B (AI Growth)">Variant B (AI Growth Won)</option>
                  <option value="Variant A (Original)">Variant A (Control Won)</option>
                  <option value="Inconclusive">Inconclusive</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEvaluatingExp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Persist Learning to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
