'use strict';

const https = require('https');
const crypto = require('crypto');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function verifyStripeSignature(payload, signature, secret) {
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const receivedSig = parts['v1'];
  if (!receivedSig) return false;

  return crypto.timingSafeEqual(
    Buffer.from(expectedSig, 'hex'),
    Buffer.from(receivedSig, 'hex')
  );
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers?.['stripe-signature'];
  const rawBody = event.body;

  if (webhookSecret && signature) {
    const isValid = verifyStripeSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid Stripe signature' }),
      };
    }
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const eventType = stripeEvent.type || '';

  switch (eventType) {
    case 'payment_intent.succeeded':
      // Fulfill the order: update user subscription, send confirmation email, etc.
      console.log('Payment succeeded:', stripeEvent.data?.object?.id);
      break;

    case 'customer.subscription.created':
      // Provision access to the Pro plan features
      console.log('Subscription created:', stripeEvent.data?.object?.id);
      break;

    case 'customer.subscription.updated':
      // Handle plan upgrade/downgrade
      console.log('Subscription updated:', stripeEvent.data?.object?.id);
      break;

    case 'customer.subscription.deleted':
      // Revoke access to paid features
      console.log('Subscription deleted:', stripeEvent.data?.object?.id);
      break;

    case 'invoice.payment_failed':
      // Notify user of failed payment, retry logic
      console.log('Payment failed for invoice:', stripeEvent.data?.object?.id);
      break;

    default:
      console.log('Unhandled Stripe event:', eventType);
  }

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true, type: eventType }),
  };
};
