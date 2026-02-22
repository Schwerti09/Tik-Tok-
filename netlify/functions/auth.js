exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, email, password, name } = body;

    // Mock implementation – replace with real Supabase calls when env vars are set
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      // Real Supabase logic would go here
    }

    const mockUser = {
      id: `user-${Date.now()}`,
      email: email || 'creator@tikflow.de',
      name:  name  || 'Creator',
      plan:  'pro',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    if (action === 'signup') {
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ user: mockUser, token: `mock-token-${Date.now()}` }),
      };
    }

    if (action === 'login') {
      if (!email || !password) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'E-Mail und Passwort erforderlich.' }) };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ user: mockUser, token: `mock-token-${Date.now()}` }),
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unbekannte Aktion.' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
