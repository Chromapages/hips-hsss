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
    const encrypted: Record<string, string> = {};

    if (input.email) encrypted.email = await this.kms.encrypt(input.email);
    if (input.name) encrypted.name = await this.kms.encrypt(input.name);
    if (input.phone) encrypted.phone = await this.kms.encrypt(input.phone);
    encrypted.ipAddress = await this.kms.encrypt(input.ipAddress);
    encrypted.deviceFingerprint = await this.kms.encrypt(input.deviceFingerprint);

    const ipExpiresAt = new Date();
    ipExpiresAt.setDate(ipExpiresAt.getDate() + 30);

    const fingerprintExpiresAt = new Date();
    fingerprintExpiresAt.setDate(fingerprintExpiresAt.getDate() + 90);

    const record = await this.vaultRepository.createRecord({
      encryptedEmail: encrypted.email ?? "",
      encryptedName: encrypted.name ?? "",
      encryptedPhone: encrypted.phone ?? "",
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

  async getRecord(token: string, justification: string, requesterId: string) {
    await this.requireJustifiedAccess(token, justification, requesterId);
    return {
      token,
      accessed: true,
      justification,
      accessedAt: new Date().toISOString(),
    };
  }

  async getEmergencyRecord(token: string, justification: string, requesterId: string) {
    await this.requireJustifiedAccess(token, justification, requesterId);
    return {
      token,
      emergencyContact: "REDACTED",
      region: "REDACTED",
      country: "REDACTED",
      accessedAt: new Date().toISOString(),
    };
  }

  async logAccess(input: AccessLogInput) {
    return this.vaultRepository.logAccess(input);
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

  private async requireJustifiedAccess(token: string, justification: string, requesterId: string) {
    if (!requesterId) {
      throw new Error("Requester ID required");
    }
    if (!justification || justification.trim().length < 10) {
      throw new Error("Justification required (min 10 characters)");
    }
    await this.vaultRepository.logAccess({
      requesterId,
      vaultRecordId: token,
      justification,
    });
  }
}
