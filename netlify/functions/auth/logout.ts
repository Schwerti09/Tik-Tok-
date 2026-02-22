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
    const authHeader = event.headers['authorization'] ?? ''
    const accessToken = authHeader.replace(/^Bearer\s+/i, '')

    if (!accessToken) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Missing authorization token' }) }
    }

    await supabase.auth.admin.signOut(accessToken)

    return { statusCode: 200, body: JSON.stringify({ message: 'Logged out successfully' }) }
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) }
  }
}
