import { createHash } from 'node:crypto';
import type { VadResult } from './vad.js';

export const CPU_DSP_RUNTIME = 'cpu-dsp-v1';

export type VoiceMaskerConfig = {
  enabled: boolean;
  persona: VoiceMaskerPersona;
  pitchRatio: number;
  ringModHz: number;
  ringModDepth: number;
  noiseFloor: number;
  drive: number;
  lowpassHz: number;
  highpassHz: number;
  formantWarp: number;
  cadenceDepth: number;
  delayJitterMs: number;
};

export type VoiceMaskerPersona = 'clara' | 'arthur' | 'guardian' | 'bright' | 'shadow';

type BiquadState = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export class VoiceMasker {
  private readonly delayLine: Float32Array;
  private delayWriteIndex = 0;
  private lfoPhase = 0;
  private cadencePhase = 0;
  private ringPhase = 0;
  private noiseSeed: number;
  private readonly highpassState: BiquadState = createBiquadState();
  private readonly lowpassState: BiquadState = createBiquadState();
  private readonly highpassCoeffs;
  private readonly lowpassCoeffs;

  constructor(
    private readonly sampleRate: number,
    private readonly config: VoiceMaskerConfig,
    seed: string,
  ) {
    this.delayLine = new Float32Array(Math.max(256, Math.floor(sampleRate * 0.08)));
    this.noiseSeed = hashSeed(seed);
    this.highpassCoeffs = makeHighpass(sampleRate, config.highpassHz, 0.707);
    this.lowpassCoeffs = makeLowpass(sampleRate, config.lowpassHz, 0.707);
  }

  process(frame: Int16Array, vad: VadResult): Buffer {
    if (!this.config.enabled) {
      return Buffer.from(frame.buffer, frame.byteOffset, frame.byteLength);
    }

    const output = Buffer.alloc(frame.length * Int16Array.BYTES_PER_ELEMENT);
    const outView = new Int16Array(output.buffer, output.byteOffset, frame.length);

    for (let i = 0; i < frame.length; i += 1) {
      const input = (frame[i] ?? 0) / 32768;
      this.delayLine[this.delayWriteIndex] = input;

      const lfo = Math.sin(this.lfoPhase);
      const cadence = Math.sin(this.cadencePhase);
      const variableDelayMs = 18 + (this.config.pitchRatio - 1) * 22 + lfo * 4.5 + cadence * this.config.delayJitterMs;
      const delayed = this.readDelay(variableDelayMs);

      let sample = input * 0.32 + delayed * 0.68;
      sample = this.applyFormantWarp(sample);
      sample = applyBiquad(sample, this.highpassCoeffs, this.highpassState);
      sample = applyBiquad(sample, this.lowpassCoeffs, this.lowpassState);

      const ring = Math.sin(this.ringPhase);
      sample *= 1 - this.config.ringModDepth + this.config.ringModDepth * (0.5 + ring * 0.5);
      sample *= 1 - this.config.cadenceDepth * 0.5 + this.config.cadenceDepth * (0.5 + cadence * 0.5);

      if (vad.speech) {
        sample += this.nextNoise() * this.config.noiseFloor;
      } else {
        sample = this.nextNoise() * this.config.noiseFloor * 0.35;
      }

      sample = Math.tanh(sample * this.config.drive) / Math.tanh(this.config.drive);
      outView[i] = floatToInt16(sample * 0.9);

      this.advancePhases();
      this.delayWriteIndex = (this.delayWriteIndex + 1) % this.delayLine.length;
    }

    return output;
  }

  private readDelay(delayMs: number): number {
    const delaySamples = clamp((delayMs / 1000) * this.sampleRate, 1, this.delayLine.length - 2);
    const readIndex = wrap(this.delayWriteIndex - delaySamples, this.delayLine.length);
    const i0 = Math.floor(readIndex);
    const i1 = (i0 + 1) % this.delayLine.length;
    const frac = readIndex - i0;
    return lerp(this.delayLine[i0] ?? 0, this.delayLine[i1] ?? 0, frac);
  }

  private applyFormantWarp(sample: number): number {
    const folded = sample + Math.sin(sample * Math.PI * this.config.formantWarp) * 0.12;
    return folded * (1 - Math.min(0.35, Math.abs(this.config.formantWarp - 1) * 0.2));
  }

  private advancePhases() {
    this.lfoPhase = wrapPhase(this.lfoPhase + (2 * Math.PI * 5.5) / this.sampleRate);
    this.cadencePhase = wrapPhase(this.cadencePhase + (2 * Math.PI * 1.8) / this.sampleRate);
    this.ringPhase = wrapPhase(this.ringPhase + (2 * Math.PI * this.config.ringModHz) / this.sampleRate);
  }

  private nextNoise(): number {
    this.noiseSeed = (1664525 * this.noiseSeed + 1013904223) >>> 0;
    return (this.noiseSeed / 0xffffffff) * 2 - 1;
  }
}

export function buildVoiceMaskerConfig(personaOverride?: string, antiCadence = false): VoiceMaskerConfig {
  const persona = normalizePersona(personaOverride ?? process.env.VOICE_WORKER_DSP_PRESET ?? 'guardian');
  const base = getPreset(persona);
  const cadenceDepth = antiCadence ? Math.max(base.cadenceDepth, 0.18) : base.cadenceDepth;
  const delayJitterMs = antiCadence ? Math.max(base.delayJitterMs, 3.5) : base.delayJitterMs;

  return {
    enabled: process.env.VOICE_WORKER_DSP_ENABLED !== 'false',
    persona,
    pitchRatio: parseNumber(process.env.VOICE_WORKER_DSP_PITCH_RATIO, base.pitchRatio, 0.75, 1.35),
    ringModHz: parseNumber(process.env.VOICE_WORKER_DSP_RING_HZ, base.ringModHz, 0, 120),
    ringModDepth: parseNumber(process.env.VOICE_WORKER_DSP_RING_DEPTH, base.ringModDepth, 0, 0.5),
    noiseFloor: parseNumber(process.env.VOICE_WORKER_DSP_NOISE_FLOOR, base.noiseFloor, 0, 0.03),
    drive: parseNumber(process.env.VOICE_WORKER_DSP_DRIVE, base.drive, 1, 4),
    lowpassHz: parseNumber(process.env.VOICE_WORKER_DSP_LOWPASS_HZ, base.lowpassHz, 1200, 12000),
    highpassHz: parseNumber(process.env.VOICE_WORKER_DSP_HIGHPASS_HZ, base.highpassHz, 20, 800),
    formantWarp: parseNumber(process.env.VOICE_WORKER_DSP_FORMANT_WARP, base.formantWarp, 0.4, 1.8),
    cadenceDepth: parseNumber(process.env.VOICE_WORKER_DSP_CADENCE_DEPTH, cadenceDepth, 0, 0.45),
    delayJitterMs: parseNumber(process.env.VOICE_WORKER_DSP_DELAY_JITTER_MS, delayJitterMs, 0, 12),
  };
}

function normalizePersona(value: string): VoiceMaskerPersona {
  if (value === 'clara' || value === 'bright') return 'bright';
  if (value === 'arthur' || value === 'shadow') return 'shadow';
  return 'guardian';
}

function getPreset(persona: VoiceMaskerPersona) {
  switch (persona) {
    case 'bright':
    case 'clara':
      return {
        pitchRatio: 0.9,
        ringModHz: 46,
        ringModDepth: 0.14,
        noiseFloor: 0.0038,
        drive: 1.48,
        lowpassHz: 6400,
        highpassHz: 165,
        formantWarp: 1.32,
        cadenceDepth: 0.08,
        delayJitterMs: 2.2,
      };
    case 'shadow':
    case 'arthur':
      return {
        pitchRatio: 1.24,
        ringModHz: 31,
        ringModDepth: 0.18,
        noiseFloor: 0.0048,
        drive: 1.72,
        lowpassHz: 4300,
        highpassHz: 95,
        formantWarp: 0.62,
        cadenceDepth: 0.1,
        delayJitterMs: 2.8,
      };
    case 'guardian':
    default:
      return {
        pitchRatio: 1.18,
        ringModHz: 37,
        ringModDepth: 0.16,
        noiseFloor: 0.0045,
        drive: 1.65,
        lowpassHz: 4800,
        highpassHz: 115,
        formantWarp: 0.72,
        cadenceDepth: 0.09,
        delayJitterMs: 2.5,
      };
  }
}

function createBiquadState(): BiquadState {
  return { x1: 0, x2: 0, y1: 0, y2: 0 };
}

function makeLowpass(sampleRate: number, frequency: number, q: number) {
  const omega = 2 * Math.PI * clamp(frequency, 20, sampleRate / 2 - 100) / sampleRate;
  const alpha = Math.sin(omega) / (2 * q);
  const cos = Math.cos(omega);
  const b0 = (1 - cos) / 2;
  const b1 = 1 - cos;
  const b2 = (1 - cos) / 2;
  const a0 = 1 + alpha;
  const a1 = -2 * cos;
  const a2 = 1 - alpha;
  return normalizeBiquad(b0, b1, b2, a0, a1, a2);
}

function makeHighpass(sampleRate: number, frequency: number, q: number) {
  const omega = 2 * Math.PI * clamp(frequency, 20, sampleRate / 2 - 100) / sampleRate;
  const alpha = Math.sin(omega) / (2 * q);
  const cos = Math.cos(omega);
  const b0 = (1 + cos) / 2;
  const b1 = -(1 + cos);
  const b2 = (1 + cos) / 2;
  const a0 = 1 + alpha;
  const a1 = -2 * cos;
  const a2 = 1 - alpha;
  return normalizeBiquad(b0, b1, b2, a0, a1, a2);
}

function normalizeBiquad(b0: number, b1: number, b2: number, a0: number, a1: number, a2: number) {
  return {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: a1 / a0,
    a2: a2 / a0,
  };
}

function applyBiquad(
  input: number,
  coeffs: ReturnType<typeof normalizeBiquad>,
  state: BiquadState,
): number {
  const output = coeffs.b0 * input + coeffs.b1 * state.x1 + coeffs.b2 * state.x2 - coeffs.a1 * state.y1 - coeffs.a2 * state.y2;
  state.x2 = state.x1;
  state.x1 = input;
  state.y2 = state.y1;
  state.y1 = output;
  return output;
}

function floatToInt16(value: number): number {
  const clamped = clamp(value, -1, 1);
  return Math.round(clamped < 0 ? clamped * 32768 : clamped * 32767);
}

function parseNumber(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
}

function hashSeed(seed: string): number {
  const digest = createHash('sha256').update(seed).digest();
  return digest.readUInt32LE(0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function wrap(value: number, length: number): number {
  let next = value % length;
  if (next < 0) next += length;
  return next;
}

function wrapPhase(phase: number): number {
  return phase >= Math.PI * 2 ? phase - Math.PI * 2 : phase;
}
