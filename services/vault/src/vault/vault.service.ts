import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'node:crypto';
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
  requestId?: string;
  metadata?: Record<string, unknown>;
};

export type VaultAccessRequestInput = {
  subjectRef: string;
  requesterRef: string;
  justification: string;
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

    const encryptedRealName = await this.crypto.encrypt(realName);
    const encryptedEmergencyContact = await this.crypto.encrypt(emergencyContact);
    const encryptedRegion = await this.crypto.encrypt(region);
    const encryptedDisclosure = disclosure
      ? await this.crypto.encrypt(disclosure)
      : null;
    const encryptedIpAddress = ipAddress
      ? await this.crypto.encrypt(ipAddress)
      : null;
    const encryptedDeviceFingerprint = deviceFingerprint
      ? await this.crypto.encrypt(deviceFingerprint)
      : null;

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

  async getRecord(subjectRef: string, actor: string, purpose: string, requestId?: string) {
    const record = await this.prisma.identityRecord.findUnique({
      where: { subjectRef },
      select: {
        subjectRef: true,
        encryptedRealName: true,
        encryptedEmergencyContact: true,
        encryptedRegion: true,
        encryptedDisclosure: true,
        encryptedIpAddress: true,
        encryptedDeviceFingerprint: true,
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
      requestId: requestId || `req-${randomUUID()}`,
      metadata: { timestamp: new Date().toISOString() },
    });

    return {
      subjectRef: record.subjectRef,
      realName: await this.crypto.decrypt(Buffer.from(record.encryptedRealName)),
      emergencyContact: await this.crypto.decrypt(Buffer.from(record.encryptedEmergencyContact)),
      region: await this.crypto.decrypt(Buffer.from(record.encryptedRegion)),
      disclosure: record.encryptedDisclosure
        ? await this.crypto.decrypt(Buffer.from(record.encryptedDisclosure))
        : null,
      ipAddress: record.encryptedIpAddress
        ? await this.crypto.decrypt(Buffer.from(record.encryptedIpAddress))
        : null,
      deviceFingerprint: record.encryptedDeviceFingerprint
        ? await this.crypto.decrypt(Buffer.from(record.encryptedDeviceFingerprint))
        : null,
    };
  }

  async logAccess(data: VaultAccessInput) {
    return this.prisma.vaultAccessLog.create({
      data: {
        subjectRef: data.subjectRef,
        actorRef: data.actorRef,
        purpose: data.purpose as any,
        action: data.action ?? null,
        requestId: data.requestId || `req-${randomUUID()}`,
      },
    });
  }

  async submitAccessRequest(data: VaultAccessRequestInput) {
    return this.prisma.vaultAccessRequest.create({
      data: {
        subjectRef: data.subjectRef,
        requesterRef: data.requesterRef,
        justification: data.justification,
        status: 'PENDING',
        metadata: {},
      },
    });
  }

  async accessEmergencyContact(
    subjectRef: string,
    accessRequestId: string,
    actor: string,
    justification: string
  ) {
    const request = await this.prisma.vaultAccessRequest.findUnique({
      where: { id: accessRequestId },
    });

    if (!request) {
      throw new NotFoundException('Vault access request not found');
    }

    if (request.subjectRef !== subjectRef) {
      throw new BadRequestException('Subject reference mismatch');
    }

    const record = await this.prisma.identityRecord.findUnique({
      where: { subjectRef },
    });

    if (!record) {
      throw new NotFoundException('Identity record not found');
    }

    const accessedAt = new Date();

    await this.prisma.vaultAccessRequest.update({
      where: { id: accessRequestId },
      data: {
        status: 'APPROVED',
        accessedAt,
      },
    });

    const decryptedEmergencyContact = await this.crypto.decrypt(Buffer.from(record.encryptedEmergencyContact));

    await this.logAccess({
      subjectRef,
      actorRef: actor,
      purpose: 'CRISIS_DISCLOSURE',
      action: 'EMERGENCY_CONTACT_ACCESS',
      requestId: accessRequestId,
    });

    return {
      subjectRef,
      emergencyContact: decryptedEmergencyContact,
      accessedAt: accessedAt,
    };
  }
}
