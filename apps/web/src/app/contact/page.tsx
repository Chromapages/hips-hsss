import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — H.I.P.S.',
  description: 'Contact H.I.P.S. Foundation.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-primary">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* H1 - ceremonial serif heading */}
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-8 text-primary leading-tight">Contact</h1>
        <div className="space-y-6 text-secondary leading-relaxed font-body">
          <p>
            Get in touch with the H.I.P.S. Foundation team.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">General Inquiries</h2>
          <p>
            <span className="text-accent">info@hips-support.org</span>
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Crisis Support</h2>
          <p>
            If you or someone you know is in crisis, please call or text <strong className="text-primary">988</strong> (Suicide and Crisis Lifeline) available 24/7.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Organization Partnerships</h2>
          <p>
            <span className="text-accent">partnerships@hips-support.org</span>
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Security</h2>
          <p>
            <span className="text-accent">security@hips-support.org</span>
          </p>
        </div>
      </div>
    </main>
  );
}