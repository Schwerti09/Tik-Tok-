import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'
import { rateLimit } from '../shared/middleware/rateLimit'

// POST /.netlify/functions/ideas/generate
// Generiert Video-Ideen via OpenAI basierend auf Nische und Trends
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  // Rate-Limiting (max. 10 Anfragen pro Minute)
  const rateLimitError = rateLimit(event, { maxRequests: 10, windowMs: 60_000 })
  if (rateLimitError) return rateLimitError

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const body = JSON.parse(event.body ?? '{}') as {
      niche?: string
      platform?: string
      count?: number
    }

    const { niche = 'allgemein', platform = 'TikTok', count = 3 } = body

    if (!process.env.OPENAI_API_KEY) {
      return errorResponse(500, 'OpenAI API-Key ist nicht konfiguriert')
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // KI-Anfrage an OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein erfahrener Social-Media-Strategist. Generiere kurze, virale Video-Ideen im JSON-Format.',
        },
        {
          role: 'user',
          content: `Generiere ${count} Video-Ideen für ${platform} in der Nische "${niche}".
Antworte AUSSCHLIESSLICH mit einem JSON-Array in folgendem Format:
[
  {
    "hook": "Einstiegssatz der die Zuschauer fesselt",
    "storyboard": ["Szene 1", "Szene 2", "Szene 3"],
    "sounds": ["Trendiger Sound 1"],
    "hashtags": ["#hashtag1", "#hashtag2"],
    "estimatedViews": "50K-200K"
  }
]`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    let ideas: unknown[]
    try {
      const parsed = JSON.parse(completion.choices[0].message.content ?? '{"ideas":[]}') as
        | { ideas?: unknown[] }
        | unknown[]
      ideas = Array.isArray(parsed) ? parsed : (parsed as { ideas?: unknown[] }).ideas ?? []
    } catch {
      ideas = []
    }

    // Ideen in der Datenbank speichern
    await supabaseAdmin.from('ideas').insert({
      user_id: authResult.user!.id,
      content: { niche, platform, ideas },
    })

    return successResponse({ ideas, niche, platform })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
