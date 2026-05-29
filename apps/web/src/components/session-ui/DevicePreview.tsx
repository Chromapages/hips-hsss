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
      {/* Camera preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
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
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="rounded-full bg-zinc-800 p-4">
              <Video className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-500">Camera not accessible</p>
          </div>
        )}
      </div>

      {/* Audio level meter */}
      <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-lg p-1.5 ${
                micPermissionGranted ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}
            >
              <Mic
                className={`h-4 w-4 ${
                  micPermissionGranted ? 'text-emerald-400' : 'text-red-400'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {audioInputLabel || 'Microphone'}
              </p>
              <p className="text-xs text-zinc-500">
                {micPermissionGranted ? 'Input detected' : 'Permission required'}
              </p>
            </div>
          </div>
          {micPermissionGranted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400" />
          )}
        </div>

        {/* Level meter */}
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
            style={{
              width: `${Math.min(100, audioLevel * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}