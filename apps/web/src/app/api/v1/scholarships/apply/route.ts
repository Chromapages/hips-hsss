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

// POST /api/v1/scholarships/apply
export async function POST(req: NextRequest) {
  const requestId = uuidv4()
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
    if (service.scholarshipMin !== null && requestedAmount < service.scholarshipMin) {
      return NextResponse.json(
        makeError(ErrorCodes.AMOUNT_OUT_OF_RANGE, `Requested amount below minimum (${service.scholarshipMin / 100})`, requestId),
        { status: 400 }
      )
    }
    if (service.scholarshipMax !== null && requestedAmount > service.scholarshipMax) {
      return NextResponse.json(
        makeError(ErrorCodes.AMOUNT_OUT_OF_RANGE, `Requested amount above maximum (${service.scholarshipMax / 100})`, requestId),
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
    const budget = await commerceDb.scholarshipBudget.findUnique({
      where: { id: 'monthly_cap' },
    })
    const monthlyCap = budget?.monthlyCap ?? SCHOLARSHIP_MONTHLY_BUDGET_CAP
    const monthlyUsed = await commerceDb.scholarship.aggregate({
      where: {
        status: 'APPROVED',
        createdAt: { gte: monthStart },
      },
      _sum: { approvedAmount: true },
    })
    const totalUsed = (monthlyUsed._sum.approvedAmount ?? 0) + requestedAmount
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
