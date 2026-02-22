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
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, user:users(id, full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return { statusCode: 200, headers, body: JSON.stringify({ data, error: null }) }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body ?? '{}')
      const { data, error } = await supabase
        .from('community_posts')
        .insert(body)
        .select('*, user:users(id, full_name, avatar_url)')
        .single()
      if (error) throw error
      return { statusCode: 201, headers, body: JSON.stringify({ data, error: null }) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
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
