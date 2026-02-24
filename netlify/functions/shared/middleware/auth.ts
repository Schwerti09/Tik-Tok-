import type { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { extractBearerToken, getUserFromToken } from '../database/supabaseAdmin'

// Authentifiziertes Benutzer-Objekt aus dem Token lesen
export async function requireAuth(event: HandlerEvent): Promise<
  { user: Awaited<ReturnType<typeof getUserFromToken>>; error: null } |
  { user: null; error: HandlerResponse }
> {
  const token = extractBearerToken(event)
  if (!token) {
    return {
      user: null,
      error: {
        statusCode: 401,
        body: JSON.stringify({ error: 'Nicht autorisiert: Bearer-Token fehlt' }),
        headers: { 'Content-Type': 'application/json' },
      },
    }
  }

  const user = await getUserFromToken(token)
  if (!user) {
    return {
      user: null,
      error: {
        statusCode: 401,
        body: JSON.stringify({ error: 'Nicht autorisiert: Ungültiger Token' }),
        headers: { 'Content-Type': 'application/json' },
      },
    }
  }

  return { user, error: null }
}
