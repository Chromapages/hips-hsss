'use client';

import dynamic from 'next/dynamic';

const SessionRoom = dynamic(() => import('@/components/session/SessionRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="animate-pulse text-sm font-bold uppercase tracking-widest text-zinc-400">
          Loading session engine...
        </span>
      </div>
    </div>
  ),
});

export default function TestSessionPage() {
  const testSessionId = 'prototype-demo-room';

  return (
    <main className="min-h-screen bg-black">
      <div className="p-4 bg-zinc-900 text-white border-b border-zinc-800">
        <h1 className="text-xl font-bold">H.I.P.S. Prototype - Session Engine Test</h1>
        <p className="text-sm text-zinc-400">Testing Hard Anonymity: 3D Avatars + WebRTC Audio</p>
      </div>
      
      <div className="h-[calc(100vh-68px)]">
        <SessionRoom sessionId={testSessionId} />
      </div>
    </main>
  );
}
