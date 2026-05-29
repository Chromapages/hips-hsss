'use client';

import { Loader2 } from 'lucide-react';
import { useConnectionState, useRoomContext } from '@livekit/components-react';

interface ConnectingOverlayProps {
  connectionQuality?: 'good' | 'fair' | 'poor';
  connectionLabel?: string;
}

export function ConnectingOverlay({ connectionQuality, connectionLabel }: ConnectingOverlayProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);

  // Only show when actually connecting or reconnecting
  if (connectionState !== 'connecting' && connectionState !== 'reconnecting') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-indigo-500/20 bg-black/80 px-10 py-8 shadow-2xl">
        {/* Animated loader */}
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-indigo-400 opacity-60" />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {connectionState === 'reconnecting' ? 'Reconnecting to demo room...' : 'Connecting to demo room...'}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {connectionState === 'reconnecting'
              ? 'Please wait, your connection will restore shortly.'
              : 'Setting up your audio and video...'}
          </p>
        </div>

        {/* Connection quality indicator */}
        {(connectionQuality || connectionLabel) && (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${
                connectionQuality === 'good' ? 'bg-emerald-400' :
                connectionQuality === 'fair' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              <span className="text-xs font-medium text-zinc-300">{connectionLabel || 'Connecting'}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}