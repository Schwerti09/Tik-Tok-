import type { HandlerEvent, HandlerResponse } from '@netlify/functions'

// Einfaches In-Memory-Rate-Limiting (resets bei Function Cold Start)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

interface RateLimitOptions {
  maxRequests?: number
  windowMs?: number
}

// Rate-Limiting-Middleware: gibt null zurück wenn OK, sonst eine Error-Response
export function rateLimit(
  event: HandlerEvent,
  options: RateLimitOptions = {},
): HandlerResponse | null {
  const { maxRequests = 100, windowMs = 60_000 } = options

  // IP-Adresse als Key verwenden
  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ??
    event.headers['client-ip'] ??
    'unknown'

  const now = Date.now()
  const entry = requestCounts.get(ip)

  if (!entry || now > entry.resetAt) {
    // Neues Zeitfenster starten
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
    return null
  }

  entry.count++
  if (entry.count > maxRequests) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: 'Zu viele Anfragen – bitte warte einen Moment',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
      },
    }
  }

  return null
}
