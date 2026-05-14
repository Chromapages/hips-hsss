import { NextRequest } from 'next/server'
import { adminAuth } from '../firebaseadmin'
import { prisma } from '@hips/db'
import { UserRole } from '@hips/types'
import { apiError } from '../api-response'
import { AuthUser } from './types'

// Trust headers set by middleware (already verified Firebase token)
function getUidFromMiddlewareHeaders(req: NextRequest): string | null {
  return req.headers.get('x-firebase-uid')
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | ReturnType<typeof apiError>> {
  // Check if middleware already verified the token (preferred path)
  const firebaseUid = getUidFromMiddlewareHeaders(req)

  if (firebaseUid) {
    // Token was already verified by middleware, only need to fetch DB user
    const dbUser = await prisma.user.findUnique({ where: { firebaseUid } })
    if (!dbUser) {
      return apiError('UNAUTHORIZED', 'User not found in database', undefined, 401) as never
    }
    return {
      userId: dbUser.id,
      role: dbUser.role as UserRole,
      firebaseUid,
      dbUser,
    }
  }

  // Fallback: verify token directly if middleware didn't set headers
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return apiError('UNAUTHORIZED', 'Missing or invalid authorization header', undefined, 401) as never
  }

  const idToken = authHeader.slice(7)

  let decoded: { uid: string; role?: string }
  try {
    decoded = await adminAuth.verifyIdToken(idToken)
  } catch {
    return apiError('UNAUTHORIZED', 'Invalid or expired Firebase token', undefined, 401) as never
  }

  const dbUser = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
  if (!dbUser) {
    return apiError('UNAUTHORIZED', 'User not found in database', undefined, 401) as never
  }

  return {
    userId: dbUser.id,
    role: dbUser.role as UserRole,
    firebaseUid: decoded.uid,
    dbUser,
  }
}
