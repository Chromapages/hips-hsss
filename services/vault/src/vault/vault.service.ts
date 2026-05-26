import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service.js';
import { VaultCryptoService } from './vault-crypto.service.js';

export type CreateVaultRecordInput = {
  subjectRef: string;
  realName: string;
  emergencyContact: string;
  region: string;
  disclosure?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
};

export type VaultAccessInput = {
  subjectRef: string;
  actorRef: string;
  purpose: string;
  action?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);

  constructor(
    private prisma: PrismaService,
    private crypto: VaultCryptoService
  ) {}

  @Cron('0 0 * * *') // daily at midnight
  async expireOldIpAddresses(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expired = await this.prisma.identityRecord.findMany({
      where: {
        ipExpiresAt: { lt: new Date() },
        encryptedIpAddress: { not: null },
      },
    });

    for (const record of expired) {
      await this.prisma.identityRecord.update({
        where: { id: record.id },
        data: { encryptedIpAddress: null, ipExpiresAt: null },
      });
      await this.logAccess({
        subjectRef: record.subjectRef,
        actorRef: 'SYSTEM',
        purpose: 'RECORD_READ',
        action: 'IP_EXPIRY',
        metadata: { expiredAt: new Date().toISOString() },
      });
      this.logger.log(`IP expired for subjectRef: ${record.subjectRef}`);
    }

    this.logger.log(`IP expiry job complete. Records processed: ${expired.length}`);
  }

  @Cron('0 0 * * *') // daily at midnight
  async expireOldDeviceFingerprints(): Promise<void> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const expired = await this.prisma.identityRecord.findMany({
      where: {
        deviceFingerprintExpiresAt: { lt: new Date() },
        encryptedDeviceFingerprint: { not: null },
      },
    });

    for (const record of expired) {
      await this.prisma.identityRecord.update({
        where: { id: record.id },
        data: { encryptedDeviceFingerprint: null, deviceFingerprintExpiresAt: null },
      });
      await this.logAccess({
        subjectRef: record.subjectRef,
        actorRef: 'SYSTEM',
        purpose: 'RECORD_READ',
        action: 'DEVICE_FINGERPRINT_EXPIRY',
        metadata: { expiredAt: new Date().toISOString() },
      });
      this.logger.log(`Device fingerprint expired for subjectRef: ${record.subjectRef}`);
    }

    this.logger.log(`Device fingerprint expiry job complete. Records processed: ${expired.length}`);
  }

  async createRecord(data: CreateVaultRecordInput) {
    const { subjectRef, realName, emergencyContact, region, disclosure, ipAddress, deviceFingerprint } = data;

    // Encrypt all PII
    const encryptedRealName = await this.crypto.encrypt(realName);
    const encryptedEmergencyContact = await this.crypto.encrypt(emergencyContact);
    const encryptedRegion = await this.crypto.encrypt(region);
    const encryptedDisclosure = disclosure ? await this.crypto.encrypt(disclosure) : null;
    const encryptedIpAddress = ipAddress ? await this.crypto.encrypt(ipAddress) : null;
    const encryptedDeviceFingerprint = deviceFingerprint ? await this.crypto.encrypt(deviceFingerprint) : null;

    return this.prisma.identityRecord.upsert({
      where: { subjectRef },
      update: {
        encryptedRealName,
        encryptedEmergencyContact,
        encryptedRegion,
        encryptedDisclosure,
        encryptedIpAddress,
        encryptedDeviceFingerprint,
      },
      create: {
        subjectRef,
        encryptedRealName,
        encryptedEmergencyContact,
        encryptedRegion,
        encryptedDisclosure,
        encryptedIpAddress,
        encryptedDeviceFingerprint,
      },
    });
  }

  async getRecord(subjectRef: string, actor: string, purpose: string) {
    const record = await this.prisma.identityRecord.findUnique({
      where: { subjectRef },
    });

    if (!record) {
      throw new NotFoundException('Identity record not found');
    }

    // MANDATORY: Log access before returning data
    await this.logAccess({
      subjectRef,
      actorRef: actor,
      purpose,
      action: 'READ_PII',
      metadata: { timestamp: new Date().toISOString() },
    });

    // Decrypt fields
    return {
      subjectRef: record.subjectRef,
      realName: await this.crypto.decrypt(record.encryptedRealName),
      emergencyContact: await this.crypto.decrypt(record.encryptedEmergencyContact),
      region: await this.crypto.decrypt(record.encryptedRegion),
      disclosure: record.encryptedDisclosure ? await this.crypto.decrypt(record.encryptedDisclosure) : null,
      ipAddress: record.encryptedIpAddress ? await this.crypto.decrypt(record.encryptedIpAddress) : null,
      deviceFingerprint: record.encryptedDeviceFingerprint ? await this.crypto.decrypt(record.encryptedDeviceFingerprint) : null,
    };
  }

  async logAccess(data: VaultAccessInput) {
    return this.prisma.vaultAccessLog.create({
      data: {
        subjectRef: data.subjectRef,
        actorRef: data.actorRef,
        purpose: data.purpose,
        action: data.action,
        metadata: data.metadata || {},
      },
    });
  }
}
