import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DirectJoinClient } from './DirectJoinClient';

const OfficeRoomScene = dynamic(
  () => import('@/components/session-ui/office/OfficeRoomScene'),
  { ssr: false }
);

interface JoinPageProps {
  params: Promise<{ sessionId: string }>;
}

export const dynamic = 'force-dynamic';

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
    <ErrorBoundary>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Loading</span>
        </div>
      </div>}>
        <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
          {/* Ambient glow */}
          <div className="fixed top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
            <DirectJoinClient sessionId={sessionId} />
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}