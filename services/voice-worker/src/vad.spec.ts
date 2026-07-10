import { describe, expect, it } from "vitest";
import { detectSpeech, int16Rms, silenceLike } from "./vad";

describe("voice worker VAD helpers", () => {
  it("returns zero RMS for empty and silent frames", () => {
    expect(int16Rms(new Int16Array())).toBe(0);
    expect(int16Rms(new Int16Array([0, 0, 0, 0]))).toBe(0);
  });

  it("detects speech above threshold", () => {
    const frame = new Int16Array([0, 4096, -4096, 4096, -4096]);

    expect(detectSpeech(frame, 0.05)).toMatchObject({
      speech: true,
    });
    expect(detectSpeech(frame, 0.5)).toMatchObject({
      speech: false,
    });
  });

  it("creates a zeroed PCM16 buffer shaped like the input frame", () => {
    const frame = new Int16Array([1200, -1200, 300]);
    const silence = silenceLike(frame);
    const view = new Int16Array(silence.buffer, silence.byteOffset, frame.length);

    expect(silence.byteLength).toBe(frame.byteLength);
    expect(Array.from(view)).toEqual([0, 0, 0]);
  });
});
