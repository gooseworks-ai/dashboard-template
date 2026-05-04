import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface Brief {
  id: number;
  week_starting: string;
  brief_path: string;
}

function formatWeek(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function WeeklyBriefs() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<Brief>(
      "SELECT id, week_starting, brief_path FROM weekly_briefs ORDER BY week_starting DESC"
    )
      .then((r) => {
        setBriefs(r.rows);
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

  return (
    <div className="space-y-6">
      <h1 className="text-sm font-medium text-stone-900">Weekly Briefs</h1>

      {briefs.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500">
          No briefs yet. The first brief will appear after Monday's run.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200/50">
                <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">
                  Week of
                </th>
                <th className="px-4 py-2 text-left text-xs font-normal text-stone-400 whitespace-nowrap">
                  File
                </th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((b) => (
                <tr
                  key={b.id}
                  className="group h-12 border-b border-stone-100/50 transition-colors hover:bg-stone-50"
                >
                  <td className="whitespace-nowrap px-4 font-medium text-stone-900">
                    {formatWeek(b.week_starting)}
                  </td>
                  <td className="px-4 text-stone-500 font-mono text-xs">
                    {b.brief_path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
