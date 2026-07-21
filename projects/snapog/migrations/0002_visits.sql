-- SnapOG D1 Schema
-- Migration 0002: lightweight visit analytics on content pages (/, /play, /gallery)
--
-- One row per recorded visit, written fire-and-forget via ctx.waitUntil so the
-- page render is never blocked. Smoke/monitoring traffic is filtered in-app by
-- User-Agent (snapog-smoke) before insert, so this table only reflects humans.
-- ponytail: D1 row-per-visit is fine at low volume; swap to CF Analytics Engine
-- (writeDataPoint) if write rate on a hot path ever becomes a concern.

CREATE TABLE IF NOT EXISTS visits (
  id          TEXT PRIMARY KEY,
  path        TEXT NOT NULL,           -- '/', '/play', '/gallery'
  country     TEXT,                    -- CF cf.country (ISO-2), nullable
  referrer    TEXT,                    -- Referer header, truncated to 200 chars, nullable
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
