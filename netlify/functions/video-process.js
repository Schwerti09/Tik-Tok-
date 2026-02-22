exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode nicht erlaubt.' }) };

  try {
    const { filename, options = [] } = JSON.parse(event.body || '{}');

    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const job = {
      jobId,
      status: 'queued',
      filename: filename || 'video.mp4',
      options,
      estimatedSeconds: options.length * 30,
      createdAt: new Date().toISOString(),
    };

    return { statusCode: 202, headers, body: JSON.stringify(job) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
