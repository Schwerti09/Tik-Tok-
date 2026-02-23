const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TIER_BY_PRICE = {
  [process.env.STRIPE_PRICE_CREATOR]: 'creator',
  [process.env.STRIPE_PRICE_PRO]: 'pro',
  [process.env.STRIPE_PRICE_BUSINESS]: 'business',
};

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const userId = session.metadata && session.metadata.user_id;
        const tier = session.metadata && session.metadata.tier;
        if (userId && tier) {
          const { error: dbError } = await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              stripe_customer_id: session.customer,
            })
            .eq('id', userId);
          if (dbError) throw new Error(`DB update failed: ${dbError.message}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = stripeEvent.data.object;
        const customerId = invoice.customer;
        if (customerId && invoice.lines && invoice.lines.data.length > 0) {
          const priceId = invoice.lines.data[0].price && invoice.lines.data[0].price.id;
          const tier = TIER_BY_PRICE[priceId];
          if (tier) {
            const { error: dbError } = await supabase
              .from('profiles')
              .update({ subscription_tier: tier })
              .eq('stripe_customer_id', customerId);
            if (dbError) throw new Error(`DB update failed: ${dbError.message}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;
        if (customerId) {
          const { error: dbError } = await supabase
            .from('profiles')
            .update({ subscription_tier: 'free' })
            .eq('stripe_customer_id', customerId);
          if (dbError) throw new Error(`DB update failed: ${dbError.message}`);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
