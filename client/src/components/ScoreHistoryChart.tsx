import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

interface HistoryPoint {
  date: string;
  seo: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
}

export default function ScoreHistoryChart({ url }: { url?: string }) {
  const [data, setData] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const params = url ? `?url=${encodeURIComponent(url)}` : "";
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seo/score-history${params}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setData(
        data.history.map((h: any) => ({
          date: new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          seo: h.scores.seo,
          performance: h.scores.performance,
          accessibility: h.scores.accessibility,
          bestPractices: h.scores.bestPractices,
        }))
      );
    };
    fetch();
  }, [url]);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">SEO Score History</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="seo" stroke="#6366f1" strokeWidth={2} dot={false} name="SEO" />
          <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} dot={false} name="Performance" />
          <Line type="monotone" dataKey="accessibility" stroke="#f59e0b" strokeWidth={2} dot={false} name="Accessibility" />
          <Line type="monotone" dataKey="bestPractices" stroke="#3b82f6" strokeWidth={2} dot={false} name="Best Practices" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}