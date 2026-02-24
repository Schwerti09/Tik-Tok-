import type { Handler } from '@netlify/functions'
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// POST /.netlify/functions/videos/upload
// Startet einen S3 Multipart-Upload und gibt die Upload-URLs zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const body = JSON.parse(event.body ?? '{}') as {
      fileName?: string
      fileType?: string
      parts?: number
    }

    const { fileName, fileType, parts = 1 } = body

    if (!fileName || !fileType) {
      return errorResponse(400, 'fileName und fileType sind erforderlich')
    }

    // S3-Client konfigurieren
    const s3 = new S3Client({
      region: process.env.AWS_REGION ?? 'eu-central-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    })

    const bucket = process.env.AWS_S3_BUCKET ?? ''
    const key = `uploads/${authResult.user!.id}/${Date.now()}_${fileName}`

    // Multipart-Upload initiieren
    const createCmd = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    })
    const { UploadId } = await s3.send(createCmd)

    // Vorsignierte URLs für jeden Teil generieren
    const uploadUrls: string[] = []
    for (let i = 1; i <= parts; i++) {
      const uploadPartCmd = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        UploadId,
        PartNumber: i,
      })
      const url = await getSignedUrl(s3, uploadPartCmd, { expiresIn: 3600 })
      uploadUrls.push(url)
    }

    // Video-Eintrag in Supabase anlegen
    const { data: video, error: dbError } = await supabaseAdmin
      .from('videos')
      .insert({
        user_id: authResult.user!.id,
        original_url: `https://${bucket}.s3.amazonaws.com/${key}`,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) return errorResponse(500, dbError.message)

    return successResponse({
      videoId: video.id,
      uploadId: UploadId,
      key,
      uploadUrls,
    }, 201)
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
