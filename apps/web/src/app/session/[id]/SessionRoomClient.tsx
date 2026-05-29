'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SessionRoom from '@/components/session/SessionRoom';

interface SessionRoomClientProps {
  sessionId: string;
}

function SessionRoomContent({ sessionId }: SessionRoomClientProps) {
  const searchParams = useSearchParams();
  const prefetchedToken = searchParams.get('token');

  return <SessionRoom sessionId={sessionId} prefetchedToken={prefetchedToken} />;
}

export default function SessionRoomClient({ sessionId }: SessionRoomClientProps) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Loading</span>
      </div>
    </div>}>
      <SessionRoomContent sessionId={sessionId} />
    </Suspense>
  );
}