/**
 * Netlify Function: GET /api/videos/status/:jobId
 *
 * Allows a client to poll the processing status of a video job.
 *
 * Response shape:
 *   { jobId, status, inputUrl, clipUrls, error, createdAt, updatedAt }
 *
 * Possible status values:
 *   'pending'    - Job created; processing not yet started
 *   'processing' - Background function is actively working
 *   'done'       - Processing complete; clipUrls contains the generated clips
 *   'failed'     - Processing failed; error contains the reason
 */

const { getJob } = require('../../src/utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // The jobId is the last path segment: /api/videos/status/<jobId>
  const jobId = event.path.split('/').pop();

  if (!jobId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'jobId is required' }),
    };
  }

  try {
    const job = await getJob(jobId);

    if (!job) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Job not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        status: job.status,
        inputUrl: job.input_url,
        clipUrls: job.clip_urls || [],
        error: job.error || null,
        createdAt: job.created_at,
        updatedAt: job.updated_at,
      }),
    };
  } catch (err) {
    console.error('video-status error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
