import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";

/* ═══════════════════════════════════════════
   Motion language — one easing curve everywhere
   ═══════════════════════════════════════════ */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
};

const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 22, rotateX: -45 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: EASE } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* ═══════════════════════════════════════════
   Live terminal: self-typing, looping stream
   ═══════════════════════════════════════════ */
type ScriptLine =
  | { kind: "log"; time: string; tag: string; tagClass: string; text: string }
  | { kind: "diff"; title: string; badge: string; lines: { cls: string; text: string }[] };

const LOG_SCRIPT: ScriptLine[] = [
  { kind: "log", time: "[06:18:01.042]", tag: "SCAN", tagClass: "text-accent", text: ": 18 striking-distance keywords detected (Pos 4–10)" },
  { kind: "log", time: "[06:18:01.218]", tag: "ML REGRESSOR", tagClass: "text-data-1", text: ": Traffic lift potential: +14,200 visits/mo" },
  { kind: "log", time: "[06:18:01.401]", tag: "ICE ENGINE", tagClass: "text-warning", text: ": Priority #1 → JSON-LD Schema (Score: 94.2)" },
  {
    kind: "diff",
    title: "PATCH PREVIEW: Header.tsx",
    badge: "AST Safe: 99.8%",
    lines: [
      { cls: "text-negative", text: '- <meta name="description" content="Old description" />' },
      { cls: "text-positive", text: '+ <script type="application/ld+json">' },
      { cls: "text-positive", text: '+   { "@context": "https://schema.org", "@type": "SoftwareApplication" }' },
      { cls: "text-positive", text: "+ </script>" },
    ],
  },
  { kind: "log", time: "[06:18:01.835]", tag: "PR DISPATCHER", tagClass: "text-accent", text: ": Opened branch serpo/schema-fix" },
  { kind: "log", time: "[06:18:02.040]", tag: "CLOSED LOOP", tagClass: "text-positive", text: ": Verification passed. Telemetry active." },
];

function useTerminalStream(
  script: ScriptLine[],
  opts: { speed?: number; linePause?: number; diffPause?: number; loopPause?: number; startDelay?: number } = {}
) {
  const { speed = 22, linePause = 420, diffPause = 1500, loopPause = 4200, startDelay = 800 } = opts;
  const [step, setStep] = useState(-1);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (step < 0) {
      const t = setTimeout(() => setStep(0), startDelay);
      return () => clearTimeout(t);
    }
    if (step >= script.length) {
      const t = setTimeout(() => {
        setStep(0);
        setChars(0);
      }, loopPause);
      return () => clearTimeout(t);
    }
    const line = script[step];
    if (line.kind === "log") {
      if (chars < line.text.length) {
        const t = setTimeout(() => setChars((c) => c + 1), speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setStep((s) => s + 1);
        setChars(0);
      }, linePause);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setChars(0);
    }, diffPause);
    return () => clearTimeout(t);
  }, [step, chars, script, speed, linePause, diffPause, loopPause, startDelay]);

  return { step, chars };
}

function StreamLine({ line, chars, caret }: { line: ScriptLine; chars?: number; caret?: boolean }) {
  if (line.kind === "log") {
    const text = chars === undefined ? line.text : line.text.slice(0, chars);
    return (
      <div className="text-text-secondary">
        <span className="text-text-muted">{line.time}</span> <span className={line.tagClass}>{line.tag}</span>
        {text}
        {caret && <span className="terminal-caret">▍</span>}
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="my-2 p-2 rounded bg-background border border-border text-[10px] space-y-0.5"
    >
      <div className="text-text-muted flex items-center justify-between pb-1 border-b border-border">
        <span>{line.title}</span>
        <span className="text-accent">{line.badge}</span>
      </div>
      {line.lines.map((l, i) => (
        <div key={i} className={`${l.cls} font-mono`}>{l.text}</div>
      ))}
    </motion.div>
  );
}

function TerminalStream() {
  const { step, chars } = useTerminalStream(LOG_SCRIPT);
  const completed = step >= 0 ? LOG_SCRIPT.slice(0, step) : [];
  const current = step >= 0 && step < LOG_SCRIPT.length ? LOG_SCRIPT[step] : null;

  return (
    <div className="p-4 space-y-2.5 text-[11px] leading-relaxed min-h-[252px]">
      <div className="text-text-muted text-[10px]">
        # Engine Loop: SCAN → PRIORITIZE → EXECUTE → MEASURE
      </div>
      {completed.map((line, i) => (
        <StreamLine key={i} line={line} />
      ))}
      {current && <StreamLine line={current} chars={chars} caret />}
      {step >= LOG_SCRIPT.length && (
        <div className="text-text-secondary">
          <span className="text-accent">$</span> <span className="terminal-caret">▍</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Live telemetry stats (count up + jitter)
   ═══════════════════════════════════════════ */
function LiveStat({
  value,
  decimals = 0,
  suffix = "",
  jitter = 0,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  jitter?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  const settled = useRef(false);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else settled.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  useEffect(() => {
    if (!jitter) return;
    const id = setInterval(() => {
      if (settled.current) setDisplay(value + (Math.random() * 2 - 1) * jitter);
    }, 1800);
    return () => clearInterval(id);
  }, [jitter, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════
   3D tilt — terminal follows the cursor
   ═══════════════════════════════════════════ */
function TerminalTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 120, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }} onMouseMove={handleMove} onMouseLeave={reset}>
      <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}

function TerminalPanel() {
  return (
    <div className="terminal-panel relative rounded-xl border border-border shadow-2xl overflow-hidden font-mono text-xs animate-float">
      {/* Terminal Window Chrome (with light sweep) */}
      <div className="sheen h-9 px-3.5 bg-surface-muted border-b border-border flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-negative" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="w-2.5 h-2.5 rounded-full bg-positive" />
          </div>
          <span className="text-[11px] text-text-muted pl-1">serpo-telemetry-daemon --stream</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent">
          <span className="relative flex w-1.5 h-1.5">
            <span className="ping-ring absolute inline-flex w-full h-full rounded-full bg-accent" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
          <span>ACTIVE</span>
        </div>
      </div>

      <TerminalStream />

      {/* Oscilloscope Latency Strip */}
      <div className="px-4 py-2 border-t border-border bg-surface-muted/80 flex items-center justify-between text-[10px] text-text-muted tabular-nums">
        <div className="flex items-center gap-2">
          <span>
            P99: <LiveStat value={142} jitter={5} decimals={0} suffix="ms" />
          </span>
          <span>·</span>
          <span>ANOMALIES: 0</span>
        </div>
        <div className="flex items-center gap-1.5 text-accent">
          <span>
            GEO CITATIONS: <LiveStat value={68.4} decimals={1} suffix="%" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════ */
const HEAD_WORDS = ["Turn", "search", "data", "into"];

export default function Hero() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  /* Cursor spotlight (accent-tinted, theme-aware) */
  const mx = useMotionValue(50);
  const my = useMotionValue(20);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mx}% ${my}%, var(--accent-soft), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url.trim())}`);
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <section
      className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-80"
        style={{ background: spotlight }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ── Left Column: Precision Headline & Immediate Action (7 cols) ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-7 space-y-6">
          {/* Status Chip (with ping ring) */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-text-secondary"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="ping-ring absolute inline-flex w-full h-full rounded-full bg-accent" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
            </span>
            <span>CONTINUOUS SEARCH TELEMETRY · DISCOVER → PRIORITIZE → EXECUTE</span>
          </motion.div>

          {/* Precision Heading — word-by-word 3D rise + self-drawing underline */}
          <motion.h1
            variants={headlineContainer}
            className="font-serif text-4xl sm:text-5xl lg:text-[44px] font-normal text-text-primary tracking-tight leading-[1.12]"
            style={{ perspective: 800 }}
          >
            {HEAD_WORDS.map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block will-change-transform">
                {w}&nbsp;
              </motion.span>
            ))}
            <motion.span variants={wordVariants} className="relative inline-block italic text-accent">
              measurable
              <svg className="absolute -bottom-1.5 left-0 w-full h-2" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none" aria-hidden>
                <motion.path
                  d="M2 6 C 40 1, 80 1, 118 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 1.15, ease: "easeOut" }}
                />
              </svg>
            </motion.span>
            <motion.span variants={wordVariants} className="inline-block will-change-transform">
              &nbsp;growth.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
            SerpoAI discovers your highest-impact SEO and AI-search opportunities, predicts what
            matters with mathematical ICE scoring, and opens verified git pull requests that move
            actual conversions.
          </motion.p>

          {/* Input & Direct Action */}
          <motion.div variants={itemVariants} className="max-w-xl space-y-2.5">
            <form
              onSubmit={handleAnalyze}
              className="p-1 rounded-lg border border-border bg-surface shadow-xs flex flex-col sm:flex-row items-center gap-2 focus-within:border-border-strong focus-within:ring-1 focus-within:ring-accent/40 transition-colors"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 w-full bg-transparent">
                <Globe size={15} className="text-text-muted shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none font-mono"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary group w-full sm:w-auto h-9 px-4 text-xs font-semibold shrink-0 gap-1.5 cursor-pointer"
              >
                <span>Analyze</span>
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </form>

            {/* Quiet Links */}
            <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-sans text-text-muted">
              <a href="#platform-showcase" className="hover:text-text-primary transition-colors flex items-center gap-1">
                <span>Read the documentation</span>
                <span>→</span>
              </a>
              <a href="#growth-loop" className="hover:text-text-primary transition-colors flex items-center gap-1">
                <span>View architecture & pipelines</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>

          {/* Vector Badges — staggered chips */}
          <motion.div variants={containerVariants} className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-text-muted">
            <span className="uppercase text-text-secondary text-[10px] pr-1">PIPELINES:</span>
            {["SEO Signals", "GEO Citations", "ICE Regressor", "Cannibalization Graph", "Git PR Bot"].map((item) => (
              <motion.span
                key={item}
                variants={chipVariants}
                className="px-2 py-0.5 rounded-full border border-border bg-surface text-text-secondary text-[10px] transition-colors hover:border-border-strong hover:text-text-primary cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right Column: Live Instrument Terminal (5 cols) ── */}
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="lg:col-span-5"
        >
          <div className="relative">
            {/* Ambient accent glow — theme-aware */}
            <div
              aria-hidden
              className="absolute -inset-6 sm:-inset-8 rounded-[36px] bg-accent-soft blur-3xl opacity-60 dark:opacity-70 pointer-events-none"
            />
            <TerminalTilt>
              <TerminalPanel />
            </TerminalTilt>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="relative mt-14 flex flex-col items-center gap-1.5"
        aria-hidden
      >
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Scroll</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ChevronDown size={14} className="text-text-muted" />
        </motion.span>
      </motion.div>
    </section>
  );
}
