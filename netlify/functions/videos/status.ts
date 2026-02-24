import type { Handler } from '@netlify/functions'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// GET /.netlify/functions/videos/status?videoId=<id>
// Gibt den aktuellen Verarbeitungsstatus eines Videos zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const videoId = event.queryStringParameters?.videoId
    if (!videoId) {
      return errorResponse(400, 'videoId ist erforderlich')
    }

    const { data: video, error } = await supabaseAdmin
      .from('videos')
      .select('id, status, processed_urls, created_at')
      .eq('id', videoId)
      .eq('user_id', authResult.user!.id)
      .single()

    if (error || !video) {
      return errorResponse(404, 'Video nicht gefunden')
    }

    return successResponse(video)
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
