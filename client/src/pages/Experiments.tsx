import confetti from "canvas-confetti";
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
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"] }); } catch(e){} 
      toast.success("Experiment evaluated & learning stored in Growth Memory!");
      setEvaluatingExp(null);
      setObservedValue("");
      await fetchExperiments();
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate experiment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
            <FlaskConical size={14} />
            Scientific Growth Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-text-primary tracking-tight">
            Growth <span className="italic text-accent">Experiments</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Test hypotheses, measure baseline vs. target metric progression, and continuously store verified learnings in Growth Memory.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md btn-primary text-xs font-mono uppercase tracking-wider transition-all self-start"
        >
          <Plus size={14} /> New Growth Experiment
        </button>
      </div>

      {/* Experiments List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : experiments.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
          <FlaskConical size={40} className="mx-auto text-accent mb-2 opacity-60" />
          <h3 className="text-base font-serif text-text-primary">No active experiments yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Create an experiment or execute an opportunity from the Dashboard to begin measuring outcomes.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-md btn-primary text-xs font-mono inline-flex items-center gap-1.5"
          >
            <Plus size={14} /> Launch First Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiments.map((exp) => (
            <div
              key={exp._id}
              className="bg-surface rounded-lg p-5 border border-border hover:border-border-strong transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-raised border border-border text-text-muted">
                    {exp.type}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      exp.status === "running"
                        ? "border-accent/40 bg-accent/10 text-accent font-semibold"
                        : "border-success/40 bg-success/10 text-success font-semibold"
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>

                <h3 className="text-sm font-serif text-text-primary">{exp.title}</h3>
                <p className="text-xs text-text-muted italic">
                  Hypothesis: "{exp.hypothesis}"
                </p>

                {/* Metrics Box */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-surface-raised rounded-md border border-border text-[11px] text-center font-mono">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase">Baseline</span>
                    <span className="font-semibold text-text-primary tabular-nums">{exp.baselineValue}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase">Current / Target</span>
                    <span className="font-semibold text-accent tabular-nums">
                      {exp.currentValue || exp.baselineValue} → {exp.targetValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase">Expected</span>
                    <span className="font-semibold text-success tabular-nums">{exp.expectedImpact || "+20%"}</span>
                  </div>
                </div>

                {exp.learnings && (
                  <div className="p-2.5 rounded-md bg-surface-raised border border-accent/30 text-xs text-text-secondary">
                    <span className="font-mono text-accent block text-[10px] uppercase">
                      Stored Growth Learning:
                    </span>
                    {exp.learnings}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-mono tabular-nums text-text-muted">
                  Confidence: {exp.confidence || 80}%
                </span>

                {exp.status === "running" && (
                  <button
                    onClick={() => setEvaluatingExp(exp)}
                    className="px-3 py-1.5 rounded-md btn-secondary text-xs font-mono flex items-center gap-1.5"
                  >
                    <Award size={12} /> Evaluate Outcome
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-serif text-text-primary">Launch Growth Experiment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted block mb-1">Experiment Title</label>
                <input
                  type="text"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder='e.g., "Add social proof logos above pricing CTA"'
                  required
                  className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs text-text-primary outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-text-muted block mb-1">Hypothesis</label>
                <textarea
                  value={newExp.hypothesis}
                  onChange={(e) => setNewExp({ ...newExp, hypothesis: e.target.value })}
                  placeholder="e.g., Adding trusted customer logos will increase visitor confidence and lift signup conversions."
                  required
                  rows={2}
                  className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs text-text-primary outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-text-muted block mb-1">Metric</label>
                  <input
                    type="text"
                    value={newExp.metric}
                    onChange={(e) => setNewExp({ ...newExp, metric: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs font-mono text-text-primary outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-text-muted block mb-1">Target Value</label>
                  <input
                    type="text"
                    value={newExp.targetValue}
                    onChange={(e) => setNewExp({ ...newExp, targetValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs font-mono text-text-primary outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-md btn-secondary text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md btn-primary text-xs font-mono flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-serif text-text-primary">Evaluate Experiment Results</h3>
              <button onClick={() => setEvaluatingExp(null)} className="text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Experiment: <strong className="text-text-primary">"{evaluatingExp.title}"</strong> (Baseline: {evaluatingExp.baselineValue})
            </p>

            <form onSubmit={handleEvaluate} className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted block mb-1">
                  Observed Outcome Metric Value
                </label>
                <input
                  type="text"
                  value={observedValue}
                  onChange={(e) => setObservedValue(e.target.value)}
                  placeholder="e.g., 2.7% conversion"
                  required
                  className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs font-mono text-text-primary outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-text-muted block mb-1">Result Outcome</label>
                <select
                  value={winnerChoice}
                  onChange={(e) => setWinnerChoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs text-text-primary outline-none focus:border-accent"
                >
                  <option value="Variant B (AI Growth)">Variant B (AI Growth Won)</option>
                  <option value="Variant A (Original)">Variant A (Control Won)</option>
                  <option value="Inconclusive">Inconclusive</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingExp(null)}
                  className="flex-1 py-2 rounded-md btn-secondary text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md btn-primary text-xs font-mono flex items-center justify-center gap-1.5"
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
