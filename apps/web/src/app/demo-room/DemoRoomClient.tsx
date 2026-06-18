'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  Loader2,
  Sparkles,
  Mic,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';
import { createLocalAudioTrack, LocalAudioTrack, Room } from 'livekit-client';
import { toast } from 'sonner';
import { DemoBanner } from '@/components/demo/demo-banner';
import { AudioAvatar } from '@/components/demo/audio-avatar';
import { ConnectingOverlay } from '@/components/demo/connecting-overlay';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { SessionHeader } from '@/components/session-ui/SessionHeader';
import { VoiceControlsBar } from '@/components/session-ui/VoiceControlsBar';
import { MediaToolbar } from '@/components/session-ui/MediaToolbar';
import SafetyMonitor from '@/components/session/SafetyMonitor';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useVoiceEffects } from '@/hooks/useVoiceEffects';
import type { VoicePreset } from '@/lib/voice-mask-presets';
import { createLowLatencyVoiceMaskProcessor } from '@/lib/voice-mask-processor';

// SECURITY NOTE: NEXT_PUBLIC_LIVEKIT_URL exposes internal infrastructure for WebSocket connections.
// This is acceptable for demo mode as no real user data is involved.
const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'ws://localhost:7880';

// Module-level TextEncoder to avoid SSR execution in Client Component render phase
const textEncoder = new TextEncoder();

type SessionControlMessage = {
  type: 'HAND_RAISED' | 'HAND_LOWERED';
  participantIdentity: string;
  at: string;
};

function decodeControlMessage(payload: Uint8Array): SessionControlMessage | null {
  try {
    const parsed = JSON.parse(new TextDecoder().decode(payload)) as Partial<SessionControlMessage>;
    if (
      (parsed.type === 'HAND_RAISED' || parsed.type === 'HAND_LOWERED') &&
      typeof parsed.participantIdentity === 'string' &&
      typeof parsed.at === 'string'
    ) {
      return parsed as SessionControlMessage;
    }
  } catch {
    return null;
  }
  return null;
}

function DemoLobby({ onEnter, error, loading }: { onEnter: () => void; error: string | null; loading: boolean }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Demo Mode
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Welcome to the Demo</h1>
          <p className="text-sm text-muted-foreground">
            This is a sandboxed environment where you can explore the session features without joining a real session.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-surface/5 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text">What you can do in the demo:</h2>
          <ul className="space-y-2 text-sm text-text-muted text-left">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              Test your microphone and camera
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              Explore voice effects and avatar customization
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              Experience the 3D virtual office environment
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              Practice raising/lowering your hand
            </li>
          </ul>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          onClick={onEnter}
          disabled={loading}
          className="w-full h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Preparing Demo...' : 'Enter Demo Room'}
          </span>
        </button>

        <p className="text-center text-xs text-text">
          Demo sessions are isolated and do not connect to real users.
        </p>
      </div>
    </div>
  );
}

function DemoRoomContent({ roomName }: { roomName: string }) {
  const router = useRouter();
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [voiceMaskWarning, setVoiceMaskWarning] = useState<string | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const { activePreset, semitones, wetDryRatio, setPreset, setSemitones, setWetDryRatio } = useVoiceEffects('sofi', 4);

  const {
    audioInputs,
    audioOutputs,
    selectedAudioInput,
    selectedAudioOutput,
    selectAudioInput,
    selectAudioOutput,
  } = useMediaDevices();

  useEffect(() => {
    const handleReconnecting = () => setIsReconnecting(true);
    const handleReconnected = () => setIsReconnecting(false);
    const handleDisconnected = () => setIsReconnecting(false);

    room.on('reconnecting', handleReconnecting);
    room.on('reconnected', handleReconnected);
    room.on('disconnected', handleDisconnected);

    return () => {
      room.off('reconnecting', handleReconnecting);
      room.off('reconnected', handleReconnected);
      room.off('disconnected', handleDisconnected);
    };
  }, [room]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const connectionState = useConnectionState(room);

  const connectionQuality = (() => {
    if (isReconnecting) return 'poor';
    switch (connectionState) {
      case 'connected':
        return 'good';
      case 'connecting':
      case 'reconnecting':
        return 'fair';
      default:
        return 'poor';
    }
  })();

  const connectionLabel = (() => {
    switch (connectionQuality) {
      case 'good':
        return 'Connected';
      case 'fair':
        return 'Connecting';
      case 'poor':
        return 'Unstable';
    }
  })();

  const applyControlMessage = useCallback((message: SessionControlMessage) => {
    setRaisedHands((current) => {
      const next = new Set(current);
      if (message.type === 'HAND_RAISED') {
        next.add(message.participantIdentity);
      } else {
        next.delete(message.participantIdentity);
      }
      return next;
    });
  }, []);

  const { send } = useDataChannel('session-control', (message) => {
    const controlMessage = decodeControlMessage(message.payload);
    if (controlMessage) {
      applyControlMessage(controlMessage);
    }
  });

  const publishControlMessage = useCallback(
    async (message: SessionControlMessage) => {
      applyControlMessage(message);
      await send(textEncoder.encode(JSON.stringify(message)), {
        reliable: true,
        topic: 'session-control',
      });
    },
    [applyControlMessage, send],
  );

  const startMicrophone = useCallback(async () => {
    setMicBusy(true);
    setVoiceMaskWarning(null);
    let track: LocalAudioTrack | null = null;

    try {
      const preferredMicId = typeof window !== 'undefined' ? localStorage.getItem('preferred-mic-device-id') : null;
      track = await createLocalAudioTrack({
        ...(preferredMicId ? { deviceId: preferredMicId } : {}),
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
        voiceIsolation: true,
      });

      // CRITICAL: apply processor BEFORE publishing to prevent unmasked audio leak.
      try {
        await track.setProcessor(createLowLatencyVoiceMaskProcessor({ preset: activePreset, semitones, wetDryRatio }));
      } catch (processorError) {
        // Processor unavailable — stop the raw track and surface an actionable warning.
        setVoiceMaskWarning(
          processorError instanceof Error
            ? `Voice mask unavailable: ${processorError.message}. Try Chrome or Edge for full support.`
            : 'Voice mask unavailable in this browser. Try Chrome or Edge for full support.',
        );
        try {
          track.stop();
        } catch {
          // ignore
        }
        setLocalAudioTrack(null);
        setMicEnabled(false);
        setMicBusy(false);
        return;
      }

      await localParticipant.publishTrack(track as unknown as MediaStreamTrack);

      setLocalAudioTrack(track);
      setMicEnabled(true);
    } catch (err) {
      console.error('[DemoRoomClient] Microphone publication failed:', err);
      if (track) {
        try {
          track.stop();
        } catch (stopErr) {
          console.warn('Failed to stop track on error:', stopErr);
        }
      }
      setLocalAudioTrack(null);
      setMicEnabled(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      toast.error(`Microphone failed to start: ${errMsg}`);
    } finally {
      setMicBusy(false);
    }
  }, [localParticipant, activePreset, semitones, wetDryRatio]);

  const toggleMicrophone = useCallback(async () => {
    if (micBusy) return;

    if (!localAudioTrack) {
      await startMicrophone();
      return;
    }

    setMicBusy(true);

    try {
      if (micEnabled) {
        await localAudioTrack.mute();
        setMicEnabled(false);
      } else {
        await localAudioTrack.unmute();
        setMicEnabled(true);
      }
    } finally {
      setMicBusy(false);
    }
  }, [localAudioTrack, micBusy, micEnabled, startMicrophone]);

  const stopLocalAudio = useCallback(async () => {
    if (!localAudioTrack) return;

    try {
      await localAudioTrack.stopProcessor(false);
      localParticipant.unpublishTrack(localAudioTrack as unknown as MediaStreamTrack);
      localAudioTrack.stop();
    } catch (error) {
      console.warn('Failed to stop local audio cleanly:', error);
    } finally {
      setLocalAudioTrack(null);
      setMicEnabled(false);
    }
  }, [localAudioTrack, localParticipant]);

  useEffect(() => {
    return () => {
      if (localAudioTrack) {
        localAudioTrack.stop();
      }
    };
  }, [localAudioTrack]);

  const toggleHand = async () => {
    const isRaised = raisedHands.has(localParticipant.identity);
    await publishControlMessage({
      type: isRaised ? 'HAND_LOWERED' : 'HAND_RAISED',
      participantIdentity: localParticipant.identity,
      at: new Date().toISOString(),
    });
  };

  const handleToggleCamera = useCallback(() => {
    setCameraEnabled((v) => !v);
  }, []);

  const handleVoicePresetChange = useCallback((preset: VoicePreset) => {
    setPreset(preset);
  }, [setPreset]);

  const handleVoiceSemitoneChange = useCallback((st: number) => {
    setSemitones(st);
  }, [setSemitones]);

  const handleVoiceWetDryChange = useCallback((ratio: number) => {
    setWetDryRatio(ratio);
  }, [setWetDryRatio]);

  const leaveSession = async () => {
    await stopLocalAudio();
    room.disconnect();
    router.push('/join');
  };

  return (
    <main id="main" tabIndex={-1} className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black text-white">
      <SessionHeader
        anonymousHandle="demo-user"
        sessionSeconds={sessionSeconds}
        connectionQuality={connectionQuality}
        connectionLabel={connectionLabel}
        roomName={roomName}
      />

      <section className="grid min-h-0 grid-cols-[1fr_360px]">
        <div className="relative min-w-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black]">
          <AudioAvatar localIdentity={localParticipant.identity} micEnabled={micEnabled} gesture="idle" />
          {voiceMaskWarning ? (
            <div className="absolute left-6 top-6 max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 backdrop-blur-xl">
              {voiceMaskWarning}
            </div>
          ) : null}

          <div className="absolute left-6 top-6 max-w-sm rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 backdrop-blur-xl">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4" />
              Demo Mode Active
            </div>
            <p className="mt-1 text-xs text-emerald-200/80">
              You are in a sandboxed demo room. Your actions do not affect real sessions.
            </p>
          </div>
        </div>

        <aside className="grid min-h-0 grid-rows-[auto_1fr] border-l border-white/10 bg-zinc-950">
          <div className="border-b border-white/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Demo Info</p>
            <p className="mt-1 text-sm text-text">
              This is a sandboxed demo environment. No real sessions or data are involved.
            </p>
          </div>
          <SafetyMonitor sessionId={roomName} onCrisis={() => {}} onKick={() => {}} />
        </aside>
      </section>

      <ConnectingOverlay
          connectionQuality={connectionQuality}
          connectionLabel={connectionLabel}
        />

      <MediaToolbar
        micEnabled={micEnabled}
        micBusy={micBusy}
        cameraEnabled={cameraEnabled}
        onToggleMic={toggleMicrophone}
        onToggleCamera={handleToggleCamera}
        audioInputs={audioInputs}
        audioOutputs={audioOutputs}
        selectedAudioInput={selectedAudioInput}
        selectedAudioOutput={selectedAudioOutput}
        onSelectAudioInput={selectAudioInput}
        onSelectAudioOutput={selectAudioOutput}
      />

      <VoiceControlsBar
        micEnabled={micEnabled}
        micBusy={micBusy}
        raisedHand={raisedHands.has(localParticipant.identity)}
        onToggleMute={toggleMicrophone}
        onToggleHand={toggleHand}
        onFlag={() => {}}
        onLeave={leaveSession}
        voicePreset={activePreset}
        voiceSemitones={semitones}
        voiceWetDryRatio={wetDryRatio}
        onVoicePresetChange={handleVoicePresetChange}
        onVoiceSemitoneChange={handleVoiceSemitoneChange}
        onVoiceWetDryChange={handleVoiceWetDryChange}
      />
    </main>
  );
}

// ─── Microphone Selector Modal ─────────────────────────────────────────────

type MicSelectorModalProps = {
  isOpen: boolean;
  initialError: string | null;
  onConfirm: (deviceId: string | null) => void;
  onClose: () => void;
};

function MicSelectorModal({ isOpen, initialError, onConfirm, onClose }: MicSelectorModalProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(initialError);
  const [volume, setVolume] = useState(0);
  const [checking, setChecking] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stopAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    streamRef.current = null;
    try { audioCtxRef.current?.close(); } catch { /* ignore */ }
    audioCtxRef.current = null;
    analyserRef.current = null;
    setVolume(0);
  }, []);

  const startAudioTest = useCallback(async (deviceId: string) => {
    stopAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const poll = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setVolume(avg / 128);
        rafRef.current = requestAnimationFrame(poll);
      };
      poll();
    } catch {
      setVolume(0);
    }
  }, [stopAudio]);

  const requestPermission = useCallback(async () => {
    setChecking(true);
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setPermissionGranted(true);

      const all = await navigator.mediaDevices.enumerateDevices();
      const inputs = all.filter((d) => d.kind === 'audioinput');
      setDevices(inputs);

      const preferred = typeof window !== 'undefined' ? localStorage.getItem('preferred-mic-device-id') : null;
      const firstId = (preferred && inputs.find((d) => d.deviceId === preferred)?.deviceId)
        || inputs[0]?.deviceId
        || '';
      setSelectedId(firstId);
      if (firstId) startAudioTest(firstId);
    } catch {
      setPermissionError(
        'Microphone access was blocked. Please click the lock icon in your browser address bar, set Microphone to "Allow", then click "Retry".'
      );
      setPermissionGranted(false);
    } finally {
      setChecking(false);
    }
  }, [startAudioTest]);

  useEffect(() => {
    if (isOpen) requestPermission();
    return () => stopAudio();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeviceChange = useCallback((deviceId: string) => {
    setSelectedId(deviceId);
    startAudioTest(deviceId);
  }, [startAudioTest]);

  const handleConfirm = useCallback(() => {
    stopAudio();
    if (selectedId) localStorage.setItem('preferred-mic-device-id', selectedId);
    onConfirm(selectedId || null);
  }, [selectedId, stopAudio, onConfirm]);

  const volumeBarWidth = Math.min(100, Math.round(volume * 100));

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mic-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-text text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Mic className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 id="mic-modal-title" className="text-base font-bold text-white">
                Microphone Setup
              </h2>
              <p className="text-xs text-text">Select your microphone before entering</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-text hover:text-white transition-colors"
            aria-label="Close microphone setup"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Permission Error */}
          {permissionError && (
            <div
              role="alert"
              className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-semibold text-amber-300">
                  Microphone Access Blocked
                </p>
                <p className="text-xs text-amber-400 leading-relaxed">
                  {permissionError}
                </p>
                <button
                  onClick={requestPermission}
                  disabled={checking}
                  type="button"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-wait"
                >
                  {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Settings className="h-3.5 w-3.5" />}
                  {checking ? 'Checking...' : 'Retry Permission'}
                </button>
              </div>
            </div>
          )}

          {/* Permission Granted: Device Picker + Volume Meter */}
          {permissionGranted && !permissionError && (
            <>
              <div className="space-y-2">
                <label htmlFor="mic-device-select" className="text-xs font-bold uppercase tracking-widest text-text">
                  Select Microphone
                </label>
                {devices.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-text px-4 py-3 text-sm text-text">
                    <Info className="h-4 w-4 shrink-0" />
                    No microphones detected. Please connect one and retry.
                  </div>
                ) : (
                  <select
                    id="mic-device-select"
                    value={selectedId}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-text px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  >
                    {devices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Live Volume Meter */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-text">
                  Microphone Test — speak to check
                </p>
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-855 border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${volumeBarWidth}%`,
                      background: volumeBarWidth > 70
                        ? 'linear-gradient(to right,#10b981,#f59e0b)'
                        : 'linear-gradient(to right,#10b981,#34d399)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-text">
                  {volumeBarWidth > 5
                    ? <span className="text-emerald-400 font-semibold">✓ Audio detected</span>
                    : 'Waiting for audio input…'}
                </p>
              </div>

              {/* Permission granted badge */}
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-semibold text-emerald-400">Microphone access granted</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-zinc-950/50">
          <button
            onClick={onClose}
            type="button"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-text hover:bg-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!permissionGranted || devices.length === 0}
            type="button"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" />
            Confirm &amp; Enter Room
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Demo Room Inner ────────────────────────────────────────────────────────

function DemoRoomInner({ roomName }: { token?: string; roomName: string }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMicModal, setShowMicModal] = useState(false);
  const [micModalError, setMicModalError] = useState<string | null>(null);

  // Pre-call media device check — opens the mic modal instead of hard-blocking
  useEffect(() => {
    async function checkDevicesAndPermissions() {
      try {
        const devices = await Room.getLocalDevices('audioinput');
        if (devices.length === 0) {
          setMicModalError('No microphone detected on your device.');
          setShowMicModal(true);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setMicModalError(
          'Microphone access blocked. Please enable microphone permissions in your browser settings.'
        );
        setShowMicModal(true);
      }
    }
    checkDevicesAndPermissions();
  }, []);

  const handleEnter = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/token', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to get demo token');
      const data = await res.json();
      setToken(data.token);
      setHasEntered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join demo');
    } finally {
      setLoading(false);
    }
  };

  const handleMicConfirm = useCallback((_deviceId: string | null) => {
    setShowMicModal(false);
    setMicModalError(null);
  }, []);

  if (!hasEntered) {
    return (
      <>
        <DemoLobby onEnter={handleEnter} error={error} loading={loading} />
        <MicSelectorModal
          isOpen={showMicModal}
          initialError={micModalError}
          onConfirm={handleMicConfirm}
          onClose={() => setShowMicModal(false)}
        />
      </>
    );
  }

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {error ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest">
                Error
              </div>
              <h1 className="text-2xl font-bold">Failed to Join Demo</h1>
              <p className="text-sm text-text">{error}</p>
              <button
                onClick={handleEnter}
                className="w-full h-12 rounded-xl bg-primary font-bold text-white hover:bg-primary transition-colors"
                type="button"
              >
                Try Again
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-surface/[0.03] px-5 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
              <span className="text-sm font-bold uppercase tracking-widest text-text">
                {loading ? 'Joining Demo...' : 'Preparing Demo...'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <DemoModeProvider isDemo={true}>
      <div className="relative min-h-screen bg-black">
        {/* DemoBanner — persistent demo mode indicator with exit */}
        <DemoBanner
          onDisconnect={() => {
            // Cleanup happens via VoiceControlsBar onLeave
          }}
          exitPath="/demo-room"
        />

        <LiveKitRoom
          audio={false}
          connect
          data-lk-theme="default"
          serverUrl={liveKitUrl}
          token={token}
          video={false}
          style={{ height: '100vh', backgroundColor: '#030712' }}
          onError={(err) => {
            // 'Client initiated disconnect' is expected when room.disconnect()
            // is called explicitly (e.g. leaveSession, unmount cleanup).
            // Suppress it to avoid bouncing the user back to the lobby.
            if (err.message?.includes('Client initiated disconnect')) {
              console.info('[DemoLiveKitRoom] Clean disconnect acknowledged.');
              return;
            }
            console.error('[DemoLiveKitRoom] Connection error:', err);
            setError(err.message || 'Failed to connect to the demo session.');
            setToken(null);
            setHasEntered(false);
          }}
        >
          <DemoRoomContent roomName={roomName} />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </DemoModeProvider>
  );
}

function DemoRoomContentWrapper() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') || 'demo-room-sandbox';

  return <DemoRoomInner roomName={room} />;
}

export function DemoRoomClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black text-white">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/[0.03] px-5 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-text">
              Preparing Demo
            </span>
          </div>
        </div>
      }
    >
      <DemoRoomContentWrapper />
    </Suspense>
  );
}
