const posts = [
  { id: 1, platform: 'tiktok',    caption: '#MorningRoutine – So starte ich meinen Tag! 🌅 #fyp #motivation',         scheduledAt: new Date(Date.now() + 86400000).toISOString() },
  { id: 2, platform: 'instagram', caption: 'Produktiver Montagmorgen ✨ Kaffee, Ziele, Action! #contentcreator #reels', scheduledAt: new Date(Date.now() + 172800000).toISOString() },
  { id: 3, platform: 'youtube',   caption: '5 Hacks für mehr Produktivität – Shorts',                                  scheduledAt: new Date(Date.now() + 259200000).toISOString() },
];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ posts }) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { platform, caption, scheduledAt } = body;

      if (!platform || !caption || !scheduledAt) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Plattform, Beschriftung und Zeitplan sind erforderlich.' }) };
      }

      const newPost = {
        id:          Date.now(),
        platform,
        caption,
        scheduledAt,
        createdAt:   new Date().toISOString(),
      };

      posts.unshift(newPost);
      return { statusCode: 201, headers, body: JSON.stringify({ post: newPost, success: true }) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode nicht erlaubt.' }) };
};
