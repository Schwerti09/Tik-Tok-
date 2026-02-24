import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'
import { rateLimit } from '../shared/middleware/rateLimit'

// POST /.netlify/functions/auth/login
// Meldet einen Benutzer an und gibt Session-Token zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  // Rate-Limiting (max. 20 Login-Versuche pro Minute)
  const rateLimitError = rateLimit(event, { maxRequests: 20, windowMs: 60_000 })
  if (rateLimitError) return rateLimitError

  try {
    const body = JSON.parse(event.body ?? '{}') as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password) {
      return errorResponse(400, 'E-Mail und Passwort sind erforderlich')
    }

    // Mit Anon-Key anmelden (damit Supabase den richtigen Auth-Flow verwendet)
    const supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return errorResponse(401, error.message)

    return successResponse({
      user: data.user,
      session: data.session,
    })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
