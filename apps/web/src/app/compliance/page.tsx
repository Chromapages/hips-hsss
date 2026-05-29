import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance — H.I.P.S.',
  description: 'H.I.P.S. Foundation compliance and regulatory information.',
};

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight mb-8">Compliance</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p>
            H.I.P.S. Foundation maintains compliance with applicable healthcare and data protection regulations.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">HIPAA</h2>
          <p>
            We comply with the Health Insurance Portability and Accountability Act. Our architecture ensures protected health information is encrypted, access-logged, and only available to authorized personnel.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">PCI DSS</h2>
          <p>
            Payment processing is handled by Stripe. We do not store credit card details. Our systems are PCI DSS compliant through our payment processor.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">GDPR</h2>
          <p>
            For users in the European Union, we provide data export and deletion capabilities. Contact privacy@hips-support.org for GDPR requests.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Audits</h2>
          <p>
            Our last security audit was completed in Q1 2026. Contact security@hips-support.org for audit reports or compliance documentation requests.
          </p>
        </div>
      </div>
    </main>
  );
}