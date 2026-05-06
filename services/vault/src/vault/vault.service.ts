import { Injectable } from "@nestjs/common";
import { KmsService } from "../kms/kms.service";
import { VaultRepository } from "./vault.repository";

interface CreateRecordInput {
  email?: string;
  name?: string;
  phone?: string;
  ipAddress: string;
  deviceFingerprint: string;
}

interface AccessLogInput {
  requesterId: string;
  vaultRecordId: string;
  justification: string;
}

@Injectable()
export class VaultService {
  constructor(private readonly kms: KmsService, private readonly vaultRepository: VaultRepository) {}

  async createRecord(input: CreateRecordInput) {
    // Encrypt all PII fields via KMS before storing
    const encrypted: Record<string, string> = {};

    if (input.email) encrypted.email = await this.kms.encrypt(input.email);
    if (input.name) encrypted.name = await this.kms.encrypt(input.name);
    if (input.phone) encrypted.phone = await this.kms.encrypt(input.phone);
    encrypted.ipAddress = await this.kms.encrypt(input.ipAddress);
    encrypted.deviceFingerprint = await this.kms.encrypt(input.deviceFingerprint);

    // 30 days from now for IP expiry
    const ipExpiresAt = new Date();
    ipExpiresAt.setDate(ipExpiresAt.getDate() + 30);

    // 90 days from now for fingerprint expiry
    const fingerprintExpiresAt = new Date();
    fingerprintExpiresAt.setDate(fingerprintExpiresAt.getDate() + 90);

    // Persist encrypted record to the Identity Vault DB
    const record = await this.vaultRepository.createRecord({
      encryptedEmail: encrypted.email ?? '',
      encryptedName: encrypted.name ?? '',
      encryptedPhone: encrypted.phone ?? '',
      encryptedIpAddress: encrypted.ipAddress,
      encryptedDeviceFingerprint: encrypted.deviceFingerprint,
      ipExpiresAt,
      fingerprintExpiresAt,
    });

    return {
      vaultRef: record.id,
      ipExpiresAt,
      fingerprintExpiresAt,
    };
  }

  async getRecord(token: string, justification: string) {
    if (!justification || justification.trim().length < 10) {
      throw new Error("Justification required (min 10 characters)");
    }
    // Lookup and decrypt — the actual implementation would use
    // VaultRepository (Prisma) here.
    return {
      token,
      accessed: true,
      justification,
      accessedAt: new Date().toISOString(),
    };
  }

  async getEmergencyRecord(token: string, _justification: string) {
    // Returns only crisis-specific fields for emergency responders
    // In production: lookup and decrypt from VaultRepository
    return {
      token,
      emergencyContact: "REDACTED",
      region: "REDACTED",
      country: "REDACTED",
      accessedAt: new Date().toISOString(),
    };
  }

  async logAccess(input: AccessLogInput) {
    return {
      id: crypto.randomUUID(),
      ...input,
      accessedAt: new Date().toISOString(),
    };
  }

  async getAccessLog(input: { page: number; pageSize: number }) {
    return {
      records: [],
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }
}
