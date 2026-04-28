import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from '@aws-sdk/client-kms';
import * as crypto from 'node:crypto';

@Injectable()
export class VaultCryptoService {
  private readonly kmsClient: KMSClient;
  private readonly keyId: string | undefined;

  constructor(private configService: ConfigService) {
    this.kmsClient = new KMSClient({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
    });
    this.keyId = this.configService.get<string>('VAULT_KMS_KEY_ID');
    
    if (!this.keyId && process.env.NODE_ENV === 'production') {
      throw new Error('VAULT_KMS_KEY_ID is required in production');
    }
  }

  /**
   * Encrypts plaintext using Envelope Encryption (AWS KMS).
   * Resulting buffer contains: [EncryptedDataKeyLength(4)][EncryptedDataKey][IV(12)][AuthTag(16)][Ciphertext]
   */
  async encrypt(plaintext: string): Promise<Buffer> {
    // If no keyId (development), use a mock/simple encryption or throw
    if (!this.keyId) {
      return Buffer.from(`mock_encrypted:${plaintext}`);
    }

    // 1. Generate a Data Encryption Key (DEK)
    const command = new GenerateDataKeyCommand({
      KeyId: this.keyId,
      KeySpec: 'AES_256',
    });

    const { Plaintext: dekPlaintext, CiphertextBlob: dekCiphertext } = await this.kmsClient.send(command);

    if (!dekPlaintext || !dekCiphertext) {
      throw new Error('Failed to generate data key from KMS');
    }

    // 2. Encrypt the data using the DEK
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', dekPlaintext, iv);
    
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();

    // 3. Assemble the payload
    const dekLength = Buffer.alloc(4);
    dekLength.writeUInt32BE(dekCiphertext.length, 0);

    return Buffer.concat([
      dekLength,
      Buffer.from(dekCiphertext),
      iv,
      authTag,
      ciphertext,
    ]);
  }

  /**
   * Decrypts a buffer created by encrypt().
   */
  async decrypt(encryptedBuffer: Buffer): Promise<string> {
    if (!this.keyId || encryptedBuffer.toString().startsWith('mock_encrypted:')) {
      return encryptedBuffer.toString().replace('mock_encrypted:', '');
    }

    try {
      // 1. Extract components from the buffer
      let offset = 0;
      const dekLength = encryptedBuffer.readUInt32BE(offset);
      offset += 4;

      const dekCiphertext = encryptedBuffer.subarray(offset, offset + dekLength);
      offset += dekLength;

      const iv = encryptedBuffer.subarray(offset, offset + 12);
      offset += 12;

      const authTag = encryptedBuffer.subarray(offset, offset + 16);
      offset += 16;

      const ciphertext = encryptedBuffer.subarray(offset);

      // 2. Decrypt the DEK using KMS
      const decryptCommand = new DecryptCommand({
        CiphertextBlob: dekCiphertext,
        KeyId: this.keyId,
      });

      const { Plaintext: dekPlaintext } = await this.kmsClient.send(decryptCommand);

      if (!dekPlaintext) {
        throw new Error('Failed to decrypt data key via KMS');
      }

      // 3. Decrypt the data using the DEK
      const decipher = crypto.createDecipheriv('aes-256-gcm', dekPlaintext, iv);
      decipher.setAuthTag(authTag);

      const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);

      return plaintext.toString('utf8');
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Could not decrypt vault record');
    }
  }
}
