import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface HireRow {
  id: number;
  competitor_name: string;
  type: string;
  snippet: string;
  detected_at: string;
  is_big_name: number;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function HiringTracker() {
  const [rows, setRows] = useState<HireRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<HireRow>(`
      SELECT
        e.id,
        c.name  AS competitor_name,
        e.type,
        e.snippet,
        e.detected_at,
        CASE WHEN e.type = 'big_name_hire' THEN 1 ELSE 0 END AS is_big_name
      FROM change_events e
      JOIN competitors c ON c.id = e.competitor_id
      WHERE e.area = 'hiring'
      ORDER BY is_big_name DESC, e.detected_at DESC
      LIMIT 200
    `)
      .then((r) => { setRows(r.rows); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-sm text-stone-400">Loading…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center py-12 text-sm text-red-500">{error}</div>;
  }

  const bigNames = rows.filter((r) => r.is_big_name);
  const rest = rows.filter((r) => !r.is_big_name);

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-medium text-stone-900">Hiring Tracker</h1>

      {rows.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500">
          No hiring activity detected yet.
        </div>
      ) : (
        <div className="space-y-8">
          {bigNames.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                Notable hires
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200/50">
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">Competitor</th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400">Role / detail</th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">Detected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bigNames.map((r) => (
                      <tr key={r.id} className="group h-12 border-b border-stone-100/50 transition-colors hover:bg-stone-50">
                        <td className="whitespace-nowrap px-4 font-medium text-stone-900">{r.competitor_name}</td>
                        <td className="px-4 text-stone-700">{r.snippet}</td>
                        <td className="whitespace-nowrap px-4 text-stone-500 tabular-nums">{formatDate(r.detected_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div>
              {bigNames.length > 0 && (
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                  All roles
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200/50">
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">Competitor</th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400">Role / detail</th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">Detected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((r) => (
                      <tr key={r.id} className="group h-12 border-b border-stone-100/50 transition-colors hover:bg-stone-50">
                        <td className="whitespace-nowrap px-4 font-medium text-stone-900">{r.competitor_name}</td>
                        <td className="px-4 text-stone-700">{r.snippet}</td>
                        <td className="whitespace-nowrap px-4 text-stone-500 tabular-nums">{formatDate(r.detected_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
