import type { Handler, HandlerEvent } from '@netlify/functions'

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base'

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
    const { text } = JSON.parse(event.body ?? '{}')

    if (!text) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'text is required' }) }
    }

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Hugging Face API error: ${errText}`)
    }

    const result = await response.json()
    // result is array of [{label, score}]
    const emotions: Record<string, number> = {}
    const items = Array.isArray(result[0]) ? result[0] : result
    items.forEach((item: { label: string; score: number }) => {
      emotions[item.label.toLowerCase()] = parseFloat(item.score.toFixed(4))
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: emotions, error: null }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'Emotion detection failed',
      }),
    }
  }
}
