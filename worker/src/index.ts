/* tikflow/worker/src/index.ts */
// TikFlow Video-Processing-Worker
// Verarbeitet Jobs aus der BullMQ-Warteschlange mit FFmpeg.

import 'dotenv/config'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { Worker, Queue, type Job } from 'bullmq'
import { createClient } from '@supabase/supabase-js'
import ffmpeg from 'fluent-ffmpeg'

// ======================================================
// Konfiguration
// ======================================================
const REDIS_URL    = process.env.REDIS_URL ?? 'redis://localhost:6379'
const QUEUE_NAME   = 'video-processing'
const CONCURRENCY  = parseInt(process.env.WORKER_CONCURRENCY ?? '2', 10)
const TEMP_DIR     = process.env.WORKER_TEMP_DIR ?? os.tmpdir()

// Supabase-Admin-Client (Service-Role-Key)
const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  { auth: { autoRefreshToken: false, persistSession: false } },
)

// ======================================================
// Job-Typ-Definition
// ======================================================
interface VideoJob {
  jobId: string
  videoId: string
  userId: string
  videoUrl: string
}

// ======================================================
// FFmpeg-Hilfsfunktionen
// ======================================================

/**
 * Schneidet ein Video in kurze Clips (Standard: 60 Sekunden).
 * @param inputPath  Lokaler Pfad zur heruntergeladenen Videodatei
 * @param outputDir  Ausgabeverzeichnis für die Clips
 * @param clipLength Länge jedes Clips in Sekunden (Standard: 60)
 */
function splitVideoIntoClips(
  inputPath: string,
  outputDir: string,
  clipLength = 60,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // Video-Metadaten ermitteln um Gesamtlänge zu bestimmen
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err)
        return
      }

      const duration = metadata.format.duration ?? 0
      const clipCount = Math.ceil(duration / clipLength)
      const outputPaths: string[] = []
      let completed = 0

      if (clipCount === 0) {
        resolve([])
        return
      }

      for (let i = 0; i < clipCount; i++) {
        const startTime = i * clipLength
        const outputPath = path.join(outputDir, `clip_${i + 1}.mp4`)
        outputPaths.push(outputPath)

        ffmpeg(inputPath)
          .setStartTime(startTime)
          .setDuration(clipLength)
          .output(outputPath)
          // Vertikales Format für TikTok/Reels (9:16)
          .videoFilter('scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2')
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions('-movflags', '+faststart')
          .on('end', () => {
            completed++
            if (completed === clipCount) {
              resolve(outputPaths)
            }
          })
          .on('error', reject)
          .run()
      }
    })
  })
}

/**
 * Lädt eine Datei von einer URL herunter und gibt den lokalen Pfad zurück.
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  const https = await import('https')
  const http  = await import('http')
  const protocol = url.startsWith('https') ? https : http

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP-Fehler: ${response.statusCode}`))
        return
      }
      response.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    }).on('error', reject)
  })
}

// ======================================================
// Job-Verarbeitungslogik
// ======================================================

/**
 * Verarbeitet einen einzelnen Video-Job:
 * 1. Video herunterladen
 * 2. In Clips schneiden (FFmpeg)
 * 3. Clips in Supabase Storage hochladen
 * 4. Video-Eintrag in der DB aktualisieren
 */
async function processVideoJob(job: Job<VideoJob>): Promise<void> {
  const { jobId, videoId, userId, videoUrl } = job.data

  console.log(`[worker] Starte Job ${jobId} für Video ${videoId}`)
  await job.updateProgress(5)

  // Temporäres Verzeichnis für diesen Job anlegen
  const jobTempDir = path.join(TEMP_DIR, `tikflow_${jobId}`)
  fs.mkdirSync(jobTempDir, { recursive: true })

  try {
    // 1. Video herunterladen
    const inputPath = path.join(jobTempDir, 'input.mp4')
    console.log(`[worker] Lade Video herunter: ${videoUrl}`)
    await downloadFile(videoUrl, inputPath)
    await job.updateProgress(30)

    // 2. In Clips schneiden
    console.log('[worker] Schneide Video in Clips…')
    const clipPaths = await splitVideoIntoClips(inputPath, jobTempDir, 60)
    await job.updateProgress(70)

    // 3. Clips in Supabase Storage hochladen (im 'recordings'-Bucket unter 'processed/')
    const processedUrls: string[] = []
    for (const clipPath of clipPaths) {
      const clipName = path.basename(clipPath)
      const storagePath = `processed/${userId}/${videoId}/${clipName}`
      const fileBuffer = fs.readFileSync(clipPath)

      const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(storagePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true,
        })

      if (uploadError) {
        console.error(`[worker] Upload-Fehler für ${clipName}:`, uploadError.message)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(storagePath)

      processedUrls.push(urlData.publicUrl)
    }

    await job.updateProgress(90)

    // 4. Video-Status und verarbeitete URLs in der DB aktualisieren
    const { error: dbError } = await supabase
      .from('videos')
      .update({
        status: 'done',
        processed_urls: processedUrls,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId)

    if (dbError) throw new Error(`DB-Update fehlgeschlagen: ${dbError.message}`)

    // Job als abgeschlossen markieren
    await supabase
      .from('jobs')
      .update({ status: 'completed', output_path: processedUrls[0] ?? '', updated_at: new Date().toISOString() })
      .eq('id', jobId)

    await job.updateProgress(100)
    console.log(`[worker] Job ${jobId} abgeschlossen. ${processedUrls.length} Clip(s) erstellt.`)
  } finally {
    // Temporäre Dateien aufräumen
    fs.rmSync(jobTempDir, { recursive: true, force: true })
  }
}

// ======================================================
// Worker starten
// ======================================================
async function main(): Promise<void> {
  console.log('[worker] TikFlow Video-Processing-Worker startet…')
  console.log(`[worker] Redis-URL: ${REDIS_URL.replace(/:[^:@]+@/, ':***@')}`)
  console.log(`[worker] Parallelität: ${CONCURRENCY}`)

  // BullMQ-Worker mit Redis-Verbindung
  const worker = new Worker<VideoJob>(
    QUEUE_NAME,
    async (job) => {
      await processVideoJob(job)
    },
    {
      connection: { url: REDIS_URL },
      concurrency: CONCURRENCY,
    },
  )

  // Event-Listener
  worker.on('completed', (job) => {
    console.log(`[worker] ✅ Job ${job.id} erfolgreich abgeschlossen`)
  })

  worker.on('failed', async (job, err) => {
    console.error(`[worker] ❌ Job ${job?.id} fehlgeschlagen:`, err.message)

    // Job in DB als fehlgeschlagen markieren
    if (job?.data.jobId) {
      await supabase
        .from('jobs')
        .update({ status: 'failed', error_msg: err.message, updated_at: new Date().toISOString() })
        .eq('id', job.data.jobId)

      await supabase
        .from('videos')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', job.data.videoId)
    }
  })

  worker.on('error', (err) => {
    console.error('[worker] Worker-Fehler:', err)
  })

  // Queue-Referenz für Monitoring
  const queue = new Queue<VideoJob>(QUEUE_NAME, {
    connection: { url: REDIS_URL },
  })

  // Graceful Shutdown
  const shutdown = async (signal: string) => {
    console.log(`[worker] Signal ${signal} empfangen – fahre Worker herunter…`)
    await worker.close()
    await queue.close()
    process.exit(0)
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT',  () => void shutdown('SIGINT'))

  console.log(`[worker] Warte auf Jobs in Warteschlange "${QUEUE_NAME}"…`)
}

main().catch((err: unknown) => {
  console.error('[worker] Fataler Fehler:', err)
  process.exit(1)
})
