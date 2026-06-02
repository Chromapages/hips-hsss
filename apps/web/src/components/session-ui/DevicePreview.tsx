'use client';

import { Mic, Video, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface DevicePreviewProps {
  micStream: MediaStream | null;
  cameraStream: MediaStream | null;
  micPermissionGranted: boolean;
  cameraPermissionGranted: boolean;
  audioLevel: number;
  videoInputLabel?: string;
  audioInputLabel?: string;
}

export function DevicePreview({
  micStream,
  cameraStream,
  micPermissionGranted,
  cameraPermissionGranted,
  audioLevel,
  videoInputLabel,
  audioInputLabel,
}: DevicePreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-border">
        {cameraPermissionGranted && cameraStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Video className="h-3 w-3 text-emerald-400" />
              {videoInputLabel || 'Camera'}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface-alt">
            <div className="rounded-full bg-surface p-4 ring-1 ring-border">
              <Video className="h-8 w-8 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">Camera not accessible</p>
            <p className="text-xs text-text-muted/70">
              Allow camera access in your browser to continue.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-lg p-1.5 ${
                micPermissionGranted ? 'bg-success/15' : 'bg-destructive/15'
              }`}
            >
              <Mic
                className={`h-4 w-4 ${
                  micPermissionGranted ? 'text-success' : 'text-destructive'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">
                {audioInputLabel || 'Microphone'}
              </p>
              <p className="text-xs text-text-muted">
                {micPermissionGranted ? 'Input detected' : 'Permission required'}
              </p>
            </div>
          </div>
          {micPermissionGranted ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-gradient-to-r from-success to-cyan-500 transition-all duration-150"
            style={{
              width: `${Math.min(100, audioLevel * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
