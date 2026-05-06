import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe'
import { commerceDb } from '@/lib/commerce-db'
import {
  CheckoutSessionSchema,
  makeResponse,
  makeError,
  ErrorCodes,
} from '@hips/types'
import { getAuthUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
})

// POST /api/v1/checkout/session
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const body = await req.json()
    const parsed = CheckoutSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { serviceId, discountCode, packageTier } = parsed.data

    // 1. Validate service
    const service = await commerceDb.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return NextResponse.json(
        makeError(ErrorCodes.SERVICE_NOT_FOUND, 'Service not found', requestId),
        { status: 404 }
      )
    }
    if (!service.isActive) {
      return NextResponse.json(
        makeError(ErrorCodes.SERVICE_INACTIVE, 'Service is not active', requestId),
        { status: 422 }
      )
    }

    // 2. Calculate amount
    let amount = service.standardPrice
    let appliedDiscount = 0

    if (discountCode) {
      const scholarship = await commerceDb.scholarship.findUnique({
        where: { discountCode: discountCode.toUpperCase() },
      })
      if (!scholarship || scholarship.status !== 'APPROVED') {
        return NextResponse.json(
          makeError(ErrorCodes.DISCOUNT_CODE_INVALID, 'Discount code is invalid or expired', requestId),
          { status: 400 }
        )
      }
      if (scholarship.expiresAt && new Date(scholarship.expiresAt) < new Date()) {
        return NextResponse.json(
          makeError(ErrorCodes.DISCOUNT_CODE_INVALID, 'Discount code has expired', requestId),
          { status: 400 }
        )
      }
      if (scholarship.serviceId !== serviceId) {
        return NextResponse.json(
          makeError(ErrorCodes.DISCOUNT_CODE_WRONG_SERVICE, 'Discount code not valid for this service', requestId),
          { status: 400 }
        )
      }
      appliedDiscount = scholarship.approvedAmount ?? 0
      amount = Math.max(0, amount - appliedDiscount)
    }

    // Package multiplier
    if (packageTier === '8_SESSION') {
      amount = amount * 8
    } else if (packageTier === '4_SESSION') {
      amount = amount * 4
    }

    // 3. Get authenticated user and create Stripe PaymentIntent
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        type: 'SERVICE_PURCHASE',
        serviceId,
        userId: authResult.firebaseUid,
        discountCode: discountCode?.toUpperCase() ?? '',
        packageTier: packageTier ?? 'SINGLE',
      },
    })

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
    console.error('[/api/v1/checkout/session]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
