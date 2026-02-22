/**
 * Netlify Function: virality-score
 * Route:  POST /api/virality/score
 *
 * Body (JSON):
 *   {
 *     "segments": [
 *       { "id": 0, "start": 0.0, "end": 5.2, "text": "..." },
 *       ...
 *     ],
 *     "topN": 5          // optional – number of highlights to return (default 5)
 *   }
 *
 * For each segment the function calls the Hugging Face Inference API with the
 * "j-hartmann/emotion-english-distilroberta-base" model to obtain emotion labels
 * and scores.  A "viralityScore" is derived from the emotion weights below.
 * The top-N segments are returned as "highlights".
 *
 * Required environment variable:
 *   HUGGINGFACE_API_KEY  – HF Inference API token
 */

"use strict";

// Emotion → virality weight mapping (higher = more viral potential)
const EMOTION_WEIGHTS = {
  joy: 1.0,
  surprise: 0.9,
  disgust: 0.7,
  anger: 0.6,
  fear: 0.5,
  sadness: 0.4,
  neutral: 0.1,
};

const HF_MODEL =
  "j-hartmann/emotion-english-distilroberta-base";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

/**
 * Call the Hugging Face Inference API for a single text segment.
 *
 * @param {string} text
 * @param {string} hfApiKey
 * @returns {Promise<Array<{label: string, score: number}>>}
 */
async function classifyEmotion(text, hfApiKey) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`HF API error ${response.status}: ${msg}`);
  }

  const result = await response.json();
  // The HF API returns [[{label, score}, ...]] for text-classification
  return Array.isArray(result[0]) ? result[0] : result;
}

/**
 * Compute a composite virality score from the emotion classification output.
 *
 * @param {Array<{label: string, score: number}>} emotions
 * @returns {number}  value in [0, 1]
 */
function computeViralityScore(emotions) {
  let score = 0;
  for (const { label, score: emotionScore } of emotions) {
    const weight = EMOTION_WEIGHTS[label.toLowerCase()] ?? 0.1;
    score += weight * emotionScore;
  }
  return Math.min(score, 1);
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let segments, topN;
  try {
    ({ segments, topN = 5 } = JSON.parse(event.body || "{}"));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!Array.isArray(segments) || segments.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "segments must be a non-empty array" }),
    };
  }

  const hfApiKey = process.env.HUGGINGFACE_API_KEY;
  if (!hfApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "HUGGINGFACE_API_KEY is not configured" }),
    };
  }

  const scored = [];
  for (const segment of segments) {
    const text = (segment.text || "").trim();
    if (!text) {
      scored.push({ ...segment, emotions: [], viralityScore: 0 });
      continue;
    }

    let emotions = [];
    try {
      emotions = await classifyEmotion(text, hfApiKey);
    } catch (err) {
      console.error(`Emotion classification failed for segment ${segment.id}:`, err.message);
      // Continue scoring the rest of the segments
    }

    scored.push({
      ...segment,
      emotions,
      viralityScore: computeViralityScore(emotions),
    });
  }

  // Sort descending by viralityScore and return top-N as highlights
  const highlights = [...scored]
    .sort((a, b) => b.viralityScore - a.viralityScore)
    .slice(0, Math.max(1, topN));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segments: scored, highlights }),
  };
};
