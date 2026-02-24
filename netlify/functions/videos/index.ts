import type { Handler } from '@netlify/functions'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// GET /.netlify/functions/videos/index
// Gibt alle Videos des angemeldeten Benutzers zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const limit = parseInt(event.queryStringParameters?.limit ?? '20', 10)
    const offset = parseInt(event.queryStringParameters?.offset ?? '0', 10)

    const { data: videos, error, count } = await supabaseAdmin
      .from('videos')
      .select('*', { count: 'exact' })
      .eq('user_id', authResult.user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return errorResponse(500, error.message)

    return successResponse({ videos, total: count ?? 0 })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
