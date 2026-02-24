import type { HandlerResponse } from '@netlify/functions'

// Einheitliche Fehler-Response-Hilfsfunktion
export function errorResponse(statusCode: number, message: string): HandlerResponse {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
    headers: { 'Content-Type': 'application/json' },
  }
}

// Einheitliche Erfolgs-Response-Hilfsfunktion
export function successResponse<T>(data: T, statusCode = 200): HandlerResponse {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }
}

// Unbekannten Fehler in eine lesbare Meldung umwandeln
export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Interner Serverfehler'
}
