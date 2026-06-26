'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  Activity,
  Loader2,
  Server,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import type { Avatar2DConfig, AvatarProfile, UserRole } from '@hips/types';
import { DEFAULT_AVATAR_2D } from '@hips/types';
import { createLocalAudioTrack, LocalAudioTrack, Room } from 'livekit-client';
import { toast } from 'sonner';
import { useAuth } from '../auth/AuthProvider';
import AvatarCanvas from './AvatarCanvas';
import SafetyMonitor from './SafetyMonitor';
import { CrisisEscalation } from './CrisisEscalation';
import { createLowLatencyVoiceMaskProcessor } from '@/lib/voice-mask-processor';
import { SessionHeader } from '../session-ui/SessionHeader';
import { VoiceControlsBar } from '../session-ui/VoiceControlsBar';
import { MobileBlockPage } from '../session-ui/MobileBlockPage';
import { MediaToolbar } from '../session-ui/MediaToolbar';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useVoiceEffects } from '@/hooks/useVoiceEffects';
import { useNeuralVoiceMasking } from '@/hooks/session/useNeuralVoiceMasking';
import { getBrowserMediaDevices } from '@/lib/browser-media';
import { normalizeAvatarEmotion, normalizeSkinTone, paletteColors } from '../session-ui/avatar-options';
import type { AvatarGesture, AvatarEmotion } from '@hips/types';
import { SessionExitState } from './SessionExitState';
import { RaisedHandQueue } from './RaisedHandQueue';
import type { VoicePreset } from '@/lib/voice-mask-presets';
import type { VoiceWorkerControlMessage } from '@/lib/streaming-voice-client';
import { asError } from '@/lib/errors';

const parseAvatar2DConfig = (raw: string | null): Avatar2DConfig | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Avatar2DConfig;
  } catch {
    return null;
  }
};

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

type VoiceMaskingStatus = {
  checked: boolean;
  ready: boolean;
  runtime: string;
  liveReady: boolean;
  publicEndpointConfigured: boolean;
  healthReachable: boolean;
  healthLatencyMs?: number;
  fallbackReason?: string;
};

// SECURITY NOTE [M12]: NEXT_PUBLIC_LIVEKIT_URL exposes internal infrastructure.
// LiveKit URL must be public for client-side WebSocket connections.
// For production: move room token generation server-side so URL doesn't need to be public.
// Current mitigation: URL is only used for WebSocket connection, not for auth.
// TODO [Phase 3]: Refactor to generate tokens server-side and remove NEXT_PUBLIC_LIVEKIT_URL.
const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'ws://localhost:7880';
const textEncoder = new TextEncoder();
const ENHANCED_NEURAL_UNAVAILABLE_MESSAGE =
  'Enhanced Neural Masking is not live yet. Use Effects Mode for microphone audio while the returned-audio backend is being connected.';

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

function isLiveKitLocalAudioTrack(track: LocalAudioTrack | MediaStreamTrack): track is LocalAudioTrack {
  return 'mediaStreamTrack' in track && typeof track.stopProcessor === 'function';
}

function stopLiveKitLocalAudioTrack(track: LocalAudioTrack) {
  try {
    track.stop();
  } catch (stopErr) {
    console.warn('[SessionRoom] Failed to stop local microphone track:', stopErr);
  }
}

function getVoiceMaskingFallbackReason(neural: Record<string, unknown>): string {
  if (!neural.enabled) return 'Worker disabled';
  if (!neural.configured) return 'Worker health URL missing';
  if (!(neural.health as { reachable?: boolean } | undefined)?.reachable) return 'Worker unreachable';
  if (!neural.liveReady) return 'Worker not live-ready';
  if (!neural.publicEndpointConfigured) return 'Public WebSocket missing';
  if (neural.sharedSecretConfigured && !neural.browserToken) return 'Browser token missing';
  return 'Enhanced path unavailable';
}

async function reportSessionError(message: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', sessionId?: string) {
  try {
    await fetch('/api/error/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId,
        severity,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      }),
    });
  } catch (err) {
    console.error('Failed to send error report:', err);
  }
}

export default function SessionRoom({
  sessionId,
  prefetchedToken,
}: {
  sessionId: string;
  prefetchedToken?: string | null;
}) {
  const router = useRouter();
  const { getToken, role } = useAuth();
  const [liveKitToken, setLiveKitToken] = useState<LiveKitTokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isKicked, setIsKicked] = useState(false);
  const [kickReason, setKickReason] = useState('');
  const [isCrisis, setIsCrisis] = useState(false);
  const [crisisReason, setCrisisReason] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Task 5.12 — Block mobile users before any connection attempt
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pre-call media device check (Step 4.5 & 4.6)
  useEffect(() => {
    async function checkDevicesAndPermissions() {
      try {
        const devices = await Room.getLocalDevices('audioinput');
        if (devices.length === 0) {
          const msg = 'No microphone detected on your device. Please plug in a microphone and retry.';
          setMediaError(msg);
          void reportSessionError(msg, 'HIGH', sessionId);
          return;
        }

        const stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: unknown) {
        const errorObj = asError(err);
        console.error('[SessionRoom] Media device check failed:', errorObj);
        const msg = 'Microphone access blocked. Please enable microphone permissions in your browser settings to join the session.';
        setMediaError(msg);
        void reportSessionError(`Media device check failed: ${errorObj.message}`, 'HIGH', sessionId);
      }
    }
    checkDevicesAndPermissions();
  }, [sessionId]);

  useEffect(() => {
    // Skip fetch if a token was pre-supplied via sessionStorage or query param.
    // sessionStorage is the new preferred path — it doesn't leak the token via
    // history, the Referer header, server logs, or analytics. The query-param
    // path is kept as a fallback for callers that pass ?token= (e.g., the
    // older /session/[id]?token=... flow during transition). See audit A1.
    if (prefetchedToken) return;

    let cancelled = false;

    async function fetchLiveKitToken() {
      setError(null);

      try {
        const idToken = await getToken();
        if (!idToken) {
          if (!cancelled) {
            setError('Please sign in to join a session.');
          }
          return;
        }
        const liveKitResponse = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
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
          const errMsg = err instanceof Error ? err.message : 'Failed to connect to the session.';
          setError(errMsg);
          void reportSessionError(`Token fetch failed: ${errMsg}`, 'CRITICAL', sessionId);
        }
      }
    }

    fetchLiveKitToken();

    return () => {
      cancelled = true;
    };
  }, [getToken, sessionId, prefetchedToken]);

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

  // Task 5.12 — Mobile block page, no connection attempt
  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 p-8 text-center text-white">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
          <svg className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Sessions require a laptop or desktop computer</h1>
        <p className="mt-3 max-w-sm text-text">
          Your device screen is too small for the 3D session environment.
        </p>
        <button
          className="mt-8 rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary"
          onClick={() => router.push('/dashboard')}
          type="button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (mediaError) {
    return (
      <SessionExitState
        actionLabel="Retry"
        description={mediaError}
        icon="warning"
        onAction={() => window.location.reload()}
        title="Microphone Required"
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
    // If we have a prefetched token from query params, use it directly
    if (prefetchedToken) {
      return (
        <LiveKitRoom
          audio={false}
          connect
          data-lk-theme="default"
          serverUrl={liveKitUrl}
          token={prefetchedToken}
          video={false}
          style={{ height: '100vh', backgroundColor: '#030712' }}
          onError={(err) => {
            console.error('[LiveKitRoom] Connection error:', err);
            const errMsg = err.message || 'Failed to connect to the session.';
            setError(errMsg);
            void reportSessionError(`LiveKit Room Connection error (prefetched): ${errMsg}`, 'CRITICAL', sessionId);
          }}
        >
          <SessionContent
            anonymousIdentity="direct-join"
            avatar={{ style: 1, palette: 'coastal', gesture: 'idle' }}
            canFacilitate={false}
            onCrisis={(reason) => {
              setCrisisReason(reason);
              setIsCrisis(true);
            }}
            onKick={(reason) => {
              setKickReason(reason);
              setIsKicked(true);
            }}
            onReconnecting={setIsReconnecting}
            isReconnecting={isReconnecting}
            roomName={sessionId}
          />
          <RoomAudioRenderer />
        </LiveKitRoom>
      );
    }
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/[0.03] px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-text" />
          <span className="text-sm font-bold uppercase tracking-widest text-text">
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
      onError={(err) => {
        console.error('[LiveKitRoom] Connection error:', err);
        const errMsg = err.message || 'Failed to connect to the session.';
        setError(errMsg);
        void reportSessionError(`LiveKit Room Connection error: ${errMsg}`, 'CRITICAL', sessionId);
      }}
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
        onReconnecting={setIsReconnecting}
        isReconnecting={isReconnecting}
        roomName={liveKitToken.roomName}
      />
      {isCrisis ? <CrisisEscalation reason={crisisReason} onStayInSession={() => setIsCrisis(false)} onEndSession={() => router.push('/dashboard')} /> : null}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function SessionContent({
  anonymousIdentity,
  avatar,
  canFacilitate,
  onCrisis,
  onKick,
  onReconnecting,
  isReconnecting,
  roomName,
}: {
  anonymousIdentity: string;
  avatar: AvatarProfile;
  canFacilitate: boolean;
  onCrisis: (reason: string) => void;
  onKick: (reason: string) => void;
  onReconnecting: (reconnecting: boolean) => void;
  isReconnecting: boolean;
  roomName: string;
}) {
  const router = useRouter();
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [localEmotion, setLocalEmotion] = useState<AvatarEmotion>(() => {
    if (typeof window !== "undefined") {
      const hostConfigStr = localStorage.getItem("hips-host-avatar");
      if (hostConfigStr) {
        try {
          const config = JSON.parse(hostConfigStr);
          return normalizeAvatarEmotion(config.emotion);
        } catch {}
      }
      const saved = sessionStorage.getItem("hips-avatar-emotion");
      if (saved) return normalizeAvatarEmotion(saved);
    }
    return "neutral";
  });

  const handleEmotionChange = (emo: AvatarEmotion) => {
    setLocalEmotion(emo);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hips-avatar-emotion", emo);
      const hostConfigStr = localStorage.getItem("hips-host-avatar");
      if (hostConfigStr) {
        try {
          const config = JSON.parse(hostConfigStr);
          config.emotion = emo;
          localStorage.setItem("hips-host-avatar", JSON.stringify(config));
        } catch {}
      }
    }
  };

  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | MediaStreamTrack | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [voiceMaskWarning, setVoiceMaskWarning] = useState<string | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [facilitatorNotes, setFacilitatorNotes] = useState('');
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  // Voice effects state
  const { activePreset, semitones, wetDryRatio, setPreset, setSemitones, setWetDryRatio } = useVoiceEffects('sofi', 4);

  // Two-tier voice replacement state
  const [anonymizationMode, setAnonymizationMode] = useState<'dsp' | 'neural'>('dsp');
  const [selectedPersona, setSelectedPersona] = useState<'clara' | 'arthur'>('clara');
  const [isAntiCadenceEnabled, setIsAntiCadenceEnabled] = useState(false);
  const [serverMaskingReady, setServerMaskingReady] = useState(false);
  const [voiceWorkerUrl, setVoiceWorkerUrl] = useState<string | null>(null);
  const [voiceWorkerToken, setVoiceWorkerToken] = useState<string | null>(null);
  const [voiceMaskingStatus, setVoiceMaskingStatus] = useState<VoiceMaskingStatus>({
    checked: false,
    ready: false,
    runtime: 'unknown',
    liveReady: false,
    publicEndpointConfigured: false,
    healthReachable: false,
  });
  const {
    start: startNeuralVoiceMasking,
    stop: stopNeuralVoiceMasking,
    state: neuralVoiceState,
    error: neuralVoiceError,
    lastControlMessage: neuralVoiceControlMessage,
  } = useNeuralVoiceMasking();
  const neuralSourceTrackRef = useRef<LocalAudioTrack | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkServerMasking() {
      try {
        const response = await fetch('/api/voice-masking/status', { cache: 'no-store' });
        const data = await response.json();
        const neural = data?.neural ?? {};
        const ready = Boolean(neural?.readyForSessionUse);
        if (!cancelled) {
          setServerMaskingReady(ready);
          setVoiceWorkerUrl(typeof neural?.publicWsUrl === 'string' ? neural.publicWsUrl : null);
          setVoiceWorkerToken(typeof neural?.browserToken === 'string' ? neural.browserToken : null);
          setVoiceMaskingStatus({
            checked: true,
            ready,
            runtime: typeof neural?.runtime === 'string' ? neural.runtime : 'unknown',
            liveReady: Boolean(neural?.liveReady),
            publicEndpointConfigured: Boolean(neural?.publicEndpointConfigured),
            healthReachable: Boolean(neural?.health?.reachable),
            ...(typeof neural?.health?.latencyMs === 'number' ? { healthLatencyMs: neural.health.latencyMs } : {}),
            ...(!ready ? { fallbackReason: getVoiceMaskingFallbackReason(neural) } : {}),
          });
        }
      } catch {
        if (!cancelled) {
          setServerMaskingReady(false);
          setVoiceWorkerUrl(null);
          setVoiceWorkerToken(null);
          setVoiceMaskingStatus({
            checked: true,
            ready: false,
            runtime: 'unknown',
            liveReady: false,
            publicEndpointConfigured: false,
            healthReachable: false,
            fallbackReason: 'Status check failed',
          });
        }
      }
    }

    void checkServerMasking();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Try host config first
    const hostConfigStr = localStorage.getItem("hips-host-avatar");
    if (hostConfigStr) {
      try {
        const config = JSON.parse(hostConfigStr);
        if (config.anonymizationMode) setAnonymizationMode(config.anonymizationMode);
        if (config.selectedPersona) setSelectedPersona(config.selectedPersona);
        if (typeof config.isAntiCadenceEnabled === "boolean") setIsAntiCadenceEnabled(config.isAntiCadenceEnabled);
        if (config.voicePreset) {
          const mappedPreset = config.voicePreset === "subtle" ? "sofi"
            : config.voicePreset === "deep" ? "guardian"
            : config.voicePreset === "high" ? "lark"
            : config.voicePreset === "cyber" ? "cyber"
            : config.voicePreset === "custom" ? "sofi"
            : (config.voicePreset as VoicePreset);
          setPreset(mappedPreset);
        }
        if (typeof config.semitones === "number") setSemitones(config.semitones);
        return;
      } catch (err) {
        console.warn("Failed to load voice configuration from host:", err);
      }
    }

    // Try guest config next
    const guestPreset = sessionStorage.getItem("hips-voice-preset");
    if (guestPreset) {
      const mappedPreset = guestPreset === "subtle" ? "sofi"
        : guestPreset === "deep" ? "guardian"
        : guestPreset === "high" ? "lark"
        : guestPreset === "cyber" ? "cyber"
        : guestPreset === "custom" ? "sofi"
        : (guestPreset as VoicePreset);
      setPreset(mappedPreset);
      const guestSemitones = sessionStorage.getItem("hips-voice-semitones");
      if (guestSemitones) setSemitones(parseInt(guestSemitones, 10));
      const guestAnonymization = sessionStorage.getItem("hips-voice-anonymization");
      if (guestAnonymization) setAnonymizationMode(guestAnonymization as any);
      const guestPersona = sessionStorage.getItem("hips-voice-persona");
      if (guestPersona) setSelectedPersona(guestPersona as any);
      const guestAnticadence = sessionStorage.getItem("hips-voice-anticadence");
      if (guestAnticadence) setIsAntiCadenceEnabled(guestAnticadence === "true");
    }
  }, [setPreset, setSemitones]);

  const localAvatarConfig = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        style: String(avatar.style),
	        palette: avatar.palette,
	        bodyType: String(avatar.bodyType ?? 1),
	        skinTone: normalizeSkinTone(avatar.skinTone),
	        hairStyle: String(avatar.style),
	        hairColor: "#1c1917",
	        eyeColor: "#1c1917",
	        faceShape: "0",
	        noseStyle: "0",
	        eyeStyle: "0",
	        eyebrowStyle: "0",
	        mouthStyle: "0",
	        clothingType: "0",
	        clothingColor: paletteColors[avatar.palette as keyof typeof paletteColors] || "#06b6d4",
	        accessoryType: "0",
	        renderMode: "2d",
          avatar2D: DEFAULT_AVATAR_2D,
	      };
    }

    // Try host configuration first
    const hostConfigStr = localStorage.getItem("hips-host-avatar");
    if (hostConfigStr) {
      try {
        const config = JSON.parse(hostConfigStr);
        return {
          style: String(config.avatarStyle ?? avatar.style),
	          palette: avatar.palette,
	          bodyType: String(config.bodyType ?? 1),
	          skinTone: normalizeSkinTone(config.skinTone),
	          hairStyle: String(config.hairStyle ?? config.avatarStyle ?? 0),
	          hairColor: config.hairColor ?? "#1c1917",
	          eyeColor: config.eyeColor ?? "#1c1917",
	          faceShape: String(config.faceShape ?? 0),
	          noseStyle: String(config.noseStyle ?? 0),
	          eyeStyle: String(config.eyeStyle ?? 0),
	          eyebrowStyle: String(config.eyebrowStyle ?? 0),
	          mouthStyle: String(config.mouthStyle ?? 0),
	          clothingType: String(config.clothingType ?? 0),
	          clothingColor: config.clothingColor ?? config.avatarColor ?? "#06b6d4",
	          accessoryType: String(config.accessoryType ?? 0),
	          renderMode: "2d",
            avatar2D: config.avatar2D ?? DEFAULT_AVATAR_2D,
	        };
      } catch {}
    }

    // Try guest/lobby configuration next
    const guestColor = sessionStorage.getItem("hips-avatar-color");
    if (guestColor) {
      return {
        style: sessionStorage.getItem("hips-avatar-style") || String(avatar.style),
	        palette: avatar.palette,
	        bodyType: sessionStorage.getItem("hips-avatar-body") || "1",
	        skinTone: normalizeSkinTone(sessionStorage.getItem("hips-avatar-skin-tone")),
	        hairStyle: sessionStorage.getItem("hips-avatar-hair") || sessionStorage.getItem("hips-avatar-style") || "0",
	        hairColor: sessionStorage.getItem("hips-avatar-hair-color") || "#1c1917",
	        eyeColor: sessionStorage.getItem("hips-avatar-eye-color") || "#1c1917",
	        faceShape: sessionStorage.getItem("hips-avatar-face-shape") || "0",
	        noseStyle: sessionStorage.getItem("hips-avatar-nose") || "0",
	        eyeStyle: sessionStorage.getItem("hips-avatar-eye") || "0",
	        eyebrowStyle: sessionStorage.getItem("hips-avatar-eyebrow") || "0",
	        mouthStyle: sessionStorage.getItem("hips-avatar-mouth") || "0",
	        clothingType: sessionStorage.getItem("hips-avatar-clothing") || "0",
	        clothingColor: sessionStorage.getItem("hips-avatar-clothing-color") || guestColor,
	        accessoryType: sessionStorage.getItem("hips-avatar-accessory") || "0",
	        renderMode: "2d",
          avatar2D: parseAvatar2DConfig(sessionStorage.getItem("hips-avatar-2d")) ?? DEFAULT_AVATAR_2D,
	      };
    }

    // Default fallback
    return {
      style: String(avatar.style),
	      palette: avatar.palette,
	      bodyType: String(avatar.bodyType ?? 1),
	      skinTone: normalizeSkinTone(avatar.skinTone),
	      hairStyle: String(avatar.style),
	      hairColor: "#1c1917",
	      eyeColor: "#1c1917",
	      faceShape: "0",
	      noseStyle: "0",
	      eyeStyle: "0",
	      eyebrowStyle: "0",
	      mouthStyle: "0",
	      clothingType: "0",
	      clothingColor: paletteColors[avatar.palette as keyof typeof paletteColors] || "#06b6d4",
	      accessoryType: "0",
	      renderMode: "2d",
        avatar2D: DEFAULT_AVATAR_2D,
	    };
  }, [avatar]);

  // Media devices for toolbar
  const {
    audioInputs,
    audioOutputs,
    selectedAudioInput,
    selectedAudioOutput,
    selectAudioInput,
    selectAudioOutput,
  } = useMediaDevices();

  // Task 4.3 — Disconnect on unmount to prevent zombie room connections
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Task 5.13 — Detect WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGLSupported(supported);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Task 5.14 — LiveKit reconnection event handlers
  useEffect(() => {
    const handleReconnecting = () => onReconnecting(true);
    const handleReconnected = async () => {
      onReconnecting(false);
      // Re-apply the voice mask processor once LiveKit has re-established
      // the transport. The localAudioTrack reference may still be valid but
      // the transport needs a fresh processor attachment.
      if (localAudioTrack && micEnabled) {
        try {
          if (anonymizationMode === 'neural') {
            setVoiceMaskWarning(ENHANCED_NEURAL_UNAVAILABLE_MESSAGE);
          } else if (isLiveKitLocalAudioTrack(localAudioTrack)) {
            await localAudioTrack.setProcessor(createLowLatencyVoiceMaskProcessor({ preset: activePreset, semitones, wetDryRatio }));
          }
        } catch (err) {
          console.error('[SessionRoom] Failed to re-apply processor after reconnect:', err);
          setVoiceMaskWarning('Voice mask was lost during reconnection. Try toggling your microphone.');
        }
      }
    };
    const handleDisconnected = () => onReconnecting(false);

    room.on('reconnecting', handleReconnecting);
    room.on('reconnected', handleReconnected);
    room.on('disconnected', handleDisconnected);

    return () => {
      room.off('reconnecting', handleReconnecting);
      room.off('reconnected', handleReconnected);
      room.off('disconnected', handleDisconnected);
    };
  }, [room, onReconnecting, localAudioTrack, micEnabled, activePreset, semitones, wetDryRatio, anonymizationMode, selectedPersona]);

  // Synchronize avatar properties and local emotion to LiveKit participant attributes dynamically
  useEffect(() => {
    if (!localParticipant) return;

    const syncAttributes = async () => {
      try {
        await localParticipant.setAttributes({
          'voice-masking': anonymizationMode === 'neural' ? 'server-worker' : 'local-dsp',
          'voice-preset': activePreset,
          'voice-semitones': String(semitones),
          ...(anonymizationMode === 'neural' ? {
            'voice-persona': selectedPersona,
            'anti-cadence': String(isAntiCadenceEnabled),
          } : {}),
          'avatar-style': localAvatarConfig.style,
          'avatar-palette': localAvatarConfig.palette,
          'avatar-emotion': localEmotion,
	          'avatar-body': localAvatarConfig.bodyType,
	          'avatar-skin-tone': localAvatarConfig.skinTone,
	          'avatar-hair': localAvatarConfig.hairStyle,
	          'avatar-hair-color': localAvatarConfig.hairColor,
	          'avatar-eye-color': localAvatarConfig.eyeColor,
	          'avatar-face-shape': localAvatarConfig.faceShape,
	          'avatar-nose': localAvatarConfig.noseStyle,
	          'avatar-eye': localAvatarConfig.eyeStyle,
	          'avatar-eyebrow': localAvatarConfig.eyebrowStyle,
	          'avatar-mouth': localAvatarConfig.mouthStyle,
	          'avatar-clothing': localAvatarConfig.clothingType,
	          'avatar-clothing-color': localAvatarConfig.clothingColor,
	          'avatar-accessory': localAvatarConfig.accessoryType,
	          'avatar-render-mode': localAvatarConfig.renderMode,
            'avatar-2d': JSON.stringify(localAvatarConfig.avatar2D),
	        });
      } catch (err) {
        console.warn('[SessionRoom] Failed to sync participant attributes:', err);
      }
    };

    void syncAttributes();
  }, [
    localParticipant,
    anonymizationMode,
    activePreset,
    semitones,
    selectedPersona,
    isAntiCadenceEnabled,
    localAvatarConfig,
    localEmotion,
  ]);

  // Task 5.8 — Session timer counting up from first render
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Task 5.8 — Connection quality via hook
  const connectionState = useConnectionState(room);

  const connectionQuality = useMemo((): 'good' | 'fair' | 'poor' => {
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
  }, [connectionState, isReconnecting]);

  const connectionLabel = useMemo(() => {
    switch (connectionQuality) {
      case 'good':
        return 'Connected';
      case 'fair':
        return 'Connecting';
      case 'poor':
        return 'Unstable';
    }
  }, [connectionQuality]);

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
    let track: LocalAudioTrack | null = null;

    try {
      track = await createLocalAudioTrack({
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
        voiceIsolation: true,
      });

      if (anonymizationMode === 'neural' && (!serverMaskingReady || !voiceWorkerUrl)) {
        setVoiceMaskWarning(ENHANCED_NEURAL_UNAVAILABLE_MESSAGE);
        stopLiveKitLocalAudioTrack(track);
        setLocalAudioTrack(null);
        setMicEnabled(false);
        setMicBusy(false);
        return;
      }

      if (anonymizationMode === 'neural') {
        try {
          const sourceSampleRate = track.mediaStreamTrack.getSettings().sampleRate;
          const processedTrack = await startNeuralVoiceMasking({
            workerUrl: voiceWorkerUrl!,
            ...(voiceWorkerToken ? { workerToken: voiceWorkerToken } : {}),
            sessionId: roomName.replace(/^session-/, ''),
            participantIdentity: localParticipant.identity,
            sourceTrack: track.mediaStreamTrack,
            persona: selectedPersona,
            antiCadence: isAntiCadenceEnabled,
            pseudoSpeakerSeed: `${roomName}:${localParticipant.identity}:${selectedPersona}`,
            ...(typeof sourceSampleRate === 'number' ? { sampleRate: sourceSampleRate } : {}),
          });

          await localParticipant.publishTrack(processedTrack, { name: 'voice-masking:server-worker' });
          await localParticipant.setAttributes({
            'voice-masking': 'server-worker',
            'voice-persona': selectedPersona,
            'anti-cadence': String(isAntiCadenceEnabled),
            'avatar-style': localAvatarConfig.style,
            'avatar-palette': localAvatarConfig.palette,
            'avatar-emotion': localEmotion,
	            'avatar-body': localAvatarConfig.bodyType,
	            'avatar-skin-tone': localAvatarConfig.skinTone,
	            'avatar-hair': localAvatarConfig.hairStyle,
	            'avatar-hair-color': localAvatarConfig.hairColor,
	            'avatar-eye-color': localAvatarConfig.eyeColor,
	            'avatar-face-shape': localAvatarConfig.faceShape,
	            'avatar-nose': localAvatarConfig.noseStyle,
	            'avatar-eye': localAvatarConfig.eyeStyle,
	            'avatar-eyebrow': localAvatarConfig.eyebrowStyle,
	            'avatar-mouth': localAvatarConfig.mouthStyle,
	            'avatar-clothing': localAvatarConfig.clothingType,
	            'avatar-clothing-color': localAvatarConfig.clothingColor,
	            'avatar-accessory': localAvatarConfig.accessoryType,
	            'avatar-render-mode': localAvatarConfig.renderMode,
              'avatar-2d': JSON.stringify(localAvatarConfig.avatar2D),
	          });

          neuralSourceTrackRef.current = track;
          setLocalAudioTrack(processedTrack);
          setMicEnabled(true);
          return;
        } catch (neuralError) {
          console.error('[SessionRoom] Enhanced Neural Masking failed:', neuralError);
          setVoiceMaskWarning(
            neuralError instanceof Error
              ? `Enhanced Neural Masking failed: ${neuralError.message}. Use Effects Mode for now.`
              : 'Enhanced Neural Masking failed. Use Effects Mode for now.',
          );
          stopNeuralVoiceMasking();
          stopLiveKitLocalAudioTrack(track);
          setLocalAudioTrack(null);
          setMicEnabled(false);
          setMicBusy(false);
          return;
        }
      }

      // CRITICAL FIX: apply voice mask processor BEFORE publishing.
      // Publishing the raw track first would leak unmasked audio to peers
      // if setProcessor() throws — and there would be no way to unpublish
      // synchronously. The track is only published after processor succeeds.
      try {
        await track.setProcessor(createLowLatencyVoiceMaskProcessor({ preset: activePreset, semitones, wetDryRatio }));
      } catch (processorError) {
        // Processor failed — do NOT publish the raw track.
        // Stop the track and surface an actionable error to the user.
        setVoiceMaskWarning(
          processorError instanceof Error
            ? `Voice mask unavailable: ${processorError.message}. Try Chrome or Edge for full support.`
            : 'Voice mask unavailable in this browser. Try Chrome or Edge for full support.',
        );
        try {
          track.stop();
        } catch (stopErr) {
          console.warn('[SessionRoom] Failed to stop raw track after processor error:', stopErr);
        }
        setLocalAudioTrack(null);
        setMicEnabled(false);
        setMicBusy(false);
        return;
      }

      // Only reach reach here once the processor was successfully applied.
      await localParticipant.publishTrack(track as unknown as MediaStreamTrack);

      try {
        await localParticipant.setAttributes({
          'voice-masking': 'local-dsp',
          'voice-preset': activePreset,
          'voice-semitones': String(semitones),
          'avatar-style': localAvatarConfig.style,
          'avatar-palette': localAvatarConfig.palette,
          'avatar-emotion': localEmotion,
	            'avatar-body': localAvatarConfig.bodyType,
	            'avatar-skin-tone': localAvatarConfig.skinTone,
	            'avatar-hair': localAvatarConfig.hairStyle,
	            'avatar-hair-color': localAvatarConfig.hairColor,
	            'avatar-eye-color': localAvatarConfig.eyeColor,
	            'avatar-face-shape': localAvatarConfig.faceShape,
	            'avatar-nose': localAvatarConfig.noseStyle,
	            'avatar-eye': localAvatarConfig.eyeStyle,
	            'avatar-eyebrow': localAvatarConfig.eyebrowStyle,
	            'avatar-mouth': localAvatarConfig.mouthStyle,
	            'avatar-clothing': localAvatarConfig.clothingType,
	            'avatar-clothing-color': localAvatarConfig.clothingColor,
	            'avatar-accessory': localAvatarConfig.accessoryType,
	            'avatar-render-mode': localAvatarConfig.renderMode,
              'avatar-2d': JSON.stringify(localAvatarConfig.avatar2D),
	        });
      } catch (attrErr) {
        console.warn('[SessionRoom] Failed to set participant attributes:', attrErr);
      }

      setLocalAudioTrack(track);
      setMicEnabled(true);
    } catch (err) {
      console.error('[SessionRoom] Microphone publication failed:', err);
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
      void reportSessionError(`Microphone publication failed: ${errMsg}`, 'HIGH', roomName);
    } finally {
      setMicBusy(false);
    }
  }, [
    localParticipant,
    activePreset,
    semitones,
    wetDryRatio,
    anonymizationMode,
    serverMaskingReady,
    voiceWorkerUrl,
    voiceWorkerToken,
    startNeuralVoiceMasking,
    stopNeuralVoiceMasking,
    roomName,
    selectedPersona,
    isAntiCadenceEnabled,
  ]);

  const toggleMicrophone = useCallback(async () => {
    if (micBusy) return;

    if (!localAudioTrack) {
      await startMicrophone();
      return;
    }

    setMicBusy(true);

    try {
      if (micEnabled) {
        if (isLiveKitLocalAudioTrack(localAudioTrack)) {
          await localAudioTrack.mute();
        } else {
          localAudioTrack.enabled = false;
          if (neuralSourceTrackRef.current) {
            neuralSourceTrackRef.current.mediaStreamTrack.enabled = false;
          }
        }
        setMicEnabled(false);
      } else {
        if (isLiveKitLocalAudioTrack(localAudioTrack)) {
          await localAudioTrack.unmute();
        } else {
          localAudioTrack.enabled = true;
          if (neuralSourceTrackRef.current) {
            neuralSourceTrackRef.current.mediaStreamTrack.enabled = true;
          }
        }
        setMicEnabled(true);
      }
    } finally {
      setMicBusy(false);
    }
  }, [localAudioTrack, micBusy, micEnabled, startMicrophone]);

  const stopLocalAudio = useCallback(async () => {
    if (!localAudioTrack) return;

    try {
      if (isLiveKitLocalAudioTrack(localAudioTrack)) {
        await localAudioTrack.stopProcessor(false);
        localParticipant.unpublishTrack(localAudioTrack as unknown as MediaStreamTrack);
        localAudioTrack.stop();
      } else {
        localParticipant.unpublishTrack(localAudioTrack);
        localAudioTrack.stop();
      }
      stopNeuralVoiceMasking();
      if (neuralSourceTrackRef.current) {
        stopLiveKitLocalAudioTrack(neuralSourceTrackRef.current);
        neuralSourceTrackRef.current = null;
      }
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
        if (isLiveKitLocalAudioTrack(localAudioTrack)) {
          localAudioTrack.stop();
        } else {
          localAudioTrack.stop();
        }
      }
      stopNeuralVoiceMasking();
      if (neuralSourceTrackRef.current) {
        stopLiveKitLocalAudioTrack(neuralSourceTrackRef.current);
        neuralSourceTrackRef.current = null;
      }
    };
  }, [localAudioTrack, stopNeuralVoiceMasking]);

  // Real-time synchronization of voice mask processor settings when preset or semitones change
  useEffect(() => {
    if (localAudioTrack && micEnabled) {
      if (anonymizationMode === 'neural') {
        return;
      } else if (isLiveKitLocalAudioTrack(localAudioTrack)) {
        localAudioTrack.setProcessor(createLowLatencyVoiceMaskProcessor({ preset: activePreset, semitones, wetDryRatio }))
          .catch((err) => console.error('[VoiceEffects] Failed to update processor:', err));
      }
    }
  }, [activePreset, semitones, wetDryRatio, localAudioTrack, micEnabled, anonymizationMode]);

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

  // Re-create the LocalAudioTrack when the user selects a different input device.
  // Simply updating the selected device ID is not enough — LiveKit must re-capture
  // from the new hardware. This mirrors the startMicrophone pattern.
  const handleSelectAudioInput = useCallback(
    async (deviceId: string) => {
      selectAudioInput(deviceId);
      if (!localAudioTrack || !micEnabled) return;

      setMicBusy(true);
      let newTrack: LocalAudioTrack | null = null;
      try {
        if (anonymizationMode === 'neural') {
          await stopLocalAudio();
          await startMicrophone();
          return;
        }

        // Tear down the old track cleanly before creating the replacement.
        await stopLocalAudio();

        newTrack = await createLocalAudioTrack({
          deviceId,
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
          voiceIsolation: true,
        });

        try {
          await newTrack.setProcessor(createLowLatencyVoiceMaskProcessor({ preset: activePreset, semitones, wetDryRatio }));
        } catch (processorError) {
          setVoiceMaskWarning(
            processorError instanceof Error
              ? `Voice mask unavailable: ${processorError.message}. Try Chrome or Edge for full support.`
              : 'Voice mask unavailable in this browser. Try Chrome or Edge for full support.',
          );
          try {
            newTrack.stop();
          } catch {
            // ignore
          }
          setMicBusy(false);
          return;
        }

        await localParticipant.publishTrack(newTrack as unknown as MediaStreamTrack);

        try {
          await localParticipant.setAttributes({
            'voice-masking': 'local-dsp',
            'voice-preset': activePreset,
            'voice-semitones': String(semitones),
            'avatar-style': localAvatarConfig.style,
            'avatar-palette': localAvatarConfig.palette,
	            'avatar-emotion': localEmotion,
	            'avatar-body': localAvatarConfig.bodyType,
	            'avatar-skin-tone': localAvatarConfig.skinTone,
	            'avatar-hair': localAvatarConfig.hairStyle,
	            'avatar-hair-color': localAvatarConfig.hairColor,
	            'avatar-eye-color': localAvatarConfig.eyeColor,
	            'avatar-face-shape': localAvatarConfig.faceShape,
	            'avatar-nose': localAvatarConfig.noseStyle,
	            'avatar-eye': localAvatarConfig.eyeStyle,
	            'avatar-eyebrow': localAvatarConfig.eyebrowStyle,
	            'avatar-mouth': localAvatarConfig.mouthStyle,
	            'avatar-clothing': localAvatarConfig.clothingType,
	            'avatar-clothing-color': localAvatarConfig.clothingColor,
	            'avatar-accessory': localAvatarConfig.accessoryType,
	            'avatar-render-mode': localAvatarConfig.renderMode,
              'avatar-2d': JSON.stringify(localAvatarConfig.avatar2D),
	          });
        } catch (attrErr) {
          console.warn('[SessionRoom] Failed to set participant attributes:', attrErr);
        }

        setLocalAudioTrack(newTrack);
      } catch (err) {
        console.error('[SessionRoom] Device switch failed:', err);
        if (newTrack) {
          try {
            newTrack.stop();
          } catch {
            // ignore
          }
        }
        toast.error('Failed to switch microphone device. Please try again.');
      } finally {
        setMicBusy(false);
      }
    },
    [localAudioTrack, micEnabled, localParticipant, activePreset, semitones, wetDryRatio, selectAudioInput, anonymizationMode, stopLocalAudio, startMicrophone],
  );

  const handleVoicePresetChange = useCallback((preset: VoicePreset) => {
    setPreset(preset);
  }, [setPreset]);

  const handleVoiceSemitoneChange = useCallback((st: number) => {
    setSemitones(st);
  }, [setSemitones]);

  const handleVoiceWetDryChange = useCallback((ratio: number) => {
    setWetDryRatio(ratio);
  }, [setWetDryRatio]);

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
      <SessionHeader
        anonymousHandle={anonymousIdentity}
        sessionSeconds={sessionSeconds}
        connectionQuality={connectionQuality}
        connectionLabel={connectionLabel}
        roomName={roomName}
      />

      <section className="grid min-h-0 grid-cols-[1fr_360px]">
        <div className="relative min-w-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black]">
              <AvatarCanvas
                avatar={avatar}
                localIdentity={localParticipant.identity}
                raisedHands={raisedHands}
                localEmotion={localEmotion}
              />
          {voiceMaskWarning ? (
            <div
              role="alert"
              aria-live="assertive"
              className="absolute left-6 top-6 max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 backdrop-blur-xl"
            >
              {voiceMaskWarning}
            </div>
          ) : null}
        </div>

        <aside className="flex min-h-0 flex-col border-l border-white/10 bg-zinc-950">
          {canFacilitate ? (
            <RaisedHandQueue raisedHands={raisedHandList} onLowerHand={lowerHand} />
          ) : (
            <div className="border-b border-white/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hand Queue</p>
              <p className="mt-1 text-sm text-text">
                Raise your hand when you would like facilitator attention.
              </p>
            </div>
          )}
          <VoiceMaskingDebugPanel
            anonymizationMode={anonymizationMode}
            selectedPersona={selectedPersona}
            antiCadenceEnabled={isAntiCadenceEnabled}
            micEnabled={micEnabled}
            warning={voiceMaskWarning}
            status={voiceMaskingStatus}
            neuralState={neuralVoiceState}
            neuralError={neuralVoiceError}
            lastControlMessage={neuralVoiceControlMessage}
          />
          <SafetyMonitor sessionId={roomName} onCrisis={onCrisis} onKick={onKick} />
          {canFacilitate ? (
            <div className="border-t border-white/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Facilitator Notes</p>
              <textarea
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-surface/5 p-3 text-sm text-text-muted placeholder-zinc-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Session notes (not persisted)..."
                rows={3}
                value={facilitatorNotes}
                onChange={(e) => setFacilitatorNotes(e.target.value)}
              />
            </div>
          ) : null}
        </aside>
      </section>

      {/* Task 5.14 — Reconnecting overlay (non-blocking) */}
      {isReconnecting ? (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-black/80 px-8 py-5 shadow-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-text" />
            <div>
              <p className="font-bold text-white">Reconnecting to session...</p>
              <p className="mt-0.5 text-sm text-text">Please wait, your connection will restore shortly.</p>
            </div>
          </div>
        </div>
      ) : null}

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
        onSelectAudioInput={handleSelectAudioInput}
        onSelectAudioOutput={selectAudioOutput}
      />

      <VoiceControlsBar
        micEnabled={micEnabled}
        micBusy={micBusy}
        raisedHand={raisedHands.has(localParticipant.identity)}
        onToggleMute={toggleMicrophone}
        onToggleHand={toggleHand}
        onFlag={handleFlag}
        onLeave={leaveSession}
        voicePreset={activePreset}
        voiceSemitones={semitones}
        voiceWetDryRatio={wetDryRatio}
        onVoicePresetChange={handleVoicePresetChange}
        onVoiceSemitoneChange={handleVoiceSemitoneChange}
        onVoiceWetDryChange={handleVoiceWetDryChange}
        voiceMaskActive={micEnabled && !voiceMaskWarning}
        activeEmotion={localEmotion}
        onEmotionChange={handleEmotionChange}
      />
    </main>
  );
}

function VoiceMaskingDebugPanel({
  anonymizationMode,
  selectedPersona,
  antiCadenceEnabled,
  micEnabled,
  warning,
  status,
  neuralState,
  neuralError,
  lastControlMessage,
}: {
  anonymizationMode: 'dsp' | 'neural';
  selectedPersona: 'clara' | 'arthur';
  antiCadenceEnabled: boolean;
  micEnabled: boolean;
  warning: string | null;
  status: VoiceMaskingStatus;
  neuralState: string;
  neuralError: string | null;
  lastControlMessage: VoiceWorkerControlMessage | null;
}) {
  const metrics = lastControlMessage?.type === 'metrics' ? lastControlMessage : null;
  const ready = status.ready;
  const activeServerWorker = micEnabled && anonymizationMode === 'neural' && neuralState === 'ready' && !warning;

  return (
    <div className="border-b border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Voice Worker</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {anonymizationMode === 'neural' ? 'Enhanced Neural' : 'Effects Mode'}
          </p>
        </div>
        <span
          className={[
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
            activeServerWorker
              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
              : ready
                ? 'border-sky-500/25 bg-sky-500/10 text-sky-300'
                : 'border-amber-500/25 bg-amber-500/10 text-amber-300',
          ].join(' ')}
        >
          {activeServerWorker ? <ShieldCheck className="h-3 w-3" /> : ready ? <Server className="h-3 w-3" /> : <TriangleAlert className="h-3 w-3" />}
          {activeServerWorker ? 'Publishing' : ready ? 'Ready' : 'Fallback'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <DebugMetric label="Runtime" value={lastControlMessage?.type === 'ready' ? lastControlMessage.runtime : status.runtime} />
        <DebugMetric label="Hook" value={neuralState} />
        <DebugMetric label="Persona" value={anonymizationMode === 'neural' ? selectedPersona : 'local-dsp'} />
        <DebugMetric label="Cadence" value={antiCadenceEnabled ? 'on' : 'off'} />
        <DebugMetric label="Health" value={status.healthReachable ? `ok${status.healthLatencyMs ? ` ${status.healthLatencyMs}ms` : ''}` : 'offline'} />
        <DebugMetric label="Live" value={status.liveReady ? 'true' : 'false'} />
      </div>

      {metrics ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            <Activity className="h-3.5 w-3.5" />
            Worker Metrics
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <DebugMetric label="RTF" value={formatMetric(metrics.rtfEstimate, 3)} />
            <DebugMetric label="Delta" value={formatMetric(metrics.transformDeltaAvg, 3)} />
            <DebugMetric label="Frames" value={`${metrics.framesReturned}/${metrics.framesReceived}`} />
            <DebugMetric label="Input" value={formatMetric(metrics.inputRmsAvg, 3)} />
            <DebugMetric label="Output" value={formatMetric(metrics.outputRmsAvg, 3)} />
            <DebugMetric label="Speech" value={`${metrics.speechFrames}`} />
          </div>
        </div>
      ) : null}

      {!ready || warning || neuralError ? (
        <p className="mt-3 rounded-xl border border-amber-500/15 bg-amber-500/8 px-3 py-2 text-[11px] leading-relaxed text-amber-100/80">
          {warning || neuralError || status.fallbackReason || 'Enhanced worker metrics appear after microphone start.'}
        </p>
      ) : null}
    </div>
  );
}

function DebugMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-white/[0.03] px-2 py-1.5">
      <p className="truncate text-[9px] font-bold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-0.5 truncate font-mono text-[11px] font-semibold text-white/75">{value}</p>
    </div>
  );
}

function formatMetric(value: number, digits: number): string {
  return Number.isFinite(value) ? value.toFixed(digits) : 'n/a';
}
