import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance — H.I.P.S.',
  description: 'H.I.P.S. Foundation compliance and regulatory information.',
};

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-white text-primary">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* H1 - ceremonial serif heading */}
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-8 text-primary leading-tight">Compliance</h1>
        <div className="space-y-6 text-secondary leading-relaxed font-body">
          <p>
            H.I.P.S. Foundation maintains compliance with applicable healthcare and data protection regulations.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">HIPAA</h2>
          <p>
            We comply with the Health Insurance Portability and Accountability Act. Our architecture ensures protected health information is encrypted, access-logged, and only available to authorized personnel.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">PCI DSS</h2>
          <p>
            Payment processing is handled by Stripe. We do not store credit card details. Our systems are PCI DSS compliant through our payment processor.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">GDPR</h2>
          <p>
            For users in the European Union, we provide data export and deletion capabilities. Contact <span className="text-accent">privacy@hips-support.org</span> for GDPR requests.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Audits</h2>
          <p>
            Our last security audit was completed in Q1 2026. Contact <span className="text-accent">security@hips-support.org</span> for audit reports or compliance documentation requests.
          </p>
        </div>
      </div>
    </main>
  );
}