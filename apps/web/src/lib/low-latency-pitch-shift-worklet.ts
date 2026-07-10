/**
 * Low-Latency OLA Pitch Shifter — registered as 'hips-pitch-shift-ola'
 *
 * Grain size L=512 (~10.7ms at 48kHz) + WSOLA lookahead (~5.3ms) ≈ 16ms total,
 * well under the 20ms Effects Mode budget.
 *
 * Key differences from the standard 'hips-pitch-shift' (L=2048):
 * - Single read head (vs two-head 180° offset) — halves WSOLA cost
 * - WSOLA search range = 64 samples (vs 256), block = 32 (vs 128)
 * - SIZE = 4096 (vs 8192)
 *
 * All security features are preserved: LFO jitter, ring modulation,
 * noise gate, and anti-biometric dither.
 */
export const lowLatencyPitchShiftWorkletSource = `
class LowLatencyPitchShiftProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();

    // ── Pitch shift ───────────────────────────────────────────────
    const semitones = options.processorOptions?.semitones ?? 4;
    this.ratio = Math.pow(2, semitones / 12);

    // ── Ring modulation (Cyber voice preset) ───────────────────────
    this.ringModFreq = options.processorOptions?.ringModFreq ?? 0;
    this.ringModPhase = 0;

    // ── Dynamic pitch jitter — anti-de-masking LFO ─────────────────
    this.phaseLFO = 0;
    this.lfoFreq = 2.5;   // Hz
    this.lfoDepth = 0.015; // ~0.25 semitones peak deviation

    // ── Circular buffer (single head, no WSOLA search headroom needed)
    this.SIZE = 4096;
    this.MASK = this.SIZE - 1;
    this.buf = new Float32Array(this.SIZE);
    this.wp = 0;

    // ── Grain parameters — L=512 gives ~10.7ms grain window ───────
    this.L = 512;
    this.HALF_L = this.L >> 1; // 256

    // ── Single read head (vs two-head in the L=2048 version) ───────
    this.p1 = 0;

    // Delay from write pointer to read anchor (samples of look-ahead)
    const minDelay = 64;
    const baseDelay = this.ratio > 1.0 ? minDelay + this.L * (this.ratio - 1.0) : minDelay;
    this.D = Math.ceil(baseDelay + 32); // safety margin

    this.anchor1 = (this.wp - this.D + this.SIZE) & this.MASK;

    // ── Noise gate ─────────────────────────────────────────────────
    this.gateThresholdDb  = -45;
    this.gateThresholdEnv = Math.pow(10, this.gateThresholdDb / 20);
    this.envelope  = 0;
    this.gateGain  = 0;

    const sr = globalThis.sampleRate || 48000;
    this.envReleaseCoef  = Math.exp(-1.0 / (sr * 0.05));  // 50 ms
    this.gateAttackCoef  = Math.exp(-1.0 / (sr * 0.002)); //  2 ms
    this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150)); // 150 ms

    // ── Real-time parameter updates via port message ───────────────
    this.port.onmessage = (event) => {
      if (event.data.type === 'update-params') {
        if (typeof event.data.semitones === 'number') {
          this.ratio = Math.pow(2, event.data.semitones / 12);
          const baseDelay = this.ratio > 1.0 ? 64 + this.L * (this.ratio - 1.0) : 64;
          this.D = Math.ceil(baseDelay + 32);
        }
        if (typeof event.data.gateThresholdDb === 'number') {
          this.gateThresholdDb  = event.data.gateThresholdDb;
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

  // ── Helpers ────────────────────────────────────────────────────────

  /** Linear interpolation at fractional buffer index */
  lerp(pos) {
    const i = (pos | 0) & this.MASK;
    const j = (i + 1) & this.MASK;
    const f = pos - (pos | 0);
    return this.buf[i] + (this.buf[j] - this.buf[i]) * f;
  }

  /** Hann window over grain position p (0 ≤ p < L) */
  win(p) {
    return 0.5 - 0.5 * Math.cos((2.0 * Math.PI * p) / this.L);
  }

  /**
   * Waveform Similarity Overlap-Add alignment.
   * Reduced search (range=64, block=32) vs standard (range=256, block=128).
   */
  alignAnchor(targetRp, baseRp) {
    const SearchRange = 64;  // ±64 samples search window
    const BlockSize   = 32;  // comparison block
    const HalfBlock   = BlockSize >> 1;

    let bestShift = 0;
    let minSad    = Infinity;

    for (let shift = -SearchRange; shift <= SearchRange; shift += 2) {
      let sad = 0;
      for (let k = -HalfBlock; k < HalfBlock; k += 4) { // skip 3-of-4 for speed
        const idxA = (targetRp + k + this.SIZE) & this.MASK;
        const idxB = (baseRp  + shift + k + this.SIZE) & this.MASK;
        const diff = this.buf[idxA] - this.buf[idxB];
        sad += diff < 0 ? -diff : diff;
      }
      if (sad < minSad) {
        minSad    = sad;
        bestShift = shift;
      }
    }
    return (baseRp + bestShift + this.SIZE) & this.MASK;
  }

  // ── Main processing loop ────────────────────────────────────────────
  process(inputs, outputs) {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;

    const sr = globalThis.sampleRate || 48000;
    if (this.sampleRate !== sr) {
      this.sampleRate          = sr;
      this.envReleaseCoef  = Math.exp(-1.0 / (sr * 0.05));
      this.gateAttackCoef  = Math.exp(-1.0 / (sr * 0.002));
      this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150));
    }

    for (let i = 0; i < src.length; i++) {
      // 1. Write to circular buffer
      this.buf[this.wp] = src[i];

      // 2. Envelope follower (pre-gate)
      const rect = Math.abs(src[i]);
      if (rect > this.envelope) {
        this.envelope = rect;
      } else {
        this.envelope = this.envelope * this.envReleaseCoef
                      + rect * (1.0 - this.envReleaseCoef);
      }

      // 3. Gate gain smoothing
      const targetGate = (this.envelope > this.gateThresholdEnv) ? 1.0 : 0.0;
      if (this.gateGain < targetGate) {
        this.gateGain = this.gateGain * this.gateAttackCoef
                     + targetGate * (1.0 - this.gateAttackCoef);
      } else {
        this.gateGain = this.gateGain * this.gateReleaseCoef
                     + targetGate * (1.0 - this.gateReleaseCoef);
      }

      // 4. LFO pitch jitter (security — prevents static pitch as de-mask anchor)
      let currentRatio = this.ratio;
      if (this.ratio !== 1.0 && this.lfoDepth > 0) {
        this.phaseLFO += this.lfoFreq / this.sampleRate;
        if (this.phaseLFO >= 1.0) this.phaseLFO -= 1.0;
        currentRatio = this.ratio * (1.0 + Math.sin(2.0 * Math.PI * this.phaseLFO) * this.lfoDepth);
      }

      // 5. Read position
      const rp1 = this.anchor1 + this.p1 * currentRatio;

      // 6. Overlap-add with Hann window (single head)
      let outSample = this.lerp(rp1) * this.win(this.p1);

      // 7. Ring modulation (Cyber preset)
      if (this.ringModFreq > 0) {
        const carrier = Math.sin(2.0 * Math.PI * this.ringModPhase);
        this.ringModPhase += this.ringModFreq / this.sampleRate;
        if (this.ringModPhase >= 1.0) this.ringModPhase -= 1.0;
        outSample = outSample * 0.45 + (outSample * carrier) * 0.55;
      }

      // 8. Noise gate + anti-biometric dither (~-70 dBFS)
      const noise = (Math.random() * 2.0 - 1.0) * 0.0003 * Math.max(0.1, this.gateGain);
      dst[i] = outSample * this.gateGain + noise;

      // 9. Advance grain phase
      this.p1 += 1;

      // 10. Grain reset + WSOLA alignment
      if (this.p1 >= this.L) {
        this.p1 -= this.L;
        const targetRp = Math.floor(this.anchor1 + this.p1 * currentRatio);
        const baseRp  = (this.wp - this.D + this.SIZE) & this.MASK;
        this.anchor1  = this.alignAnchor(targetRp, baseRp);
      }

      this.wp = (this.wp + 1) & this.MASK;
    }
    return true;
  }
}

registerProcessor('hips-pitch-shift-ola', LowLatencyPitchShiftProcessor);
`;
