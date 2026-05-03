'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useDataChannel,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  AlertTriangle,
  Hand,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  ShieldAlert,
} from 'lucide-react';
import type { AvatarProfile, UserRole } from '@hips/types';
import { createLocalAudioTrack, LocalAudioTrack } from 'livekit-client';
import { useAuth } from '../auth/AuthProvider';
import AvatarCanvas from './AvatarCanvas';
import SafetyMonitor from './SafetyMonitor';
import { CrisisEscalation } from './CrisisEscalation';
import { createVoiceMaskProcessor } from '@/lib/voice-mask-processor';

type LiveKitTokenResponse = {
  token: string;
  roomName: string;
  anonymousIdentity: string;
  avatar: AvatarProfile;
  expiresAt: string;
};

type SessionControlMessage = {
  type: 'HAND_RAISED' | 'HAND_LOWERED';
  participantIdentity: string;
  at: string;
};

const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880';
const textEncoder = new TextEncoder();

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

function roleCanFacilitate(role: string | null): role is Extract<UserRole, 'FACILITATOR' | 'ADMIN'> {
  return role === 'FACILITATOR' || role === 'ADMIN';
}

export default function SessionRoom({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { getToken, role } = useAuth();
  const [liveKitToken, setLiveKitToken] = useState<LiveKitTokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isKicked, setIsKicked] = useState(false);
  const [kickReason, setKickReason] = useState('');
  const [isCrisis, setIsCrisis] = useState(false);
  const [crisisReason, setCrisisReason] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchLiveKitToken() {
      setError(null);

      try {
        const firebaseToken = await getToken();

        if (!firebaseToken) {
          throw new Error('Sign in to join this anonymous session.');
        }

        // Direct request to our new LiveKit token generator
        const liveKitResponse = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify({ sessionId }),
        });
        
        const liveKitJson = await liveKitResponse.json().catch(() => ({}));

        if (!liveKitResponse.ok || !liveKitJson.token) {
          throw new Error(liveKitJson.error || 'Could not create the LiveKit room token.');
        }

        if (!cancelled) {
          setLiveKitToken(liveKitJson as LiveKitTokenResponse);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to connect to the session.');
        }
      }
    }

    fetchLiveKitToken();

    return () => {
      cancelled = true;
    };
  }, [getToken, sessionId]);

  if (isKicked) {
    return (
      <SessionExitState
        actionLabel="Return to Dashboard"
        description={
          kickReason
            ? `Your access to this session has been revoked. Reason: ${kickReason}`
            : 'Your access to this session has been revoked due to a safety intervention.'
        }
        icon="danger"
        onAction={() => router.push('/dashboard')}
        title="Session Terminated"
      />
    );
  }

  if (error) {
    return (
      <SessionExitState
        actionLabel="Back to Dashboard"
        description={error}
        icon="warning"
        onAction={() => router.push('/dashboard')}
        title="Unable to Join"
      />
    );
  }

  if (!liveKitToken) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-300" />
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Preparing anonymous room
          </span>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      audio={false}
      connect
      data-lk-theme="default"
      serverUrl={liveKitUrl}
      token={liveKitToken.token}
      video={false}
      style={{ height: '100vh', backgroundColor: '#030712' }}
    >
      <SessionContent
        anonymousIdentity={liveKitToken.anonymousIdentity}
        avatar={liveKitToken.avatar}
        canFacilitate={roleCanFacilitate(role)}
        onCrisis={(reason) => {
          setCrisisReason(reason);
          setIsCrisis(true);
        }}
        onKick={(reason) => {
          setKickReason(reason);
          setIsKicked(true);
        }}
        roomName={liveKitToken.roomName}
      />
      {isCrisis ? <CrisisEscalation reason={crisisReason} /> : null}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function SessionContent({
  anonymousIdentity,
  avatar,
  canFacilitate,
  roomName,
  onKick,
  onCrisis,
}: {
  anonymousIdentity: string;
  avatar: AvatarProfile;
  canFacilitate: boolean;
  roomName: string;
  onKick: (reason: string) => void;
  onCrisis: (reason: string) => void;
}) {
  const router = useRouter();
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [voiceMaskWarning, setVoiceMaskWarning] = useState<string | null>(null);

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

  const raisedHandList = useMemo(
    () =>
      participants
        .filter((participant) => raisedHands.has(participant.identity))
        .map((participant) => participant.identity),
    [participants, raisedHands],
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
      });

      await localParticipant.publishTrack(track as unknown as MediaStreamTrack);

      try {
        await track.setProcessor(createVoiceMaskProcessor({ preset: 'subtle' }));
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
  }, [localParticipant]);

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

  const lowerHand = async (participantIdentity: string) => {
    await publishControlMessage({
      type: 'HAND_LOWERED',
      participantIdentity,
      at: new Date().toISOString(),
    });
  };

  const handleFlag = async () => {
    const reason = window.prompt('Please describe the safety concern:');
    if (!reason) return;

    await fetch('/api/safety/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: roomName,
        reporterId: localParticipant.identity,
        level: 'HIGH',
        reason,
      }),
    });
  };

  const leaveSession = async () => {
    await stopLocalAudio();
    room.disconnect();
    router.push('/dashboard');
  };

  return (
    <main className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-black/70 px-6 py-4 backdrop-blur-2xl">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Anonymous Room</p>
          <p className="font-mono text-sm font-bold text-indigo-300">anon-{anonymousIdentity.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <ShieldAlert className="h-4 w-4" />
          Safety Engine Active
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Room Hash</p>
          <p className="font-mono text-xs text-zinc-400">{roomName.slice(0, 12)}</p>
        </div>
      </header>

      <section className="grid min-h-0 grid-cols-[1fr_360px]">
        <div className="relative min-w-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),#030712]">
          <AvatarCanvas
            avatar={avatar}
            localIdentity={localParticipant.identity}
            raisedHands={raisedHands}
          />
          {voiceMaskWarning ? (
            <div className="absolute left-6 top-6 max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 backdrop-blur-xl">
              {voiceMaskWarning}
            </div>
          ) : null}
        </div>

        <aside className="grid min-h-0 grid-rows-[auto_1fr] border-l border-white/10 bg-zinc-950">
          {canFacilitate ? (
            <RaisedHandQueue raisedHands={raisedHandList} onLowerHand={lowerHand} />
          ) : (
            <div className="border-b border-white/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Hand Queue</p>
              <p className="mt-1 text-sm text-zinc-400">
                Raise your hand when you would like facilitator attention.
              </p>
            </div>
          )}
          <SafetyMonitor sessionId={roomName} onCrisis={onCrisis} onKick={onKick} />
        </aside>
      </section>

      <footer className="flex items-center justify-center border-t border-white/10 bg-black/75 px-6 py-4 backdrop-blur-2xl">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl">
          <button
            aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
            className={[
              'flex h-14 min-w-14 items-center justify-center rounded-2xl border px-5 font-bold transition-all disabled:cursor-wait disabled:opacity-60',
              micEnabled
                ? 'border-white/10 bg-white/10 text-white hover:bg-white/15'
                : 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20',
            ].join(' ')}
            data-testid="mute-button"
            disabled={micBusy}
            onClick={toggleMicrophone}
            type="button"
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            <span className="ml-2 hidden sm:inline">{micEnabled ? 'Mute' : 'Unmute'}</span>
          </button>

          <button
            aria-pressed={raisedHands.has(localParticipant.identity)}
            className={[
              'flex h-14 min-w-14 items-center justify-center rounded-2xl border px-5 font-bold transition-all',
              raisedHands.has(localParticipant.identity)
                ? 'border-amber-500/30 bg-amber-500/20 text-amber-100'
                : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
            ].join(' ')}
            data-testid="raise-hand-button"
            onClick={toggleHand}
            type="button"
          >
            <Hand className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">
              {raisedHands.has(localParticipant.identity) ? 'Lower Hand' : 'Raise Hand'}
            </span>
          </button>

          <button
            aria-label="Flag safety concern"
            className="flex h-14 min-w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 font-bold text-amber-200 transition-all hover:bg-amber-500/20"
            data-testid="flag-button"
            onClick={handleFlag}
            type="button"
          >
            <AlertTriangle className="h-5 w-5" />
          </button>

          <button
            className="flex h-14 items-center justify-center rounded-2xl bg-red-600 px-6 font-bold text-white transition-all hover:bg-red-500"
            data-testid="end-session-button"
            onClick={() => setConfirmLeave(true)}
            type="button"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="ml-2">Leave</span>
          </button>
        </div>
      </footer>

      {confirmLeave ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-xl">
          <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <h2 className="text-2xl font-black tracking-tight">Leave this session?</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Your audio will stop and you will return to the dashboard.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                className="h-12 flex-1 rounded-2xl border border-white/10 font-bold text-white hover:bg-white/5"
                onClick={() => setConfirmLeave(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-12 flex-1 rounded-2xl bg-red-600 font-bold text-white hover:bg-red-500"
                onClick={leaveSession}
                type="button"
              >
                Leave
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function RaisedHandQueue({
  raisedHands,
  onLowerHand,
}: {
  raisedHands: string[];
  onLowerHand: (participantIdentity: string) => void;
}) {
  return (
    <div className="border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Facilitator Queue</p>
        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-200">
          {raisedHands.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {raisedHands.length === 0 ? (
          <p className="text-sm text-zinc-500">No raised hands.</p>
        ) : (
          raisedHands.map((identity) => (
            <div
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"
              key={identity}
            >
              <span className="font-mono text-xs text-zinc-300">anon-{identity.slice(0, 8)}</span>
              <button
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300 hover:bg-white/10"
                onClick={() => onLowerHand(identity)}
                type="button"
              >
                Lower
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SessionExitState({
  actionLabel,
  description,
  icon,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  icon: 'danger' | 'warning';
  onAction: () => void;
  title: string;
}) {
  const Icon = icon === 'danger' ? ShieldAlert : AlertTriangle;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-950 p-6 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
        <Icon className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-md text-gray-400">{description}</p>
      <button
        className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-500"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </button>
    </div>
  );
}
