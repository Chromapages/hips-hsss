'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SessionRoom from '@/components/session/SessionRoom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Force dynamic rendering — session pages must never be cached
export const dynamic = 'force-dynamic';

const OfficeRoomScene = dynamic(
  () => import('@/components/session-ui/office/OfficeRoomScene'),
  { ssr: false }
);

function SessionRoomContent({ sessionId }: { sessionId: string }) {
  const searchParams = useSearchParams();
  const prefetchedToken = searchParams.get('token');
  return <SessionRoom sessionId={sessionId} prefetchedToken={prefetchedToken} />;
}

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Loading</span>
        </div>
      </div>}>
        <SessionRoomContentWrapper params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

async function SessionRoomContentWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionRoomContent sessionId={id} />;
}