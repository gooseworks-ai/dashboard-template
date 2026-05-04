-- Competitor Intel schema — run once at install time (all statements are idempotent)

CREATE TABLE IF NOT EXISTS competitors (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT    NOT NULL,
  domain   TEXT    NOT NULL,
  linkedin TEXT
);

CREATE TABLE IF NOT EXISTS tracked_pages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  competitor_id INTEGER NOT NULL REFERENCES competitors(id),
  area          TEXT    NOT NULL,
  url           TEXT
);

CREATE TABLE IF NOT EXISTS change_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  competitor_id INTEGER NOT NULL REFERENCES competitors(id),
  area          TEXT    NOT NULL,
  type          TEXT    NOT NULL,
  snippet       TEXT,
  detected_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  alerted       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS weekly_briefs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  week_starting TEXT    NOT NULL,
  brief_path    TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_competitor ON change_events(competitor_id);
CREATE INDEX IF NOT EXISTS idx_events_detected   ON change_events(detected_at);
CREATE INDEX IF NOT EXISTS idx_events_area       ON change_events(area);
