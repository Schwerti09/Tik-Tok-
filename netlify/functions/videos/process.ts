import type { Handler } from '@netlify/functions'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// POST /.netlify/functions/videos/process
// Stellt einen Video-Verarbeitungs-Job in die Warteschlange
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const body = JSON.parse(event.body ?? '{}') as { videoId?: string }
    const { videoId } = body

    if (!videoId) {
      return errorResponse(400, 'videoId ist erforderlich')
    }

    // Video-Eigentümer prüfen
    const { data: video, error: videoError } = await supabaseAdmin
      .from('videos')
      .select('id, user_id, status')
      .eq('id', videoId)
      .eq('user_id', authResult.user!.id)
      .single()

    if (videoError || !video) {
      return errorResponse(404, 'Video nicht gefunden')
    }

    if (video.status !== 'pending') {
      return errorResponse(409, `Video ist bereits im Status "${video.status}"`)
    }

    // Job in der jobs-Tabelle anlegen (wird vom Worker aufgegriffen)
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .insert({
        video_id: videoId,
        user_id: authResult.user!.id,
        status: 'pending',
        video_url: video.original_url,
      })
      .select()
      .single()

    if (jobError) return errorResponse(500, jobError.message)

    // Video-Status auf "processing" setzen
    await supabaseAdmin
      .from('videos')
      .update({ status: 'processing' })
      .eq('id', videoId)

    return successResponse({ jobId: job.id, status: 'queued' }, 201)
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
