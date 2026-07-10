'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useAuth } from '@/components/auth/AuthProvider';
import { DevicePreview } from '@/components/session-ui/DevicePreview';
import { DirectJoinLobby } from '@/components/session-ui/DirectJoinLobby';

interface DirectJoinClientProps {
  sessionId: string;
}

interface LiveKitTokenResponse {
  token: string;
  roomName: string;
  anonymousIdentity: string;
  avatar: { style: number; palette: string; gesture: string };
  expiresAt: string;
  sessionStatus: string;
}

interface ChecklistState {
  anonymous: boolean;
  headphones: boolean;
  safeSpace: boolean;
}

const TOKEN_STORAGE_PREFIX = 'hips:join:token:';

function getSessionAvatarInitials(sessionId: string): string {
  if (typeof window === 'undefined') return '??';
  const key = `hips:session-avatar-initials:${sessionId}`;
  let initials = sessionStorage.getItem(key);
  if (!initials) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = chars[Math.floor(Math.random() * chars.length)];
    const second = chars[Math.floor(Math.random() * chars.length)];
    initials = `${first}${second}`;
    sessionStorage.setItem(key, initials);
  }
  return initials;
}

export function DirectJoinClient({ sessionId }: DirectJoinClientProps) {
  const router = useRouter();
  const { getToken, user } = useAuth();
  const [tokenCache, setTokenCache] = useState<string | null>(null);
  const [avatarInitials, setAvatarInitials] = useState<string>(() => getSessionAvatarInitials(sessionId));
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistState>({
    anonymous: false,
    headphones: false,
    safeSpace: false,
  });

  const {
    audioInputs,
    videoInputs,
    selectedAudioInput,
    selectedVideoInput,
    selectAudioInput,
    selectVideoInput,
    micPermissionGranted,
    cameraPermissionGranted,
    micStream,
    cameraStream,
    audioLevel,
    refreshDevices,
  } = useMediaDevices();

  useEffect(() => {
    let cancelled = false;

    const fetchToken = async () => {
      try {
        const idToken = await getToken();
        if (!idToken) {
          if (!cancelled) {
            setTokenError('Please sign in to join a session.');
          }
          return;
        }

        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) {
          if (res.status === 429) {
            if (!cancelled) {
              setTokenError("You've joined several sessions recently — please wait 30 seconds and try again.");
            }
            return;
          }
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            setTokenError(
              typeof data?.error === 'string' ? data.error : 'Could not prepare the session.',
            );
          }
          return;
        }
        const data: LiveKitTokenResponse = await res.json();
        if (!cancelled) {
          setTokenCache(data.token);
        }
      } catch {
        if (!cancelled) {
          setTokenError('Network error preparing the session.');
        }
      }
    };
    void fetchToken();
    return () => {
      cancelled = true;
    };
  }, [sessionId, getToken]);

  const allChecked = Object.values(checklist).every(Boolean);

  const handleJoin = useCallback(
    async (displayName: string) => {
      setIsJoining(true);
      setTokenError(null);

      try {
        let token = tokenCache;
        if (!token) {
          const idToken = await getToken();
          if (!idToken) {
            setTokenError('Please sign in to join a session.');
            setIsJoining(false);
            return;
          }
          const res = await fetch('/api/livekit/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ sessionId }),
          });
          if (!res.ok) {
            if (res.status === 429) {
              setTokenError("You've joined several sessions recently — please wait 30 seconds and try again.");
              setIsJoining(false);
              return;
            }
            const data = await res.json().catch(() => ({}));
            setTokenError(
              typeof data?.error === 'string' ? data.error : 'Could not prepare the session.',
            );
            setIsJoining(false);
            return;
          }
          const data: LiveKitTokenResponse = await res.json();
          token = data.token;
          setTokenCache(token);
        }

        try {
          window.sessionStorage.setItem(
            `${TOKEN_STORAGE_PREFIX}${sessionId}`,
            token,
          );
        } catch {
          setTokenError(
            'Your browser blocked the session handoff. Please disable private mode and try again.',
          );
          setIsJoining(false);
          return;
        }

        const safeName = encodeURIComponent(displayName);
        router.push(`/session/${encodeURIComponent(sessionId)}?name=${safeName}`);
      } catch {
        setTokenError('Unexpected error joining the session.');
        setIsJoining(false);
      }
    },
    [getToken, router, sessionId, tokenCache],
  );

  const handleAvatarRefresh = useCallback(() => {
    if (typeof window === 'undefined') return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = chars[Math.floor(Math.random() * chars.length)];
    const second = chars[Math.floor(Math.random() * chars.length)];
    const initials = `${first}${second}`;
    sessionStorage.setItem(`hips:session-avatar-initials:${sessionId}`, initials);
    setAvatarInitials(initials);
  }, [sessionId]);

  const audioInputLabel =
    audioInputs.find((d) => d.deviceId === selectedAudioInput)?.label || 'Microphone';
  const videoInputLabel =
    videoInputs.find((d) => d.deviceId === selectedVideoInput)?.label || 'Camera';

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-4">
        <DevicePreview
          micStream={micStream}
          cameraStream={cameraStream}
          micPermissionGranted={micPermissionGranted}
          cameraPermissionGranted={cameraPermissionGranted}
          audioLevel={audioLevel}
          videoInputLabel={videoInputLabel}
          audioInputLabel={audioInputLabel}
        />

        <div className="space-y-3">
          {audioInputs.length > 0 && (
            <div className="space-y-1.5">
              <label
                htmlFor="mic-select"
                className="text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Microphone
              </label>
              <select
                id="mic-select"
                value={selectedAudioInput ?? ''}
                onChange={(e) => {
                  selectAudioInput(e.target.value);
                  void refreshDevices();
                }}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {audioInputs.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {videoInputs.length > 0 && (
            <div className="space-y-1.5">
              <label
                htmlFor="cam-select"
                className="text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Camera
              </label>
              <select
                id="cam-select"
                value={selectedVideoInput ?? ''}
                onChange={(e) => {
                  selectVideoInput(e.target.value);
                  void refreshDevices();
                }}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {videoInputs.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${d.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {tokenError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-primary">Could not prepare the session</p>
              <p className="mt-0.5 text-xs text-text-secondary">{tokenError}</p>
            </div>
          </div>
        ) : null}

        {!user && !tokenError ? (
          <p className="text-xs text-text-muted">
            You need to be signed in to join.{' '}
            <a href="/login" className="underline underline-offset-2 text-accent font-semibold">
              Sign in
            </a>{' '}
            or return to the{' '}
            <a href="/join" className="underline underline-offset-2 text-accent font-semibold">
              session entry
            </a>
            .
          </p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm shadow-primary/5 sm:p-8">
        <DirectJoinLobby
          sessionId={sessionId}
          onJoin={handleJoin}
          allChecked={allChecked}
          checklist={checklist}
          onChecklistChange={setChecklist}
          avatarInitials={avatarInitials}
          onAvatarRefresh={handleAvatarRefresh}
          isJoining={isJoining}
          isPreparing={!tokenCache && !tokenError}
        />
      </div>
    </div>
  );
}

export function readJoinToken(sessionId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(`${TOKEN_STORAGE_PREFIX}${sessionId}`);
  } catch {
    return null;
  }
}

export function clearJoinToken(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(`${TOKEN_STORAGE_PREFIX}${sessionId}`);
  } catch {
    // Ignore — best-effort cleanup.
  }
}
