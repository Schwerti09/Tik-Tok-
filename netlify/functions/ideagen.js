const MOCK_IDEA = {
  title: 'Der 5-Minuten Morgen-Routine Hack',
  hook: '„Ich habe 30 Tage lang diese Morgen-Routine gemacht – hier ist was passiert ist..." (Direktblick in Kamera, dramatische Musik)',
  storyboard: [
    'Szene 1 (0–3s): Schneller Überblick – zeige vorher/nachher Bild, erstelle Neugier',
    'Szene 2 (3–15s): Das Problem – Morgens gehetzt, keine Energie, kein Plan',
    'Szene 3 (15–35s): Die 5-Schritte-Routine im Zeitraffer zeigen',
    'Szene 4 (35–50s): Ergebnis nach 30 Tagen – Energie, Fokus, Produktivität',
    'Szene 5 (50–60s): Call-to-Action – „Folge mir für Teil 2" + Routine-PDF anbieten',
  ],
  recommendedSounds: ['Motivational Beat – TikTok', 'Morning Vibes', 'Cinematic Rise'],
  recommendedHashtags: ['morningroutine', 'productivity', 'selfimprovement', 'lifehack', 'motivation', 'fyp'],
  estimatedViews: 45000,
};

async function generateWithOpenAI(niche, platform, style) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Du bist ein erfahrener Content-Creator und Social-Media-Stratege.
Erstelle ein vollständiges Video-Konzept auf Deutsch für:
- Nische/Thema: ${niche}
- Plattform: ${platform}
- Stil: ${style}

Antworte ausschließlich als valides JSON-Objekt mit diesen Feldern:
{
  "title": "Titel des Videos",
  "hook": "Aufmerksamkeitsstarke Eröffnung (erste 3 Sekunden)",
  "storyboard": ["Szene 1...", "Szene 2...", "Szene 3...", "Szene 4...", "Szene 5..."],
  "recommendedSounds": ["Sound 1", "Sound 2", "Sound 3"],
  "recommendedHashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "estimatedViews": 50000
}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  });

  return JSON.parse(completion.choices[0].message.content);
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode nicht erlaubt.' }) };

  try {
    const { niche, platform = 'TikTok', style = 'Unterhaltsam' } = JSON.parse(event.body || '{}');

    if (!niche?.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nische / Thema ist erforderlich.' }) };
    }

    let idea;
    if (process.env.OPENAI_API_KEY) {
      try {
        idea = await generateWithOpenAI(niche, platform, style);
      } catch (aiErr) {
        console.error('OpenAI Fehler:', aiErr.message);
        idea = { ...MOCK_IDEA, title: `${niche} – ${MOCK_IDEA.title}` };
      }
    } else {
      idea = { ...MOCK_IDEA, title: `${niche} – ${MOCK_IDEA.title}` };
    }

    return { statusCode: 200, headers, body: JSON.stringify(idea) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
