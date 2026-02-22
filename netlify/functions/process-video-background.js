/**
 * Netlify Background Function: process-video-background
 *
 * Invoked asynchronously by upload-video.js after a new job is created.
 * Netlify Background Functions have a 15-minute (900-second) timeout, which is
 * sufficient for FFmpeg-based video processing.
 *
 * Workflow:
 * 1. Receive { jobId, s3Key } from the triggering function.
 * 2. Mark job status as 'processing' in the database.
 * 3. Download the source video from S3 to a local /tmp path.
 * 4. Use FFmpeg to split the video into short clips (default: 60-second segments).
 * 5. Upload each generated clip back to S3.
 * 6. Update job status to 'done' with the list of clip URLs.
 * 7. On any error, mark the job as 'failed'.
 *
 * Required environment variables (same as the other functions):
 *   DATABASE_URL, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
 *
 * Optional:
 *   CLIP_DURATION  - Segment length in seconds (default: 60)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');
const { downloadFromS3, uploadToS3 } = require('../../src/utils/s3');
const { markJobProcessing, markJobDone, markJobFailed } = require('../../src/utils/db');

const mkdtemp = promisify(fs.mkdtemp);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rm);

/**
 * Splits a video file into equal-length segments using FFmpeg.
 * @param {string} inputPath    - Absolute path to the source video file
 * @param {string} outputDir    - Directory where segments will be written
 * @param {number} segmentLength - Segment duration in seconds
 * @returns {Promise<string[]>}  Sorted list of absolute paths to the generated segments
 */
function splitVideoIntoClips(inputPath, outputDir, segmentLength) {
  return new Promise((resolve, reject) => {
    const outputPattern = path.join(outputDir, 'clip_%03d.mp4');

    ffmpeg(inputPath)
      .outputOptions([
        '-c copy',
        `-segment_time ${segmentLength}`,
        '-f segment',
        '-reset_timestamps 1',
      ])
      .output(outputPattern)
      .on('end', () => {
        const clips = fs
          .readdirSync(outputDir)
          .filter((f) => f.startsWith('clip_') && f.endsWith('.mp4'))
          .sort()
          .map((f) => path.join(outputDir, f));
        resolve(clips);
      })
      .on('error', reject)
      .run();
  });
}

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { jobId, s3Key } = body;

  if (!jobId || !s3Key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'jobId and s3Key are required' }),
    };
  }

  const segmentLength = parseInt(process.env.CLIP_DURATION || '60', 10);
  let tmpDir;

  try {
    // 2. Mark job as processing
    await markJobProcessing(jobId);

    // 3. Download source video from S3 to a local temp directory
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'video-'));
    const ext = path.extname(s3Key) || '.mp4';
    const sourcePath = path.join(tmpDir, `source${ext}`);
    const videoBuffer = await downloadFromS3(s3Key);
    fs.writeFileSync(sourcePath, videoBuffer);

    // 4. Split video into clips using FFmpeg
    const clipsDir = path.join(tmpDir, 'clips');
    fs.mkdirSync(clipsDir);
    const clipPaths = await splitVideoIntoClips(sourcePath, clipsDir, segmentLength);

    // 5. Upload each clip to S3
    const clipUrls = [];
    for (let i = 0; i < clipPaths.length; i++) {
      const clipKey = `clips/${jobId}/clip_${String(i).padStart(3, '0')}.mp4`;
      const clipBuffer = fs.readFileSync(clipPaths[i]);
      const clipUrl = await uploadToS3(clipKey, clipBuffer, 'video/mp4');
      clipUrls.push(clipUrl);
    }

    // 6. Update job status to 'done' with clip URLs
    await markJobDone(jobId, clipUrls);

    return {
      statusCode: 200,
      body: JSON.stringify({ jobId, status: 'done', clipUrls }),
    };
  } catch (err) {
    console.error(`process-video-background error for job ${jobId}:`, err);
    await markJobFailed(jobId, err.message).catch(() => {});
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    // Clean up temp files
    if (tmpDir) {
      await rmdir(tmpDir, { recursive: true }).catch(() => {});
    }
  }
};
