import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { makeResponse, makeError, ErrorCodes, SessionStatus, UserRole } from '@hips/types'
import { requireRole } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const authResult = await requireRole(req, [UserRole.ADMIN])
    if (authResult instanceof Response) return authResult
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50'))
    const status = searchParams.get('status')
    const facilitatorId = searchParams.get('facilitatorId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const skip = (page - 1) * limit

    const where = {
      ...(status && status !== 'ALL' ? { status: status as SessionStatus } : {}),
      ...(facilitatorId ? { facilitatorId } : {}),
      ...(startDate || endDate ? {
        scheduledAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      } : {}),
    }

    const [sessions, total] = await Promise.all([
      commerceDb.session.findMany({
        where,
        include: { user: { select: { firebaseUid: true } }, service: { select: { name: true } } },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit,
      }),
      commerceDb.session.count({ where }),
    ])

    return NextResponse.json(
      makeResponse({
        sessions: sessions.map(s => ({
          sessionId: s.id, serviceId: s.serviceId, serviceName: s.service.name,
          userId: s.user.firebaseUid, facilitatorId: s.facilitatorId,
          scheduledAt: s.scheduledAt.toISOString(), status: s.status,
          pricePaid: Number(s.pricePaid), isScholarship: s.isScholarship,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      }, requestId),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/admin/bookings]', err)
    return NextResponse.json(makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId), { status: 500 })
  }
}
