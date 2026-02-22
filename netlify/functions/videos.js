// Netlify Function: videos
// GET /api/videos - Returns a list of videos for the feed

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Replace with real database query using process.env.DATABASE_URL
    const videos = [
      {
        id: "1",
        url: "https://example.com/video1.mp4",
        thumbnail: "https://example.com/thumb1.jpg",
        description: "My first TikTok #viral",
        likes: 1200,
        comments: 34,
        author: { username: "user1", avatar: "https://example.com/avatar1.jpg" },
      },
      {
        id: "2",
        url: "https://example.com/video2.mp4",
        thumbnail: "https://example.com/thumb2.jpg",
        description: "Check this out! #fun #trending",
        likes: 980,
        comments: 21,
        author: { username: "user2", avatar: "https://example.com/avatar2.jpg" },
      },
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ videos }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
