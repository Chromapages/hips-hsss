'use client';

import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import '@livekit/components-styles';

import AvatarCanvas from './AvatarCanvas';
import SafetyMonitor from './SafetyMonitor';

export default function SessionRoom({ roomName }: { roomName: string }) {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Fetch the LiveKit token using the roomName
    const fetchToken = async () => {
      try {
        const resp = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName }),
        });
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (e) {
        console.error('Failed to fetch token', e);
      }
    };
    fetchToken();
  }, [roomName]);

  if (token === '') {
    return <div className="flex h-screen items-center justify-center bg-gray-950 text-white">Connecting to Session...</div>;
  }

  const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880';

  return (
    <LiveKitRoom
      video={false} // Hard Anonymity: No video allowed
      audio={true}
      token={token}
      serverUrl={liveKitUrl}
      data-lk-theme="default"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#030712' }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Safety Engine Active
        </div>
        <button className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 rounded-md transition-colors">
          Leave Session
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="flex-1 relative border-r border-gray-800 bg-gray-950">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <AvatarCanvas />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-900 flex flex-col border-l border-gray-800">
          <SafetyMonitor sessionId={roomName} />
        </div>
      </div>

      {/* Control Bar (Microphone, etc.) */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center">
        <ControlBar variation="minimal" controls={{ camera: false, microphone: true, screenShare: false, chat: false }} />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
