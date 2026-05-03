import type { AudioProcessorOptions, TrackProcessor } from 'livekit-client';
import { Track } from 'livekit-client';

type VoiceMaskPreset = 'subtle';

type VoiceMaskProcessorOptions = {
  preset: VoiceMaskPreset;
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
  const len = Math.floor(ctx.sampleRate * durationSec);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return ir;
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

export function createVoiceMaskProcessor(
  options: VoiceMaskProcessorOptions,
): TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  void options;

  let source: MediaStreamAudioSourceNode | undefined;
  let highpass: BiquadFilterNode | undefined;
  let lowpass: BiquadFilterNode | undefined;
  let compressor: DynamicsCompressorNode | undefined;
  let pitchShift: AudioWorkletNode | undefined;
  let convolver: ConvolverNode | undefined;
  let dryGain: GainNode | undefined;
  let wetGain: GainNode | undefined;
  let destination: MediaStreamAudioDestinationNode | undefined;
  let workletUrl: string | undefined;

  const destroy = async () => {
    [source, highpass, lowpass, compressor, pitchShift, convolver, dryGain, wetGain].forEach(
      (n) => n?.disconnect(),
    );
    destination?.stream.getTracks().forEach((t) => t.stop());
    destination?.disconnect();
    if (workletUrl) URL.revokeObjectURL(workletUrl);
    source = highpass = lowpass = compressor = pitchShift = convolver = dryGain = wetGain = destination = workletUrl = undefined;
  };

  const processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> = {
    name: 'hips-voice-anonymiser',

    async init(opts) {
      if (!opts.audioContext.audioWorklet) {
        throw new Error('AudioWorklet is not supported in this browser.');
      }

      await destroy();

      const semitones = options.semitones ?? getSessionSemitones();

      workletUrl = createWorkletUrl(pitchShiftWorkletSource);
      await opts.audioContext.audioWorklet.addModule(workletUrl);

      const inputStream = new MediaStream([opts.track]);
      source    = opts.audioContext.createMediaStreamSource(inputStream);
      highpass  = opts.audioContext.createBiquadFilter();
      lowpass   = opts.audioContext.createBiquadFilter();
      compressor = opts.audioContext.createDynamicsCompressor();
      pitchShift = new AudioWorkletNode(opts.audioContext, 'hips-pitch-shift', {
        processorOptions: { semitones },
      });
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

      convolver.buffer = buildReverbIR(opts.audioContext, 0.75, 2.8);
      dryGain.gain.value = 0.78;
      wetGain.gain.value = 0.22;

      // Chain: source → highpass → pitchShift → lowpass → compressor → dry → destination
      //                                                              └→ reverb → wet → destination
      source.connect(highpass);
      highpass.connect(pitchShift);
      pitchShift.connect(lowpass);
      lowpass.connect(compressor);
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
