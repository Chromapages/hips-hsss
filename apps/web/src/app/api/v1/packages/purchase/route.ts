import { NextResponse } from 'next/server'
import { ErrorCodes, makeError } from '@hips/types'

// Package grants are fulfilled only after Stripe confirms payment through the
// signed webhook. Keeping this route closed prevents client-side entitlement minting.
export async function POST() {
  return NextResponse.json(
    makeError(
      ErrorCodes.FORBIDDEN,
      'Package fulfillment is handled by the Stripe webhook after payment confirmation.',
      crypto.randomUUID()
    ),
    { status: 403 }
  )
}
