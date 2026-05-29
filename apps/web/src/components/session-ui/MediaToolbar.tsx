'use client';

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Volume2, Settings } from 'lucide-react';

interface MediaToolbarProps {
  micEnabled: boolean;
  micBusy: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  selectedAudioInput: string | null;
  selectedAudioOutput: string | null;
  onSelectAudioInput: (deviceId: string) => void;
  onSelectAudioOutput: (deviceId: string) => void;
}

export function MediaToolbar({
  micEnabled,
  micBusy,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  audioInputs,
  audioOutputs,
  selectedAudioInput,
  selectedAudioOutput,
  onSelectAudioInput,
  onSelectAudioOutput,
}: MediaToolbarProps) {
  const [openMicMenu, setOpenMicMenu] = useState(false);
  const [openSpeakerMenu, setOpenSpeakerMenu] = useState(false);

  return (
    <div className="absolute top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-2 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Mic toggle */}
      <button
        aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
        onClick={onToggleMic}
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full transition-all',
          micBusy
            ? 'cursor-wait opacity-50'
            : micEnabled
              ? 'border border-white/5 bg-white/5 text-white hover:bg-white/10'
              : 'border border-red-500/20 bg-red-500/10 text-red-500',
        ].join(' ')}
      >
        {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </button>

      {/* Mic device selector */}
      {audioInputs.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpenMicMenu(!openMicMenu)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 text-sm text-white hover:bg-white/10 transition-all"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {openMicMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Microphone
              </p>
              <div className="space-y-1">
                {audioInputs.map((d) => (
                  <button
                    key={d.deviceId}
                    onClick={() => {
                      onSelectAudioInput(d.deviceId);
                      setOpenMicMenu(false);
                    }}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      selectedAudioInput === d.deviceId
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-zinc-300 hover:bg-white/5',
                    ].join(' ')}
                  >
                    {d.label || `Mic ${d.deviceId.slice(0, 8)}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-5 w-px bg-white/10" />

      {/* Camera toggle */}
      <button
        aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
        onClick={onToggleCamera}
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full transition-all',
          cameraEnabled
            ? 'border border-white/5 bg-white/5 text-white hover:bg-white/10'
            : 'border border-white/5 bg-white/5 text-zinc-500',
        ].join(' ')}
      >
        {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
      </button>

      {/* Speaker output selector */}
      {audioOutputs.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpenSpeakerMenu(!openSpeakerMenu)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 text-sm text-white hover:bg-white/10 transition-all"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {openSpeakerMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Speaker Output
              </p>
              <div className="space-y-1">
                {audioOutputs.map((d) => (
                  <button
                    key={d.deviceId}
                    onClick={() => {
                      onSelectAudioOutput(d.deviceId);
                      setOpenSpeakerMenu(false);
                    }}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      selectedAudioOutput === d.deviceId
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-zinc-300 hover:bg-white/5',
                    ].join(' ')}
                  >
                    {d.label || `Speaker ${d.deviceId.slice(0, 8)}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}