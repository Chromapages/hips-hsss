import { Metadata } from 'next';
import { Navbar } from '@/components/polish/Navbar';

export const metadata: Metadata = {
  title: 'Privacy Policy — H.I.P.S.',
  description: 'H.I.P.S. Foundation privacy policy and data protection practices.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-primary">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* H1 - ceremonial serif heading */}
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-8 text-primary leading-tight">Privacy Policy</h1>
        <div className="space-y-6 text-secondary leading-relaxed font-body">
          <p>Last updated: May 27, 2026</p>
          <p>
            H.I.P.S. Foundation is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information, especially given the sensitive nature of peer support services.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Data Collection</h2>
          <p>
            We collect minimal personal data. Your billing identity is cryptographically separated from your session participation. We do not store Firebase UIDs alongside session records.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Anonymity Guarantee</h2>
          <p>
            All session data uses anonymous identifiers. Your peer support sessions cannot be linked to your billing information through technical and organizational measures.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">HIPAA Compliance</h2>
          <p>
            As a mental health peer support platform, we comply with HIPAA requirements for protected health information. Our vault architecture ensures PHI access is logged and auditable.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Contact</h2>
          <p>
            For privacy concerns, contact our Data Protection Officer at <span className="text-accent">privacy@hips-support.org</span>.
          </p>
        </div>
      </div>
      </main>
    </>
  );
}
