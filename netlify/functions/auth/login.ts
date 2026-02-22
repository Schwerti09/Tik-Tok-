import { createClient } from '@supabase/supabase-js'
import type { Handler } from '@netlify/functions'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const { email, password } = JSON.parse(event.body ?? '{}')

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'email and password are required' })
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { statusCode: 401, body: JSON.stringify({ error: error.message }) }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ session: data.session, user: data.user })
    }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }
}
