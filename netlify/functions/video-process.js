'use strict';

// In production, this function enqueues a video processing job using a task queue
// (e.g., AWS SQS, BullMQ, or Inngest) and returns a job ID for status polling.
// The actual processing is done asynchronously by worker functions.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ESTIMATED_TIMES = {
  1: '1-2 minutes',
  2: '2-3 minutes',
  3: '3-5 minutes',
  4: '5-8 minutes',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { videoUrl, operations = [] } = payload;

  if (!videoUrl) {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'videoUrl is required' }),
    };
  }

  const validOps = ['highlights', 'subtitles', 'reframe', 'thumbnail'];
  const filteredOps = operations.filter((op) => validOps.includes(op));

  const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const estimatedTime = ESTIMATED_TIMES[filteredOps.length] || '2-3 minutes';

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId,
      status: 'queued',
      operations: filteredOps,
      estimatedTime,
      queuedAt: new Date().toISOString(),
    }),
  };
};
