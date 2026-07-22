import { describe, expect, it } from "vitest";
import { lowLatencyPitchShiftWorkletSource } from "./low-latency-pitch-shift-worklet";

describe("low-latency pitch-shift worklet source", () => {
  it("supports live preset parameter updates", () => {
    expect(lowLatencyPitchShiftWorkletSource).toContain("update-params");
    expect(lowLatencyPitchShiftWorkletSource).toContain("event.data.semitones");
  });

  it("smooths pitch ratio and delay changes to avoid abrupt preset transitions", () => {
    expect(lowLatencyPitchShiftWorkletSource).toContain("targetRatio");
    expect(lowLatencyPitchShiftWorkletSource).toContain("parameterSmoothing");
    expect(lowLatencyPitchShiftWorkletSource).toContain("targetD");
  });
});
