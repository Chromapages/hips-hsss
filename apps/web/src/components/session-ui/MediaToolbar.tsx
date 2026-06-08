'use client';

import { useState, useCallback } from 'react';
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

  const handleMicKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!openMicMenu) return;
    if (e.key === 'Escape') {
      setOpenMicMenu(false);
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpenMicMenu(false);
    }
  }, [openMicMenu]);

  const handleSpeakerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!openSpeakerMenu) return;
    if (e.key === 'Escape') {
      setOpenSpeakerMenu(false);
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpenSpeakerMenu(false);
    }
  }, [openSpeakerMenu]);

  return (
    <div className="absolute top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-2 shadow-lg backdrop-blur-xl">
      {/* Mic toggle */}
      <button
        aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
        onClick={onToggleMic}
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full transition-all',
          micBusy
            ? 'cursor-wait opacity-50'
            : micEnabled
              ? 'border border-border bg-bg-subtle text-text hover:bg-border'
              : 'border border-destructive bg-destructive text-destructive',
        ].join(' ')}
      >
        {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </button>

      {/* Mic device selector */}
      {audioInputs.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpenMicMenu(!openMicMenu)}
            onKeyDown={handleMicKeyDown}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-3 text-sm text-text hover:bg-border transition-all"
            aria-haspopup="true"
            aria-expanded={openMicMenu}
            aria-label="Select microphone"
          >
            <Settings className="h-3.5 w-3.5 text-text-muted0" />
          </button>

          {openMicMenu && (
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border bg-surface p-3 shadow-lg"
              role="menu"
              aria-label="Microphone selection"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted0">
                Microphone
              </p>
              <div className="space-y-1">
                {audioInputs.map((d) => (
                  <button
                    key={d.deviceId}
                    role="menuitem"
                    onClick={() => {
                      onSelectAudioInput(d.deviceId);
                      setOpenMicMenu(false);
                    }}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      selectedAudioInput === d.deviceId
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-bg-subtle',
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

      <div className="h-5 w-px bg-border" />

      {/* Camera toggle */}
      <button
        aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
        onClick={onToggleCamera}
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full transition-all',
          cameraEnabled
            ? 'border border-border bg-bg-subtle text-text hover:bg-border'
            : 'border border-border bg-bg-subtle text-text-muted0',
        ].join(' ')}
      >
        {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
      </button>

      {/* Speaker output selector */}
      {audioOutputs.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpenSpeakerMenu(!openSpeakerMenu)}
            onKeyDown={handleSpeakerKeyDown}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-3 text-sm text-text hover:bg-border transition-all"
            aria-haspopup="true"
            aria-expanded={openSpeakerMenu}
            aria-label="Select speaker output"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {openSpeakerMenu && (
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border bg-surface p-3 shadow-lg"
              role="menu"
              aria-label="Speaker output selection"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted0">
                Speaker Output
              </p>
              <div className="space-y-1">
                {audioOutputs.map((d) => (
                  <button
                    key={d.deviceId}
                    role="menuitem"
                    onClick={() => {
                      onSelectAudioOutput(d.deviceId);
                      setOpenSpeakerMenu(false);
                    }}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      selectedAudioOutput === d.deviceId
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-bg-subtle',
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
