import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — H.I.P.S.',
  description: 'Contact H.I.P.S. Foundation.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight mb-8">Contact</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p>
            Get in touch with the H.I.P.S. Foundation team.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">General Inquiries</h2>
          <p>
            info@hips-support.org
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Crisis Support</h2>
          <p>
            If you or someone you know is in crisis, please call or text <strong className="text-white">988</strong> (Suicide and Crisis Lifeline) available 24/7.
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Organization Partnerships</h2>
          <p>
            partnerships@hips-support.org
          </p>
          <h2 className="text-xl font-semibold text-white mt-8">Security</h2>
          <p>
            security@hips-support.org
          </p>
        </div>
      </div>
    </main>
  );
}