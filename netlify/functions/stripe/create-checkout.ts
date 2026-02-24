import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { requireAuth } from '../shared/middleware/auth'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// POST /.netlify/functions/stripe/create-checkout
// Erstellt eine Stripe-Checkout-Session und gibt die URL zurück
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  const authResult = await requireAuth(event)
  if (authResult.error) return authResult.error

  try {
    const body = JSON.parse(event.body ?? '{}') as { priceId?: string }
    const { priceId } = body

    if (!priceId) {
      return errorResponse(400, 'priceId ist erforderlich')
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return errorResponse(500, 'Stripe-API-Key ist nicht konfiguriert')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const appUrl = process.env.APP_URL ?? 'http://localhost:5173'

    // Vorhandene Stripe-Kunden-ID aus dem Profil lesen
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', authResult.user!.id)
      .single()

    let customerId = profile?.stripe_customer_id as string | undefined

    // Neuen Stripe-Kunden anlegen falls noch nicht vorhanden
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authResult.user!.email,
        metadata: { supabase_user_id: authResult.user!.id },
      })
      customerId = customer.id

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', authResult.user!.id)
    }

    // Checkout-Session erstellen
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    })

    return successResponse({ url: session.url })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

export { handler }
