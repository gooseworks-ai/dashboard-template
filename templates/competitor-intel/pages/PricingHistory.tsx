import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface PricingRow {
  id: number;
  competitor_name: string;
  type: string;
  snippet: string;
  detected_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function PricingHistory() {
  const [rows, setRows] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<PricingRow>(`
      SELECT
        e.id,
        c.name AS competitor_name,
        e.type,
        e.snippet,
        e.detected_at
      FROM change_events e
      JOIN competitors c ON c.id = e.competitor_id
      WHERE e.area = 'pricing_pages'
      ORDER BY c.name, e.detected_at DESC
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

  const byCompetitor = rows.reduce<Record<string, PricingRow[]>>((acc, r) => {
    (acc[r.competitor_name] ??= []).push(r);
    return acc;
  }, {});

  const competitors = Object.keys(byCompetitor).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-medium text-stone-900">Pricing History</h1>

      {rows.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500">
          No pricing changes detected yet.
        </div>
      ) : (
        <div className="space-y-8">
          {competitors.map((name) => (
            <div key={name}>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                {name}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200/50">
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-normal text-stone-400">
                        Detail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCompetitor[name].map((r) => (
                      <tr
                        key={r.id}
                        className="group h-12 border-b border-stone-100/50 transition-colors hover:bg-stone-50"
                      >
                        <td className="whitespace-nowrap px-4 text-stone-500 tabular-nums">
                          {formatDate(r.detected_at)}
                        </td>
                        <td className="whitespace-nowrap px-4 text-stone-600">
                          {r.type}
                        </td>
                        <td className="px-4 text-stone-700">{r.snippet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
