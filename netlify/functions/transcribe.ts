import type { Handler, HandlerEvent } from '@netlify/functions'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { videoUrl, videoId, language } = JSON.parse(event.body ?? '{}')

    if (!videoUrl) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'videoUrl is required' }) }
    }

    // Fetch the audio from the video URL and transcribe
    const audioResponse = await fetch(videoUrl)
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch video/audio')
    }
    const audioBlob = await audioResponse.blob()
    const audioFile = new File([audioBlob], 'audio.mp4', { type: 'audio/mp4' })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language ?? 'en',
      response_format: 'verbose_json',
    })

    // Optionally update video in database with transcription
    if (videoId) {
      await supabase
        .from('videos')
        .update({ description: transcription.text })
        .eq('id', videoId)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: {
          text: transcription.text,
          language: transcription.language,
          duration: transcription.duration,
          segments: transcription.segments,
        },
        error: null,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'Transcription failed',
      }),
    }
  }
}
