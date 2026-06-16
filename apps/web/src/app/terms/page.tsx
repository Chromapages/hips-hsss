import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — H.I.P.S.',
  description: 'H.I.P.S. Foundation terms of service for peer support platform.',
};

export default function TermsPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-primary">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* H1 - ceremonial serif heading */}
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-8 text-primary leading-tight">Terms of Service</h1>
        <div className="space-y-6 text-secondary leading-relaxed font-body">
          <p>Last updated: May 27, 2026</p>
          <p>
            By using H.I.P.S. Foundation peer support services, you agree to these terms. Our platform provides anonymous peer support and must be used in good faith.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Peer Support Services</h2>
          <p>
            H.I.P.S. provides peer support sessions facilitated by trained peer supporters. These are not licensed mental health services and should not replace professional care.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Anonymity</h2>
          <p>
            You agree to maintain the anonymity of other participants. Recording, screenshots, or sharing identifying information about other participants is strictly prohibited.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Safety</h2>
          <p>
            Our safety systems monitor for harmful content. Violations may result in session termination and account suspension. Crisis situations should be escalated to emergency services.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Contact</h2>
          <p>
            Questions about these terms? Contact <span className="text-accent">legal@hips-support.org</span>.
          </p>
        </div>
      </div>
    </main>
  );
}