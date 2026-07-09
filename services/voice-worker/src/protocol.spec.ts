import { describe, expect, it } from "vitest";
import {
  DEFAULT_CHUNK_MS,
  DEFAULT_SAMPLE_RATE,
  controlMessageSchema,
  encodeControl,
} from "./protocol";

describe("voice worker protocol", () => {
  it("parses a start message with defaults", () => {
    const parsed = controlMessageSchema.parse({
      type: "start",
      sessionId: "session-1",
      participantIdentity: "anon-1",
    });

    expect(parsed).toMatchObject({
      type: "start",
      sessionId: "session-1",
      participantIdentity: "anon-1",
      sampleRate: DEFAULT_SAMPLE_RATE,
      chunkMs: DEFAULT_CHUNK_MS,
      persona: "guardian",
      antiCadence: false,
    });
  });

  it("rejects malformed control messages", () => {
    expect(() => controlMessageSchema.parse({
      type: "start",
      sessionId: "",
      participantIdentity: "anon-1",
    })).toThrow();

    expect(() => controlMessageSchema.parse({
      type: "start",
      sessionId: "session-1",
      participantIdentity: "anon-1",
      sampleRate: 96_000,
    })).toThrow();

    expect(() => controlMessageSchema.parse({ type: "unknown" })).toThrow();
  });

  it("encodes server control messages as JSON", () => {
    expect(JSON.parse(encodeControl({
      type: "ready",
      runtime: "cpu-dsp-v1",
      sampleRate: 24_000,
      chunkMs: 40,
      liveReady: false,
    }))).toEqual({
      type: "ready",
      runtime: "cpu-dsp-v1",
      sampleRate: 24_000,
      chunkMs: 40,
      liveReady: false,
    });
  });
});
