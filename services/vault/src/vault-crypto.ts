import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

export interface VaultKey {
  keyId: string;
  encrypt(plaintext: Uint8Array): Promise<Uint8Array>;
  decrypt(ciphertext: Uint8Array): Promise<Uint8Array>;
}

export class KmsVaultKey implements VaultKey {
  private readonly client: KMSClient;

  constructor(
    public readonly keyId: string,
    region: string = 'us-east-1'
  ) {
    this.client = new KMSClient({ region });
  }

  async encrypt(plaintext: Uint8Array): Promise<Uint8Array> {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: plaintext,
    });
    const response = await this.client.send(command);
    if (!response.CiphertextBlob) {
      throw new Error('KMS encryption failed: No ciphertext blob');
    }
    return response.CiphertextBlob;
  }

  async decrypt(ciphertext: Uint8Array): Promise<Uint8Array> {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: ciphertext,
    });
    const response = await this.client.send(command);
    if (!response.Plaintext) {
      throw new Error('KMS decryption failed: No plaintext');
    }
    return response.Plaintext;
  }
}

export class MockVaultKey implements VaultKey {
  constructor(public readonly keyId: string = 'mock-key') {}

  async encrypt(plaintext: Uint8Array): Promise<Uint8Array> {
    const prefix = new TextEncoder().encode('mock:');
    const result = new Uint8Array(prefix.length + plaintext.length);
    result.set(prefix);
    result.set(plaintext, prefix.length);
    return result;
  }

  async decrypt(ciphertext: Uint8Array): Promise<Uint8Array> {
    return ciphertext.slice(5); // Remove 'mock:'
  }
}

export class VaultCrypto {
  constructor(private readonly key: VaultKey) {}

  async encryptText(value: string): Promise<Uint8Array> {
    return this.key.encrypt(new TextEncoder().encode(value));
  }

  async decryptText(value: Uint8Array): Promise<string> {
    const plaintext = await this.key.decrypt(value);
    return new TextDecoder().decode(plaintext);
  }
}
