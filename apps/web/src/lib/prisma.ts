import { CommerceClient } from '@hips/db';

const globalForPrisma = global as unknown as {
  prisma: CommerceClient;
};

export const prisma = globalForPrisma.prisma || new CommerceClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}