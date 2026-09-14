import { useState } from "react";
import {
  Zap,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";

interface QuickWinQuery {
  id: string;
  query: string;
  impressions: number;
  currentClicks: number;
  currentCTR: number;
  expectedCTR: number;
  position: number;
  potentialClickLift: number;
  targetUrl: string;
  suggestedTitle: string;
}

const MOCK_QUICK_WINS: QuickWinQuery[] = [
  {
    id: "qw-1",
    query: "b2b saas seo automation",
    impressions: 4800,
    currentClicks: 96,
    currentCTR: 2.0,
    expectedCTR: 7.8,
    position: 4.8,
    potentialClickLift: 278,
    targetUrl: "/features/automation",
    suggestedTitle: "B2B SaaS SEO Automation: Cut Manual Work by 80% (2025)",
  },
  {
    id: "qw-2",
    query: "generative engine optimization audit",
    impressions: 3400,
    currentClicks: 61,
    currentCTR: 1.8,
    expectedCTR: 6.5,
    position: 5.6,
    potentialClickLift: 160,
    targetUrl: "/geo",
    suggestedTitle: "Free GEO Audit Tool: Measure Perplexity & ChatGPT Citations",
  },
  {
    id: "qw-3",
    query: "automated schema markup generator react",
    impressions: 2900,
    currentClicks: 43,
    currentCTR: 1.5,
    expectedCTR: 5.4,
    position: 6.9,
    potentialClickLift: 113,
    targetUrl: "/tools/schema-generator",
    suggestedTitle: "Automated JSON-LD Schema Generator for React & Next.js",
  },
];

export default function GSCQuickWinsDetector() {
  const [selectedWin, setSelectedWin] = useState<QuickWinQuery | null>(null);
  const [appliedWins, setAppliedWins] = useState<string[]>([]);

  const totalPotentialLift = MOCK_QUICK_WINS.reduce((acc, q) => acc + q.potentialClickLift, 0);

  return (
    <div className="surface-card bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mb-1.5">
            <Target size={12} />
            GSC Search Analytics Ingestion
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Striking Distance & High-CTR Quick Wins
          </h3>
          <p className="text-xs text-muted-foreground">
            Identifies keywords ranking in positions 4–10 with high impressions but low click-through rates. Rewrite metadata to unlock lost organic clicks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-surface-elevated border border-border text-right">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">Predicted Monthly Click Lift</span>
            <span className="text-sm font-mono font-black text-primary">+{totalPotentialLift.toLocaleString()} Clicks/mo</span>
          </div>
        </div>
      </div>

      {/* Quick Win Query Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-[11px] uppercase">
              <th className="pb-2.5 font-semibold">Search Query</th>
              <th className="pb-2.5 font-semibold text-right">Avg Pos</th>
              <th className="pb-2.5 font-semibold text-right">Impressions</th>
              <th className="pb-2.5 font-semibold text-right">Current CTR</th>
              <th className="pb-2.5 font-semibold text-right">Expected CTR</th>
              <th className="pb-2.5 font-semibold text-right text-primary">Click Gain</th>
              <th className="pb-2.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {MOCK_QUICK_WINS.map((q) => {
              const isApplied = appliedWins.includes(q.id);

              return (
                <tr key={q.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-2">
                    <span className="font-bold text-foreground block font-sans text-xs">{q.query}</span>
                    <span className="text-[10px] text-muted-foreground truncate block max-w-[200px]">{q.targetUrl}</span>
                  </td>
                  <td className="py-3 text-right font-bold text-amber-500">#{q.position}</td>
                  <td className="py-3 text-right text-foreground">{q.impressions.toLocaleString()}</td>
                  <td className="py-3 text-right text-muted-foreground">{q.currentCTR}%</td>
                  <td className="py-3 text-right text-emerald-500 font-bold">{q.expectedCTR}%</td>
                  <td className="py-3 text-right font-bold text-primary">+{q.potentialClickLift}/mo</td>
                  <td className="py-3 text-right">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                        <CheckCircle2 size={12} /> Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedWin(q)}
                        className="px-3 py-1.5 rounded-lg btn-primary text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Zap size={11} /> Optimize
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Meta Rewrite Modal */}
      {selectedWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="surface-card bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" /> ML High-CTR Title Rewrite
              </h4>
              <button
                type="button"
                onClick={() => setSelectedWin(null)}
                className="text-muted-foreground hover:text-foreground text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground font-semibold block mb-1">Target Search Query:</span>
                <span className="font-mono font-bold text-foreground px-2.5 py-1 rounded bg-surface-elevated border border-border inline-block">
                  {selectedWin.query}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground font-semibold block mb-1">Predicted Click Lift:</span>
                <span className="font-mono font-black text-emerald-500 text-sm">
                  +{selectedWin.potentialClickLift} extra monthly visitors
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
                <span className="text-[11px] font-mono text-primary font-bold block uppercase">Recommended Meta Title</span>
                <div className="font-bold text-foreground text-sm font-sans">{selectedWin.suggestedTitle}</div>
                <p className="text-[11px] text-muted-foreground">
                  Formula: [Keyword] + [Compelling Benefit] + [Current Year / Curiosity Trigger]
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedWin(null)}
                className="px-4 py-2 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppliedWins([...appliedWins, selectedWin.id]);
                  setSelectedWin(null);
                }}
                className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={13} /> Approve Title Patch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}