'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const MOCK_ANALYTICS = {
  kpi: [
    { label: 'Total Views', value: 2840000, prev: 2400000, icon: '👁️' },
    { label: 'Link Clicks', value: 84200, prev: 70000, icon: '🔗' },
    { label: 'Conversions', value: 3120, prev: 2800, icon: '💰' },
    { label: 'Revenue (UTM)', value: '$12,480', prev: '$10,200', icon: '💵', raw: true },
  ],
  posts: [
    { title: 'Morning Routine 2024', platform: 'TikTok', views: 520000, clicks: 14200, ctr: '2.73%', date: '2024-01-15' },
    { title: 'Productivity System Deep Dive', platform: 'YouTube', views: 210000, clicks: 9800, ctr: '4.67%', date: '2024-01-12' },
    { title: 'OOTD – Minimal Winter Fit', platform: 'Instagram', views: 180000, clicks: 6200, ctr: '3.44%', date: '2024-01-10' },
    { title: 'Coffee Shop Study Vlog', platform: 'TikTok', views: 340000, clicks: 8900, ctr: '2.62%', date: '2024-01-08' },
    { title: 'How I Plan My Week', platform: 'Instagram', views: 95000, clicks: 5100, ctr: '5.37%', date: '2024-01-05' },
  ],
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { startDate, endDate } = event.queryStringParameters || {};

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...MOCK_ANALYTICS, startDate, endDate, fetchedAt: new Date().toISOString() }),
  };
};
