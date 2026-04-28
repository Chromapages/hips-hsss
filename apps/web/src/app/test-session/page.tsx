'use client';

import SessionRoom from '@/components/session/SessionRoom';

export default function TestSessionPage() {
  // A hardcoded room name for testing purposes
  const testRoomName = 'prototype-demo-room';

  return (
    <main className="min-h-screen bg-black">
      <div className="p-4 bg-gray-900 text-white border-b border-gray-800">
        <h1 className="text-xl font-bold">H.I.P.S. Prototype - Session Engine Test</h1>
        <p className="text-sm text-gray-400">Testing Hard Anonymity: 3D Avatars + WebRTC Audio</p>
      </div>
      
      <div className="h-[calc(100vh-68px)]">
        <SessionRoom roomName={testRoomName} />
      </div>
    </main>
  );
}
