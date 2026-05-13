import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import {
  ApplyScholarshipSchema,
  makeResponse,
  makeError,
  ErrorCodes,
} from '@hips/types'
import { getAuthUser } from '@/lib/auth'
import { SCHOLARSHIP_MONTHLY_BUDGET_CAP } from '@/lib/config'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'

// POST /api/v1/scholarships/apply
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  const rl = rateLimit(rateLimitKey(req, 'scholarship'), RATE_LIMITS.scholarship)
  if (rl !== 'ok') return rl

  try {
    const body = await req.json()
    const parsed = ApplyScholarshipSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { serviceId, requestedAmount, reason } = parsed.data

    // 1. Validate service exists
    const service = await commerceDb.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return NextResponse.json(
        makeError(ErrorCodes.SERVICE_NOT_FOUND, 'Service not found', requestId),
        { status: 404 }
      )
    }

    // 2. Validate amount is within scholarship range
    const scholarshipMin = Math.round(Number(service.scholarshipMin ?? 0) * 100)
    const scholarshipMax = Math.round(Number(service.scholarshipMax ?? 0) * 100)
    if (requestedAmount < scholarshipMin) {
      return NextResponse.json(
        makeError(ErrorCodes.AMOUNT_OUT_OF_RANGE, `Requested amount below minimum (${scholarshipMin / 100})`, requestId),
        { status: 400 }
      )
    }
    if (scholarshipMax > 0 && requestedAmount > scholarshipMax) {
      return NextResponse.json(
        makeError(ErrorCodes.AMOUNT_OUT_OF_RANGE, `Requested amount above maximum (${scholarshipMax / 100})`, requestId),
        { status: 400 }
      )
    }

    // 3. Get authenticated user
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult

    // 4. Check for duplicate pending application
    const existingApp = await commerceDb.scholarship.findFirst({
      where: {
        userId: authResult.userId,
        serviceId,
        status: 'PENDING',
      },
    })
    if (existingApp) {
      return NextResponse.json(
        makeError(ErrorCodes.DUPLICATE_APPLICATION, 'An active scholarship application already exists for this service', requestId),
        { status: 409 }
      )
    }

    // 5. Check monthly budget cap
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyCap = SCHOLARSHIP_MONTHLY_BUDGET_CAP
    const monthlyUsed = await commerceDb.scholarship.aggregate({
      where: {
        status: 'APPROVED',
        createdAt: { gte: monthStart },
      },
      _sum: { approvedAmount: true },
    })
    const totalUsed = Math.round(Number(monthlyUsed._sum.approvedAmount ?? 0) * 100) + requestedAmount
    if (totalUsed > monthlyCap) {
      return NextResponse.json(
        makeError(ErrorCodes.SCHOLARSHIP_CAP_REACHED, 'Monthly scholarship budget exhausted', requestId),
        { status: 400 }
      )
    }

    const scholarship = await commerceDb.scholarship.create({
      data: {
        userId: authResult.userId,
        serviceId,
        status: 'PENDING',
        requestedAmount,
        reason,
      },
    })

    // Admin notification would be sent via Resend here

    return NextResponse.json(
      makeResponse(
        {
          scholarshipId: scholarship.id,
          status: scholarship.status,
          serviceId: scholarship.serviceId,
          requestedAmount: scholarship.requestedAmount,
          submittedAt: scholarship.createdAt.toISOString(),
        },
        requestId
      ),
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/v1/scholarships/apply]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
