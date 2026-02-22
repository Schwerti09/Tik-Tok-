'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// In production, scheduled posts would be stored in a database (e.g., Supabase).
const MOCK_POSTS = [
  { id: '1', platform: 'TikTok', caption: 'My morning routine ☀️ #morningroutine', scheduledAt: new Date(Date.now() + 3 * 3600000).toISOString(), status: 'scheduled' },
  { id: '2', platform: 'Instagram', caption: 'Behind the scenes 🎥 #creator', scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(), status: 'scheduled' },
];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const responseHeaders = { ...CORS_HEADERS, 'Content-Type': 'application/json' };

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ posts: MOCK_POSTS }),
    };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const { platform, caption, scheduledAt } = body;
    if (!platform || !caption || !scheduledAt) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: 'platform, caption, and scheduledAt are required' }),
      };
    }

    const newPost = {
      id: 'post_' + Date.now(),
      platform,
      caption,
      scheduledAt,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers: responseHeaders,
      body: JSON.stringify({ post: newPost }),
    };
  }

  return {
    statusCode: 405,
    headers: responseHeaders,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
