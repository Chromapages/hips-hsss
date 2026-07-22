import { describe, expect, it } from "vitest";
import {
  deleteSessionPersona,
  HOST_PERSONA_SESSION_KEY,
  readSessionPersona,
  saveSessionPersona,
} from "./protected-persona-storage";

function memoryStorage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("protected persona session storage", () => {
  it("saves persona choices only in the supplied session store", () => {
    const session = memoryStorage();
    saveSessionPersona({ base: "signal" }, session);
    expect(session.getItem(HOST_PERSONA_SESSION_KEY)).toBe('{"base":"signal"}');
  });

  it("moves a legacy localStorage persona into the current session and removes the durable copy", () => {
    const session = memoryStorage();
    const legacy = memoryStorage({ [HOST_PERSONA_SESSION_KEY]: '{"base":"legacy"}' });

    expect(readSessionPersona(session, legacy)).toBe('{"base":"legacy"}');
    expect(session.getItem(HOST_PERSONA_SESSION_KEY)).toBe('{"base":"legacy"}');
    expect(legacy.getItem(HOST_PERSONA_SESSION_KEY)).toBeNull();
  });

  it("removes a stale durable copy when the tab already has a persona", () => {
    const session = memoryStorage({ [HOST_PERSONA_SESSION_KEY]: '{"base":"current"}' });
    const legacy = memoryStorage({ [HOST_PERSONA_SESSION_KEY]: '{"base":"stale"}' });

    expect(readSessionPersona(session, legacy)).toBe('{"base":"current"}');
    expect(legacy.getItem(HOST_PERSONA_SESSION_KEY)).toBeNull();
  });

  it("deletes persona configuration and derived preview values", () => {
    const session = memoryStorage({
      [HOST_PERSONA_SESSION_KEY]: "{}",
      "hips-avatar-color": "#fff",
      "hips-avatar-2d": "{}",
      "hips-avatar-render-mode": "2d",
      "hips-avatar-emotion": "neutral",
      "hips-avatar-hair-color": "#111827",
      "hips-voice-preset": "deep",
      "hips-voice-enhanced-neural-consent": "true",
    });
    const legacy = memoryStorage({ [HOST_PERSONA_SESSION_KEY]: "{}" });

    deleteSessionPersona(session, legacy);

    expect(session.getItem(HOST_PERSONA_SESSION_KEY)).toBeNull();
    expect(session.getItem("hips-avatar-2d")).toBeNull();
    expect(session.getItem("hips-avatar-emotion")).toBeNull();
    expect(session.getItem("hips-avatar-hair-color")).toBeNull();
    expect(session.getItem("hips-voice-preset")).toBeNull();
    expect(session.getItem("hips-voice-enhanced-neural-consent")).toBeNull();
    expect(legacy.getItem(HOST_PERSONA_SESSION_KEY)).toBeNull();
  });
});
