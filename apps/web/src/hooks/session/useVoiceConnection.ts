"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createLocalAudioTrack,
  LocalAudioTrack,
  RoomEvent,
  ConnectionState,
} from "livekit-client";
import { useRoomContext, useDataChannel, useParticipants } from "@livekit/components-react";
import { toast } from "sonner";
import { createLowLatencyVoiceMaskProcessor } from "@/lib/voice-mask-processor";
import type { VoicePreset } from "@/lib/voice-mask-presets";

export type ConnectionQuality = "good" | "fair" | "poor";

export type ControlMessage = {
  type: "HAND_RAISED" | "HAND_LOWERED" | "GESTURE";
  participantIdentity: string;
  gesture?: "nodding" | "raised-hand" | "thinking" | "applause" | "idle";
  at: string;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const ENHANCED_NEURAL_UNAVAILABLE_MESSAGE =
  "Enhanced Neural Masking is not live yet. Use Effects Mode for microphone audio while the returned-audio backend is being connected.";

function decodeControlMessage(payload: Uint8Array): ControlMessage | null {
  try {
    const parsed = JSON.parse(textDecoder.decode(payload)) as Partial<ControlMessage>;
    if (
      parsed.type &&
      typeof parsed.participantIdentity === "string" &&
      typeof parsed.at === "string"
    ) {
      return parsed as ControlMessage;
    }
  } catch {
    return null;
  }
  return null;
}

function buildControlMessage(
  msg: Omit<ControlMessage, "at">,
): ControlMessage {
  return { ...msg, at: new Date().toISOString() };
}

export function useVoiceConnection() {
  const room = useRoomContext();
  const participants = useParticipants();

  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>("poor");
  const [micEnabled, setMicEnabled] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);
  const [activeSpeakerIdentity, setActiveSpeakerIdentity] = useState<string | null>(null);

  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  // Track AudioContext to avoid leaking instances
  const audioContextRef = useRef<AudioContext | null>(null);

  // Task 5.4 — Connection quality tracking
  useEffect(() => {
    const handleConnectionStateChange = (state: ConnectionState) => {
      switch (state) {
        case ConnectionState.Connected:
          setConnectionQuality("good");
          break;
        case ConnectionState.Reconnecting:
          setConnectionQuality("fair");
          break;
        default:
          setConnectionQuality("poor");
      }
    };

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChange);

    const handleActiveSpeakersChanged = (speakers: Array<{ identity: string }>) => {
      if (speakers.length > 0) {
        const loudest = speakers[0];
        setActiveSpeakerIdentity(loudest?.identity ?? null);
      } else {
        setActiveSpeakerIdentity(null);
      }
    };

    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);

    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChange);
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
    };
  }, [room]);

  // Task 5.4 — Enable microphone with voice mask processor
  const startMicrophone = useCallback(
    async (
      voicePreset: VoicePreset = 'sofi',
      semitones?: number,
      anonymizationMode: 'dsp' | 'neural' = 'dsp',
      _selectedPersona: 'clara' | 'arthur' = 'clara',
      _isAntiCadenceEnabled: boolean = false,
      wetDryRatio: number = 0.22,
    ) => {
      setMicBusy(true);
      let trackObj: LocalAudioTrack | null = null;
      try {
        // Close any existing AudioContext before creating a new one
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        trackObj = await createLocalAudioTrack({
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
          voiceIsolation: true,
        });

        if (anonymizationMode === 'neural') {
          try {
            trackObj.stop();
          } catch {
            // ignore
          }
          toast.error(ENHANCED_NEURAL_UNAVAILABLE_MESSAGE);
          setMicBusy(false);
          return;
        }

        // Apply the voice mask processor before publishing.
        // CRITICAL: the raw track must never be published if the processor fails —
        // unpublishing synchronously is not possible in WebRTC.
        try {
          await trackObj.setProcessor(createLowLatencyVoiceMaskProcessor({
            preset: voicePreset,
            ...(semitones !== undefined ? { semitones } : {}),
            wetDryRatio,
          }));
        } catch {
          // Processor unavailable — do NOT publish raw audio.
          try {
            trackObj.stop();
          } catch {
            // ignore
          }
          setMicBusy(false);
          return;
        }

        await room.localParticipant.publishTrack(trackObj as unknown as MediaStreamTrack);
        
        try {
          await room.localParticipant.setAttributes({
            'voice-masking': 'local-dsp',
            'voice-preset': voicePreset,
            'voice-semitones': String(semitones ?? 0),
            'voice-wet-dry-ratio': String(wetDryRatio),
          });
        } catch (attrErr) {
          console.warn('[useVoiceConnection] Failed to set participant attributes:', attrErr);
        }

        localAudioTrackRef.current = trackObj;
        setLocalAudioTrack(trackObj);
        setMicEnabled(true);
      } catch (err) {
        console.error('[useVoiceConnection] Microphone publication failed:', err);
        if (trackObj) {
          try {
            trackObj.stop();
          } catch (stopErr) {
            console.warn('Failed to stop track on error:', stopErr);
          }
        }
        localAudioTrackRef.current = null;
        setLocalAudioTrack(null);
        setMicEnabled(false);
        const errMsg = err instanceof Error ? err.message : String(err);
        toast.error(`Microphone failed to start: ${errMsg}`);
      } finally {
        setMicBusy(false);
      }
    },
    [room],
  );

  // Task 5.4 — Toggle mute/unmute
  const toggleMicrophone = useCallback(async () => {
    if (micBusy) return;

    if (!localAudioTrackRef.current) {
      await startMicrophone();
      return;
    }

    setMicBusy(true);
    try {
      if (micEnabled) {
        await localAudioTrackRef.current.mute();
        setMicEnabled(false);
      } else {
        await localAudioTrackRef.current.unmute();
        setMicEnabled(true);
      }
    } finally {
      setMicBusy(false);
    }
  }, [micBusy, micEnabled, startMicrophone]);

  // Task 5.4 — Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Task 5.4 — Publish control message (hand raise/lower, gesture)
  const { send } = useDataChannel("session-control", (message) => {
    const controlMessage = decodeControlMessage(message.payload);
    if (controlMessage) {
      // Handled by parent component via raisedHands state
    }
  });

  const publishControlMessage = useCallback(
    async (message: Omit<ControlMessage, "at">) => {
      const msg = buildControlMessage(message);
      if (send) {
        await send(textEncoder.encode(JSON.stringify(msg)), {
          reliable: true,
          topic: "session-control",
        });
      }
    },
    [send],
  );

  return {
    connectionQuality,
    micEnabled,
    micBusy,
    localAudioTrack,
    activeSpeakerIdentity,
    toggleMicrophone,
    startMicrophone,
    publishControlMessage,
    participants,
  };
}
