import type { Handler } from '@netlify/functions'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// GET /.netlify/functions/auth/me
// Gibt das Profil des angemeldeten Benutzers zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authResult.user!.id)
      .single()

    if (error) return errorResponse(404, 'Profil nicht gefunden')

    return successResponse({ user: authResult.user, profile })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
