'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { createLocalAudioTrack, createLocalVideoTrack, LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { DemoRoomErrorBoundary } from '@/components/demo/demo-room-error-boundary';
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
import { createVoiceMaskProcessor } from '@/lib/voice-mask-processor';
import type { AvatarGesture } from '@hips/types';

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
          <h1 className="text-3xl font-black tracking-tight">Welcome to the Demo</h1>
          <p className="text-sm text-zinc-500">
            This is a sandboxed environment where you can explore the session features without joining a real session.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">What you can do in the demo:</h2>
          <ul className="space-y-2 text-sm text-zinc-300 text-left">
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
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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

        <p className="text-center text-xs text-zinc-600">
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
  const [gesture, setGesture] = useState<AvatarGesture>('idle');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const { activePreset, semitones, setPreset, setSemitones } = useVoiceEffects('subtle', 4);

  const {
    audioInputs,
    audioOutputs,
    selectedAudioInput,
    selectedAudioOutput,
    selectAudioInput,
    selectAudioOutput,
  } = useMediaDevices();

  // Persist selected audio input device across mic toggles so device switch takes effect
  const selectedAudioInputRef = useRef<string | null>(null);

  useEffect(() => {
    selectedAudioInputRef.current = selectedAudioInput;
  }, [selectedAudioInput]);

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

    try {
      const track = await createLocalAudioTrack({
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
        voiceIsolation: true,
        deviceId: selectedAudioInputRef.current ? { exact: selectedAudioInputRef.current } : undefined,
      });

      await localParticipant.publishTrack(track as unknown as MediaStreamTrack);

      try {
        await track.setProcessor(createVoiceMaskProcessor({ preset: activePreset, semitones }));
      } catch (processorError) {
        setVoiceMaskWarning(
          processorError instanceof Error
            ? `Voice mask unavailable: ${processorError.message}`
            : 'Voice mask unavailable in this browser.',
        );
      }

      setLocalAudioTrack(track);
      setMicEnabled(true);
    } finally {
      setMicBusy(false);
    }
  }, [localParticipant, activePreset, semitones]);

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

  const handleToggleCamera = useCallback(async () => {
    if (cameraEnabled && localVideoTrack) {
      await localVideoTrack.mute();
      localParticipant.unpublishTrack(localVideoTrack);
      setCameraEnabled(false);
      setLocalVideoTrack(null);
    } else if (!cameraEnabled) {
      try {
        const track = await createLocalVideoTrack({ resolution: { width: 1280, height: 720 } });
        await localParticipant.publishTrack(track as unknown as MediaStreamTrack);
        setLocalVideoTrack(track);
        setCameraEnabled(true);
      } catch (err) {
        console.warn('Camera unavailable:', err);
      }
    }
  }, [cameraEnabled, localVideoTrack, localParticipant]);

  const handleVoicePresetChange = useCallback((preset: VoicePreset) => {
    setPreset(preset);
  }, [setPreset]);

  const handleVoiceSemitoneChange = useCallback((st: number) => {
    setSemitones(st);
  }, [setSemitones]);

  // Re-apply voice processor when preset or semitones change after mic is already on
  useEffect(() => {
    if (!localAudioTrack || micBusy) return;
    let cancelled = false;
    const applyProcessor = async () => {
      try {
        await localAudioTrack.setProcessor(createVoiceMaskProcessor({ preset: activePreset, semitones }));
      } catch (processorError) {
        if (cancelled) return;
        setVoiceMaskWarning(
          processorError instanceof Error
            ? `Voice mask unavailable: ${processorError.message}`
            : 'Voice mask unavailable in this browser.',
        );
      }
    };
    applyProcessor();
    return () => { cancelled = true; };
  }, [activePreset, semitones, localAudioTrack, micBusy]);

  const leaveSession = async () => {
    await stopLocalAudio();
    room.disconnect();
    router.push('/join');
  };

  return (
    <main className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black text-white">
      <SessionHeader
        anonymousHandle="demo-user"
        sessionSeconds={sessionSeconds}
        connectionQuality={connectionQuality}
        connectionLabel={connectionLabel}
        roomName={roomName}
      />

      <section className="grid min-h-0 grid-cols-[1fr_360px]">
        <div className="relative min-w-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black]">
          <AudioAvatar
            localIdentity={localParticipant.identity}
            micEnabled={micEnabled}
            gesture={gesture}
            audioStream={localAudioTrack?.mediaStream ?? null}
          />
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Demo Info</p>
            <p className="mt-1 text-sm text-zinc-400">
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
        gesture={gesture}
        onToggleMute={toggleMicrophone}
        onToggleHand={toggleHand}
        onFlag={() => {}}
        onLeave={leaveSession}
        onGestureChange={setGesture}
        voicePreset={activePreset}
        voiceSemitones={semitones}
        onVoicePresetChange={handleVoicePresetChange}
        onVoiceSemitoneChange={handleVoiceSemitoneChange}
      />
    </main>
  );
}

// DemoBanner wrapper — must live inside LiveKitRoom where useRoomContext is valid
function DemoBannerExit({ exitPath }: { exitPath: string }) {
  const router = useRouter();
  const room = useRoomContext();
  return (
    <DemoBanner
      onDisconnect={() => room.disconnect()}
      exitPath={exitPath}
    />
  );
}

function DemoRoomInner({ roomName }: { token?: string; roomName: string }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!hasEntered) {
    return <DemoLobby onEnter={handleEnter} error={error} loading={loading} />;
  }

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {error ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                Error
              </div>
              <h1 className="text-2xl font-bold">Failed to Join Demo</h1>
              <p className="text-sm text-zinc-400">{error}</p>
              <button
                onClick={handleEnter}
                className="w-full h-12 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
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
        {/* DemoBanner — lives inside LiveKitRoom so useRoomContext is in scope */}
        <DemoBannerExit exitPath="/join" />

        <LiveKitRoom
          audio={false}
          connect
          data-lk-theme="default"
          serverUrl={liveKitUrl}
          token={token}
          video={false}
          style={{ height: '100vh', backgroundColor: '#030712' }}
        >
          <DemoRoomContent roomName={roomName} />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </DemoModeProvider>
  );
}

function DemoRoomContentWrapper() {
  // The token route always issues tokens for demo-room-sandbox — ?room= is display-only
  // and was misleading users into thinking they could join other rooms.
  return <DemoRoomInner roomName="demo-room-sandbox" />;
}

export function DemoRoomClient() {
  return (
    <DemoRoomErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Preparing Demo
              </span>
            </div>
          </div>
        }
      >
        <DemoRoomContentWrapper />
      </Suspense>
    </DemoRoomErrorBoundary>
  );
}
