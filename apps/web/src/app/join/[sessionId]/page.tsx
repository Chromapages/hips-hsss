import type { Metadata } from 'next';
import { DirectJoinClient } from './DirectJoinClient';

interface JoinPageProps {
  params: Promise<{ sessionId: string }>;
}

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  return {
    title: `Join Session ${sessionId} — H.I.P.S. Sanctuary`,
    description: 'Enter the secure Virtual Sanctuary session.',
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { sessionId } = await params;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Ambient glow */}
      <div className="fixed top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <DirectJoinClient sessionId={sessionId} />
      </div>
    </main>
  );
}