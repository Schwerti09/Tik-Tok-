import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// GET /.netlify/functions/stripe/subscription
// Gibt das aktuelle Abonnement des angemeldeten Benutzers zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return errorResponse(500, 'Stripe-API-Key ist nicht konfiguriert')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    // Stripe-Kunden-ID aus dem Profil lesen
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, subscription_tier')
      .eq('id', authResult.user!.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return successResponse({ subscription: null, tier: 'free' })
    }

    // Aktives Abonnement bei Stripe abrufen
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id as string,
      status: 'active',
      limit: 1,
    })

    const subscription = subscriptions.data[0] ?? null

    return successResponse({
      subscription,
      tier: profile.subscription_tier ?? 'free',
    })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
