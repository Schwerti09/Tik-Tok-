import type { Handler, HandlerEvent } from '@netlify/functions'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { priceId, userId, tier } = JSON.parse(event.body ?? '{}')

    if (!priceId || !userId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing priceId or userId' }) }
    }

    // Get or create Stripe customer
    const { data: userData } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single()

    let customerId: string | undefined = (userData as { stripe_customer_id?: string })?.stripe_customer_id

    if (!customerId && userData?.email) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { userId },
      })
      customerId = customer.id
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.VITE_APP_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.VITE_APP_URL}/settings`,
      metadata: { userId, tier: tier ?? 'pro' },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, error: null }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : 'Subscription creation failed',
      }),
    }
  }
}
