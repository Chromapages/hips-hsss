import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkNeuralVoiceMaskingHealth,
  getNeuralVoiceMaskingConfig,
} from "./neural-voice-masking";

const VOICE_WORKER_ENV = [
  "VOICE_WORKER_ENABLED",
  "VOICE_WORKER_WS_URL",
  "VOICE_WORKER_HEALTH_URL",
  "VOICE_WORKER_PUBLIC_WS_URL",
  "VOICE_WORKER_RUNTIME",
  "VOICE_WORKER_LIVE_READY",
  "VOICE_WORKER_SHARED_SECRET",
  "VOICE_WORKER_BROWSER_TOKEN",
  "VOICE_WORKER_JWT_SECRET",
  "SERVICE_JWT_SECRET",
  "VOICE_WORKER_TIMEOUT_MS",
] as const;

const originalEnv: Record<string, string | undefined> = {};

function clearVoiceWorkerEnv() {
  for (const key of VOICE_WORKER_ENV) {
    delete process.env[key];
  }
}

beforeEach(() => {
  for (const key of VOICE_WORKER_ENV) {
    originalEnv[key] = process.env[key];
  }
  clearVoiceWorkerEnv();
});

afterEach(() => {
  for (const key of VOICE_WORKER_ENV) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("neural voice masking config", () => {
  it("stays disabled when the worker flag is not enabled", () => {
    vi.stubEnv("VOICE_WORKER_HEALTH_URL", "http://127.0.0.1:3010/health");

    expect(getNeuralVoiceMaskingConfig()).toMatchObject({
      enabled: false,
      provider: "voice-worker",
      healthUrl: "http://127.0.0.1:3010/health",
      runtime: "transport-passthrough-vad",
      liveReady: false,
    });
  });

  it("derives health URL from a private worker WebSocket URL", () => {
    vi.stubEnv("VOICE_WORKER_ENABLED", "true");
    vi.stubEnv("VOICE_WORKER_WS_URL", "wss://worker.example.test/v1/stream?token=secret");

    expect(getNeuralVoiceMaskingConfig()).toMatchObject({
      enabled: true,
      healthUrl: "https://worker.example.test/health",
    });
  });

  it("records public endpoint and legacy browser token requirements", () => {
    vi.stubEnv("VOICE_WORKER_ENABLED", "true");
    vi.stubEnv("VOICE_WORKER_HEALTH_URL", "http://127.0.0.1:3010/health");
    vi.stubEnv("VOICE_WORKER_PUBLIC_WS_URL", "wss://voice.example.test/v1/stream");
    vi.stubEnv("VOICE_WORKER_LIVE_READY", "true");
    vi.stubEnv("VOICE_WORKER_SHARED_SECRET", "server-secret");
    vi.stubEnv("VOICE_WORKER_BROWSER_TOKEN", "browser-token");
    vi.stubEnv("VOICE_WORKER_RUNTIME", "cpu-dsp-v1");

    expect(getNeuralVoiceMaskingConfig()).toMatchObject({
      enabled: true,
      publicWsUrl: "wss://voice.example.test/v1/stream",
      runtime: "cpu-dsp-v1",
      liveReady: true,
      sharedSecretConfigured: true,
      jwtConfigured: true,
      browserToken: null,
    });
  });

  it("keeps legacy browser tokens only when JWT signing is unavailable", () => {
    vi.stubEnv("VOICE_WORKER_ENABLED", "true");
    vi.stubEnv("VOICE_WORKER_HEALTH_URL", "http://127.0.0.1:3010/health");
    vi.stubEnv("VOICE_WORKER_PUBLIC_WS_URL", "wss://voice.example.test/v1/stream");
    vi.stubEnv("VOICE_WORKER_LIVE_READY", "true");
    vi.stubEnv("VOICE_WORKER_BROWSER_TOKEN", "browser-token");

    expect(getNeuralVoiceMaskingConfig()).toMatchObject({
      enabled: true,
      jwtConfigured: false,
      browserToken: "browser-token",
    });
  });

  it("checks worker health and returns worker liveReady", async () => {
    vi.stubEnv("VOICE_WORKER_ENABLED", "true");
    vi.stubEnv("VOICE_WORKER_HEALTH_URL", "http://127.0.0.1:3010/health");

    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ liveReady: true }),
    })));

    await expect(checkNeuralVoiceMaskingHealth()).resolves.toMatchObject({
      configured: true,
      reachable: true,
      statusCode: 200,
      workerLiveReady: true,
    });
  });

  it("reports unreachable worker health without throwing", async () => {
    vi.stubEnv("VOICE_WORKER_ENABLED", "true");
    vi.stubEnv("VOICE_WORKER_HEALTH_URL", "http://127.0.0.1:3010/health");

    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("connection refused");
    }));

    await expect(checkNeuralVoiceMaskingHealth()).resolves.toMatchObject({
      configured: true,
      reachable: false,
      error: "connection refused",
    });
  });
});
