/* tikflow/worker/index.js */
// Video-Processing-Worker – verarbeitet Jobs aus der Supabase-Datenbank.
// Aktuell wird die Video-Pipeline simuliert; später kann dieser Worker auf
// einen separaten Dienst (z.B. AWS Lambda + FFmpeg) ausgelagert werden.

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Polling-Intervall in Millisekunden
const POLL_INTERVAL_MS = parseInt(process.env.WORKER_POLL_INTERVAL_MS || '10000', 10);

/**
 * Holt den nächsten ausstehenden Job aus der Datenbank.
 * @returns {Promise<Object|null>}
 */
async function fetchNextJob() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[worker] Fehler beim Abrufen des nächsten Jobs:', error.message);
    return null;
  }
  return data;
}

/**
 * Markiert einen Job als "processing".
 * @param {string} jobId
 */
async function markProcessing(jobId) {
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'processing' })
    .eq('id', jobId);
  if (error) console.error(`[worker] DB-Fehler bei markProcessing(${jobId}):`, error.message);
}

/**
 * Markiert einen Job als "completed" und setzt den Ausgabepfad.
 * @param {string} jobId
 * @param {string} outputPath
 */
async function markCompleted(jobId, outputPath) {
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'completed', output_path: outputPath })
    .eq('id', jobId);
  if (error) console.error(`[worker] DB-Fehler bei markCompleted(${jobId}):`, error.message);
}

/**
 * Markiert einen Job als "failed".
 * @param {string} jobId
 */
async function markFailed(jobId) {
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'failed' })
    .eq('id', jobId);
  if (error) console.error(`[worker] DB-Fehler bei markFailed(${jobId}):`, error.message);
}

/**
 * Verarbeitet einen einzelnen Job.
 * TODO: FFmpeg-Pipeline hier implementieren (z.B. via fluent-ffmpeg oder AWS Lambda).
 * @param {Object} job
 */
async function processJob(job) {
  console.log(`[worker] Starte Job ${job.id} (video_url: ${job.video_url || 'n/a'})`);
  await markProcessing(job.id);

  try {
    // Simulierte Verarbeitungszeit (2 Sekunden)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Platzhalter-Ausgabepfad; wird durch echte FFmpeg-Ausgabe ersetzt
    const outputPath = `processed/${job.id}/output.mp4`;

    await markCompleted(job.id, outputPath);
    console.log(`[worker] Job ${job.id} abgeschlossen. Ausgabe: ${outputPath}`);
  } catch (err) {
    console.error(`[worker] Job ${job.id} fehlgeschlagen:`, err.message);
    await markFailed(job.id);
  }
}

/**
 * Haupt-Polling-Schleife: prüft regelmäßig auf neue Jobs.
 */
async function run() {
  console.log(`[worker] Gestartet. Polling alle ${POLL_INTERVAL_MS / 1000}s …`);

  const poll = async () => {
    try {
      const job = await fetchNextJob();
      if (job) {
        await processJob(job);
      }
    } catch (err) {
      console.error('[worker] Unerwarteter Fehler im Polling-Zyklus:', err.message);
    }
    setTimeout(poll, POLL_INTERVAL_MS);
  };

  poll();
}

run().catch((err) => {
  console.error('[worker] Fataler Fehler:', err);
  process.exit(1);
});
