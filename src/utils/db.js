/**
 * Database utilities for job management.
 *
 * Requires the DATABASE_URL environment variable pointing to a PostgreSQL instance.
 * Schema (run once to initialise):
 *
 *   CREATE TABLE video_jobs (
 *     id          TEXT PRIMARY KEY,
 *     status      TEXT NOT NULL DEFAULT 'pending',
 *     input_url   TEXT,
 *     clip_urls   JSONB,
 *     error       TEXT,
 *     created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *     updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *   );
 */

const { Pool } = require('pg');

let pool;

/**
 * Returns a shared pg connection pool.
 * @returns {import('pg').Pool}
 */
function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * Creates a new video processing job with status 'pending'.
 * @param {string} jobId  - UUID for the job
 * @param {string} inputUrl - S3 URL of the uploaded source video
 * @returns {Promise<object>} The created job row
 */
async function createJob(jobId, inputUrl) {
  const result = await getPool().query(
    `INSERT INTO video_jobs (id, status, input_url)
     VALUES ($1, 'pending', $2)
     RETURNING *`,
    [jobId, inputUrl]
  );
  return result.rows[0];
}

/**
 * Retrieves a job by its ID.
 * @param {string} jobId
 * @returns {Promise<object|null>}
 */
async function getJob(jobId) {
  const result = await getPool().query(
    'SELECT * FROM video_jobs WHERE id = $1',
    [jobId]
  );
  return result.rows[0] || null;
}

/**
 * Marks a job as 'processing'.
 * @param {string} jobId
 * @returns {Promise<object>}
 */
async function markJobProcessing(jobId) {
  const result = await getPool().query(
    `UPDATE video_jobs
     SET status = 'processing', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [jobId]
  );
  return result.rows[0];
}

/**
 * Marks a job as 'done' and stores the generated clip URLs.
 * @param {string} jobId
 * @param {string[]} clipUrls - Array of public S3 URLs for the generated clips
 * @returns {Promise<object>}
 */
async function markJobDone(jobId, clipUrls) {
  const result = await getPool().query(
    `UPDATE video_jobs
     SET status = 'done', clip_urls = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [jobId, clipUrls]
  );
  return result.rows[0];
}

/**
 * Marks a job as 'failed' and records the error message.
 * @param {string} jobId
 * @param {string} errorMessage
 * @returns {Promise<object>}
 */
async function markJobFailed(jobId, errorMessage) {
  const result = await getPool().query(
    `UPDATE video_jobs
     SET status = 'failed', error = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [jobId, errorMessage]
  );
  return result.rows[0];
}

module.exports = { createJob, getJob, markJobProcessing, markJobDone, markJobFailed };
