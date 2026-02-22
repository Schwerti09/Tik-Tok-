/**
 * Netlify Function: ideagen-generate
 * Route:  POST /api/ideagen/generate
 *
 * Body (JSON):
 *   { "topic": "Fitness", "niche": "Home-Workouts" }
 *
 * Returns a JSON array of 10 TikTok video concepts, each containing:
 *   - hook        : first-3-second hook text
 *   - description : brief action description
 *   - sounds      : [string, string, string]
 *   - hashtags    : [string, string, string, string, string]
 */

"use strict";

const { OpenAI } = require("openai");

const ALLOWED_METHODS = ["POST"];

/**
 * Build the system + user messages for GPT-4.
 * @param {string} topic
 * @param {string} niche
 * @returns {Array<{role: string, content: string}>}
 */
function buildMessages(topic, niche) {
  return [
    {
      role: "system",
      content:
        "Du bist ein kreativer Assistent für TikTok-Creatorinnen. " +
        "Antworte ausschließlich mit einem validen JSON-Array, ohne zusätzliche Erklärungen.",
    },
    {
      role: "user",
      content:
        `Generiere 10 kurze Videokonzepte zum Thema "${topic}" in der Nische "${niche}". ` +
        "Jedes Konzept soll enthalten: " +
        "einen einprägsamen Hook (erste 3 Sekunden), " +
        "eine kurze Beschreibung der Handlung, " +
        "3 empfohlene Sounds, " +
        "5 relevante Hashtags. " +
        "Formatiere die Antwort als JSON-Objekt mit einem Array-Feld \"concepts\", " +
        "wobei jedes Element die Felder enthält: " +
        "hook, description, sounds (Array mit 3 Strings), hashtags (Array mit 5 Strings).",
    },
  ];
}

exports.handler = async function (event) {
  if (!ALLOWED_METHODS.includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let topic, niche;
  try {
    ({ topic, niche } = JSON.parse(event.body || "{}"));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!topic || !niche) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields: topic, niche" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
    };
  }

  const client = new OpenAI({ apiKey });

  let concepts;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: buildMessages(topic, niche),
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    concepts = parsed.concepts ?? parsed;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to generate ideas", detail: err.message }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concepts }),
  };
};
