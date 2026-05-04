import { useEffect, useState } from "react";
import { runQuery } from "../lib/api";

interface Competitor {
  id: number;
  name: string;
  domain: string;
  events_7d: number;
  events_prior_7d: number;
}

interface Event {
  competitor_id: number;
  area: string;
  snippet: string;
  detected_at: string;
}

const AREA_LABELS: Record<string, string> = {
  product_changelog: "Shipped",
  hiring: "Hiring",
  paid_ads: "Ads",
  pricing_pages: "Pricing",
  blog: "Blog",
  social_posts: "Social",
};

const AREA_ORDER = [
  "product_changelog",
  "hiring",
  "paid_ads",
  "pricing_pages",
  "blog",
  "social_posts",
];

function activityDelta(current: number, prior: number): string | null {
  if (prior === 0 && current === 0) return null;
  if (prior === 0) return `+${current} new`;
  const diff = current - prior;
  if (diff === 0) return "same as last week";
  return diff > 0 ? `+${diff} vs last week` : `${diff} vs last week`;
}

export default function CompetitorOverview() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      runQuery<Competitor>(`
        SELECT
          c.id,
          c.name,
          c.domain,
          COUNT(CASE WHEN e.detected_at >= date('now', '-7 days')  THEN 1 END) AS events_7d,
          COUNT(CASE WHEN e.detected_at >= date('now', '-14 days')
                      AND e.detected_at <  date('now', '-7 days')  THEN 1 END) AS events_prior_7d
        FROM competitors c
        LEFT JOIN change_events e ON e.competitor_id = c.id
        GROUP BY c.id, c.name, c.domain
        ORDER BY events_7d DESC, c.name
      `),
      runQuery<Event>(`
        SELECT competitor_id, area, snippet, detected_at
        FROM change_events
        WHERE detected_at >= date('now', '-7 days')
        ORDER BY detected_at DESC
      `),
    ])
      .then(([compResult, evtResult]) => {
        setCompetitors(compResult.rows);
        setEvents(evtResult.rows);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-12 text-sm text-stone-400">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center py-12 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (competitors.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="max-w-sm text-center">
          <p className="text-sm text-stone-500">No competitors tracked yet.</p>
          <p className="mt-2 text-xs text-stone-400">
            The daily watch will populate this after the first run.
          </p>
        </div>
      </div>
    );
  }

  const eventsByCompetitor = events.reduce<Record<number, Event[]>>((acc, e) => {
    (acc[e.competitor_id] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-sm font-medium text-stone-900">Competitor Overview</h1>
        <span className="text-xs text-stone-400">Last 7 days</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {competitors.map((c) => {
          const compEvents = eventsByCompetitor[c.id] ?? [];
          const byArea = AREA_ORDER.reduce<Record<string, Event[]>>((acc, area) => {
            const filtered = compEvents.filter((e) => e.area === area);
            if (filtered.length) acc[area] = filtered;
            return acc;
          }, {});
          const d = activityDelta(Number(c.events_7d), Number(c.events_prior_7d));

          return (
            <div
              key={c.id}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-stone-900">{c.name}</div>
                  <div className="mt-0.5 text-xs text-stone-400">{c.domain}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-normal text-stone-900 tabular-nums">
                    {c.events_7d}
                  </div>
                  {d && <div className="mt-0.5 text-xs text-stone-400">{d}</div>}
                </div>
              </div>

              {Object.keys(byArea).length === 0 ? (
                <p className="mt-4 text-sm text-stone-400">
                  No changes detected this week.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {AREA_ORDER.filter((a) => byArea[a]).map((area) => (
                    <div key={area}>
                      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
                        {AREA_LABELS[area] ?? area}
                      </div>
                      <ul className="space-y-1.5">
                        {byArea[area].slice(0, 3).map((e, i) => (
                          <li key={i} className="text-sm leading-normal text-stone-700">
                            — {e.snippet}
                          </li>
                        ))}
                        {byArea[area].length > 3 && (
                          <li className="text-xs text-stone-400">
                            +{byArea[area].length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
