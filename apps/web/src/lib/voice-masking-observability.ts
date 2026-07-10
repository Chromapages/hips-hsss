export type VoiceMaskingEventName =
  | "voice_masking.raw_publish_blocked"
  | "voice_masking.fallback_triggered";

export type VoiceMaskingMode = "dsp" | "neural";

export type VoiceMaskingEvent = {
  name: VoiceMaskingEventName;
  mode: VoiceMaskingMode;
  reason: string;
  sessionId?: string;
  participantIdentity?: string;
};

export function reportVoiceMaskingEvent(event: VoiceMaskingEvent): void {
  const payload = sanitizeVoiceMaskingEvent(event);

  if (typeof window === "undefined") {
    return;
  }

  window.fetch("/api/voice-masking/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Observability must never interfere with microphone safety behavior.
  });
}

export function sanitizeVoiceMaskingEvent(event: VoiceMaskingEvent): VoiceMaskingEvent {
  return {
    name: event.name,
    mode: event.mode,
    reason: truncate(event.reason, 240),
    ...(event.sessionId ? { sessionId: truncate(event.sessionId, 160) } : {}),
    ...(event.participantIdentity ? { participantIdentity: truncate(event.participantIdentity, 160) } : {}),
  };
}

function truncate(value: string, maxLength: number): string {
  const trimmed = value.trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}
