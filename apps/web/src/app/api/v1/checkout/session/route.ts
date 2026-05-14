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
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
})

// POST /api/v1/checkout/session
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  const rl = await rateLimit(rateLimitKey(req, 'checkout'), RATE_LIMITS.checkout)
  if (rl !== 'ok') return rl

  try {
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult

    const body = await req.json()
    const parsed = CheckoutSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { serviceId, sessionId, discountCode, packageTier } = parsed.data

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
    let amount = Math.round(Number(service.standardPrice) * 100)
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
      if (scholarship.userId !== authResult.userId) {
        return NextResponse.json(
          makeError(ErrorCodes.FORBIDDEN, 'Discount code does not belong to this account', requestId),
          { status: 403 }
        )
      }
      appliedDiscount = Math.round(Number(scholarship.approvedAmount ?? 0) * 100)
      amount = Math.max(0, amount - appliedDiscount)
    }

    // Package multiplier
    if (packageTier === '8_SESSION') {
      amount = amount * 8
    } else if (packageTier === '4_SESSION') {
      amount = amount * 4
    }

    const metadataType = packageTier === '4_SESSION' || packageTier === '8_SESSION'
      ? 'PACKAGE_PURCHASE'
      : 'SERVICE_PURCHASE'
    const totalSessions = packageTier === '8_SESSION' ? '8' : packageTier === '4_SESSION' ? '4' : '1'
    if (metadataType === 'SERVICE_PURCHASE' && !sessionId) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Single-session checkout requires a booked session ID', requestId),
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        metadata: {
          type: metadataType,
          serviceId,
          sessionId: sessionId ?? '',
          userId: authResult.userId,
          firebaseUid: authResult.firebaseUid,
          discountCode: discountCode?.toUpperCase() ?? '',
          packageTier: packageTier ?? 'SINGLE',
          totalSessions,
        },
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
    console.error('[/api/v1/checkout/session]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
