import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — H.I.P.S.',
  description: 'H.I.P.S. Foundation terms of service for peer support platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight mb-8">Terms of Service</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p>Last updated: May 27, 2026</p>
          <p>
            By using H.I.P.S. Foundation peer support services, you agree to these terms. Our platform provides anonymous peer support and must be used in good faith.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Peer Support Services</h2>
          <p>
            H.I.P.S. provides peer support sessions facilitated by trained peer supporters. These are not clinical mental health services and should not replace professional care.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Anonymity</h2>
          <p>
            You agree to maintain the anonymity of other participants. Recording, screenshots, or sharing identifying information about other participants is strictly prohibited.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Safety</h2>
          <p>
            Our safety systems monitor for harmful content. Violations may result in session termination and account suspension. Crisis situations should be escalated to emergency services.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Contact</h2>
          <p>
            Questions about these terms? Contact legal@hips-support.org.
          </p>
        </div>
      </div>
    </main>
  );
}