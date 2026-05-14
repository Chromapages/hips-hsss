import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { BookSessionSchema, ErrorCodes, makeError, makeResponse } from '@hips/types'
import { SESSION_HOURS_END, SESSION_HOURS_START, SESSION_HOURS_TIMEZONE } from '@/lib/config'
import { getAuthUser } from '@/lib/auth'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'

function isWithinSessionHours(datetime: Date): boolean {
  // Get day and hours in the configured timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: SESSION_HOURS_TIMEZONE,
    hour: 'numeric',
    weekday: 'short',
  })
  const parts = formatter.formatToParts(datetime)
  const dayPart = parts.find(p => p.type === 'weekday')
  const hourPart = parts.find(p => p.type === 'hour')

  const day = dayPart?.value ?? ''
  const hours = parseInt(hourPart?.value ?? '0', 10)

  // No sessions on Sundays
  if (day === 'Sun') return false

  const start = parseInt(SESSION_HOURS_START.split(':')[0])
  const end = parseInt(SESSION_HOURS_END.split(':')[0])
  return hours >= start && hours < end
}

export async function POST(req: NextRequest) {
  const requestId = uuidv4()
  const rl = await rateLimit(rateLimitKey(req, 'booking'), RATE_LIMITS.booking)
  if (rl !== 'ok') return rl

  try {
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult

    const body = await req.json()
    const parsed = BookSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    const { serviceId, scheduledAt, facilitatorId, packageId, discountCode } = parsed.data
    const sessionDate = new Date(scheduledAt)

    if (!isWithinSessionHours(sessionDate)) {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_HOURS_BLOCKED, 'Session time outside allowed window', requestId),
        { status: 403 }
      )
    }

    const result = await commerceDb.$transaction(async (tx) => {
      const service = await tx.service.findUnique({ where: { id: serviceId } })
      if (!service) {
        return { error: makeError(ErrorCodes.SERVICE_NOT_FOUND, 'Service not found', requestId), status: 404 }
      }
      if (!service.isActive) {
        return { error: makeError(ErrorCodes.SERVICE_INACTIVE, 'Service is not active', requestId), status: 422 }
      }

      const existing = await tx.session.findFirst({
        where: {
          serviceId,
          facilitatorId: facilitatorId ?? null,
          scheduledAt: sessionDate,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      })
      if (existing) {
        return { error: makeError(ErrorCodes.SLOT_UNAVAILABLE, 'Requested slot is not available', requestId), status: 400 }
      }

      let pricePaid = Number(service.standardPrice)
      let isScholarship = false
      let scholarshipCode: string | null = null

      if (packageId) {
        const pkg = await tx.package.findFirst({
          where: {
            id: packageId,
            userId: authResult.userId,
            serviceId,
            status: 'ACTIVE',
            expiresAt: { gte: new Date() },
          },
        })

        if (!pkg) {
          return { error: makeError(ErrorCodes.PACKAGE_EXPIRED, 'Package not found for this account and service', requestId), status: 400 }
        }
        if (pkg.usedSessions >= pkg.totalSessions) {
          return { error: makeError(ErrorCodes.PACKAGE_EXHAUSTED, 'Package has no sessions remaining', requestId), status: 400 }
        }

        const consumed = await tx.package.updateMany({
          where: {
            id: pkg.id,
            userId: authResult.userId,
            serviceId,
            usedSessions: { lt: pkg.totalSessions },
            status: 'ACTIVE',
          },
          data: { usedSessions: { increment: 1 } },
        })
        if (consumed.count !== 1) {
          return { error: makeError(ErrorCodes.PACKAGE_EXHAUSTED, 'Package was already used by another request', requestId), status: 409 }
        }

        pricePaid = 0
      }

      if (discountCode) {
        const code = discountCode.toUpperCase()
        const scholarship = await tx.scholarship.findUnique({ where: { discountCode: code } })
        if (!scholarship || scholarship.status !== 'APPROVED') {
          return { error: makeError(ErrorCodes.DISCOUNT_CODE_INVALID, 'Discount code is invalid or already used', requestId), status: 400 }
        }
        if (scholarship.userId !== authResult.userId) {
          return { error: makeError(ErrorCodes.FORBIDDEN, 'Discount code does not belong to this account', requestId), status: 403 }
        }
        if (scholarship.expiresAt && scholarship.expiresAt < new Date()) {
          return { error: makeError(ErrorCodes.DISCOUNT_CODE_INVALID, 'Discount code has expired', requestId), status: 400 }
        }
        if (scholarship.serviceId !== serviceId) {
          return { error: makeError(ErrorCodes.DISCOUNT_CODE_WRONG_SERVICE, 'Discount code not valid for this service', requestId), status: 400 }
        }

        const redeemed = await tx.scholarship.updateMany({
          where: { id: scholarship.id, status: 'APPROVED', userId: authResult.userId, expiresAt: { gte: new Date() } },
          data: { status: 'EXPIRED' },
        })
        if (redeemed.count !== 1) {
          return { error: makeError(ErrorCodes.DISCOUNT_CODE_INVALID, 'Discount code was already used', requestId), status: 409 }
        }

        pricePaid = Math.max(0, Number(service.standardPrice) - Number(scholarship.approvedAmount ?? 0))
        isScholarship = true
        scholarshipCode = code
      }

      const session = await tx.session.create({
        data: {
          userId: authResult.userId,
          serviceId,
          facilitatorId: facilitatorId ?? null,
          packageId: packageId ?? null,
          status: 'PENDING',
          scheduledAt: sessionDate,
          pricePaid,
          isScholarship,
          scholarshipCode,
        },
      })

      return { session, status: 201 }
    })

    if ('error' in result) {
      return NextResponse.json(result.error, { status: result.status })
    }

    return NextResponse.json(
      makeResponse(
        {
          sessionId: result.session.id,
          serviceId: result.session.serviceId,
          scheduledAt: result.session.scheduledAt.toISOString(),
          status: result.session.status,
          pricePaid: result.session.pricePaid,
          isScholarship: result.session.isScholarship,
          packageId: result.session.packageId,
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
