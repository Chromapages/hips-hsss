import { VaultDemo } from '@/components/demo/VaultDemo';

export const metadata = {
  title: 'Identity Vault Demo · Phase 1C — H.I.P.S.',
  description: 'Interactive demo showing how envelope encryption protects PII using a Data Encryption Key (DEK) and produces an immutable audit trail.',
};

export default function VaultDemoPage() {
  return (
    <main className="min-h-screen bg-[#EFEFED]">
      <VaultDemo />
    </main>
  );
}
