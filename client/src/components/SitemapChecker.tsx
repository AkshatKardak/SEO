import { useState } from "react";
import axios from "axios";

export default function SitemapChecker({ defaultUrl }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/seo/sitemap-check?url=${encodeURIComponent(url)}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setResult(data.result);
    setLoading(false);
  };

  const StatusBadge = ({ ok }: { ok: boolean }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
      {ok ? "✓ Found" : "✗ Missing"}
    </span>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sitemap & Robots.txt Checker</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={check}
          disabled={loading || !url}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">robots.txt</span>
            <div className="flex items-center gap-2">
              <StatusBadge ok={result.robots.exists} />
              {result.robots.sitemapInRobots && (
                <span className="text-xs text-green-600">Sitemap referenced ✓</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">sitemap.xml</span>
            <StatusBadge ok={result.sitemap.exists} />
          </div>

          {result.recommendations.length > 0 && (
            <div className="mt-3 space-y-2">
              {result.recommendations.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <span>⚠️</span> {r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}