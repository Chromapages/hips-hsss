import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { makeResponse, makeError, ErrorCodes } from '@hips/types'
import { getAuthUser } from '@/lib/auth'

// GET /api/v1/packages/balance
export async function GET(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const authResult = await getAuthUser(req)
    if (authResult instanceof Response) return authResult

    const packages = await commerceDb.package.findMany({
      where: {
        userId: authResult.userId,
        status: 'ACTIVE',
        expiresAt: { gte: new Date() },
      },
      include: { service: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const now = new Date()
    const packagesWithBalance = packages.map(pkg => {
      const remaining = pkg.totalSessions - pkg.usedSessions
      const isExpiringSoon = (pkg.expiresAt.getTime() - now.getTime()) < (90 * 0.25 * 24 * 60 * 60 * 1000)
      return {
        packageId: pkg.id,
        serviceName: pkg.service.name,
        totalSessions: pkg.totalSessions,
        usedSessions: pkg.usedSessions,
        remaining,
        expiresAt: pkg.expiresAt.toISOString(),
        isExpiringSoon,
      }
    })

    return NextResponse.json(
      makeResponse({ packages: packagesWithBalance }, requestId),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/packages/balance]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
