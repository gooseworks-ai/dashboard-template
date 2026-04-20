import { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";
import { runQuery } from "../lib/api";

interface TableRow {
  name: string;
}

export default function Overview() {
  const [tables, setTables] = useState<TableRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runQuery<TableRow>(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
    )
      .then((res) => setTables(res.rows))
      .catch((err) => setError(String(err.message || err)));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-normal text-stone-900">Overview</h1>
        <p className="mt-0.5 text-xs text-stone-500">
          Ask the agent to customize this page for your data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label="Tables"
          value={tables ? tables.length : "—"}
          hint="in agent database"
        />
        <MetricCard label="Example metric" value="0" hint="placeholder" />
        <MetricCard label="Another metric" value="0" hint="placeholder" />
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="mb-2 text-xs font-medium text-stone-600">
          Tables in this agent&apos;s database
        </div>
        {error && (
          <div className="text-xs text-red-600">Error: {error}</div>
        )}
        {!error && !tables && (
          <div className="text-xs text-stone-400">Loading…</div>
        )}
        {tables && tables.length === 0 && (
          <div className="text-xs text-stone-400">No tables yet.</div>
        )}
        {tables && tables.length > 0 && (
          <ul className="flex flex-col gap-1">
            {tables.map((t) => (
              <li key={t.name} className="text-xs text-stone-700">
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
