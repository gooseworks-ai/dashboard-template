# Gooseworks Dashboard Template

This is the starter template cloned by the `create-dashboard` skill when a Gooseworks agent builds a dashboard inside its sandbox.

It's a **React + Vite + Tailwind SPA** served by a **single Express process** that also exposes `/api/*` routes connected to the agent's Turso database. One port, one origin, no CORS.

## Architecture Invariant

**Single port. Always.**

Sandbox preview URLs give each port its own subdomain. If the SPA runs on port A and the API on port B, they're cross-origin and CORS becomes a problem. This template side-steps the issue by having Express serve both the built SPA (`dist/public`) and the `/api/*` routes on port `3847`.

Do not split frontend and backend onto different ports. Do not add a dev server (Vite dev). The agent should only ever run:

```
npx vite build      # produces dist/public/
node server.js      # serves SPA + API on port 3847
```

## File Layout

```
dashboard-template/
├── package.json          # react, recharts, tailwindcss, vite, express, @libsql/client
├── vite.config.ts        # outputs to dist/public
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── index.html            # SPA entry
├── server.js             # Express: /api/query + static SPA
├── src/
│   ├── main.tsx          # React root
│   ├── App.tsx           # Router + layout shell
│   ├── index.css         # Tailwind directives
│   ├── db.ts             # Turso client helper (used server-side only)
│   ├── lib/api.ts        # Thin fetch wrapper for /api/*
│   ├── pages/Overview.tsx  # Example page with metric cards
│   └── components/
│       ├── Layout.tsx
│       ├── MetricCard.tsx
│       └── Chart.tsx
```

## Environment Variables

The sandbox sets these automatically when the agent has a Turso DB:

- `AGENT_DB_URL` — Turso libSQL endpoint
- `AGENT_DB_TOKEN` — auth token

If either is missing, `/api/query` returns 503.

## How the Skill Uses This

The `create-dashboard` skill:

1. Clones this repo to `/home/daytona/dashboard/` (outside the S3 FUSE mount).
2. Runs `npm install` (node_modules stay local, never sync to S3).
3. Asks the user what data they want to see.
4. Lists tables in the Turso DB via the `query_database` MCP tool.
5. Modifies `src/pages/` and `src/App.tsx` to build the requested UI.
6. Adds any extra `/api/*` routes to `server.js` for specific SQL the UI needs.
7. Runs `npx vite build` + `node server.js &`.
8. Mirrors the source (not `node_modules`) to `/home/daytona/workspace/dashboard-src/` so it survives sandbox restarts.

## Iteration Loop

When the user asks for changes ("add a churn chart"), the agent:

1. Edits the relevant files in `/home/daytona/dashboard/`.
2. Kills the running server: `pkill -f "node server.js"`.
3. Rebuilds: `npx vite build`.
4. Restarts: `node server.js &`.
5. Mirrors updated source to S3.

The user sees the refreshed dashboard in the **App** tab (the iframe auto-reloads after each assistant turn).
