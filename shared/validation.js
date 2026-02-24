/* tikflow/shared/validation.js */
// Eingabevalidierung – wird sowohl im Backend (Express-Routen) als auch
// im Frontend genutzt, um doppelten Validierungscode zu vermeiden.

/**
 * Prüft ob ein Wert ein nicht-leerer String ist.
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validiert eine E-Mail-Adresse.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validiert ein Passwort (mind. 8 Zeichen).
 * @param {string} password
 * @returns {boolean}
 */
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

/**
 * Validiert den Scheduler-Payload.
 * @param {{ platform?: unknown, scheduled_at?: unknown }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSchedulePayload(body) {
  const errors = [];
  const allowedPlatforms = ['tiktok', 'instagram', 'youtube'];

  if (!body.platform || !allowedPlatforms.includes(body.platform)) {
    errors.push(`platform muss einer von ${allowedPlatforms.join(', ')} sein`);
  }

  const time = body.scheduled_at || body.scheduled_time;
  if (!time || isNaN(new Date(time).getTime())) {
    errors.push('scheduled_at muss ein gültiges Datum sein');
  } else if (new Date(time) <= new Date()) {
    errors.push('scheduled_at muss in der Zukunft liegen');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validiert den Ideen-Generator-Payload.
 * @param {{ keyword?: unknown }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateIdeaGeneratePayload(body) {
  const errors = [];
  if (!isNonEmptyString(body.keyword)) {
    errors.push('keyword darf nicht leer sein');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validiert den Subscriptions-Tier-Payload.
 * @param {{ tier?: unknown }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSubscriptionTier(body) {
  const errors = [];
  const allowedTiers = ['creator', 'pro', 'business'];
  if (!body.tier || !allowedTiers.includes(body.tier)) {
    errors.push(`tier muss einer von ${allowedTiers.join(', ')} sein`);
  }
  return { valid: errors.length === 0, errors };
}

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  validateSchedulePayload,
  validateIdeaGeneratePayload,
  validateSubscriptionTier,
};
