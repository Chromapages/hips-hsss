import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export type { Stripe }

// ─── Payment Intent ──────────────────────────────────────────────────────────

export interface CreateSessionPaymentIntentParams {
  amount: number // cents
  currency?: 'usd'
  metadata: {
    type: 'SERVICE_PURCHASE'
    sessionId: string
    userId: string
    serviceId: string
  }
}

export interface CreateDonationPaymentIntentParams {
  amount: number // cents
  email: string
  metadata: {
    type: 'DONATION'
    userId?: string
    tier: string
  }
}

export async function createSessionPaymentIntent(
  params: CreateSessionPaymentIntentParams
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency ?? 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: params.metadata,
  })
}

export async function createDonationPaymentIntent(
  params: CreateDonationPaymentIntentParams
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    receipt_email: params.email,
    metadata: params.metadata,
  })
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
