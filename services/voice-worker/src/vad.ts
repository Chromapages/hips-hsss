export type VadResult = {
  speech: boolean;
  rms: number;
};

export function int16Rms(frame: Int16Array): number {
  if (frame.length === 0) return 0;

  let sumSquares = 0;
  for (let i = 0; i < frame.length; i += 1) {
    const sample = frame[i] ?? 0;
    const normalized = sample / 32768;
    sumSquares += normalized * normalized;
  }

  return Math.sqrt(sumSquares / frame.length);
}

export function detectSpeech(frame: Int16Array, threshold: number): VadResult {
  const rms = int16Rms(frame);
  return {
    speech: rms >= threshold,
    rms,
  };
}

export function silenceLike(frame: Int16Array): Buffer {
  return Buffer.alloc(frame.length * Int16Array.BYTES_PER_ELEMENT);
}
