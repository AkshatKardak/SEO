// assets.tsx — shared static data and SVG components

// ── HomeWave SVG ──────────────────────────────────────────────────────────────
export function HomeWave() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="w-full h-24 opacity-20"
      aria-hidden="true"
    >
      <path
        d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}

// ── Features Section Data ─────────────────────────────────────────────────────
import {
  ZapIcon,
  SearchIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  TrendingUpIcon,
  GlobeIcon,
} from "lucide-react";

export const homeFeaturesData = [
  {
    icon: <ZapIcon size={28} />,
    title: "Instant AI Audit",
    desc: "Get a full SEO audit in seconds powered by Gemini AI and real browser rendering.",
  },
  {
    icon: <SearchIcon size={28} />,
    title: "Keyword Analysis",
    desc: "Discover the keywords your page ranks for and uncover new ranking opportunities.",
  },
  {
    icon: <BarChart3Icon size={28} />,
    title: "Score Breakdown",
    desc: "Detailed scores for SEO, Performance, Accessibility, and Best Practices.",
  },
  {
    icon: <ShieldCheckIcon size={28} />,
    title: "Issue Detection",
    desc: "Automatically detect critical, major, and minor SEO issues with fix recommendations.",
  },
  {
    icon: <TrendingUpIcon size={28} />,
    title: "Rank Tracker",
    desc: "Track your keyword positions on Google daily and monitor ranking improvements over time.",
  },
  {
    icon: <GlobeIcon size={28} />,
    title: "Competitor Insights",
    desc: "Benchmark your site against competitors and identify gaps in your SEO strategy.",
  },
];

// ── How It Works Section Data ─────────────────────────────────────────────────
import { LinkIcon, BotIcon, ClipboardListIcon } from "lucide-react";

export const homeHowItWorksData = [
  {
    num: "01",
    icon: <LinkIcon size={26} />,
    title: "Enter Your URL",
    desc: "Paste any website URL into the analyzer. No sign-up required to get started.",
  },
  {
    num: "02",
    icon: <BotIcon size={26} />,
    title: "AI Analyzes Your Site",
    desc: "Our engine renders your page in a real browser and runs a deep AI-powered SEO audit.",
  },
  {
    num: "03",
    icon: <ClipboardListIcon size={26} />,
    title: "Get Your Report",
    desc: "Receive a comprehensive report with scores, issues, and actionable fix recommendations.",
  },
];
