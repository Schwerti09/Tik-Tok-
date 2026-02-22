import type { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { prompt, platform, userId } = JSON.parse(event.body ?? '{}')

    if (!prompt || !userId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) }
    }

    const systemPrompt = `You are a viral content strategist specializing in ${platform} content. 
Generate 5 creative, engaging content ideas based on the user's prompt. 
For each idea, provide:
- A catchy title (max 60 chars)
- A compelling description (2-3 sentences)
- 3-5 relevant hashtag tags (without #)
Format your response as a JSON array of objects with keys: title, description, tags`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ideas for: ${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
    })

    const responseText = completion.choices[0].message.content ?? '{}'
    const parsed = JSON.parse(responseText)
    const ideasArray = parsed.ideas ?? parsed.content ?? (Array.isArray(parsed) ? parsed : [])

    const insertData = ideasArray.map((idea: { title: string; description: string; tags: string[] }) => ({
      user_id: userId,
      title: idea.title,
      description: idea.description,
      platform,
      tags: idea.tags ?? [],
      ai_generated: true,
    }))

    const { data, error } = await supabase.from('ideas').insert(insertData).select()
    if (error) throw error

    return { statusCode: 200, headers, body: JSON.stringify({ data, error: null }) }
  } catch (error) {
    console.error('Ideas generation error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'Failed to generate ideas',
      }),
    }
  }
}
