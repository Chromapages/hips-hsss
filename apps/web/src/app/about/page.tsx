import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — H.I.P.S.',
  description: 'Learn about the H.I.P.S. Foundation Sanctuary — anonymous peer support with hard anonymity boundaries.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-primary">
      <div className="container mx-auto px-4 py-16">
        {/* H1 - ceremonial serif heading */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
          About H.I.P.S. Sanctuary
        </h1>
        <div className="max-w-2xl">
          <p className="text-lg text-secondary mb-4 font-body leading-relaxed">
            H.I.P.S. (Healing Interaction Peer Support) Sanctuary is a platform
            designed to provide anonymous peer support with hard anonymity boundaries.
          </p>
          <p className="text-lg text-secondary mb-4 font-body leading-relaxed">
            Our mission is to create a safe space where individuals can seek help
            without revealing their identity.
          </p>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-2xl font-semibold mt-8 mb-4 text-primary">Core Principles</h2>
          <ul className="list-disc list-inside text-secondary space-y-2 font-body">
            <li><strong className="text-primary">Anonymous:</strong> Your identity is never revealed</li>
            <li><strong className="text-primary">Peer-Focused:</strong> Support from people who understand</li>
            <li><strong className="text-primary">Safe:</strong> Hard anonymity boundaries protect you</li>
            <li><strong className="text-primary">Accessible:</strong> Support available when you need it</li>
          </ul>
          {/* H2 - serif heading */}
          <h2 className="font-heading text-2xl font-semibold mt-8 mb-4 text-primary">Contact</h2>
          <p className="text-secondary font-body">
            For inquiries, please contact us through the platform.
          </p>
        </div>
      </div>
    </main>
  );
}
