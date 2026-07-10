import http from 'node:http';
import { performance } from 'node:perf_hooks';
import { WebSocketServer, type RawData, type WebSocket } from 'ws';
import {
  DEFAULT_CHUNK_MS,
  DEFAULT_SAMPLE_RATE,
  DEFAULT_VAD_THRESHOLD,
  controlMessageSchema,
  encodeControl,
  type StartMessage,
} from './protocol.js';
import { CPU_DSP_RUNTIME, VoiceMasker, buildVoiceMaskerConfig, type VoiceMaskerConfig } from './dsp.js';
import { detectSpeech, int16Rms, silenceLike } from './vad.js';
import { authorizeVoiceWorkerUrl, type VoiceWorkerAuthResult } from './auth.js';

type ClientState = {
  started: boolean;
  startedAt: number;
  lastPongAt: number;
  sampleRate: number;
  chunkMs: number;
  framesReceived: number;
  framesReturned: number;
  speechFrames: number;
  silenceFrames: number;
  processingMs: number;
  inputRmsSum: number;
  outputRmsSum: number;
  transformDeltaSum: number;
  masker: VoiceMasker | null;
  maskerConfig: VoiceMaskerConfig;
};

const port = Number(process.env.PORT ?? process.env.VOICE_WORKER_PORT ?? 3010);
const host = process.env.HOST ?? process.env.VOICE_WORKER_HOST ?? '0.0.0.0';
const sharedSecret = process.env.VOICE_WORKER_SHARED_SECRET?.trim() || '';
const browserToken = process.env.VOICE_WORKER_BROWSER_TOKEN?.trim() || '';
const jwtSecret =
  process.env.VOICE_WORKER_JWT_SECRET?.trim() ||
  process.env.SERVICE_JWT_SECRET?.trim() ||
  sharedSecret;
const liveReady = process.env.VOICE_WORKER_LIVE_READY === 'true';
const vadThreshold = parseNumber(process.env.VOICE_WORKER_VAD_THRESHOLD, DEFAULT_VAD_THRESHOLD);
const maxPayloadBytes = parseInteger(process.env.VOICE_WORKER_MAX_PAYLOAD_BYTES, 256 * 1024);
const defaultMaskerConfig = buildVoiceMaskerConfig();
const authMetrics = createAuthMetrics();

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/health')) {
    const body = JSON.stringify({
      status: 'ok',
      service: 'voice-worker',
      runtime: defaultMaskerConfig.enabled ? CPU_DSP_RUNTIME : 'transport-passthrough-vad',
      liveReady,
      dsp: summarizeMaskerConfig(defaultMaskerConfig),
      vad: {
        enabled: true,
        threshold: vadThreshold,
      },
      metrics: {
        auth: authMetrics,
      },
    });

    res.writeHead(200, {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

const wss = new WebSocketServer({
  server,
  path: '/v1/stream',
  clientTracking: true,
  maxPayload: maxPayloadBytes,
  perMessageDeflate: false,
});

wss.on('connection', async (ws, req) => {
  const auth = await authorizeVoiceWorkerUrl(req.url, {
    jwtSecret,
    sharedSecret,
    browserToken,
  });

  if (!auth.ok) {
    recordAuthResult(auth);
    ws.close(1008, 'unauthorized');
    return;
  }
  recordAuthResult(auth);

  const state: ClientState = {
    started: false,
    startedAt: performance.now(),
    lastPongAt: Date.now(),
    sampleRate: DEFAULT_SAMPLE_RATE,
    chunkMs: DEFAULT_CHUNK_MS,
    framesReceived: 0,
    framesReturned: 0,
    speechFrames: 0,
    silenceFrames: 0,
    processingMs: 0,
    inputRmsSum: 0,
    outputRmsSum: 0,
    transformDeltaSum: 0,
    masker: null,
    maskerConfig: defaultMaskerConfig,
  };

  ws.on('pong', () => {
    state.lastPongAt = Date.now();
  });

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      handleAudioFrame(ws, state, data);
      return;
    }

    handleControlMessage(ws, state, data.toString('utf8'));
  });

  ws.send(encodeControl({
    type: 'ready',
    runtime: state.maskerConfig.enabled ? CPU_DSP_RUNTIME : 'transport-passthrough-vad',
    sampleRate: state.sampleRate,
    chunkMs: state.chunkMs,
    liveReady,
  }));
});

const heartbeat = setInterval(() => {
  const now = Date.now();
  for (const client of wss.clients) {
    const state = (client as WebSocket & { state?: ClientState }).state;
    if (state && now - state.lastPongAt > 30_000) {
      client.terminate();
      continue;
    }

    if (client.readyState === client.OPEN) {
      client.ping();
    }
  }
}, 15_000);

wss.on('close', () => clearInterval(heartbeat));

server.listen(port, host, () => {
  console.log(`[voice-worker] listening on ${host}:${port}`);
});

function handleControlMessage(ws: WebSocket, state: ClientState, raw: string) {
  const parsed = controlMessageSchema.safeParse(parseJson(raw));
  if (!parsed.success) {
    ws.send(encodeControl({
      type: 'error',
      code: 'invalid_control_message',
      message: 'Expected a valid voice-worker control message.',
    }));
    return;
  }

  if (parsed.data.type === 'start') {
    startSession(ws, state, parsed.data);
    return;
  }

  if (parsed.data.type === 'stop') {
    ws.close(1000, 'client_stop');
    return;
  }

  ws.send(encodeControl({
    type: 'pong',
    ...(typeof parsed.data.sentAt === 'number' ? { sentAt: parsed.data.sentAt } : {}),
    receivedAt: Date.now(),
  }));
}

function startSession(ws: WebSocket, state: ClientState, message: StartMessage) {
  state.started = true;
  state.sampleRate = message.sampleRate;
  state.chunkMs = message.chunkMs;
  state.maskerConfig = buildVoiceMaskerConfig(message.persona, message.antiCadence);
  state.masker = new VoiceMasker(
    state.sampleRate,
    state.maskerConfig,
    message.pseudoSpeakerSeed ?? `${message.sessionId}:${message.participantIdentity}`,
  );
  (ws as WebSocket & { state?: ClientState }).state = state;

  ws.send(encodeControl({
    type: 'ready',
    runtime: state.maskerConfig.enabled ? CPU_DSP_RUNTIME : 'transport-passthrough-vad',
    sampleRate: state.sampleRate,
    chunkMs: state.chunkMs,
    liveReady,
  }));
}

function handleAudioFrame(ws: WebSocket, state: ClientState, data: RawData) {
  if (!state.started) {
    ws.send(encodeControl({
      type: 'error',
      code: 'session_not_started',
      message: 'Send a start control message before binary audio frames.',
    }));
    return;
  }

  const startedAt = performance.now();
  const buffer = rawDataToBuffer(data);
  const frame = new Int16Array(buffer.buffer, buffer.byteOffset, Math.floor(buffer.byteLength / 2));
  const vad = detectSpeech(frame, vadThreshold);
  const output = vad.speech && state.masker ? state.masker.process(frame, vad) : silenceLike(frame);
  const outputFrame = new Int16Array(output.buffer, output.byteOffset, Math.floor(output.byteLength / 2));
  const outputRms = int16Rms(outputFrame);

  state.framesReceived += 1;
  state.framesReturned += 1;
  state.processingMs += performance.now() - startedAt;
  state.inputRmsSum += vad.rms;
  state.outputRmsSum += outputRms;
  state.transformDeltaSum += meanAbsDelta(frame, outputFrame);
  if (vad.speech) state.speechFrames += 1;
  else state.silenceFrames += 1;

  if (ws.readyState === ws.OPEN) {
    ws.send(output, { binary: true, compress: false });
  }

  if (state.framesReceived % 50 === 0) {
    const audioMs = state.framesReceived * state.chunkMs;
    ws.send(encodeControl({
      type: 'metrics',
      framesReceived: state.framesReceived,
      framesReturned: state.framesReturned,
      speechFrames: state.speechFrames,
      silenceFrames: state.silenceFrames,
      rtfEstimate: audioMs > 0 ? state.processingMs / audioMs : 0,
      inputRmsAvg: state.inputRmsSum / state.framesReceived,
      outputRmsAvg: state.outputRmsSum / state.framesReturned,
      transformDeltaAvg: state.transformDeltaSum / state.framesReturned,
    }));
  }
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

function summarizeMaskerConfig(config: VoiceMaskerConfig) {
  return {
    enabled: config.enabled,
    persona: config.persona,
    pitchRatio: config.pitchRatio,
    ringModHz: config.ringModHz,
    ringModDepth: config.ringModDepth,
    lowpassHz: config.lowpassHz,
    highpassHz: config.highpassHz,
    formantWarp: config.formantWarp,
    cadenceDepth: config.cadenceDepth,
    delayJitterMs: config.delayJitterMs,
  };
}

function rawDataToBuffer(data: RawData): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  return Buffer.concat(data);
}

function createAuthMetrics() {
  return {
    accepted: {
      jwt: 0,
      legacyToken: 0,
      open: 0,
    },
    rejected: {
      missingToken: 0,
      invalid: 0,
      expired: 0,
      wrongScope: 0,
      wrongSession: 0,
      wrongParticipant: 0,
    },
  };
}

function recordAuthResult(auth: VoiceWorkerAuthResult) {
  if (auth.ok) {
    if (auth.mode === 'legacy-token') {
      authMetrics.accepted.legacyToken += 1;
      return;
    }

    authMetrics.accepted[auth.mode] += 1;
    return;
  }

  authMetrics.rejected[toAuthMetricKey(auth.reason)] += 1;
}

function toAuthMetricKey(
  reason: Exclude<VoiceWorkerAuthResult, { ok: true }>['reason'],
): keyof ReturnType<typeof createAuthMetrics>['rejected'] {
  switch (reason) {
    case 'missing_token':
      return 'missingToken';
    case 'wrong_scope':
      return 'wrongScope';
    case 'wrong_session':
      return 'wrongSession';
    case 'wrong_participant':
      return 'wrongParticipant';
    default:
      return reason;
  }
}

function parseInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
