import { createClient } from '@supabase/supabase-js'
import type { Handler } from '@netlify/functions'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const { email, password, username } = JSON.parse(event.body ?? '{}')

    if (!email || !password || !username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'email, password and username are required' })
      }
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    })

    if (error) {
      return { statusCode: 400, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, body: JSON.stringify({ user: data.user }) }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }
}
