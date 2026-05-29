'use client';

// AudioWorkletProcessor is a browser global - declare it for TypeScript
declare const AudioWorkletProcessor: any;
declare const registerProcessor: any;

import { useEffect, useRef, useCallback } from 'react';

interface PitchShiftProcessorOptions {
  semitones?: number;
  processorOptions?: { semitones?: number };
}

class HipsPitchShiftProcessor extends AudioWorkletProcessor {
  private ratio: number;
  private BUF_SIZE: number;
  private MASK: number;
  private HALF: number;
  private buf: Float32Array;
  private wp: number = 0;
  private baseRp: number = 0;
  private frac: number = 0;

  constructor(options?: PitchShiftProcessorOptions) {
    super();
    const semitones = options?.processorOptions?.semitones ?? 4;
    this.ratio = Math.pow(2, semitones / 12);
    this.BUF_SIZE = 4096;
    this.MASK = this.BUF_SIZE - 1;
    this.HALF = this.BUF_SIZE >> 1;
    this.buf = new Float32Array(this.BUF_SIZE);
  }

  private lerp(rp: number): number {
    const i0 = Math.floor(rp) & this.MASK;
    const i1 = (i0 + 1) & this.MASK;
    const f = rp - Math.floor(rp);
    return (this.buf[i0] ?? 0) * (1 - f) + (this.buf[i1] ?? 0) * f;
  }

  private win(n: number): number {
    return 0.5 * (1 - Math.cos(6.2831853 * n / this.HALF));
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    _options: Record<string, unknown>
  ): boolean {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;

    for (let i = 0; i < src.length; i++) {
      this.buf[this.wp & this.MASK] = src[i] ?? 0;
      this.wp++;

      this.frac += this.ratio;
      if (this.frac >= 1) {
        const whole = Math.floor(this.frac);
        this.baseRp += whole;
        this.frac -= whole;
      }

      const rp1 = this.baseRp & this.MASK;
      dst[i] =
        this.lerp(this.baseRp) * this.win(rp1) +
        this.lerp((this.baseRp + this.HALF) & this.MASK) * this.win((this.baseRp + this.HALF) & this.MASK);

      if (this.baseRp > this.BUF_SIZE * 16) {
        this.baseRp -= this.BUF_SIZE * 16;
      }
    }
    return true;
  }
}

registerProcessor('hips-pitch-shift', HipsPitchShiftProcessor);