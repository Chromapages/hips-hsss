import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { CPU_DSP_RUNTIME, VoiceMasker, buildVoiceMaskerConfig } from "../../../services/voice-worker/src/dsp.ts";
import { DEFAULT_CHUNK_MS, DEFAULT_SAMPLE_RATE } from "../../../services/voice-worker/src/protocol.ts";
import { detectSpeech, int16Rms, silenceLike } from "../../../services/voice-worker/src/vad.ts";

type FrameMetric = {
  index: number;
  speech: boolean;
  processingMs: number;
  inputRms: number;
  outputRms: number;
  transformDelta: number;
};

const sampleRate = Number(process.env.VOICE_EVAL_SAMPLE_RATE ?? DEFAULT_SAMPLE_RATE);
const chunkMs = Number(process.env.VOICE_EVAL_CHUNK_MS ?? DEFAULT_CHUNK_MS);
const durationSeconds = Number(process.env.VOICE_EVAL_DURATION_SECONDS ?? 6);
const runId = process.env.VOICE_EVAL_RUN_ID ?? `dsp-smoke-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const repoRoot = process.cwd();
const runDir = join(repoRoot, "tools", "voice-eval", "runs", runId);

async function main() {
  const maskerConfig = buildVoiceMaskerConfig();
  const masker = new VoiceMasker(sampleRate, maskerConfig, `voice-eval:${runId}`);
  const frames = chunkSyntheticFixture(generateSyntheticFixture(sampleRate, durationSeconds), sampleRate, chunkMs);
  const frameMetrics: FrameMetric[] = [];

  let framesReceived = 0;
  let framesReturned = 0;
  let speechFrames = 0;
  let silenceFrames = 0;
  let processingMsTotal = 0;

  for (let index = 0; index < frames.length; index += 1) {
    const frame = frames[index]!;
    const startedAt = performance.now();
    const vad = detectSpeech(frame, 0.012);
    const output = vad.speech ? masker.process(frame, vad) : silenceLike(frame);
    const processingMs = performance.now() - startedAt;
    const outputFrame = new Int16Array(output.buffer, output.byteOffset, frame.length);
    const outputRms = int16Rms(outputFrame);
    const transformDelta = meanAbsDelta(frame, outputFrame);

    framesReceived += 1;
    framesReturned += 1;
    processingMsTotal += processingMs;
    if (vad.speech) speechFrames += 1;
    else silenceFrames += 1;

    frameMetrics.push({
      index,
      speech: vad.speech,
      processingMs,
      inputRms: vad.rms,
      outputRms,
      transformDelta,
    });
  }

  const audioMs = framesReceived * chunkMs;
  const latencyValues = frameMetrics.map((metric) => metric.processingMs);
  const speechMetrics = frameMetrics.filter((metric) => metric.speech);

  const manifest = {
    name: "synthetic-dsp-smoke",
    runId,
    generatedAt: new Date().toISOString(),
    source: "synthetic-fixture",
    note: "No participant, user, or recorded speech audio is used by this smoke run.",
    sampleRate,
    chunkMs,
    durationSeconds,
    frames: framesReceived,
  };

  const system = {
    id: "current-voice-worker-cpu-dsp",
    runtime: maskerConfig.enabled ? CPU_DSP_RUNTIME : "transport-passthrough-vad",
    maskerConfig,
  };

  const metrics = {
    eer: {
      lazyInformed: null,
      semiInformed: null,
      adapted: null,
    },
    wer: null,
    uar: null,
    mos: null,
    rtf: audioMs > 0 ? processingMsTotal / audioMs : null,
    framesReceived,
    framesReturned,
    speechFrames,
    silenceFrames,
    inputRmsAvg: average(frameMetrics.map((metric) => metric.inputRms)),
    outputRmsAvg: average(frameMetrics.map((metric) => metric.outputRms)),
    speechTransformDeltaAvg: average(speechMetrics.map((metric) => metric.transformDelta)),
    transformDeltaAvg: average(frameMetrics.map((metric) => metric.transformDelta)),
  };

  const latency = {
    processingMs: {
      min: min(latencyValues),
      p50: percentile(latencyValues, 0.5),
      p95: percentile(latencyValues, 0.95),
      p99: percentile(latencyValues, 0.99),
      max: max(latencyValues),
      total: processingMsTotal,
    },
    chunkMs,
    audioMs,
  };

  const notes = [
    "# DSP Smoke Evaluation",
    "",
    "This run is a transport/model smoke test for the current CPU DSP worker logic.",
    "It does not measure biometric anonymization strength. EER, WER, UAR, and MOS remain null until ASV/ASR/SER adapters are added.",
    "",
    "## Summary",
    "",
    `- Runtime: ${system.runtime}`,
    `- Frames: ${framesReceived}`,
    `- Speech frames: ${speechFrames}`,
    `- Silence frames: ${silenceFrames}`,
    `- RTF: ${formatNullable(metrics.rtf)}`,
    `- p95 processing: ${formatNullable(latency.processingMs.p95)} ms`,
    `- Speech transform delta avg: ${formatNullable(metrics.speechTransformDeltaAvg)}`,
    "",
  ].join("\n");

  await mkdir(runDir, { recursive: true });
  await writeJson("manifest.json", manifest);
  await writeJson("system.json", system);
  await writeJson("metrics.json", metrics);
  await writeJson("latency.json", latency);
  await writeFile(join(runDir, "notes.md"), notes, "utf8");

  console.log(`Voice DSP smoke run written to ${runDir}`);
  console.log(JSON.stringify({ runId, metrics, latency }, null, 2));
}

function generateSyntheticFixture(rate: number, seconds: number): Int16Array {
  const length = Math.floor(rate * seconds);
  const output = new Int16Array(length);

  for (let i = 0; i < length; i += 1) {
    const time = i / rate;
    const inSpeechSegment = (time >= 0.35 && time < 2.2) || (time >= 2.75 && time < 4.45) || time >= 5.0;
    if (!inSpeechSegment) {
      output[i] = 0;
      continue;
    }

    const phraseEnvelope = 0.55 + 0.45 * Math.sin(2 * Math.PI * 1.7 * time) ** 2;
    const fundamental = 132 + 18 * Math.sin(2 * Math.PI * 0.65 * time);
    const sample =
      Math.sin(2 * Math.PI * fundamental * time) * 0.42 +
      Math.sin(2 * Math.PI * fundamental * 2.02 * time) * 0.23 +
      Math.sin(2 * Math.PI * fundamental * 3.05 * time) * 0.11 +
      Math.sin(2 * Math.PI * 740 * time) * 0.06 +
      Math.sin(2 * Math.PI * 1380 * time) * 0.035;

    output[i] = floatToInt16(sample * phraseEnvelope * 0.68);
  }

  return output;
}

function chunkSyntheticFixture(input: Int16Array, rate: number, chunkDurationMs: number): Int16Array[] {
  const chunkSize = Math.max(1, Math.floor((rate * chunkDurationMs) / 1000));
  const chunks: Int16Array[] = [];

  for (let offset = 0; offset < input.length; offset += chunkSize) {
    const chunk = new Int16Array(chunkSize);
    chunk.set(input.subarray(offset, Math.min(input.length, offset + chunkSize)));
    chunks.push(chunk);
  }

  return chunks;
}

function meanAbsDelta(input: Int16Array, output: Int16Array): number {
  const length = Math.min(input.length, output.length);
  if (length === 0) return 0;

  let sum = 0;
  for (let i = 0; i < length; i += 1) {
    sum += Math.abs((input[i] ?? 0) - (output[i] ?? 0)) / 32768;
  }
  return sum / length;
}

function floatToInt16(value: number): number {
  const clamped = Math.max(-1, Math.min(1, value));
  return Math.round(clamped < 0 ? clamped * 32768 : clamped * 32767);
}

function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[index] ?? null;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function min(values: number[]): number | null {
  return values.length > 0 ? Math.min(...values) : null;
}

function max(values: number[]): number | null {
  return values.length > 0 ? Math.max(...values) : null;
}

function formatNullable(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "n/a" : value.toFixed(4);
}

async function writeJson(filename: string, value: unknown) {
  await writeFile(join(runDir, filename), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
