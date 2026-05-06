import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../packages/db/node_modules/.prisma/client-vault/index';

@Injectable()
export class VaultRepository {
  private prisma = new PrismaClient();

  async createRecord(data: {
    encryptedEmail?: string;
    encryptedName?: string;
    encryptedPhone?: string;
    encryptedIpAddress: string;
    encryptedDeviceFingerprint: string;
    ipExpiresAt: Date;
    fingerprintExpiresAt: Date;
  }) {
    return this.prisma.identityRecord.create({ data });
  }

  async findById(id: string) {
    return this.prisma.identityRecord.findUnique({ where: { id } });
  }

  async findByToken(_token: string) {
    return this.prisma.identityRecord.findFirst();
  }

  async logAccess(data: {
    requesterId: string;
    vaultRecordId: string;
    justification: string;
  }) {
    return this.prisma.vaultAccessLog.create({ data });
  }
}
