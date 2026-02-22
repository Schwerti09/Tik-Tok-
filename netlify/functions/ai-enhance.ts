import type { Handler, HandlerEvent } from '@netlify/functions'
import OpenAI from 'openai'

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
    const { title, description, platform, targetAudience } = JSON.parse(event.body ?? '{}')

    if (!title) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Title is required' }) }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert ${platform} content strategist. Provide specific, actionable AI enhancement suggestions for video content to maximize virality and engagement.`,
        },
        {
          role: 'user',
          content: `Enhance this video:
Title: ${title}
Description: ${description ?? 'N/A'}
Platform: ${platform}
Target Audience: ${targetAudience ?? 'General'}

Provide JSON with:
- optimizedTitle: improved title
- optimizedDescription: improved description with hashtags
- hookSuggestion: first 3 seconds hook idea
- editingTips: array of 3 editing suggestions
- soundSuggestion: audio/music recommendation
- postingTime: best time to post`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const suggestions = JSON.parse(completion.choices[0].message.content ?? '{}')
    return { statusCode: 200, headers, body: JSON.stringify({ data: suggestions, error: null }) }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'AI enhancement failed',
      }),
    }
  }
}
