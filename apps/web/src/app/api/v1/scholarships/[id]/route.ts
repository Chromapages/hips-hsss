import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from 'crypto'
import { commerceDb } from '@/lib/commerce-db'
import {
  ReviewScholarshipSchema,
  makeResponse,
  makeError,
  ErrorCodes,
  UserRole,
} from '@hips/types'
import { requireRole } from '@/lib/auth'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'

// PATCH /api/v1/scholarships/:id
export async function PATCH(req: NextRequest) {
  const requestId = uuidv4()
  const rl = rateLimit(rateLimitKey(req, 'admin'), RATE_LIMITS.admin)
  if (rl !== 'ok') return rl

  try {
    const url = new URL(req.url)
    const scholarshipId = url.pathname.split('/')[5] // /api/v1/scholarships/{id}
    if (!scholarshipId) {
      return NextResponse.json(
        makeError(ErrorCodes.SCHOLARSHIP_NOT_FOUND, 'Scholarship ID is required', requestId),
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsed = ReviewScholarshipSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { status, approvedAmount, reviewNote } = parsed.data

    // 1. Fetch scholarship
    const scholarship = await commerceDb.scholarship.findUnique({
      where: { id: scholarshipId },
      include: { service: true },
    })
    if (!scholarship) {
      return NextResponse.json(
        makeError(ErrorCodes.SCHOLARSHIP_NOT_FOUND, 'Scholarship not found', requestId),
        { status: 404 }
      )
    }
    if (scholarship.status !== 'PENDING') {
      return NextResponse.json(
        makeError(ErrorCodes.ALREADY_REVIEWED, 'Scholarship has already been reviewed', requestId),
        { status: 409 }
      )
    }

    if (status === 'APPROVED' && !approvedAmount) {
      return NextResponse.json(
        makeError(ErrorCodes.APPROVED_AMOUNT_REQUIRED, 'Approved amount is required when approving', requestId),
        { status: 400 }
      )
    }

    const authResult = await requireRole(req, [UserRole.ADMIN])
    if (authResult instanceof Response) return authResult

    // Generate discount code on approval
    const expiresAt = status === 'APPROVED'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null
    const discountCode = status === 'APPROVED'
      ? `SCH-${randomBytes(16).toString('hex').toUpperCase()}`
      : null

    const updated = await commerceDb.scholarship.update({
      where: { id: scholarshipId },
      data: {
        status,
        approvedAmount: status === 'APPROVED' ? approvedAmount : null,
        discountCode,
        expiresAt,
        reviewNote,
        reviewedBy: authResult.firebaseUid,
        reviewedAt: new Date(),
      },
    })

    // Trigger Resend email: SCHOLARSHIP_APPROVED or SCHOLARSHIP_DENIED

    return NextResponse.json(
      makeResponse(
        {
          scholarshipId: updated.id,
          status: updated.status,
          discountCode: updated.discountCode,
          expiresAt: updated.expiresAt?.toISOString() ?? null,
          approvedAmount: updated.approvedAmount,
        },
        requestId
      ),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/scholarships/:id]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
