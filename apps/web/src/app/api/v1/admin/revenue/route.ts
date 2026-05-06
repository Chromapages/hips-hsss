import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { makeResponse, makeError, ErrorCodes, UserRole } from '@hips/types'
import { requireRole } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const authResult = await requireRole(req, [UserRole.ADMIN])
    if (authResult instanceof Response) return authResult
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (!startDate || !endDate) {
      return NextResponse.json(makeError(ErrorCodes.VALIDATION_ERROR, 'startDate and endDate are required', requestId), { status: 400 })
    }
    const start = new Date(startDate)
    const end = new Date(endDate)

    const [sessions, donations] = await Promise.all([
      commerceDb.session.findMany({
        where: { status: 'COMPLETED', completedAt: { gte: start, lte: end } },
        include: { service: { select: { category: true } } },
      }),
      commerceDb.donation.findMany({ where: { createdAt: { gte: start, lte: end } } }),
    ])

    const totalRevenue = sessions.reduce((sum, s) => sum + Number(s.pricePaid), 0)
    const serviceRevenue = sessions.filter(s => !s.isScholarship).reduce((sum, s) => sum + Number(s.pricePaid), 0)
    const donationRevenue = donations.reduce((sum, d) => sum + Number(d.amount), 0)
    const scholarshipDiscount = sessions.filter(s => s.isScholarship).reduce((sum, s) => sum + Number(s.pricePaid), 0)

    const byCategory = Object.entries(sessions.reduce<Record<string, { revenue: number; sessionCount: number }>>((acc, s) => {
      const cat = s.service.category
      if (!acc[cat]) acc[cat] = { revenue: 0, sessionCount: 0 }
      acc[cat].revenue += Number(s.pricePaid)
      acc[cat].sessionCount++
      return acc
    }, {})).map(([category, data]) => ({ category, ...data }))

    const completedCount = sessions.length
    const noShowCount = await commerceDb.session.count({ where: { status: 'NO_SHOW', completedAt: { gte: start, lte: end } } })

    return NextResponse.json(
      makeResponse({
        summary: { totalRevenue, serviceRevenue, donationRevenue, scholarshipDiscount },
        byCategory,
        byPeriod: [],
        kpis: {
          sessionCompletionRate: completedCount + noShowCount > 0 ? completedCount / (completedCount + noShowCount) : 0,
          packageUtilizationRate: 0,
          cohortFillRate: 0,
          donationConversionRate: 0,
          scholarshipUsageRate: sessions.length > 0 ? sessions.filter(s => s.isScholarship).length / sessions.length : 0,
        },
      }, requestId),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/admin/revenue]', err)
    return NextResponse.json(makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId), { status: 500 })
  }
}
