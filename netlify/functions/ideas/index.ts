import type { Handler } from '@netlify/functions'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// GET /.netlify/functions/ideas/index
// Gibt alle gespeicherten Ideen des angemeldeten Benutzers zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const { data: ideas, error } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('user_id', authResult.user!.id)
      .order('saved_at', { ascending: false })
      .limit(50)

    if (error) return errorResponse(500, error.message)

    return successResponse({ ideas })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
