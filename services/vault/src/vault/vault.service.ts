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

    const result = await this.prisma.identityRecord.updateMany({
      where: {
        ipExpiresAt: { lt: new Date() },
        encryptedIpAddress: { not: null },
      },
      data: { encryptedIpAddress: null, ipExpiresAt: null },
    });

    this.logger.log(`IP expiry job complete. Records expired: ${result.count}`);
  }

  @Cron('0 0 * * *') // daily at midnight
  async expireOldDeviceFingerprints(): Promise<void> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await this.prisma.identityRecord.updateMany({
      where: {
        deviceFingerprintExpiresAt: { lt: new Date() },
        encryptedDeviceFingerprint: { not: null },
      },
      data: { encryptedDeviceFingerprint: null, deviceFingerprintExpiresAt: null },
    });

    this.logger.log(`Device fingerprint expiry job complete. Records expired: ${result.count}`);
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
      select: {
        subjectRef: true,
        encryptedRealName: true,
        encryptedEmergencyContact: true,
        encryptedDateOfBirth: true,
        encryptedPhone: true,
        encryptedAddress: true,
        encryptedInsuranceInfo: true,
        encryptedEmergencyContactPhone: true,
      },
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
      dateOfBirth: record.encryptedDateOfBirth ? await this.crypto.decrypt(record.encryptedDateOfBirth) : null,
      phone: record.encryptedPhone ? await this.crypto.decrypt(record.encryptedPhone) : null,
      address: record.encryptedAddress ? await this.crypto.decrypt(record.encryptedAddress) : null,
      insuranceInfo: record.encryptedInsuranceInfo ? await this.crypto.decrypt(record.encryptedInsuranceInfo) : null,
      emergencyContactPhone: record.encryptedEmergencyContactPhone ? await this.crypto.decrypt(record.encryptedEmergencyContactPhone) : null,
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
