'use strict';

const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function openAIRequest(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
    });
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse OpenAI response'));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

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

  const { niche, targetAudience, style, platform } = payload;
  if (!niche) {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'niche is required' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Return mock data when no API key is configured
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept: {
          title: `The Ultimate ${niche} Guide for ${targetAudience || 'Everyone'}`,
          hook: `Stop scrolling. If you're into ${niche}, this changes everything...`,
          storyboard: [
            `Open with a bold statement about ${niche} (hook the viewer in 2 seconds)`,
            `Show the "before" scenario that your target audience identifies with`,
            `Introduce the main tip or transformation with visual demonstration`,
            `Provide 2-3 supporting examples or mini-demonstrations`,
            `Close with a strong CTA and your personal story connection`,
          ],
          sounds: ['Trending Viral Sound 2024', 'Upbeat Background Music', 'Lo-fi Chill Beats'],
          hashtags: [`#${niche.toLowerCase().replace(/\s+/g, '')}`, '#creator', '#viral', '#fyp', `#${style?.toLowerCase() || 'tips'}`],
          duration: '30-60 seconds',
        },
      }),
    };
  }

  try {
    const systemPrompt = `You are an expert viral content strategist for short-form video platforms. Generate video concepts that are creative, engaging, and highly shareable.`;
    const userPrompt = `Generate a viral video concept for:
- Niche/Topic: ${niche}
- Target Audience: ${targetAudience || 'General audience'}
- Content Style: ${style || 'Educational'}
- Platform: ${platform || 'TikTok'}

Return a JSON object with this exact structure:
{
  "title": "catchy video title",
  "hook": "opening line to grab attention (first 2 seconds)",
  "storyboard": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "sounds": ["sound 1", "sound 2", "sound 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "duration": "recommended duration"
}`;

    const response = await openAIRequest(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const content = response.choices?.[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const concept = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to generate idea: ' + err.message }),
    };
  }
};
