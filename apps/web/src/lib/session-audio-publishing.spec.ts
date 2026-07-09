import { describe, expect, it, vi } from "vitest";
import type { LocalAudioTrack } from "livekit-client";
import {
  ENHANCED_NEURAL_UNAVAILABLE_MESSAGE,
  prepareDspVoiceTrack,
  prepareNeuralVoiceTrack,
} from "./session-audio-publishing";

function makeLocalAudioTrack() {
  const mediaStreamTrack = {
    getSettings: vi.fn(() => ({ sampleRate: 48_000 })),
  } as unknown as MediaStreamTrack;

  return {
    mediaStreamTrack,
    setProcessor: vi.fn(async () => undefined),
    stop: vi.fn(),
  } as unknown as LocalAudioTrack & {
    mediaStreamTrack: MediaStreamTrack;
    setProcessor: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  };
}

describe("session audio publishing guards", () => {
  it("prepares DSP tracks before publishing", async () => {
    const track = makeLocalAudioTrack();
    const processor = {
      name: "test-processor",
      init: vi.fn(),
      restart: vi.fn(),
      destroy: vi.fn(),
    } as any;

    const result = await prepareDspVoiceTrack({
      track,
      processorOptions: { preset: "sofi", semitones: -3, wetDryRatio: 0.22 },
      createProcessor: vi.fn(() => processor),
    });

    expect(result).toEqual({ status: "ready", track });
    expect(track.setProcessor).toHaveBeenCalledWith(processor);
    expect(track.stop).not.toHaveBeenCalled();
  });

  it("blocks DSP publishing and stops the raw source track when processor setup fails", async () => {
    const track = makeLocalAudioTrack();

    const result = await prepareDspVoiceTrack({
      track,
      processorOptions: { preset: "sofi", semitones: -3, wetDryRatio: 0.22 },
      createProcessor: vi.fn(() => {
        throw new Error("AudioWorklet unavailable");
      }),
    });

    expect(result).toMatchObject({
      status: "blocked",
      warning: "Voice mask unavailable: AudioWorklet unavailable. Try Chrome or Edge for full support.",
    });
    expect(track.setProcessor).not.toHaveBeenCalled();
    expect(track.stop).toHaveBeenCalledTimes(1);
  });

  it("blocks neural publishing when worker readiness is false", async () => {
    const track = makeLocalAudioTrack();
    const startNeuralVoiceMasking = vi.fn();

    const result = await prepareNeuralVoiceTrack({
      track,
      serverMaskingReady: false,
      voiceWorkerUrl: "wss://voice.example.test/v1/stream",
      voiceWorkerToken: "browser-token",
      sessionId: "session-1",
      participantIdentity: "anon-1",
      selectedPersona: "clara",
      antiCadence: false,
      startNeuralVoiceMasking,
      stopNeuralVoiceMasking: vi.fn(),
    });

    expect(result).toEqual({
      status: "blocked",
      warning: ENHANCED_NEURAL_UNAVAILABLE_MESSAGE,
    });
    expect(startNeuralVoiceMasking).not.toHaveBeenCalled();
    expect(track.stop).toHaveBeenCalledTimes(1);
  });

  it("returns only the processed neural track as publishable output", async () => {
    const track = makeLocalAudioTrack();
    const processedTrack = { id: "processed" } as unknown as MediaStreamTrack;
    const startNeuralVoiceMasking = vi.fn(async () => processedTrack);

    const result = await prepareNeuralVoiceTrack({
      track,
      serverMaskingReady: true,
      voiceWorkerUrl: "wss://voice.example.test/v1/stream",
      voiceWorkerToken: "browser-token",
      sessionId: "abc123",
      participantIdentity: "anon-1",
      selectedPersona: "arthur",
      antiCadence: true,
      startNeuralVoiceMasking,
      stopNeuralVoiceMasking: vi.fn(),
    });

    expect(result).toEqual({
      status: "ready",
      processedTrack,
      sourceTrack: track,
    });
    expect(startNeuralVoiceMasking).toHaveBeenCalledWith({
      workerUrl: "wss://voice.example.test/v1/stream",
      workerToken: "browser-token",
      sessionId: "abc123",
      participantIdentity: "anon-1",
      sourceTrack: track.mediaStreamTrack,
      persona: "arthur",
      antiCadence: true,
      pseudoSpeakerSeed: "session-abc123:anon-1:arthur",
      sampleRate: 48_000,
    });
    expect(result.status === "ready" ? result.processedTrack : null).not.toBe(track.mediaStreamTrack);
    expect(track.stop).not.toHaveBeenCalled();
  });

  it("blocks neural publishing and stops the raw source track when worker startup fails", async () => {
    const track = makeLocalAudioTrack();
    const stopNeuralVoiceMasking = vi.fn();

    const result = await prepareNeuralVoiceTrack({
      track,
      serverMaskingReady: true,
      voiceWorkerUrl: "wss://voice.example.test/v1/stream",
      voiceWorkerToken: null,
      sessionId: "abc123",
      participantIdentity: "anon-1",
      selectedPersona: "clara",
      antiCadence: false,
      startNeuralVoiceMasking: vi.fn(async () => {
        throw new Error("worker unavailable");
      }),
      stopNeuralVoiceMasking,
    });

    expect(result).toMatchObject({
      status: "blocked",
      warning: "Enhanced Neural Masking failed: worker unavailable. Use Effects Mode for now.",
    });
    expect(stopNeuralVoiceMasking).toHaveBeenCalledTimes(1);
    expect(track.stop).toHaveBeenCalledTimes(1);
  });
});
