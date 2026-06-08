'use client';

import { Loader2 } from 'lucide-react';
import { useConnectionState, useRoomContext } from '@livekit/components-react';

interface ConnectingOverlayProps {
  connectionQuality?: 'good' | 'fair' | 'poor';
  connectionLabel?: string;
  variant?: 'light' | 'dark';
}

export function ConnectingOverlay({
  connectionQuality,
  connectionLabel,
  variant = 'dark',
}: ConnectingOverlayProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);

  // Only show when actually connecting or reconnecting
  if (connectionState !== 'connecting' && connectionState !== 'reconnecting') {
    return null;
  }

  const isLight = variant === 'light';
  const backdrop = isLight
    ? 'pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm'
    : 'pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
  const card = isLight
    ? 'flex flex-col items-center gap-6 rounded-2xl border border-border bg-background/95 px-10 py-8 shadow-elevated'
    : 'flex flex-col items-center gap-6 rounded-2xl border border-primary/20 bg-black/80 px-10 py-8 shadow-2xl';
  const loaderColor = isLight ? 'text-accent' : 'text-text';
  const loaderDot = isLight ? 'h-3 w-3 rounded-full bg-accent opacity-60' : 'h-3 w-3 rounded-full bg-primary opacity-60';
  const titleText = isLight ? 'text-lg font-bold text-primary' : 'text-lg font-bold text-white';
  const subtitleText = isLight ? 'mt-1 text-sm text-text-muted' : 'mt-1 text-sm text-text';
  const pill = isLight
    ? 'flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2'
    : 'flex items-center gap-3 rounded-full border border-white/10 bg-surface/5 px-4 py-2';
  const pillLabel = isLight ? 'text-xs font-medium text-text-secondary' : 'text-xs font-medium text-text-muted';

  return (
    <div className={backdrop}>
      <div className={card}>
        <div className="relative">
          <Loader2 className={`h-12 w-12 animate-spin ${loaderColor}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={loaderDot} />
          </div>
        </div>

        <div className="text-center">
          <p className={titleText}>
            {connectionState === 'reconnecting'
              ? 'Reconnecting to demo room...'
              : 'Connecting to demo room...'}
          </p>
          <p className={subtitleText}>
            {connectionState === 'reconnecting'
              ? 'Please wait, your connection will restore shortly.'
              : 'Setting up your audio and video...'}
          </p>
        </div>

        {(connectionQuality || connectionLabel) && (
          <div className={pill}>
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  connectionQuality === 'good'
                    ? 'bg-emerald-400'
                    : connectionQuality === 'fair'
                      ? 'bg-amber-400'
                      : 'bg-destructive'
                }`}
              />
              <span className={pillLabel}>{connectionLabel || 'Connecting'}</span>
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
