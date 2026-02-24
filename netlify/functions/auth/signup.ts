import type { Handler } from '@netlify/functions'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'
import { rateLimit } from '../shared/middleware/rateLimit'

// POST /.netlify/functions/auth/signup
// Erstellt einen neuen Benutzer und ein zugehöriges Profil
const handler: Handler = async (event) => {
  // Nur POST erlauben
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  // Rate-Limiting (max. 10 Registrierungen pro Minute pro IP)
  const rateLimitError = rateLimit(event, { maxRequests: 10, windowMs: 60_000 })
  if (rateLimitError) return rateLimitError

  try {
    const body = JSON.parse(event.body ?? '{}') as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password) {
      return errorResponse(400, 'E-Mail und Passwort sind erforderlich')
    }

    if (password.length < 8) {
      return errorResponse(400, 'Passwort muss mindestens 8 Zeichen lang sein')
    }

    // Benutzer in Supabase Auth anlegen
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })

    if (error) return errorResponse(400, error.message)

    // Profil in der profiles-Tabelle anlegen
    if (data.user) {
      await supabaseAdmin.from('profiles').insert({
        id: data.user.id,
        subscription_tier: 'free',
      })
    }

    return successResponse({ message: 'Registrierung erfolgreich. Bitte E-Mail bestätigen.' }, 201)
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
