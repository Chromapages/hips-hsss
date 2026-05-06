import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import {
  PurchasePackageSchema,
  makeResponse,
  makeError,
  ErrorCodes,
  ServiceCategory,
} from '@hips/types'
import { getAuthUser } from '@/lib/auth'

// POST /api/v1/packages/purchase
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const body = await req.json()
    const parsed = PurchasePackageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { serviceId, stripePaymentId, isScholarship, discountCode } = parsed.data

    // 1. Check duplicate PaymentIntent (idempotency)
    const existing = await commerceDb.package.findUnique({
      where: { stripePaymentId },
    })
    if (existing) {
      return NextResponse.json(
        makeError(ErrorCodes.DUPLICATE_PAYMENT, 'Payment already processed', requestId),
        { status: 400 }
      )
    }

    // 2. Validate service
    const service = await commerceDb.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return NextResponse.json(
        makeError(ErrorCodes.SERVICE_NOT_FOUND, 'Service not found', requestId),
        { status: 404 }
      )
    }
    if (service.category !== 'CARE_SESSION' && service.category !== 'COACHING') {
      return NextResponse.json(
        makeError(ErrorCodes.INVALID_SERVICE_CATEGORY, 'Packages only available for care sessions and coaching', requestId),
        { status: 400 }
      )
    }

    // 3. Get authenticated user
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult

    // 4. Determine package size from service name (4-session vs 8-session)
    const totalSessions = service.name.toLowerCase().includes('8') ? 8 : 4

    // 5. Calculate price
    let pricePaid = service.standardPrice * totalSessions
    let discountAmount = 0
    if (discountCode) {
      const scholarship = await commerceDb.scholarship.findUnique({
        where: { discountCode: discountCode.toUpperCase() },
      })
      if (scholarship?.status === 'APPROVED' && scholarship.serviceId === serviceId) {
        discountAmount = scholarship.approvedAmount ?? 0
        pricePaid = Math.max(0, pricePaid - discountAmount)
      }
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    const pkg = await commerceDb.package.create({
      data: {
        userId: authResult.userId,
        serviceId,
        totalSessions,
        usedSessions: 0,
        status: 'ACTIVE',
        expiresAt,
        pricePaid,
        stripePaymentId,
        isScholarship,
        discountCode: discountCode?.toUpperCase(),
      },
    })

    return NextResponse.json(
      makeResponse(
        {
          packageId: pkg.id,
          totalSessions: pkg.totalSessions,
          usedSessions: pkg.usedSessions,
          expiresAt: pkg.expiresAt.toISOString(),
          pricePaid: pkg.pricePaid,
        },
        requestId
      ),
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/v1/packages/purchase]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
