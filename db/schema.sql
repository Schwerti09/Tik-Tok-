-- Video processing jobs table.
-- Run this script once against your PostgreSQL database to set up the schema.

CREATE TABLE IF NOT EXISTS video_jobs (
  id          TEXT PRIMARY KEY,
  status      TEXT        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  input_url   TEXT,
  clip_urls   JSONB,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast status-based lookups
CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_jobs (status);
