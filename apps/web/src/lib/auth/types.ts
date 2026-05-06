import { UserRole } from '@hips/types'
import { prisma } from '@hips/db'

export interface AuthUser {
  userId: string
  role: UserRole
  firebaseUid: string
  dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> & {}
}
