import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
)

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const { action, email, password, fullName, userId } = body

    if (action === 'signUp') {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: fullName },
        email_confirm: true,
      })
      if (error) throw error

      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        subscription_tier: 'free',
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data: { user: data.user }, error: null }),
      }
    }

    if (action === 'getUser' && userId) {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
      if (error) throw error
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data, error: null }),
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ data: null, error: 'Invalid action' }),
    }
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
