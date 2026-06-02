'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SessionRoom from '@/components/session/SessionRoom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function SessionRoomContent({ sessionId }: { sessionId: string }) {
  // Read the LiveKit token from sessionStorage — the /join/[sessionId] page
  // stashed it there to avoid putting it in the URL. sessionStorage is per-tab
  // and cleared on tab close, which is the right scope for a 1h token. We
  // intentionally do NOT also read ?token= from the URL — that path leaks the
  // token via history, the Referer header, and any server-side analytics. If
  // the token is missing, the SessionRoom effect below will fetch a fresh one
  // using the caller's Firebase ID token.
  const [prefetchedToken, setPrefetchedToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stashed = window.sessionStorage.getItem(`hips:join:token:${sessionId}`);
      if (stashed) {
        setPrefetchedToken(stashed);
        // Best-effort cleanup so the token doesn't linger in storage after
        // the room has loaded. The token is 1h-TTL and signed, so even if
        // cleanup fails it's not a long-term leak.
        window.sessionStorage.removeItem(`hips:join:token:${sessionId}`);
      }
    } catch {
      // sessionStorage can throw in private-browsing mode; fall through and
      // let the SessionRoom effect fetch a fresh token.
    }
  }, [sessionId]);

  return <SessionRoom sessionId={sessionId} prefetchedToken={prefetchedToken} />;
}

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = typeof params?.id === 'string' ? params.id : '';
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-black text-white">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Loading</span>
          </div>
        </div>
      }>
        <SessionRoomContent sessionId={sessionId} />
      </Suspense>
    </ErrorBoundary>
  );
}
