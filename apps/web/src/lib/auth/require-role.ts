import { NextRequest } from 'next/server'
import { UserRole } from '@hips/types'
import { apiError } from '../api-response'
import { getAuthUser } from './get-auth-user'
import { AuthUser } from './types'

export async function requireRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthUser | ReturnType<typeof apiError>> {
  const authResult = await getAuthUser(req)
  if (authResult instanceof Response) return authResult as never

  if (!allowedRoles.includes(authResult.role)) {
    return apiError('FORBIDDEN', 'Insufficient permissions', undefined, 403) as never
  }

  return authResult
}
