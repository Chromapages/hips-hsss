'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { DevicePreview } from '@/components/session-ui/DevicePreview';
import { DirectJoinLobby } from '@/components/session-ui/DirectJoinLobby';

interface DirectJoinClientProps {
  sessionId: string;
}

interface LiveKitTokenResponse {
  token: string;
  roomName: string;
  anonymousIdentity: string;
  avatar: { style: number; palette: string; gesture: string; locked: boolean };
  expiresAt: string;
  sessionStatus: string;
}

interface ChecklistState {
  anonymous: boolean;
  headphones: boolean;
  safeSpace: boolean;
}

export function DirectJoinClient({ sessionId }: DirectJoinClientProps) {
  const router = useRouter();
  const [tokenCache, setTokenCache] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [checklist, setChecklist] = useState<ChecklistState>({
    anonymous: false,
    headphones: false,
    safeSpace: false,
  });

  const {
    audioInputs,
    videoInputs,
    selectedAudioInput,
    micPermissionGranted,
    cameraPermissionGranted,
    micStream,
    cameraStream,
    audioLevel,
    refreshDevices,
  } = useMediaDevices();

  // Pre-fetch LiveKit token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const data: LiveKitTokenResponse = await res.json();
          setTokenCache(data.token);
          setAvatarSeed(data.anonymousIdentity);
        }
      } catch {
        // Non-fatal — token fetch will retry on join
      }
    };
    fetchToken();
  }, [sessionId]);

  const allChecked = Object.values(checklist).every(Boolean);

  const handleJoin = useCallback(
    (displayName: string) => {
      if (!tokenCache) {
        // If token not pre-fetched, fetch now and navigate
        fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
          .then((r) => r.json())
          .then((data: LiveKitTokenResponse) => {
            router.push(`/session/${sessionId}?token=${encodeURIComponent(data.token)}&name=${encodeURIComponent(displayName)}`);
          });
        return;
      }
      router.push(
        `/session/${sessionId}?token=${encodeURIComponent(tokenCache)}&name=${encodeURIComponent(displayName)}`,
      );
    },
    [router, sessionId, tokenCache],
  );

  const handleAvatarRefresh = useCallback(() => {
    setAvatarSeed(crypto.randomUUID());
  }, []);

  const audioInputLabel = audioInputs.find((d) => d.deviceId === selectedAudioInput)?.label || 'Microphone';
  const videoInputLabel = videoInputs[0]?.label || 'Camera';

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Device preview column */}
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

        {/* Device selectors */}
        <div className="space-y-3">
          {audioInputs.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Microphone
              </label>
              <select
                onChange={(e) => refreshDevices()}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
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
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Camera
              </label>
              <select
                onChange={() => refreshDevices()}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
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
      </div>

      {/* Lobby column */}
      <DirectJoinLobby
        sessionId={sessionId}
        onJoin={handleJoin}
        allChecked={allChecked}
        checklist={checklist}
        onChecklistChange={setChecklist}
        avatarSeed={avatarSeed}
        onAvatarRefresh={handleAvatarRefresh}
      />
    </div>
  );
}