/**
 * Netlify Function: transcribe
 * Route:  POST /api/transcribe
 *
 * Accepts a multipart/form-data upload with a field named "video".
 * Sends the file to OpenAI Whisper (whisper-1) for transcription,
 * then stores the result in the configured database and returns it.
 *
 * Required environment variables:
 *   OPENAI_API_KEY   – OpenAI secret key
 *   DATABASE_URL     – (optional) connection string for transcript storage
 *                      When not set the transcript is returned only.
 *
 * The function uses the multipart body forwarded by Netlify (base64-encoded).
 */

"use strict";

const { OpenAI } = require("openai");

/**
 * Parse a multipart/form-data body (as forwarded by Netlify, base64-encoded)
 * and extract the first file field named "video".
 *
 * Returns { filename, buffer, mimetype } or null when not found.
 *
 * @param {string}  body        base64-encoded body
 * @param {string}  contentType Content-Type header (contains the boundary)
 * @returns {{ filename: string, buffer: Buffer, mimetype: string } | null}
 */
function extractVideoFile(body, contentType) {
  const boundaryMatch = contentType.match(/boundary=([^\s;]+)/i);
  if (!boundaryMatch) return null;

  const boundary = "--" + boundaryMatch[1];
  const raw = Buffer.from(body, "base64");
  const text = raw.toString("binary");

  const parts = text.split(boundary);
  for (const part of parts) {
    if (!part.includes('name="video"')) continue;

    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.slice(0, headerEnd);
    const filenameMatch = headers.match(/filename="([^"]+)"/i);
    const mimeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);

    const dataStr = part.slice(headerEnd + 4, part.lastIndexOf("\r\n"));
    const buffer = Buffer.from(dataStr, "binary");

    return {
      filename: filenameMatch ? filenameMatch[1] : "video.mp4",
      buffer,
      mimetype: mimeMatch ? mimeMatch[1].trim() : "video/mp4",
    };
  }
  return null;
}

/**
 * Persist the transcript to the database (when DATABASE_URL is configured).
 * Uses a minimal SQL INSERT via the `pg` package if installed.
 *
 * @param {object} record
 * @param {string} record.filename
 * @param {string} record.transcript
 * @param {string} record.language
 */
async function saveTranscript(record) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return; // storage is optional

  let Client;
  try {
    ({ Client } = require("pg")); // optional dependency
  } catch {
    console.warn("pg module not available – skipping DB storage");
    return;
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: process.env.DATABASE_SSL !== "false" } });
  try {
    await client.connect();
    await client.query(
      `CREATE TABLE IF NOT EXISTS transcripts (
         id        SERIAL PRIMARY KEY,
         filename  TEXT,
         language  TEXT,
         transcript TEXT,
         created_at TIMESTAMPTZ DEFAULT now()
       )`,
    );
    await client.query(
      "INSERT INTO transcripts (filename, language, transcript) VALUES ($1, $2, $3)",
      [record.filename, record.language, record.transcript],
    );
  } finally {
    await client.end();
  }
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
    };
  }

  const contentType = (event.headers["content-type"] || event.headers["Content-Type"] || "").trim();
  if (!contentType.includes("multipart/form-data")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Expected multipart/form-data" }),
    };
  }

  const file = extractVideoFile(event.body, contentType);
  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No "video" field found in the upload' }),
    };
  }

  const openai = new OpenAI({ apiKey });

  let transcription;
  try {
    transcription = await openai.audio.transcriptions.create({
      file: await OpenAI.toFile(file.buffer, file.filename, { type: file.mimetype }),
      model: "whisper-1",
      response_format: "verbose_json",
    });
  } catch (err) {
    console.error("Whisper error:", err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Transcription failed", detail: err.message }),
    };
  }

  const record = {
    filename: file.filename,
    transcript: transcription.text,
    language: transcription.language || "unknown",
  };

  try {
    await saveTranscript(record);
  } catch (err) {
    // Non-fatal – still return the transcript to the caller
    console.warn("DB storage failed:", err.message);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: record.filename,
      language: record.language,
      transcript: record.transcript,
      segments: transcription.segments ?? [],
    }),
  };
};
