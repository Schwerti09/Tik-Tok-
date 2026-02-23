const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const authMiddleware = require('../middleware/auth');
const supabase = require('../supabaseClient');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  creator: process.env.STRIPE_PRICE_CREATOR,
  pro: process.env.STRIPE_PRICE_PRO,
  business: process.env.STRIPE_PRICE_BUSINESS,
};

// POST /api/stripe/create-checkout-session
// Creates a Stripe Checkout session for the given subscription tier
router.post('/create-checkout-session', authMiddleware, async (req, res, next) => {
  try {
    const { tier } = req.body;
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/subscription/cancel`,
      client_reference_id: req.user.id,
      customer_email: req.user.email,
      metadata: { user_id: req.user.id, tier },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// POST /api/stripe/create-portal-session
// Creates a Stripe Customer Portal session for managing payment methods
router.post('/create-portal-session', authMiddleware, async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || !profile.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found for this user' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.APP_URL}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
