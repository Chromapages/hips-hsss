import { Injectable } from "@nestjs/common";
import {
  KMSClient,
  EncryptCommand,
  DecryptCommand,
  GenerateDataKeyCommand,
} from "@aws-sdk/client-kms";

@Injectable()
export class KmsService {
  private client: KMSClient;
  private keyId: string;

  constructor() {
    this.client = new KMSClient({
      region: process.env.AWS_REGION ?? "us-east-1",
    });
    this.keyId = process.env.AWS_VAULT_KMS_KEY_ID ?? "";
    if (!this.keyId) {
      throw new Error("AWS_VAULT_KMS_KEY_ID is required");
    }
  }

  async encrypt(plaintext: string): Promise<string> {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(plaintext, "utf-8"),
    });
    const result = await this.client.send(command);
    return result.CiphertextBlob ? Buffer.from(result.CiphertextBlob).toString("hex") : "";
  }

  async decrypt(ciphertextHex: string): Promise<string> {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: Buffer.from(ciphertextHex, "hex"),
    });
    const result = await this.client.send(command);
    return result.Plaintext ? Buffer.from(result.Plaintext).toString("utf-8") : "";
  }

  async generateDataKey(): Promise<{ plaintext: string; ciphertext: string }> {
    const command = new GenerateDataKeyCommand({
      KeyId: this.keyId,
      KeySpec: "AES_256",
    });
    const result = await this.client.send(command);
    return {
      plaintext: result.Plaintext ? Buffer.from(result.Plaintext).toString("base64") : "",
      ciphertext: result.CiphertextBlob ? Buffer.from(result.CiphertextBlob).toString("base64") : "",
    };
  }
}
