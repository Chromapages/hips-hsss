/**
 * Protected personas intentionally live only for the current browser tab.
 *
 * Durable persistence is deferred until H.I.P.S. has an audited encryption
 * and key-recovery design, an anonymized server-side data model, and a
 * verifiable deletion contract. Browser localStorage is not encrypted at rest
 * and therefore must not be used for persona data.
 */
export const HOST_PERSONA_SESSION_KEY = "hips-host-avatar";

const PERSONA_SESSION_KEYS = [
  HOST_PERSONA_SESSION_KEY,
  "hips-avatar-color",
  "hips-avatar-2d",
  "hips-avatar-render-mode",
  "hips-avatar-style",
  "hips-avatar-body",
  "hips-avatar-skin-tone",
  "hips-avatar-hair",
  "hips-avatar-hair-color",
  "hips-avatar-background",
  "hips-avatar-eye-color",
  "hips-avatar-face-shape",
  "hips-avatar-nose",
  "hips-avatar-eye",
  "hips-avatar-eyebrow",
  "hips-avatar-mouth",
  "hips-avatar-clothing",
  "hips-avatar-clothing-color",
  "hips-avatar-accessory",
  "hips-avatar-emotion",
  "hips-voice-preset",
  "hips-voice-semitones",
  "hips-voice-reverb",
  "hips-voice-anonymization",
  "hips-voice-persona",
  "hips-voice-anticadence",
  "hips-voice-enhanced-neural-consent",
] as const;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readSessionPersona(
  sessionStore: StorageLike = window.sessionStorage,
  legacyStore: StorageLike = window.localStorage,
): string | null {
  const current = sessionStore.getItem(HOST_PERSONA_SESSION_KEY);
  const legacy = legacyStore.getItem(HOST_PERSONA_SESSION_KEY);
  // Always remove an unencrypted durable copy, even if this tab already has a
  // newer persona. This makes the privacy migration idempotent.
  if (legacy) legacyStore.removeItem(HOST_PERSONA_SESSION_KEY);

  if (current) return current;
  if (!legacy) return null;

  // One-time privacy migration: keep an existing choice available in this tab.
  sessionStore.setItem(HOST_PERSONA_SESSION_KEY, legacy);
  return legacy;
}

export function saveSessionPersona(
  persona: unknown,
  sessionStore: StorageLike = window.sessionStorage,
): void {
  sessionStore.setItem(HOST_PERSONA_SESSION_KEY, JSON.stringify(persona));
}

export function deleteSessionPersona(
  sessionStore: StorageLike = window.sessionStorage,
  legacyStore: StorageLike = window.localStorage,
): void {
  for (const key of PERSONA_SESSION_KEYS) sessionStore.removeItem(key);
  legacyStore.removeItem(HOST_PERSONA_SESSION_KEY);
}
