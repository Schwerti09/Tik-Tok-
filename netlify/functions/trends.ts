import type { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  try {
    const platform = event.queryStringParameters?.platform
    const limit = parseInt(event.queryStringParameters?.limit ?? '20')

    let query = supabase
      .from('trends')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)

    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query
    if (error) throw error

    return { statusCode: 200, headers, body: JSON.stringify({ data, error: null }) }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    }
  }
}
