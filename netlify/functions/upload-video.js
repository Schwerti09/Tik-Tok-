/**
 * Netlify Function: POST /api/videos/upload
 *
 * Accepts a multipart/form-data request containing a video file.
 * 1. Parses the uploaded file from the request body.
 * 2. Uploads the raw video to S3 under uploads/<jobId>/source.<ext>.
 * 3. Creates a job record in PostgreSQL with status = 'pending'.
 * 4. Invokes the background function (process-video-background) via an
 *    internal Netlify HTTP call so processing happens asynchronously.
 * 5. Returns { jobId, status: 'pending' } to the client immediately.
 *
 * The client can then poll GET /api/videos/status/:jobId to track progress.
 */

const { v4: uuidv4 } = require('uuid');
const Busboy = require('busboy');
const path = require('path');
const { uploadToS3 } = require('../../src/utils/s3');
const { createJob } = require('../../src/utils/db');

/**
 * Parses multipart/form-data from a Netlify event and returns the first file.
 * @param {object} event - Netlify Function event
 * @returns {Promise<{filename: string, mimetype: string, data: Buffer}>}
 */
function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: { 'content-type': event.headers['content-type'] },
    });

    let fileData = null;

    busboy.on('file', (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      fileStream.on('data', (chunk) => chunks.push(chunk));
      fileStream.on('end', () => {
        fileData = {
          filename,
          mimetype: mimeType,
          data: Buffer.concat(chunks),
        };
      });
    });

    busboy.on('finish', () => {
      if (!fileData) {
        return reject(new Error('No file found in request'));
      }
      resolve(fileData);
    });

    busboy.on('error', reject);

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '');

    busboy.write(body);
    busboy.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // 1. Parse uploaded file
    const file = await parseMultipartForm(event);

    const ext = path.extname(file.filename || '.mp4') || '.mp4';
    const jobId = uuidv4();
    const s3Key = `uploads/${jobId}/source${ext}`;

    // 2. Upload source video to S3
    const inputUrl = await uploadToS3(s3Key, file.data, file.mimetype || 'video/mp4');

    // 3. Create job record in DB with status = 'pending'
    await createJob(jobId, inputUrl);

    // 4. Trigger background function asynchronously
    //    Netlify background functions are invoked by appending "-background" to
    //    the function name and calling them via a standard HTTP POST.
    const backgroundUrl =
      process.env.URL
        ? `${process.env.URL}/.netlify/functions/process-video-background`
        : 'http://localhost:8888/.netlify/functions/process-video-background';

    // Fire-and-forget: we do not await this fetch so the client gets an
    // immediate response while processing continues in the background.
    fetch(backgroundUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, s3Key }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Background function responded with HTTP ${res.status} for job ${jobId}`);
        }
      })
      .catch((err) => {
        // Log but do not fail the upload response – the job is already in the DB.
        console.error('Failed to trigger background function:', err.message);
      });

    // 5. Return jobId to client immediately
    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, status: 'pending' }),
    };
  } catch (err) {
    console.error('upload-video error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
