import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { makeResponse, makeError, ErrorCodes, ScholarshipStatus, UserRole } from '@hips/types'
import { requireRole } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const authResult = await requireRole(req, [UserRole.ADMIN])
    if (authResult instanceof Response) return authResult
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '50'))
    const status = (searchParams.get('status') as ScholarshipStatus) ?? 'PENDING'
    const skip = (page - 1) * limit
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [scholarships, total] = await Promise.all([
      commerceDb.scholarship.findMany({
        where: { status },
        include: { user: { select: { firebaseUid: true } }, service: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }, skip, take: limit,
      }),
      commerceDb.scholarship.count({ where: { status } }),
    ])

    const monthlyUsed = await commerceDb.scholarship.aggregate({
      where: { status: 'APPROVED', createdAt: { gte: monthStart } },
      _sum: { approvedAmount: true },
    })

    const monthlyCapTotal = 50000
    const monthlyCapUsed = Number(monthlyUsed._sum.approvedAmount ?? 0)

    return NextResponse.json(
      makeResponse({
        scholarships: scholarships.map(s => ({
          scholarshipId: s.id, userId: s.user.firebaseUid, serviceId: s.serviceId,
          serviceName: s.service.name, requestedAmount: Number(s.requestedAmount),
          approvedAmount: s.approvedAmount ? Number(s.approvedAmount) : null,
          reason: s.reason, status: s.status, discountCode: s.discountCode,
          expiresAt: s.expiresAt?.toISOString() ?? null, createdAt: s.createdAt.toISOString(),
        })),
        budgetStatus: {
          monthlyCapTotal, monthlyCapUsed,
          monthlyCapRemaining: Math.max(0, monthlyCapTotal - monthlyCapUsed),
          waitlistCount: await commerceDb.scholarship.count({ where: { status: 'WAITLISTED' } }),
        },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      }, requestId),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/admin/scholarships]', err)
    return NextResponse.json(makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId), { status: 500 })
  }
}
