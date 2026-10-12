-- migrations/0001_init.sql
-- Cloudflare D1 / SQLite database schema for GENESIS 2026 (Section 7.3)

CREATE TABLE IF NOT EXISTS registrations (
  id            TEXT PRIMARY KEY,                 -- ULID, generated server-side
  idem_key      TEXT NOT NULL UNIQUE,             -- from the Idempotency-Key header
  track         TEXT NOT NULL CHECK (track IN ('main', 'vr')),
  team_name     TEXT NOT NULL,
  leader_name   TEXT NOT NULL,
  leader_email  TEXT NOT NULL,
  leader_phone  TEXT NOT NULL,
  college       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  checked_in_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (track, leader_email)
);

CREATE TABLE IF NOT EXISTS team_members (
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  name            TEXT NOT NULL,
  email           TEXT,
  PRIMARY KEY (registration_id, position)
);

CREATE TABLE IF NOT EXISTS notify_signups (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  consent_at TEXT NOT NULL,
  source     TEXT NOT NULL CHECK (source IN ('toast', 'menu', 'footer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS announcements (
  id        TEXT PRIMARY KEY,
  text      TEXT NOT NULL,
  link      TEXT,
  starts_at TEXT NOT NULL,
  ends_at   TEXT
);
