import type { AudioProcessorOptions, TrackProcessor } from 'livekit-client';
import { Track } from 'livekit-client';
import type { VoicePreset } from './voice-mask-presets';
import { lowLatencyPitchShiftWorkletSource } from './low-latency-pitch-shift-worklet';

type VoiceMaskProcessorOptions = {
  preset: VoicePreset;
  semitones?: number;
  /** 0.0 = fully dry, 1.0 = fully wet. Default 0.22 (22% wet reverb). */
  wetDryRatio?: number;
};

// Two-head granular pitch shifter using overlap-add with Hanning windows.
// Each read head advances at pitchRatio samples per input sample and is windowed
// over a half-buffer period so crossfading hides the wrap discontinuity.
export const pitchShiftWorkletSource = `
class HipsPitchShiftProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    // Pitch shift configuration
    const semitones = options.processorOptions?.semitones ?? 4;
    this.ratio = Math.pow(2, semitones / 12);

    // Ring modulation configuration (Cyber voice)
    this.ringModFreq = options.processorOptions?.ringModFreq ?? 0;
    this.ringModPhase = 0;

    // Dynamic pitch jitter configuration (Security Anti-De-Masking)
    this.phaseLFO = 0;
    this.lfoFreq = 2.5; // 2.5 Hz modulation
    this.lfoDepth = 0.015; // depth of modulation (~0.25 semitones)
    this.sampleRate = 48000; // default, will be overridden in process if needed

    // Circular buffer
    this.SIZE = 8192; // larger buffer for WSOLA search headroom
    this.MASK = this.SIZE - 1;
    this.buf = new Float32Array(this.SIZE);
    this.wp = 0;

    // Grain parameters
    this.L = 2048; // grain size (~42ms at 48kHz)
    this.HALF_L = this.L >> 1;

    // Head parameters: phase (0 to L) and buffer anchor
    this.p1 = 0;
    this.p2 = this.HALF_L; // offset by 180 degrees
    
    // Initial delays
    const minDelay = 64;
    const baseDelay = this.ratio > 1.0 ? minDelay + this.L * (this.ratio - 1.0) : minDelay;
    this.D = Math.ceil(baseDelay + 64); // add safety margin

    this.anchor1 = (this.wp - this.D + this.SIZE) & this.MASK;
    this.anchor2 = (this.wp - this.D - this.HALF_L + this.SIZE) & this.MASK;

    // Noise gate parameters (threshold at -45dB)
    this.gateThresholdDb = -45;
    this.gateThresholdEnv = Math.pow(10, this.gateThresholdDb / 20); // convert to linear envelope
    this.envelope = 0;
    this.gateGain = 0;

    // Smoothing coefficients (assuming 48kHz, updated dynamically)
    const sr = globalThis.sampleRate || 48000;
    this.envReleaseCoef = Math.exp(-1.0 / (sr * 0.05)); // 50ms envelope release
    this.gateAttackCoef = Math.exp(-1.0 / (sr * 0.002)); // 2ms gate attack
    this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150)); // 150ms gate release

    // Listen to real-time parameter changes
    this.port.onmessage = (event) => {
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

  // Linear interpolation for fractional buffer indices
  lerp(pos) {
    const i = (pos | 0) & this.MASK;
    const j = (i + 1) & this.MASK;
    const f = pos - (pos | 0);
    return this.buf[i] + (this.buf[j] - this.buf[i]) * f;
  }

  // Hann window over grain size L
  win(p) {
    return 0.5 - 0.5 * Math.cos((2 * Math.PI * p) / this.L);
  }

  // Waveform Similarity alignment helper
  alignAnchor(targetRp, baseRp) {
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
        const diff = this.buf[idxA] - this.buf[idxB];
        sad += diff < 0 ? -diff : diff;
      }
      if (sad < minSad) {
        minSad = sad;
        bestShift = shift;
      }
    }
    return (baseRp + bestShift + this.SIZE) & this.MASK;
  }

  process(inputs, outputs) {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;

    const sr = globalThis.sampleRate || 48000;
    if (this.sampleRate !== sr) {
      this.sampleRate = sr;
      this.envReleaseCoef = Math.exp(-1.0 / (sr * 0.05));
      this.gateAttackCoef = Math.exp(-1.0 / (sr * 0.002));
      this.gateReleaseCoef = Math.exp(-1.0 / (sr * 0.150));
    }

    for (let i = 0; i < src.length; i++) {
      // 1. Write input to circular buffer
      this.buf[this.wp] = src[i];

      // 2. Envelope tracking (pre-gate)
      const rect = Math.abs(src[i]);
      if (rect > this.envelope) {
        this.envelope = rect;
      } else {
        this.envelope = this.envelope * this.envReleaseCoef + rect * (1.0 - this.envReleaseCoef);
      }

      // 3. Gate gain smoothing
      const targetGate = (this.envelope > this.gateThresholdEnv) ? 1.0 : 0.0;
      if (this.gateGain < targetGate) {
        this.gateGain = this.gateGain * this.gateAttackCoef + targetGate * (1.0 - this.gateAttackCoef);
      } else {
        this.gateGain = this.gateGain * this.gateReleaseCoef + targetGate * (1.0 - this.gateReleaseCoef);
      }

      // 4. Determine ratio with LFO jitter
      let currentRatio = this.ratio;
      if (this.ratio !== 1.0 && this.lfoDepth > 0) {
        this.phaseLFO += this.lfoFreq / this.sampleRate;
        if (this.phaseLFO >= 1.0) this.phaseLFO -= 1.0;
        currentRatio = this.ratio * (1.0 + Math.sin(2.0 * Math.PI * this.phaseLFO) * this.lfoDepth);
      }

      // 5. Calculate read positions
      const rp1 = this.anchor1 + this.p1 * currentRatio;
      const rp2 = this.anchor2 + this.p2 * currentRatio;

      // 6. Overlap-add output sample
      let outSample = this.lerp(rp1) * this.win(this.p1)
                      + this.lerp(rp2) * this.win(this.p2);

      // 6.5 Apply Ring Modulation if enabled
      if (this.ringModFreq > 0) {
        const carrier = Math.sin(2.0 * Math.PI * this.ringModPhase);
        this.ringModPhase += this.ringModFreq / this.sampleRate;
        if (this.ringModPhase >= 1.0) this.ringModPhase -= 1.0;
        outSample = outSample * 0.45 + (outSample * carrier) * 0.55;
      }

      // 7. Apply noise gate and low-level anti-biometric dither (noise level of 0.0003 corresponds to ~-70dBFS)
      const noise = (Math.random() * 2.0 - 1.0) * 0.0003 * Math.max(0.1, this.gateGain);
      dst[i] = outSample * this.gateGain + noise;

      // 8. Advance grain phases
      this.p1 += 1;
      this.p2 += 1;

      // 9. Grain resets and WSOLA phase alignment
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
`;

// Programmatic reverb impulse response — decaying white noise, no external file needed.
function buildReverbIR(ctx: AudioContext, durationSec: number, decay: number): AudioBuffer {
  try {
    const len = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return ir;
  } catch (err) {
    console.error('[VoiceMaskProcessor] buildReverbIR failed:', err);
    return ctx.createBuffer(1, 1, ctx.sampleRate);
  }
}

// Per-session semitone shift — randomised once, persisted in sessionStorage.
function getSessionSemitones(): number {
  const key = 'hips-pitch-semitones';
  const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
  if (stored) {
    const n = Number(stored);
    if (!isNaN(n)) return n;
  }
  const options = [-5, -4, -3, 3, 4, 5] as const;
  const pick = options[Math.floor(Math.random() * options.length)] ?? 4;
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, String(pick));
  return pick;
}

// Single shared blob URL — AudioWorklet registers globally by name so concurrent
// addModule() calls are safe regardless of which processor instance initiated first.
const SHARED_WORKLET_URL = (() => {
  const blob = new Blob([pitchShiftWorkletSource], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
})();

// Separate blob URL for the low-latency OLA processor (hips-pitch-shift-ola).
const LOW_LATENCY_WORKLET_URL = (() => {
  const blob = new Blob([lowLatencyPitchShiftWorkletSource], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
})();

const workletLoadingPromises = new WeakMap<AudioContext, Promise<void>>();
const lowLatencyWorkletLoadingPromises = new WeakMap<AudioContext, Promise<void>>();

export function createVoiceMaskProcessor(
  options: VoiceMaskProcessorOptions,
): TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  let source: MediaStreamAudioSourceNode | undefined;
  let preEmphasis: BiquadFilterNode | undefined;
  let highpass: BiquadFilterNode | undefined;
  let lowpass: BiquadFilterNode | undefined;
  let compressor: DynamicsCompressorNode | undefined;
  let pitchShift: AudioWorkletNode | undefined;
  let convolver: ConvolverNode | undefined;
  let dryGain: GainNode | undefined;
  let wetGain: GainNode | undefined;
  let destination: MediaStreamAudioDestinationNode | undefined;
  // Echo / delay chain nodes
  let echoDelay1: DelayNode | undefined;
  let echoDelay2: DelayNode | undefined;
  let echoFeedback: GainNode | undefined;
  let echoWet: GainNode | undefined;
  // Formant compensation nodes
  let formantLow: BiquadFilterNode | undefined;
  let formantMid: BiquadFilterNode | undefined;
  let formantHigh: BiquadFilterNode | undefined;
  let formantVeryHigh: BiquadFilterNode | undefined;

  const destroy = async () => {
    [
      source, preEmphasis, highpass, lowpass, compressor, pitchShift,
      convolver, dryGain, wetGain,
      echoDelay1, echoDelay2, echoFeedback, echoWet,
      formantLow, formantMid, formantHigh, formantVeryHigh,
    ].forEach((n) => n?.disconnect());
    destination?.stream.getTracks().forEach((t) => t.stop());
    destination?.disconnect();
    source = preEmphasis = highpass = lowpass = compressor = pitchShift =
      convolver = dryGain = wetGain =
      echoDelay1 = echoDelay2 = echoFeedback = echoWet =
      formantLow = formantMid = formantHigh = formantVeryHigh =
      destination = undefined;
  };

  const processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> = {
    name: 'hips-voice-anonymiser',

    async init(opts) {
      if (!opts.audioContext.audioWorklet) {
        throw new Error('AudioWorklet is not supported in this browser.');
      }

      await destroy();

      const semitones = options.semitones ?? getSessionSemitones();
      const isEcho = options.preset === 'echo';
      const isCave = options.preset === 'cave';
      const isCyber = options.preset === 'cyber';
      const isPitch = !isEcho && !isCave;

      // Load pitch-shift worklet only for pitch-based presets.
      let workletLoaded = false;
      if (isPitch) {
        let loadPromise = workletLoadingPromises.get(opts.audioContext);
        if (!loadPromise) {
          loadPromise = opts.audioContext.audioWorklet.addModule(SHARED_WORKLET_URL).catch((err) => {
            workletLoadingPromises.delete(opts.audioContext);
            throw err;
          });
          workletLoadingPromises.set(opts.audioContext, loadPromise);
        }
        try {
          await loadPromise;
          workletLoaded = true;
        } catch (err) {
          console.warn('[VoiceMaskProcessor] Worklet load failed — pitch shift unavailable:', err);
          document.dispatchEvent(new CustomEvent('voice-mask-unavailable', {
            detail: { message: err instanceof Error ? err.message : String(err) },
          }));
        }
      }

      // MediaStream capture
      try {
        const inputStream = new MediaStream([opts.track]);
        source = opts.audioContext.createMediaStreamSource(inputStream);
      } catch (err) {
        console.error('[VoiceMaskProcessor] Failed to create MediaStreamSource:', err);
        throw new Error('Failed to capture audio source for anonymisation.');
      }

      // Core filter chain
      highpass  = opts.audioContext.createBiquadFilter();
      lowpass   = opts.audioContext.createBiquadFilter();
      compressor = opts.audioContext.createDynamicsCompressor();

      highpass.type = 'highpass';
      highpass.frequency.value = 90;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 7000;

      // Pre-emphasis clarity boost for down-pitched voices
      preEmphasis = opts.audioContext.createBiquadFilter();
      preEmphasis.type = 'highshelf';
      preEmphasis.frequency.value = 3500;
      preEmphasis.gain.value = semitones < 0 ? 4.0 : 0.0;

      compressor.threshold.value = -22;
      compressor.knee.value      = 20;
      compressor.ratio.value     = 2.8;
      compressor.attack.value    = 0.003;
      compressor.release.value   = 0.22;

      // Pitch-shift worklet (sofi / guardian / lark / cyber)
      if (workletLoaded) {
        try {
          pitchShift = new AudioWorkletNode(opts.audioContext, 'hips-pitch-shift', {
            processorOptions: {
              semitones,
              ringModFreq: isCyber ? 75 : 0
            },
          });
        } catch (nodeError) {
          console.error('[VoiceMaskProcessor] Failed to instantiate AudioWorkletNode:', nodeError);
        }
      }

      // Formant compensation filters — applied after pitch shift to restore naturalness.
      formantLow      = opts.audioContext.createBiquadFilter();
      formantMid      = opts.audioContext.createBiquadFilter();
      formantHigh     = opts.audioContext.createBiquadFilter();
      formantVeryHigh = opts.audioContext.createBiquadFilter();

      // Vocal tract length simulation scaling
      const formantScale = Math.pow(2, (semitones * 0.6) / 12);

      formantLow.type      = 'peaking'; formantLow.frequency.value      = Math.min(2000, Math.max(100, 600 * formantScale));  formantLow.Q.value      = 1.2;
      formantMid.type      = 'peaking'; formantMid.frequency.value      = Math.min(4000, Math.max(300, 1400 * formantScale)); formantMid.Q.value      = 1.2;
      formantHigh.type     = 'peaking'; formantHigh.frequency.value     = Math.min(6000, Math.max(800, 2400 * formantScale)); formantHigh.Q.value     = 1.2;
      formantVeryHigh.type = 'peaking'; formantVeryHigh.frequency.value = Math.min(10000, Math.max(1500, 3400 * formantScale)); formantVeryHigh.Q.value = 1.2;

      if (semitones < 0) {
        // Deeper register (pitched down) -> cut muddiness, boost higher resonances to preserve brightness and articulation
        formantLow.gain.value      = -3.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = 4.0;
        formantVeryHigh.gain.value = 6.0;
      } else if (semitones > 0) {
        // Raised register (pitched up) -> boost body/warmth, cut harshness and squeaky frequencies
        formantLow.gain.value      = 4.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = -3.0;
        formantVeryHigh.gain.value = -5.0;
      } else {
        // Flat (unshifted) -> completely transparent peaking filters
        formantLow.gain.value      = 0.0;
        formantMid.gain.value      = 0.0;
        formantHigh.gain.value     = 0.0;
        formantVeryHigh.gain.value = 0.0;
      }

      // Reverb + dry/wet (all presets except echo)
      convolver = opts.audioContext.createConvolver();
      dryGain   = opts.audioContext.createGain();
      wetGain   = opts.audioContext.createGain();
      destination = opts.audioContext.createMediaStreamDestination();

      let dryLevel = 0.78;
      let wetLevel = 0.22;
      let reverbDuration = 0.75;
      let reverbDecay = 2.8;

      if (isCave) {
        // Cave: long hall reverb — 4s IR, very slow decay.
        // No pitch manipulation. Dry dominates so speech clarity is preserved.
        reverbDuration = 4.0;
        reverbDecay = 0.4;
        dryLevel = 0.85;
        wetLevel = 0.15;
      } else if (isEcho) {
        // Echo: two delay lines in series with feedback for slapback echo.
        // No pitch shift, no reverb — the echo itself is the anonymizer.
        // Timing disruption breaks rhythm and cadence cues.
        echoDelay1 = opts.audioContext.createDelay(2.0);
        echoDelay2 = opts.audioContext.createDelay(2.0);
        echoFeedback = opts.audioContext.createGain();
        echoWet = opts.audioContext.createGain();
        echoDelay1.delayTime.value = 0.28;  // 280ms — distinct first echo
        echoDelay2.delayTime.value = 0.47;   // 470ms — second echo
        echoFeedback.gain.value = 0.35;       // feedback decay
        echoWet.gain.value = 0.4;            // echo mix level
      } else if (options.preset === 'guardian') {
        dryLevel = 0.8;
        wetLevel = 0.2;
        lowpass.frequency.value = 5000;
      } else if (options.preset === 'lark') {
        dryLevel = 0.85;
        wetLevel = 0.15;
        highpass.frequency.value = 150;
      } else if (isCyber) {
        dryLevel = 0.85;
        wetLevel = 0.15;
        lowpass.frequency.value = 6000;
      }
      // sofi uses the defaults (0.78 / 0.22)

      // Build the impulse response
      try {
        convolver.buffer = buildReverbIR(opts.audioContext, reverbDuration, reverbDecay);
      } catch (err) {
        console.warn('[VoiceMaskProcessor] Failed to set convolver buffer:', err);
        convolver.buffer = opts.audioContext.createBuffer(1, 1, opts.audioContext.sampleRate);
      }

      dryGain.gain.value = dryLevel;
      wetGain.gain.value = wetLevel;

      // ── Audio routing ──────────────────────────────────────────────────────
      //
      //  sofi / guardian / lark:
      //    source → highpass → [pitchShift] → formantLow → formantMid → formantHigh
      //             → lowpass → compressor → dryGain → destination
      //                                   └→ convolver → wetGain → destination
      //
      //  cave (reverb-only):
      //    source → highpass → lowpass → compressor → dryGain → destination
      //                                   └→ convolver → wetGain → destination
      //
      //  echo (timing disruption):
      //    source → highpass → lowpass → compressor → dryGain → destination
      //                                   └→ echoDelay1 → echoFeedback
      //                                       └→ echoDelay2 → echoFeedback
      //                                           └→ echoWet → destination
      //
      // ─────────────────────────────────────────────────────────────────────

      source.connect(preEmphasis);
      preEmphasis.connect(highpass);

      if (pitchShift) {
        highpass.connect(pitchShift);
        // Formant compensation chain after pitch shift
        pitchShift.connect(formantLow);
        formantLow.connect(formantMid);
        formantMid.connect(formantHigh);
        formantHigh.connect(formantVeryHigh);
        formantVeryHigh.connect(lowpass);
      } else {
        highpass.connect(lowpass);
      }

      lowpass.connect(compressor);

      if (isEcho && echoDelay1 && echoDelay2 && echoFeedback && echoWet) {
        compressor.connect(echoDelay1);
        echoDelay1.connect(echoFeedback);
        echoFeedback.connect(echoDelay2);
        echoDelay2.connect(echoFeedback);
        echoDelay1.connect(echoWet);
        echoDelay2.connect(echoWet);
        echoWet.connect(destination);
        compressor.connect(dryGain);
        dryGain.connect(destination);
      } else {
        // All other presets: compressor splits to dry and reverb return
        compressor.connect(dryGain);
        compressor.connect(convolver);
        dryGain.connect(destination);
        convolver.connect(wetGain);
        wetGain.connect(destination);
      }

      const processedTrack = destination.stream.getAudioTracks()[0];
      if (!processedTrack) throw new Error('Voice anonymiser produced no audio track.');
      processor.processedTrack = processedTrack;
    },

    async restart(opts) {
      await this.init(opts);
    },

    destroy,
  };

  return processor;
}

// ─── Low-Latency Voice Mask Processor ────────────────────────────────────────
// Uses 'hips-pitch-shift-ola' (L=512, ~16ms total) instead of the standard
// 'hips-pitch-shift' (L=2048, ~42ms). For Effects Mode < 20ms budget.

export function createLowLatencyVoiceMaskProcessor(
  options: VoiceMaskProcessorOptions,
): TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  let source: MediaStreamAudioSourceNode | undefined;
  let preEmphasis: BiquadFilterNode | undefined;
  let highpass: BiquadFilterNode | undefined;
  let lowpass: BiquadFilterNode | undefined;
  let compressor: DynamicsCompressorNode | undefined;
  let pitchShift: AudioWorkletNode | undefined;
  let convolver: ConvolverNode | undefined;
  let dryGain: GainNode | undefined;
  let wetGain: GainNode | undefined;
  let destination: MediaStreamAudioDestinationNode | undefined;
  let echoDelay1: DelayNode | undefined;
  let echoDelay2: DelayNode | undefined;
  let echoFeedback: GainNode | undefined;
  let echoWet: GainNode | undefined;
  let formantLow: BiquadFilterNode | undefined;
  let formantMid: BiquadFilterNode | undefined;
  let formantHigh: BiquadFilterNode | undefined;
  let formantVeryHigh: BiquadFilterNode | undefined;

  const destroy = async () => {
    [
      source, preEmphasis, highpass, lowpass, compressor, pitchShift,
      convolver, dryGain, wetGain,
      echoDelay1, echoDelay2, echoFeedback, echoWet,
      formantLow, formantMid, formantHigh, formantVeryHigh,
    ].forEach((n) => n?.disconnect());
    destination?.stream.getTracks().forEach((t) => t.stop());
    destination?.disconnect();
    source = preEmphasis = highpass = lowpass = compressor = pitchShift =
      convolver = dryGain = wetGain =
      echoDelay1 = echoDelay2 = echoFeedback = echoWet =
      formantLow = formantMid = formantHigh = formantVeryHigh =
      destination = undefined;
  };

  const processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> = {
    name: 'hips-voice-anonymiser-lowlatency',

    async init(opts) {
      if (!opts.audioContext.audioWorklet) {
        throw new Error('AudioWorklet is not supported in this browser.');
      }

      await destroy();

      const semitones    = options.semitones ?? getSessionSemitones();
      const wetDryRatio  = options.wetDryRatio ?? 0.22;
      const isEcho       = options.preset === 'echo';
      const isCave       = options.preset === 'cave';
      const isCyber      = options.preset === 'cyber';
      const isPitch      = !isEcho && !isCave;

      // Load low-latency pitch-shift worklet for pitch-based presets.
      let workletLoaded = false;
      if (isPitch) {
        let loadPromise = lowLatencyWorkletLoadingPromises.get(opts.audioContext);
        if (!loadPromise) {
          loadPromise = opts.audioContext.audioWorklet.addModule(LOW_LATENCY_WORKLET_URL).catch((err) => {
            lowLatencyWorkletLoadingPromises.delete(opts.audioContext);
            throw err;
          });
          lowLatencyWorkletLoadingPromises.set(opts.audioContext, loadPromise);
        }
        try {
          await loadPromise;
          workletLoaded = true;
        } catch (err) {
          console.warn('[LowLatencyVoiceMaskProcessor] Worklet load failed:', err);
          document.dispatchEvent(new CustomEvent('voice-mask-unavailable', {
            detail: { message: err instanceof Error ? err.message : String(err) },
          }));
        }
      }

      // MediaStream capture
      try {
        const inputStream = new MediaStream([opts.track]);
        source = opts.audioContext.createMediaStreamSource(inputStream);
      } catch (err) {
        console.error('[LowLatencyVoiceMaskProcessor] Failed to create MediaStreamSource:', err);
        throw new Error('Failed to capture audio source for anonymisation.');
      }

      // Core filter chain
      highpass   = opts.audioContext.createBiquadFilter();
      lowpass    = opts.audioContext.createBiquadFilter();
      compressor = opts.audioContext.createDynamicsCompressor();

      highpass.type = 'highpass';
      highpass.frequency.value = 90;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 7000;

      preEmphasis = opts.audioContext.createBiquadFilter();
      preEmphasis.type = 'highshelf';
      preEmphasis.frequency.value = 3500;
      preEmphasis.gain.value = semitones < 0 ? 4.0 : 0.0;

      compressor.threshold.value = -22;
      compressor.knee.value      = 20;
      compressor.ratio.value     = 2.8;
      compressor.attack.value    = 0.003;
      compressor.release.value    = 0.22;

      // Low-latency pitch-shift worklet (hips-pitch-shift-ola)
      if (workletLoaded) {
        try {
          pitchShift = new AudioWorkletNode(opts.audioContext, 'hips-pitch-shift-ola', {
            processorOptions: {
              semitones,
              ringModFreq: isCyber ? 75 : 0,
            },
          });
        } catch (nodeError) {
          console.error('[LowLatencyVoiceMaskProcessor] Failed to instantiate AudioWorkletNode:', nodeError);
        }
      }

      // Formant compensation filters
      formantLow      = opts.audioContext.createBiquadFilter();
      formantMid      = opts.audioContext.createBiquadFilter();
      formantHigh     = opts.audioContext.createBiquadFilter();
      formantVeryHigh = opts.audioContext.createBiquadFilter();

      const formantScale = Math.pow(2, (semitones * 0.6) / 12);

      formantLow.type      = 'peaking'; formantLow.frequency.value      = Math.min(2000, Math.max(100, 600 * formantScale));  formantLow.Q.value      = 1.2;
      formantMid.type      = 'peaking'; formantMid.frequency.value      = Math.min(4000, Math.max(300, 1400 * formantScale)); formantMid.Q.value      = 1.2;
      formantHigh.type     = 'peaking'; formantHigh.frequency.value     = Math.min(6000, Math.max(800, 2400 * formantScale)); formantHigh.Q.value     = 1.2;
      formantVeryHigh.type = 'peaking'; formantVeryHigh.frequency.value = Math.min(10000, Math.max(1500, 3400 * formantScale)); formantVeryHigh.Q.value = 1.2;

      if (semitones < 0) {
        formantLow.gain.value      = -3.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = 4.0;
        formantVeryHigh.gain.value = 6.0;
      } else if (semitones > 0) {
        formantLow.gain.value      = 4.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = -3.0;
        formantVeryHigh.gain.value = -5.0;
      } else {
        formantLow.gain.value      = 0.0;
        formantMid.gain.value      = 0.0;
        formantHigh.gain.value     = 0.0;
        formantVeryHigh.gain.value = 0.0;
      }

      // Reverb + dry/wet (all presets except echo)
      convolver  = opts.audioContext.createConvolver();
      dryGain    = opts.audioContext.createGain();
      wetGain    = opts.audioContext.createGain();
      destination = opts.audioContext.createMediaStreamDestination();

      // wetDryRatio controls the wet/dry split (0.0 = all dry, 1.0 = all wet)
      dryGain.gain.value = 1.0 - wetDryRatio;
      wetGain.gain.value = wetDryRatio;

      let reverbDuration = 0.75;
      let reverbDecay    = 2.8;

      if (isCave) {
        reverbDuration = 4.0;
        reverbDecay    = 0.4;
      } else if (isEcho) {
        echoDelay1    = opts.audioContext.createDelay(2.0);
        echoDelay2    = opts.audioContext.createDelay(2.0);
        echoFeedback  = opts.audioContext.createGain();
        echoWet       = opts.audioContext.createGain();
        echoDelay1.delayTime.value = 0.28;
        echoDelay2.delayTime.value = 0.47;
        echoFeedback.gain.value    = 0.35;
        echoWet.gain.value         = 0.4;
      } else if (options.preset === 'guardian') {
        lowpass.frequency.value = 5000;
      } else if (options.preset === 'lark') {
        highpass.frequency.value = 150;
      } else if (isCyber) {
        lowpass.frequency.value = 6000;
      }

      // Build reverb impulse response
      try {
        convolver.buffer = buildReverbIR(opts.audioContext, reverbDuration, reverbDecay);
      } catch (err) {
        console.warn('[LowLatencyVoiceMaskProcessor] Failed to set convolver buffer:', err);
        convolver.buffer = opts.audioContext.createBuffer(1, 1, opts.audioContext.sampleRate);
      }

      // ── Audio routing (same structure as createVoiceMaskProcessor) ────────
      //
      //  sofi / guardian / lark:
      //    source → preEmphasis → highpass → [pitchShift] → formantLow → formantMid
      //      → formantHigh → formantVeryHigh → lowpass → compressor → dryGain → destination
      //                                               └→ convolver → wetGain → destination
      //
      //  cave (reverb-only):
      //    source → preEmphasis → highpass → lowpass → compressor → dryGain → destination
      //                                                    └→ convolver → wetGain → destination
      //
      //  echo (timing disruption):
      //    source → preEmphasis → highpass → lowpass → compressor → dryGain → destination
      //                                                    └→ echoDelay1 → echoFeedback
      //                                                        └→ echoDelay2 → echoFeedback
      //                                                            └→ echoWet → destination
      // ─────────────────────────────────────────────────────────────────────

      source.connect(preEmphasis);
      preEmphasis.connect(highpass);

      if (pitchShift) {
        highpass.connect(pitchShift);
        pitchShift.connect(formantLow);
        formantLow.connect(formantMid);
        formantMid.connect(formantHigh);
        formantHigh.connect(formantVeryHigh);
        formantVeryHigh.connect(lowpass);
      } else {
        highpass.connect(lowpass);
      }

      lowpass.connect(compressor);

      if (isEcho && echoDelay1 && echoDelay2 && echoFeedback && echoWet) {
        compressor.connect(echoDelay1);
        echoDelay1.connect(echoFeedback);
        echoFeedback.connect(echoDelay2);
        echoDelay2.connect(echoFeedback);
        echoDelay1.connect(echoWet);
        echoDelay2.connect(echoWet);
        echoWet.connect(destination);
        compressor.connect(dryGain);
        dryGain.connect(destination);
      } else {
        compressor.connect(dryGain);
        compressor.connect(convolver);
        dryGain.connect(destination);
        convolver.connect(wetGain);
        wetGain.connect(destination);
      }

      const processedTrack = destination.stream.getAudioTracks()[0];
      if (!processedTrack) throw new Error('Low-latency voice anonymiser produced no audio track.');
      processor.processedTrack = processedTrack;
    },

    async restart(opts) {
      await this.init(opts);
    },

    destroy,
  };

  return processor;
}
