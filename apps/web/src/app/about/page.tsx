import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — H.I.P.S.',
  description: 'Learn about the H.I.P.S. Foundation Sanctuary — anonymous peer support with hard anonymity boundaries.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">About H.I.P.S. Sanctuary</h1>
        <div className="prose prose-invert max-w-2xl">
          <p className="text-lg text-gray-300 mb-4">
            H.I.P.S. (Healing Interaction Peer Support) Sanctuary is a platform
            designed to provide anonymous peer support with hard anonymity boundaries.
          </p>
          <p className="text-lg text-gray-300 mb-4">
            Our mission is to create a safe space where individuals can seek help
            without revealing their identity.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Core Principles</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Anonymous:</strong> Your identity is never revealed</li>
            <li><strong>Peer-Focused:</strong> Support from people who understand</li>
            <li><strong>Safe:</strong> Hard anonymity boundaries protect you</li>
            <li><strong>Accessible:</strong> Support available when you need it</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-gray-300">
            For inquiries, please contact us through the platform.
          </p>
        </div>
      </div>
    </main>
  );
}
