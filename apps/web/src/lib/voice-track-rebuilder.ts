export type VoiceTrackRebuilder = {
  track: MediaStreamTrack;
  stream: MediaStream;
  enqueuePcm16: (frame: ArrayBuffer) => void;
  stop: () => void;
};

export function createVoiceTrackRebuilder(sampleRate: number): VoiceTrackRebuilder {
  const AudioCtx = getAudioContextCtor();
  const audioContext = new AudioCtx({ sampleRate });
  const destination = audioContext.createMediaStreamDestination();
  const processor = audioContext.createScriptProcessor(2048, 0, 1);
  const queue: Float32Array[] = [];
  let current: Float32Array | null = null;
  let currentOffset = 0;

  processor.onaudioprocess = (event) => {
    const output = event.outputBuffer.getChannelData(0);
    let written = 0;

    while (written < output.length) {
      if (!current || currentOffset >= current.length) {
        current = queue.shift() ?? null;
        currentOffset = 0;
      }

      if (!current) {
        output.fill(0, written);
        break;
      }

      const copyCount = Math.min(output.length - written, current.length - currentOffset);
      output.set(current.subarray(currentOffset, currentOffset + copyCount), written);
      currentOffset += copyCount;
      written += copyCount;
    }
  };

  processor.connect(destination);

  const track = destination.stream.getAudioTracks()[0];
  if (!track) {
    throw new Error('Voice track rebuilder could not create an output audio track.');
  }

  return {
    track,
    stream: destination.stream,
    enqueuePcm16(frame) {
      queue.push(pcm16ToFloat32(frame));
    },
    stop() {
      processor.disconnect();
      track.stop();
      void audioContext.close();
    },
  };
}

function pcm16ToFloat32(frame: ArrayBuffer): Float32Array {
  const source = new Int16Array(frame);
  const output = new Float32Array(source.length);
  for (let i = 0; i < source.length; i += 1) {
    output[i] = (source[i] ?? 0) / 32768;
  }
  return output;
}

function getAudioContextCtor(): typeof AudioContext {
  return window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
    AudioContext;
}
