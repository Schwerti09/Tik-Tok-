exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const analytics = {
    totalViews:       1248000,
    totalLikes:        89400,
    totalFollowers:    34200,
    estimatedRevenue:  1847.50,
    topPosts: [
      { title: '5-Minuten Morgen-Routine',                 views: 245000, likes: 18200, platform: 'tiktok' },
      { title: 'Produktivitäts-Hack #3',                   views: 187000, likes: 14100, platform: 'instagram' },
      { title: 'Warum du früher aufstehen solltest',       views: 156000, likes: 12400, platform: 'youtube' },
      { title: 'Mein Work-From-Home Setup',                views: 134000, likes:  9800, platform: 'tiktok' },
    ],
    weeklyData: [
      { day: 'Mo', views: 32000 },
      { day: 'Di', views: 45000 },
      { day: 'Mi', views: 28000 },
      { day: 'Do', views: 61000 },
      { day: 'Fr', views: 79000 },
      { day: 'Sa', views: 54000 },
      { day: 'So', views: 38000 },
    ],
    utmLinks: [
      { url: 'https://tikflow.de?utm_source=tiktok&utm_medium=bio&utm_campaign=spring', clicks: 1240 },
      { url: 'https://tikflow.de?utm_source=instagram&utm_medium=bio&utm_campaign=spring', clicks: 890 },
    ],
    suggestions: [
      'Poste öfter zwischen 18–21 Uhr für +23% mehr Reichweite',
      'Nutze mehr Duett-Features auf TikTok – dein Engagement steigt um 34%',
      'Längere Untertitel führen zu +18% mehr Engagement bei deiner Zielgruppe',
      'Antworte auf die ersten 20 Kommentare innerhalb der ersten Stunde',
    ],
    fetchedAt: new Date().toISOString(),
  };

  return { statusCode: 200, headers, body: JSON.stringify(analytics) };
};
