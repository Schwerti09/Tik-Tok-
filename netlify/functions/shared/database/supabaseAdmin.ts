import { createClient } from '@supabase/supabase-js'
import type { HandlerEvent } from '@netlify/functions'

// Supabase Admin-Client mit Service-Role-Key (nur serverseitig verwenden!)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  {
    auth: { autoRefreshToken: false, persistSession: false },
  },
)

// JWT-Token aus Authorization-Header extrahieren
export function extractBearerToken(event: HandlerEvent): string | null {
  const header = event.headers['authorization'] ?? event.headers['Authorization']
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7)
}

// Angemeldeten Benutzer anhand des Tokens ermitteln
export async function getUserFromToken(token: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}
