import { CommerceClient, SafetyClient, SessionClient, VaultClient } from '@hips/db';

const globalForPrisma = global as unknown as {
  prisma: CommerceClient;
  safetyPrisma: SafetyClient;
  sessionPrisma: SessionClient;
  vaultPrisma: VaultClient;
};

export const prisma = globalForPrisma.prisma || new CommerceClient();
export const safetyPrisma = globalForPrisma.safetyPrisma || new SafetyClient();
export const sessionPrisma = globalForPrisma.sessionPrisma || new SessionClient();
export const vaultPrisma = globalForPrisma.vaultPrisma || new VaultClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.safetyPrisma = safetyPrisma;
  globalForPrisma.sessionPrisma = sessionPrisma;
  globalForPrisma.vaultPrisma = vaultPrisma;
}
