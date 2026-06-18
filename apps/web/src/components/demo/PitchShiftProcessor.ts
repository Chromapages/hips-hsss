'use client';

// AudioWorkletProcessor is a browser global - declare it for TypeScript
declare const AudioWorkletProcessor: any;
declare const registerProcessor: any;

import { useEffect, useRef, useCallback } from 'react';

interface PitchShiftProcessorOptions {
  semitones?: number;
  processorOptions?: { semitones?: number; ringModFreq?: number };
}

class HipsPitchShiftProcessor extends AudioWorkletProcessor {
  private ratio: number;
  private ringModFreq: number = 0;
  private ringModPhase: number = 0;
  private phaseLFO: number = 0;
  private lfoFreq: number = 2.5;
  private lfoDepth: number = 0.015;
  private sampleRate: number = 48000;
  private SIZE: number = 8192;
  private MASK: number = 8191;
  private buf: Float32Array;
  private wp: number = 0;
  private L: number = 2048;
  private HALF_L: number = 1024;
  private p1: number = 0;
  private p2: number = 1024;
  private D: number;
  private anchor1: number;
  private anchor2: number;
  private gateThresholdDb: number = -45;
  private gateThresholdEnv: number;
  private envelope: number = 0;
  private gateGain: number = 0;
  private envReleaseCoef: number;
  private gateAttackCoef: number;
  private gateReleaseCoef: number;

  constructor(options?: PitchShiftProcessorOptions) {
    super();
    const semitones = options?.processorOptions?.semitones ?? 4;
    this.ratio = Math.pow(2, semitones / 12);
    this.ringModFreq = options?.processorOptions?.ringModFreq ?? 0;
    this.buf = new Float32Array(this.SIZE);
    
    const minDelay = 64;
    const baseDelay = this.ratio > 1.0 ? minDelay + this.L * (this.ratio - 1.0) : minDelay;
    this.D = Math.ceil(baseDelay + 64);

    this.anchor1 = (this.wp - this.D + this.SIZE) & this.MASK;
    this.anchor2 = (this.wp - this.D - this.HALF_L + this.SIZE) & this.MASK;

    this.gateThresholdEnv = Math.pow(10, this.gateThresholdDb / 20);

    const sr = (globalThis as any).sampleRate || 48000;
    this.envReleaseCoef = Math.exp(-1.0 / (sr * 0.05));
    this.gateAttackCoef = Math.exp(-1.0 / (sr * 0.002));
    this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150));

    this.port.onmessage = (event: any) => {
      if (event.data.type === 'update-params') {
        if (typeof event.data.semitones === 'number') {
          this.ratio = Math.pow(2, event.data.semitones / 12);
          const baseDelay = this.ratio > 1.0 ? 64 + this.L * (this.ratio - 1.0) : 64;
          this.D = Math.ceil(baseDelay + 64);
        }
        if (typeof event.data.gateThresholdDb === 'number') {
          this.gateThresholdDb = event.data.gateThresholdDb;
          this.gateThresholdEnv = Math.pow(10, this.gateThresholdDb / 20);
        }
        if (typeof event.data.lfoDepth === 'number') {
          this.lfoDepth = event.data.lfoDepth;
        }
        if (typeof event.data.lfoFreq === 'number') {
          this.lfoFreq = event.data.lfoFreq;
        }
        if (typeof event.data.ringModFreq === 'number') {
          this.ringModFreq = event.data.ringModFreq;
        }
      }
    };
  }

  private lerp(pos: number): number {
    const i = (pos | 0) & this.MASK;
    const j = (i + 1) & this.MASK;
    const f = pos - (pos | 0);
    const valI = this.buf[i] ?? 0;
    const valJ = this.buf[j] ?? 0;
    return valI + (valJ - valI) * f;
  }

  private win(p: number): number {
    return 0.5 - 0.5 * Math.cos((2 * Math.PI * p) / this.L);
  }

  private alignAnchor(targetRp: number, baseRp: number): number {
    const SearchRange = 256;
    const BlockSize = 128;
    const HalfBlock = BlockSize >> 1;

    let bestShift = 0;
    let minSad = Infinity;

    for (let shift = -SearchRange; shift <= SearchRange; shift += 2) {
      let sad = 0;
      for (let k = -HalfBlock; k < HalfBlock; k += 4) {
        const idxA = (targetRp + k + this.SIZE) & this.MASK;
        const idxB = (baseRp + shift + k + this.SIZE) & this.MASK;
        const valA = this.buf[idxA] ?? 0;
        const valB = this.buf[idxB] ?? 0;
        const diff = valA - valB;
        sad += diff < 0 ? -diff : diff;
      }
      if (sad < minSad) {
        minSad = sad;
        bestShift = shift;
      }
    }
    return (baseRp + bestShift + this.SIZE) & this.MASK;
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    _options: Record<string, unknown>
  ): boolean {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;

    const sr = (globalThis as any).sampleRate || 48000;
    if (this.sampleRate !== sr) {
      this.sampleRate = sr;
      this.envReleaseCoef = Math.exp(-1.0 / (sr * 0.05));
      this.gateAttackCoef = Math.exp(-1.0 / (sr * 0.002));
      this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150));
    }

    for (let i = 0; i < src.length; i++) {
      this.buf[this.wp] = src[i] ?? 0;

      const rect = Math.abs(src[i] ?? 0);
      if (rect > this.envelope) {
        this.envelope = rect;
      } else {
        this.envelope = this.envelope * this.envReleaseCoef + rect * (1.0 - this.envReleaseCoef);
      }

      const targetGate = (this.envelope > this.gateThresholdEnv) ? 1.0 : 0.0;
      if (this.gateGain < targetGate) {
        this.gateGain = this.gateGain * this.gateAttackCoef + targetGate * (1.0 - this.gateAttackCoef);
      } else {
        this.gateGain = this.gateGain * this.gateReleaseCoef + targetGate * (1.0 - this.gateReleaseCoef);
      }

      let currentRatio = this.ratio;
      if (this.ratio !== 1.0 && this.lfoDepth > 0) {
        this.phaseLFO += this.lfoFreq / this.sampleRate;
        if (this.phaseLFO >= 1.0) this.phaseLFO -= 1.0;
        currentRatio = this.ratio * (1.0 + Math.sin(2.0 * Math.PI * this.phaseLFO) * this.lfoDepth);
      }

      const rp1 = this.anchor1 + this.p1 * currentRatio;
      const rp2 = this.anchor2 + this.p2 * currentRatio;

      let outSample = this.lerp(rp1) * this.win(this.p1)
                      + this.lerp(rp2) * this.win(this.p2);

      if (this.ringModFreq > 0) {
        const carrier = Math.sin(2.0 * Math.PI * this.ringModPhase);
        this.ringModPhase += this.ringModFreq / this.sampleRate;
        if (this.ringModPhase >= 1.0) this.ringModPhase -= 1.0;
        outSample = outSample * 0.45 + (outSample * carrier) * 0.55;
      }

      // 7. Apply noise gate and low-level anti-biometric dither (noise level of 0.0003 corresponds to ~-70dBFS)
      const noise = (Math.random() * 2.0 - 1.0) * 0.0003 * Math.max(0.1, this.gateGain);
      dst[i] = outSample * this.gateGain + noise;

      this.p1 += 1;
      this.p2 += 1;

      if (this.p1 >= this.L) {
        this.p1 -= this.L;
        const targetRp = Math.floor(this.anchor2 + this.p2 * currentRatio);
        const baseRp = (this.wp - this.D + this.SIZE) & this.MASK;
        this.anchor1 = this.alignAnchor(targetRp, baseRp);
      }

      if (this.p2 >= this.L) {
        this.p2 -= this.L;
        const targetRp = Math.floor(this.anchor1 + this.p1 * currentRatio);
        const baseRp = (this.wp - this.D + this.SIZE) & this.MASK;
        this.anchor2 = this.alignAnchor(targetRp, baseRp);
      }

      this.wp = (this.wp + 1) & this.MASK;
    }
    return true;
  }
}

registerProcessor('hips-pitch-shift', HipsPitchShiftProcessor);