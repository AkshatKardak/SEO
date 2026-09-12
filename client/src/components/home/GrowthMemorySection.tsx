import { CheckCircle2, XCircle, Calendar } from "lucide-react";

interface MemoryEntry {
  id: string;
  isWin: boolean;
  learning: string;
  category: string;
  experiment: string;
  measuredResult: string;
  confidence: string;
  date: string;
  source: string;
}

const MEMORIES: MemoryEntry[] = [
  {
    id: "mem-1",
    isWin: true,
    learning: "Comparison pages (/vs/competitor) drive 3.2x higher conversion than top-of-funnel articles",
    category: "CONTENT & GEO",
    experiment: "A/B Comparison Hub Architecture",
    measuredResult: "+28.4% Qualified Lead CVR",
    confidence: "94% Confidence",
    date: "14 days ago",
    source: "Growth Analyst Agent",
  },
  {
    id: "mem-2",
    isWin: true,
    learning: "Product & Review JSON-LD schema increased rich snippet CTR from 2.1% to 4.8%",
    category: "STRUCTURED DATA",
    experiment: "Automated Schema Injection",
    measuredResult: "+19.1% Organic Clicks",
    confidence: "98% Confidence",
    date: "21 days ago",
    source: "SEO Agent",
  },
  {
    id: "mem-3",
    isWin: false,
    learning: "Generic top-of-funnel glossaries generated clicks with near-zero signup velocity",
    category: "CONTENT DEPTH",
    experiment: "Programmatic Glossary Index",
    measuredResult: "< 0.4% Trial Conversion",
    confidence: "91% Confidence",
    date: "35 days ago",
    source: "Growth Brain Retrospective",
  },
  {
    id: "mem-4",
    isWin: true,
    learning: "Sub-300ms LCP optimization on pricing page reduced mobile bounce rate by 18%",
    category: "CORE WEB VITALS",
    experiment: "Hero Image WebP + Preload Patch",
    measuredResult: "-18.2% Mobile Bounce",
    confidence: "96% Confidence",
    date: "42 days ago",
    source: "SEO Agent",
  },
];

export default function GrowthMemorySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          Persistent Organizational Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          GROWTH MEMORY: It learns what moves your specific business.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Most SEO tools start from zero every single month. SerpoAI stores verified experiment outcomes in permanent organizational memory, ensuring your growth engine gets smarter with every run.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {MEMORIES.map((mem) => (
          <div
            key={mem.id}
            className={`surface-card p-5 sm:p-6 rounded-2xl border bg-card space-y-4 hover-lift cursor-pointer transition-all ${
              mem.isWin ? "border-border hover:border-primary/50" : "border-border/80 hover:border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span
                  className={`font-bold px-2 py-0.5 rounded uppercase ${
                    mem.isWin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {mem.category}
                </span>
                <span className="text-muted-foreground">{mem.confidence}</span>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                <Calendar size={12} /> {mem.date}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-2.5">
                {mem.isWin ? (
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                )}
                <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                  {mem.learning}
                </h3>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Measured Outcome:</span>
                <span className={mem.isWin ? "text-primary font-bold" : "text-muted-foreground font-bold"}>
                  {mem.measuredResult}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block uppercase">Verified By:</span>
                <span className="text-foreground text-[11px]">{mem.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
