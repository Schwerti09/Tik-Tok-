'use strict';

// In production, this function would call a real trends API (e.g., TikTok Research API,
// Chartmetric, or a custom scraper) to return live trending data.
// Currently it returns realistic mock data for demonstration.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const MOCK_TRENDS = {
  tiktok: [
    { id: 't1', name: '#MorningRoutine', category: 'Lifestyle', growth: '+234%', platform: 'tiktok', hashtags: ['#morning', '#routine', '#wellness'], sounds: ['Lo-fi Beats Vol.3'] },
    { id: 't2', name: 'Get Ready With Me', category: 'Beauty', growth: '+187%', platform: 'tiktok', hashtags: ['#grwm', '#beauty', '#makeup'], sounds: ['Trending Audio 2024'] },
    { id: 't3', name: '#FoodTok', category: 'Food', growth: '+156%', platform: 'tiktok', hashtags: ['#foodtok', '#recipe', '#cooking'], sounds: ['Kitchen Vibes'] },
    { id: 't4', name: 'Day in My Life', category: 'Vlog', growth: '+112%', platform: 'tiktok', hashtags: ['#dayinmylife', '#vlog', '#lifestyle'], sounds: ['Upbeat Indie'] },
    { id: 't5', name: 'Outfit of the Day', category: 'Fashion', growth: '+91%', platform: 'tiktok', hashtags: ['#ootd', '#fashion', '#style'], sounds: ['Trendy Pop 2024'] },
  ],
  instagram: [
    { id: 'i1', name: 'POV Aesthetic', category: 'Aesthetic', growth: '+143%', platform: 'instagram', hashtags: ['#pov', '#aesthetic', '#vibes'], sounds: ['Dreamy Pop'] },
    { id: 'i2', name: '#WorkoutCheck', category: 'Fitness', growth: '+98%', platform: 'instagram', hashtags: ['#workout', '#gym', '#fitness'], sounds: ['Gym Motivation Beat'] },
    { id: 'i3', name: 'Minimalist Lifestyle', category: 'Lifestyle', growth: '+76%', platform: 'instagram', hashtags: ['#minimalist', '#lifestyle', '#aesthetic'], sounds: ['Calm Acoustic'] },
  ],
  youtube: [
    { id: 'y1', name: '#StudyWithMe', category: 'Education', growth: '+128%', platform: 'youtube', hashtags: ['#study', '#focus', '#lofi'], sounds: ['Study Lofi Mix'] },
    { id: 'y2', name: 'Productivity Vlog', category: 'Productivity', growth: '+88%', platform: 'youtube', hashtags: ['#productivity', '#vlog', '#routine'], sounds: ['Motivational Ambient'] },
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

  const { platform = 'tiktok', timeframe = '24h' } = event.queryStringParameters || {};
  const validPlatforms = ['tiktok', 'instagram', 'youtube', 'all'];
  const resolvedPlatform = validPlatforms.includes(platform) ? platform : 'tiktok';

  let trends;
  if (resolvedPlatform === 'all') {
    trends = [...MOCK_TRENDS.tiktok, ...MOCK_TRENDS.instagram, ...MOCK_TRENDS.youtube];
  } else {
    trends = MOCK_TRENDS[resolvedPlatform] || MOCK_TRENDS.tiktok;
  }

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ trends, platform: resolvedPlatform, timeframe, fetchedAt: new Date().toISOString() }),
  };
};
