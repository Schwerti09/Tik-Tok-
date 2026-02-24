import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { supabaseAdmin } from '../shared/database/supabaseAdmin'
import { errorResponse, successResponse, toErrorMessage } from '../shared/middleware/errorHandler'

// POST /.netlify/functions/stripe/webhook
// Verarbeitet Stripe-Webhook-Events (Abonnements, Zahlungen)
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Methode nicht erlaubt')
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return errorResponse(500, 'Stripe-Konfiguration fehlt')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })

  const sig = event.headers['stripe-signature']
  if (!sig) return errorResponse(400, 'Stripe-Signatur fehlt')

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body ?? '',
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    return errorResponse(400, `Webhook-Signaturprüfung fehlgeschlagen: ${toErrorMessage(err)}`)
  }

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice
        console.log(`Zahlung erfolgreich für Kunde: ${invoice.customer}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice
        console.error(`Zahlung fehlgeschlagen für Kunde: ${invoice.customer}`)
        break
      }

      default:
        console.log(`Unbehandelter Webhook-Event-Typ: ${stripeEvent.type}`)
    }

    return successResponse({ received: true })
  } catch (err) {
    return errorResponse(500, toErrorMessage(err))
  }
}

// Abonnement-Tier anhand der Preis-ID bestimmen
function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_CREATOR) return 'creator'
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return 'business'
  return 'free'
}

// Supabase-Profil bei Abonnement-Änderung aktualisieren
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id ?? ''
  const tier = getTierFromPriceId(priceId)

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_tier: tier })
    .eq('stripe_customer_id', customerId)
}

// Abonnement beenden → zurück auf Free setzen
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_tier: 'free' })
    .eq('stripe_customer_id', customerId)
}

export { handler }
