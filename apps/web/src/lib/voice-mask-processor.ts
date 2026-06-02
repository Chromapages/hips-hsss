import type { AudioProcessorOptions, TrackProcessor } from 'livekit-client';
import { Track } from 'livekit-client';
import type { VoicePreset } from './voice-mask-presets';

type VoiceMaskProcessorOptions = {
  preset: VoicePreset;
  semitones?: number;
};

// Two-head granular pitch shifter using overlap-add with Hanning windows.
// Each read head advances at pitchRatio samples per input sample and is windowed
// over a half-buffer period so crossfading hides the wrap discontinuity.
const pitchShiftWorkletSource = `
class HipsPitchShiftProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const semitones = options.processorOptions?.semitones ?? 4;
    this.ratio = Math.pow(2, semitones / 12);
    // Buffer must be power-of-2 for fast modulo via bitwise AND
    this.SIZE = 8192;
    this.MASK = this.SIZE - 1;
    this.HALF = this.SIZE >> 1;
    this.buf = new Float32Array(this.SIZE);
    this.wp  = this.HALF * 2;   // write pointer starts after both heads
    this.rp1 = 0;
    this.rp2 = this.HALF;       // second head offset by half buffer
  }

  lerp(pos) {
    const i = (pos | 0) & this.MASK;
    const j = (i + 1) & this.MASK;
    const f = pos - (pos | 0);
    return this.buf[i] + (this.buf[j] - this.buf[i]) * f;
  }

  // Hanning window — period = HALF, so heads fade in/out over half the buffer
  win(rp) {
    const phase = ((rp % this.HALF) + this.HALF) % this.HALF;
    return 0.5 - 0.5 * Math.cos(6.2831853 * phase / this.HALF);
  }

  resetIfNeeded(rp) {
    const delay = (this.wp - rp + this.SIZE * 8) % this.SIZE;
    if (delay < 64 || delay > this.SIZE - 64) {
      return this.wp - this.HALF;
    }
    return rp;
  }

  process(inputs, outputs) {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;

    for (let i = 0; i < src.length; i++) {
      this.buf[this.wp & this.MASK] = src[i];
      this.wp++;

      dst[i] = this.lerp(this.rp1) * this.win(this.rp1)
             + this.lerp(this.rp2) * this.win(this.rp2);

      this.rp1 += this.ratio;
      this.rp2 += this.ratio;

      this.rp1 = this.resetIfNeeded(this.rp1);
      this.rp2 = this.resetIfNeeded(this.rp2 + this.HALF) - this.HALF;
    }
    return true;
  }
}
registerProcessor('hips-pitch-shift', HipsPitchShiftProcessor);
`;

function createWorkletUrl(source: string) {
  const blob = new Blob([source], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
}

// Programmatic reverb impulse response — decaying white noise, no external file needed
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
    try {
      return ctx.createBuffer(1, 1, ctx.sampleRate);
    } catch {
      throw err;
    }
  }
}

// Per-session semitone shift — randomised once, persisted in sessionStorage
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

const workletLoadingPromises = new WeakMap<AudioContext, Promise<void>>();

export function createVoiceMaskProcessor(
  options: VoiceMaskProcessorOptions,
): TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  let source: MediaStreamAudioSourceNode | undefined;
  let highpass: BiquadFilterNode | undefined;
  let lowpass: BiquadFilterNode | undefined;
  let ringmodGain: GainNode | undefined;
  let compressor: DynamicsCompressorNode | undefined;
  let pitchShift: AudioWorkletNode | undefined;
  let convolver: ConvolverNode | undefined;
  let dryGain: GainNode | undefined;
  let wetGain: GainNode | undefined;
  let destination: MediaStreamAudioDestinationNode | undefined;
  let workletUrl: string | undefined;
  let oscillator: OscillatorNode | undefined;

  const destroy = async () => {
    [source, highpass, lowpass, ringmodGain, compressor, pitchShift, convolver, dryGain, wetGain, oscillator].forEach(
      (n) => n?.disconnect(),
    );
    if (oscillator) {
      try {
        oscillator.stop();
      } catch {}
    }
    destination?.stream.getTracks().forEach((t) => t.stop());
    destination?.disconnect();
    if (workletUrl) URL.revokeObjectURL(workletUrl);
    source = highpass = lowpass = ringmodGain = compressor = pitchShift = convolver = dryGain = wetGain = destination = workletUrl = oscillator = undefined;
  };

  const processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> = {
    name: 'hips-voice-anonymiser',

    async init(opts) {
      if (!opts.audioContext.audioWorklet) {
        throw new Error('AudioWorklet is not supported in this browser.');
      }

      await destroy();

      const semitones = options.semitones ?? getSessionSemitones();

      // Concurrency check & deduplication using WeakMap cached Promises.
      // This prevents race condition double-load collisions on rapid settings switches.
      let loadPromise = workletLoadingPromises.get(opts.audioContext);
      if (!loadPromise) {
        workletUrl = createWorkletUrl(pitchShiftWorkletSource);
        loadPromise = opts.audioContext.audioWorklet.addModule(workletUrl).catch((err) => {
          workletLoadingPromises.delete(opts.audioContext);
          throw err;
        });
        workletLoadingPromises.set(opts.audioContext, loadPromise);
      }

      let workletLoaded = false;
      try {
        await loadPromise;
        workletLoaded = true;
      } catch (err) {
        console.warn('[VoiceMaskProcessor] AudioWorklet failed to load. Falling back to bypass mode:', err);
      }

      // Safe MediaStream capture wrapper
      try {
        const inputStream = new MediaStream([opts.track]);
        source = opts.audioContext.createMediaStreamSource(inputStream);
      } catch (err) {
        console.error('[VoiceMaskProcessor] Failed to create MediaStreamAudioSourceNode:', err);
        throw new Error('Failed to capture audio source track for anonymisation.');
      }

      highpass  = opts.audioContext.createBiquadFilter();
      lowpass   = opts.audioContext.createBiquadFilter();
      compressor = opts.audioContext.createDynamicsCompressor();

      // Safe Worklet Node creation
      if (workletLoaded) {
        try {
          pitchShift = new AudioWorkletNode(opts.audioContext, 'hips-pitch-shift', {
            processorOptions: { semitones },
          });
        } catch (nodeError) {
          console.error('[VoiceMaskProcessor] Failed to instantiate AudioWorkletNode, bypassing pitch shift:', nodeError);
        }
      }

      convolver  = opts.audioContext.createConvolver();
      dryGain    = opts.audioContext.createGain();
      wetGain    = opts.audioContext.createGain();
      destination = opts.audioContext.createMediaStreamDestination();

      highpass.type = 'highpass';
      highpass.frequency.value = 90;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 7000;

      compressor.threshold.value = -22;
      compressor.knee.value      = 20;
      compressor.ratio.value     = 2.8;
      compressor.attack.value    = 0.003;
      compressor.release.value   = 0.22;

      // Adjust parameters based on preset
      let dryLevel = 0.78;
      let wetLevel = 0.22;
      let reverbDuration = 0.75;
      let reverbDecay = 2.8;

      if (options.preset === 'robotic') {
        dryLevel = 0.5;
        wetLevel = 0.5;
        reverbDuration = 1.5;
        reverbDecay = 1.2; // long metallic decay
        
        // Instantiate a sawtooth oscillator at 50Hz for ring modulation
        ringmodGain = opts.audioContext.createGain();
        ringmodGain.gain.value = 0.0; // Modulate around 0
        oscillator = opts.audioContext.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 50;
        oscillator.connect(ringmodGain.gain);
        oscillator.start();
      } else if (options.preset === 'deep') {
        dryLevel = 0.8;
        wetLevel = 0.2;
        lowpass.frequency.value = 5000; // roll off more highs
      } else if (options.preset === 'high') {
        dryLevel = 0.85;
        wetLevel = 0.15;
        highpass.frequency.value = 150; // roll off more lows
      }

      // Safe impulse response builder wrapper
      try {
        convolver.buffer = buildReverbIR(opts.audioContext, reverbDuration, reverbDecay);
      } catch (err) {
        console.warn('[VoiceMaskProcessor] Failed to set convolver buffer, skipping reverb:', err);
        try {
          convolver.buffer = opts.audioContext.createBuffer(1, 1, opts.audioContext.sampleRate);
        } catch {}
      }

      dryGain.gain.value = dryLevel;
      wetGain.gain.value = wetLevel;

      // Chain: source → highpass → [pitchShift] → lowpass → [ringmod] → compressor → dry → destination
      //                                                                          └→ reverb → wet → destination
      source.connect(highpass);
      
      if (pitchShift) {
        highpass.connect(pitchShift);
        pitchShift.connect(lowpass);
      } else {
        highpass.connect(lowpass);
      }

      if (ringmodGain) {
        lowpass.connect(ringmodGain);
        ringmodGain.connect(compressor);
      } else {
        lowpass.connect(compressor);
      }
      
      compressor.connect(dryGain);
      compressor.connect(convolver);
      dryGain.connect(destination);
      convolver.connect(wetGain);
      wetGain.connect(destination);

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
