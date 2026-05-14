import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe'
import {
  CheckoutDonationSchema,
  makeResponse,
  makeError,
  ErrorCodes,
} from '@hips/types'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
})

// POST /api/v1/checkout/donation
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  const rl = await rateLimit(rateLimitKey(req, 'donation'), RATE_LIMITS.donation)
  if (rl !== 'ok') return rl

  try {
    const body = await req.json()
    const parsed = CheckoutDonationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { amount, tier, email } = parsed.data

    // Create Stripe PaymentIntent with metadata.type = "DONATION"
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        receipt_email: email,
        metadata: {
          type: 'DONATION',
          tier,
          email,
          userId: 'anonymous',
        },
        description: `H.I.P.S. Donation — ${tier.replace('_', ' ')}`,
      },
      { timeout: 30000 }
    )

    return NextResponse.json(
      makeResponse(
        {
          clientSecret: paymentIntent.client_secret,
          amount,
          currency: 'usd',
          paymentIntentId: paymentIntent.id,
        },
        requestId
      ),
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/v1/checkout/donation]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
