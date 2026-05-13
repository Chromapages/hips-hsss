import { PrismaClient } from '@hips/db/generated/commerce'

const globalForPrisma = globalThis as unknown as { commerceDb: PrismaClient }

export const commerceDb =
  globalForPrisma.commerceDb ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.commerceDb = commerceDb

export { PrismaClient }
