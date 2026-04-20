export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  columns: string[];
}

/**
 * Runs a SQL query against the sandbox's /api/query endpoint.
 * Same origin as the SPA — no CORS.
 */
export async function runQuery<T = Record<string, unknown>>(
  sql: string,
): Promise<QueryResult<T>> {
  const res = await fetch(`/api/query?sql=${encodeURIComponent(sql)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}
