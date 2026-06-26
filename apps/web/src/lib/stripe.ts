import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia' as any,
    typescript: true,
  });

  return stripeClient;
}
