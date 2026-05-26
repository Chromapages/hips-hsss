import { PrismaClient as CommerceClient } from '@hips/db';

const globalForPrisma = global as unknown as {
  prisma: CommerceClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL;
}

function getClient(): CommerceClient {
  if (!getDatabaseUrl()) {
    throw new Error(
      'DATABASE_URL is not set. Cannot create CommerceClient. ' +
      'Set DATABASE_URL in your environment or .env.local file.'
    );
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new CommerceClient();
  }
  return globalForPrisma.prisma;
}

// Export a getter so Prisma only initializes when first accessed
export const getPrisma = () => getClient();

// Lazy proxy that defers initialization until first property access
// This allows the module to load without crashing even when DATABASE_URL is missing
export const prisma = new Proxy({} as CommerceClient, {
  get(_target, prop) {
    return (getClient() as any)[prop];
  },
});

if (process.env.NODE_ENV !== 'production') {
  // Don't persist the lazy proxy to global — each access goes through getClient()
  // which already caches in globalForPrisma.prisma
}