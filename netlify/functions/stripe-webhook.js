exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode nicht erlaubt.' }) };

  try {
    let stripeEvent;

    if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_SECRET_KEY) {
      const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const signature = event.headers['stripe-signature'];
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      stripeEvent = JSON.parse(event.body || '{}');
    }

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const pi = stripeEvent.data?.object;
        console.log(`Zahlung erfolgreich: ${pi?.id}, Betrag: ${pi?.amount}`);
        break;
      }
      case 'customer.subscription.created': {
        const sub = stripeEvent.data?.object;
        console.log(`Neues Abo: ${sub?.id}, Plan: ${sub?.items?.data?.[0]?.price?.id}`);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data?.object;
        console.log(`Abo gekündigt: ${sub?.id}`);
        break;
      }
      default:
        console.log(`Unbekanntes Event: ${stripeEvent.type}`);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Stripe Webhook Fehler:', err.message);
    return { statusCode: 400, headers, body: JSON.stringify({ error: err.message }) };
  }
};
