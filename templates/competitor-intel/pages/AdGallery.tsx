import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface AdRow {
  id: number;
  competitor_name: string;
  type: string;
  snippet: string;
  detected_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function AdGallery() {
  const [rows, setRows] = useState<AdRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<AdRow>(`
      SELECT
        e.id,
        c.name AS competitor_name,
        e.type,
        e.snippet,
        e.detected_at
      FROM change_events e
      JOIN competitors c ON c.id = e.competitor_id
      WHERE e.area = 'paid_ads'
      ORDER BY e.detected_at DESC
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

  const byCompetitor = rows.reduce<Record<string, AdRow[]>>((acc, r) => {
    (acc[r.competitor_name] ??= []).push(r);
    return acc;
  }, {});

  const competitors = Object.keys(byCompetitor).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-medium text-stone-900">Ad Gallery</h1>

      {rows.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500">
          No ad activity detected yet.
        </div>
      ) : (
        <div className="space-y-8">
          {competitors.map((name) => (
            <div key={name}>
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-stone-400">
                {name}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {byCompetitor[name].map((ad) => (
                  <div
                    key={ad.id}
                    className="rounded-xl border border-stone-200 bg-white p-4"
                  >
                    <div className="text-sm text-stone-700 leading-normal">
                      {ad.snippet}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-stone-400">{ad.type}</span>
                      <span className="text-xs text-stone-400 tabular-nums">
                        {formatDate(ad.detected_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
