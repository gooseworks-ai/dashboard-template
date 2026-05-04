import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface FeedRow {
  competitor_name: string;
  area: string;
  type: string;
  snippet: string;
  detected_at: string;
}

const AREA_LABELS: Record<string, string> = {
  product_changelog: "Product",
  hiring: "Hiring",
  paid_ads: "Ads",
  pricing_pages: "Pricing",
  blog: "Blog",
  social_posts: "Social",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function groupByDate(rows: FeedRow[]) {
  const groups: Record<string, FeedRow[]> = {};
  for (const row of rows) {
    const day = row.detected_at.slice(0, 10);
    (groups[day] ??= []).push(row);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function ChangeFeed() {
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<FeedRow>(`
      SELECT
        c.name  AS competitor_name,
        e.area,
        e.type,
        e.snippet,
        e.detected_at
      FROM change_events e
      JOIN competitors c ON c.id = e.competitor_id
      ORDER BY e.detected_at DESC
      LIMIT 300
    `)
      .then((r) => {
        setRows(r.rows);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-stone-400">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-red-500">
        {error}
      </div>
    );
  }

  const groups = groupByDate(rows);

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-medium text-stone-900">Change Feed</h1>

      {groups.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500">
          No changes recorded yet. The daily watch will populate this after the first run.
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([day, dayRows]) => (
            <div key={day}>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                {formatDate(day)}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {dayRows.map((row, i) => (
                      <tr
                        key={i}
                        className="group h-10 border-b border-stone-100/50 transition-colors hover:bg-stone-50"
                      >
                        <td className="whitespace-nowrap px-4 font-medium text-stone-900 w-40">
                          {row.competitor_name}
                        </td>
                        <td className="whitespace-nowrap px-4 text-stone-500 w-24">
                          {AREA_LABELS[row.area] ?? row.area}
                        </td>
                        <td className="px-4 text-stone-700">
                          {row.snippet}
                        </td>
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
