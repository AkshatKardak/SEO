import { useEffect, useState } from "react";
import axios from "axios";

interface Metrics { lcp: string; fid: string; cls: string; fcp: string; ttfb: string; speedIndex: string; }
interface Scores { performance: number; accessibility: number; seo: number; bestPractices: number; }

export default function PageSpeedWidget({ url }: { url: string }) {
  const [data, setData] = useState<{ scores: Scores; metrics: Metrics } | null>(null);
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data: d } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seo/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setData(d);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (url) fetch(); }, [url, strategy]);

  const ring = (score: number) => score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">PageSpeed Insights</h3>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(["mobile", "desktop"] as const).map((s) => (
            <button key={s} onClick={() => setStrategy(s)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${strategy === s ? "bg-white dark:bg-gray-600 shadow font-medium" : "text-gray-500"}`}>
              {s === "mobile" ? "📱 Mobile" : "🖥 Desktop"}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400 text-center py-4">Running Lighthouse audit...</p>}

      {data && !loading && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {Object.entries(data.scores).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-1">
                  <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={ring(val)} strokeWidth="3"
                      strokeDasharray={`${val} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: ring(val) }}>{val}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{key.replace("bestPractices", "Best Practices")}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(data.metrics).map(([key, val]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{key.toUpperCase()}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}