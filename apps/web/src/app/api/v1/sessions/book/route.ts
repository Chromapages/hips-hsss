import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import {
  BookSessionSchema,
  makeResponse,
  makeError,
  ErrorCodes,
} from '@hips/types'
import { SESSION_HOURS_START, SESSION_HOURS_END, SCHOLARSHIP_MONTHLY_BUDGET_CAP } from '@/lib/config'
import { getAuthUser } from '@/lib/auth'

// Session hours: Mon–Sat 8am–9pm ET
function isWithinSessionHours(datetime: Date): boolean {
  const day = datetime.getDay()
  if (day === 0) return false // Sunday blocked
  const hours = datetime.getHours()
  const start = parseInt(SESSION_HOURS_START.split(':')[0])
  const end = parseInt(SESSION_HOURS_END.split(':')[0])
  return hours >= start && hours < end
}

export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const body = await req.json()
    const parsed = BookSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }
    const { serviceId, scheduledAt, facilitatorId, packageId, discountCode } = parsed.data

    // 1. Validate service exists and is active
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

    // 2. Validate session hours
    const sessionDate = new Date(scheduledAt)
    if (!isWithinSessionHours(sessionDate)) {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_HOURS_BLOCKED, 'Session time outside allowed window', requestId),
        { status: 403 }
      )
    }

    // 3. Check slot availability (no existing CONFIRMED session at same time with same facilitator)
    const existing = await commerceDb.session.findFirst({
      where: {
        serviceId,
        facilitatorId: facilitatorId ?? null,
        scheduledAt: sessionDate,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      },
    })
    if (existing) {
      return NextResponse.json(
        makeError(ErrorCodes.SLOT_UNAVAILABLE, 'Requested slot is not available', requestId),
        { status: 400 }
      )
    }

    // 4. Package validation (if packageId provided)
    let pricePaid = service.standardPrice
    if (packageId) {
      const pkg = await commerceDb.package.findUnique({ where: { id: packageId } })
      if (!pkg) {
        return NextResponse.json(
          makeError(ErrorCodes.PACKAGE_EXPIRED, 'Package not found', requestId),
          { status: 400 }
        )
      }
      if (pkg.status !== 'ACTIVE' || new Date(pkg.expiresAt) < new Date()) {
        return NextResponse.json(
          makeError(ErrorCodes.PACKAGE_EXPIRED, 'Package has expired', requestId),
          { status: 400 }
        )
      }
      if (pkg.usedSessions >= pkg.totalSessions) {
        return NextResponse.json(
          makeError(ErrorCodes.PACKAGE_EXHAUSTED, 'Package has no sessions remaining', requestId),
          { status: 400 }
        )
      }
      // Atomically increment usedSessions
      await commerceDb.package.update({
        where: { id: packageId },
        data: { usedSessions: { increment: 1 } },
      })
      pricePaid = 0 // Package covers the session
    }

    // 5. Discount code validation
    let isScholarship = false
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
      pricePaid = Math.max(0, service.standardPrice - (scholarship.approvedAmount ?? 0))
      isScholarship = true
    }

    // 6. Get authenticated user
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult
    const { userId } = authResult

    const session = await commerceDb.session.create({
      data: {
        userId,
        serviceId,
        facilitatorId: facilitatorId ?? null,
        packageId: packageId ?? null,
        status: 'PENDING',
        scheduledAt: sessionDate,
        pricePaid,
        isScholarship,
        discountCode: discountCode?.toUpperCase() ?? null,
      },
    })

    // Booking confirmation email would be triggered via Resend
    // await sendBookingConfirmationEmail(session)

    return NextResponse.json(
      makeResponse(
        {
          sessionId: session.id,
          serviceId: session.serviceId,
          scheduledAt: session.scheduledAt.toISOString(),
          status: session.status,
          pricePaid: session.pricePaid,
          isScholarship: session.isScholarship,
          packageId: session.packageId,
          confirmationEmailSent: false,
        },
        requestId
      ),
      { status: 201 }
    )
  } catch (err) {
    console.error('[/api/v1/sessions/book]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
