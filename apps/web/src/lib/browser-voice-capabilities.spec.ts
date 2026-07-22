import { afterEach, describe, expect, it, vi } from "vitest";
import {
  detectBrowserEnvironment,
  getBrowserVoiceCapabilities,
  getSupportedRecorderMimeTypes,
  negotiateRecorderMimeType,
} from "./browser-voice-capabilities";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("browser voice capabilities", () => {
  it("is safe during server rendering", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("navigator", undefined);
    vi.stubGlobal("MediaRecorder", undefined);

    expect(getBrowserVoiceCapabilities()).toMatchObject({
      browserFamily: "unknown",
      secureContext: false,
      getUserMedia: false,
      mediaRecorder: false,
      audioContext: false,
      canCaptureAudio: false,
      canProcessAudio: false,
      canRecordAudio: false,
    });
  });

  it("reports a complete browser audio preflight without requesting permission", () => {
    const getUserMedia = vi.fn();
    const isTypeSupported = vi.fn((mimeType: string) =>
      ["audio/webm;codecs=opus", "audio/webm"].includes(mimeType),
    );

    vi.stubGlobal("window", {
      isSecureContext: true,
      AudioContext: class AudioContext {},
    });
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36",
      mediaDevices: {
        getUserMedia,
        getSupportedConstraints: () => ({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }),
      },
    });
    vi.stubGlobal("MediaRecorder", class MediaRecorder {
      static isTypeSupported = isTypeSupported;
    });

    expect(getBrowserVoiceCapabilities()).toEqual({
      browserFamily: "chrome",
      mobile: true,
      secureContext: true,
      mediaDevices: true,
      getUserMedia: true,
      mediaRecorder: true,
      audioContext: true,
      recorderMimeType: "audio/webm;codecs=opus",
      supportedRecorderMimeTypes: ["audio/webm;codecs=opus", "audio/webm"],
      supportedConstraints: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      canCaptureAudio: true,
      canProcessAudio: true,
      canRecordAudio: true,
    });
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("requires a secure context for browser voice readiness", () => {
    vi.stubGlobal("window", {
      isSecureContext: false,
      webkitAudioContext: class WebkitAudioContext {},
    });
    vi.stubGlobal("navigator", {
      userAgent: "test",
      mediaDevices: { getUserMedia: vi.fn() },
    });
    vi.stubGlobal("MediaRecorder", class MediaRecorder {});

    expect(getBrowserVoiceCapabilities()).toMatchObject({
      getUserMedia: true,
      audioContext: true,
      secureContext: false,
      canCaptureAudio: false,
      canProcessAudio: false,
      canRecordAudio: false,
    });
  });
});

describe("recorder MIME negotiation", () => {
  it("chooses the first supported type in preferred order", () => {
    const recorder = {
      isTypeSupported(mimeType: string) {
        return mimeType === "audio/ogg;codecs=opus" || mimeType === "audio/mp4";
      },
    };

    expect(getSupportedRecorderMimeTypes(recorder)).toEqual([
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ]);
    expect(negotiateRecorderMimeType(recorder)).toBe("audio/ogg;codecs=opus");
  });

  it("handles missing or throwing MIME support checks", () => {
    expect(negotiateRecorderMimeType(undefined)).toBeNull();

    const recorder = {
      isTypeSupported() {
        throw new Error("unsupported");
      },
    };
    expect(getSupportedRecorderMimeTypes(recorder)).toEqual([]);
  });
});

describe("browser environment detection", () => {
  it.each([
    ["Mozilla/5.0 Edg/124.0.0.0 Chrome/124.0", "edge", false],
    ["Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/17.4 Mobile Safari/604.1", "safari", true],
    ["Mozilla/5.0 (Android 14) SamsungBrowser/25.0 Chrome/121.0 Mobile", "samsung", true],
    ["Mozilla/5.0 Firefox/125.0", "firefox", false],
  ])("detects %s", (userAgent, browserFamily, mobile) => {
    expect(detectBrowserEnvironment(userAgent)).toEqual({ browserFamily, mobile });
  });
});
