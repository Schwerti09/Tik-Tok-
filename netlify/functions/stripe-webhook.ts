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
  'Content-Type': 'application/json',
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const sig = event.headers['stripe-signature']
  if (!sig) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing stripe-signature' }) }
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body ?? '',
      sig,
      webhookSecret
    )

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const tier = session.metadata?.tier ?? 'pro'

      if (userId) {
        await supabase
          .from('users')
          .update({ subscription_tier: tier })
          .eq('id', userId)
      }
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        await supabase
          .from('users')
          .update({ subscription_tier: 'free' })
          .eq('id', userId)
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) }
  } catch (error) {
    console.error('Webhook error:', error)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      }),
    }
  }
}
