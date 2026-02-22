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
    const userId = event.queryStringParameters?.userId
    const videoId = event.queryStringParameters?.videoId

    if (!userId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) }
    }

    // Get video IDs for user
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id')
      .eq('user_id', userId)

    if (videosError) throw videosError
    const videoIds = videoId
      ? [videoId]
      : videos?.map((v: { id: string }) => v.id) ?? []

    if (videoIds.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ data: [], error: null }) }
    }

    const { data, error } = await supabase
      .from('analytics')
      .select('*, video:videos(title, platform)')
      .in('video_id', videoIds)
      .order('recorded_at', { ascending: false })

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
