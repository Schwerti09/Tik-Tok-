// Netlify Function: upload
// POST /api/upload - Returns a pre-signed URL for video upload

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const authHeader = event.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const { filename, contentType } = JSON.parse(event.body || "{}");

    if (!filename || !contentType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "filename and contentType are required" }),
      };
    }

    // Replace with real cloud storage pre-signed URL logic using
    // process.env.STORAGE_BUCKET, process.env.STORAGE_KEY_ID, process.env.STORAGE_SECRET
    const uploadUrl = `https://example-storage.com/upload/${Date.now()}-${filename}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ uploadUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
