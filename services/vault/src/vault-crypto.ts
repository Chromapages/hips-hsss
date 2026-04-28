export type VaultKey = {
  keyId: string;
  encrypt(plaintext: Uint8Array): Promise<Uint8Array>;
  decrypt(ciphertext: Uint8Array): Promise<Uint8Array>;
};

export class VaultCrypto {
  constructor(private readonly key: VaultKey) {}

  encryptText(value: string) {
    return this.key.encrypt(new TextEncoder().encode(value));
  }

  async decryptText(value: Uint8Array) {
    const plaintext = await this.key.decrypt(value);
    return new TextDecoder().decode(plaintext);
  }
}
