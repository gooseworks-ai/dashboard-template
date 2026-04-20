import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.DASHBOARD_PORT || 3847);
const DB_URL = process.env.AGENT_DB_URL;
const DB_TOKEN = process.env.AGENT_DB_TOKEN;

const db =
  DB_URL && DB_TOKEN
    ? createClient({ url: DB_URL, authToken: DB_TOKEN })
    : null;

const app = express();
app.use(express.json());

// Query endpoint — runs arbitrary SQL against the agent's Turso DB.
// The sandbox is single-tenant (one agent), so this is scoped by infra, not by app logic.
app.get("/api/query", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Agent DB is not configured in this sandbox." });
  }
  const sql = String(req.query.sql || "");
  if (!sql) {
    return res.status(400).json({ error: "missing sql parameter" });
  }
  try {
    const result = await db.execute(sql);
    res.json({ rows: result.rows, columns: result.columns });
  } catch (err) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: Boolean(db) });
});

// Static SPA — must come AFTER /api routes.
const staticDir = path.join(__dirname, "dist", "public");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dashboard running on port ${PORT}`);
});
