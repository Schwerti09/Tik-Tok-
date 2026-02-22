// Netlify Function: auth
// POST /api/auth - Handle user login / registration

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

  try {
    const { username, password, action } = JSON.parse(event.body || "{}");

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "username and password are required" }),
      };
    }

    // Replace with real auth logic using process.env.JWT_SECRET and process.env.DATABASE_URL
    if (action === "register") {
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "User registered successfully" }),
      };
    }

    // Default: login
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: "replace-with-real-jwt-token",
        user: { username },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
