import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(
    private prisma: PrismaService,
    private crypto: VaultCryptoService
  ) {}

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
