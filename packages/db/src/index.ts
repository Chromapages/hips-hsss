import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  commercePrisma: PrismaClient | undefined
}

export const commercePrisma =
  globalForPrisma.commercePrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.commercePrisma = commercePrisma
}

export { commercePrisma as prisma }
