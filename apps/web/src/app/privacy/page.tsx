import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — H.I.P.S.',
  description: 'H.I.P.S. Foundation privacy policy and data protection practices.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p>Last updated: May 27, 2026</p>
          <p>
            H.I.P.S. Foundation is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information, especially given the sensitive nature of peer support services.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Data Collection</h2>
          <p>
            We collect minimal personal data. Your billing identity is cryptographically separated from your session participation. We do not store Firebase UIDs alongside session records.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Anonymity Guarantee</h2>
          <p>
            All session data uses anonymous identifiers. Your peer support sessions cannot be linked to your billing information through technical and organizational measures.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">HIPAA Compliance</h2>
          <p>
            As a mental health peer support platform, we comply with HIPAA requirements for protected health information. Our vault architecture ensures PHI access is logged and auditable.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Contact</h2>
          <p>
            For privacy concerns, contact our Data Protection Officer at privacy@hips-support.org.
          </p>
        </div>
      </div>
    </main>
  );
}