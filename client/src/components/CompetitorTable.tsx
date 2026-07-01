interface Competitor {
  position: number;
  url: string;
  domain: string;
  title: string;
  snippet: string;
}

interface Props {
  yourDomain: string;
  yourPosition: number | null;
  competitors: Competitor[];
}

export default function CompetitorTable({ yourDomain, yourPosition, competitors }: Props) {
  const top3 = competitors.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Competitor Comparison</h3>
        <p className="text-xs text-gray-500 mt-0.5">You vs. top 3 ranking pages</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">Domain</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">Snippet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* YOUR ROW */}
            <tr className="bg-indigo-50 dark:bg-indigo-900/20">
              <td className="px-4 py-3 font-bold text-indigo-600">
                {yourPosition ? `#${yourPosition}` : "Not ranked"}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400">
                  ⭐ {yourDomain}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 italic" colSpan={2}>Your tracked site</td>
            </tr>

            {top3.map((c) => (
              <tr key={c.position} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  #{c.position}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {c.domain}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                  {c.title || "—"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-sm truncate">
                  {c.snippet || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}