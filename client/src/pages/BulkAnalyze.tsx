import { useState } from "react";
import axios from "axios";

interface BulkResult {
  url: string;
  title?: string;
  seoScore: number;
  accessibilityScore: number;
  hasViewport?: boolean;
  hasCanonical?: boolean;
  imagesMissingAlt?: number;
  h1Count?: number;
  error?: string;
}

export default function BulkAnalyze() {
  const [urls, setUrls] = useState(["", "", ""]);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [loading, setLoading] = useState(false);

  const updateUrl = (i: number, val: string) => {
    const copy = [...urls];
    copy[i] = val;
    setUrls(copy);
  };

  const addUrl = () => urls.length < 5 && setUrls([...urls, ""]);

  const analyze = async () => {
    const valid = urls.filter((u) => u.trim());
    if (!valid.length) return;
    setLoading(true);
    setResults([]);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seo/analyze-bulk`,
        { urls: valid },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResults(data.analyses);
    } catch (e: any) {
      alert(e.response?.data?.message || "Bulk analysis failed");
    }
    setLoading(false);
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bulk URL Analyzer</h1>
      <p className="text-gray-500 text-sm mb-6">Analyze up to 5 URLs side-by-side</p>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-col gap-3">
          {urls.map((u, i) => (
            <input
              key={i}
              value={u}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder={`https://example${i + 1}.com`}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          {urls.length < 5 && (
            <button onClick={addUrl} className="text-sm text-indigo-600 hover:underline">
              + Add URL
            </button>
          )}
          <button
            onClick={analyze}
            disabled={loading}
            className="ml-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze All"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["URL", "SEO Score", "Accessibility", "Viewport", "Canonical", "Missing Alt", "H1s"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((r) => (
                <tr key={r.url} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 max-w-[200px] truncate font-medium text-gray-800 dark:text-gray-200">
                    {r.error ? <span className="text-red-500">{r.url} ❌</span> : r.url}
                  </td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(r.seoScore)}`}>{r.seoScore}</td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(r.accessibilityScore)}`}>{r.accessibilityScore}</td>
                  <td className="px-4 py-3">{r.hasViewport ? "✅" : "❌"}</td>
                  <td className="px-4 py-3">{r.hasCanonical ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.imagesMissingAlt ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.h1Count ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}