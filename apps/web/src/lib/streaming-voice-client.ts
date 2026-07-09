export type VoiceWorkerControlMessage =
  | {
      type: 'ready';
      runtime: string;
      sampleRate: number;
      chunkMs: number;
      liveReady: boolean;
    }
  | {
      type: 'metrics';
      framesReceived: number;
      framesReturned: number;
      speechFrames: number;
      silenceFrames: number;
      rtfEstimate: number;
      inputRmsAvg: number;
      outputRmsAvg: number;
      transformDeltaAvg: number;
    }
  | { type: 'error'; code: string; message: string }
  | { type: 'pong'; sentAt?: number; receivedAt: number };

export type StreamingVoiceClientOptions = {
  url: string;
  token?: string;
  sessionId: string;
  participantIdentity: string;
  persona?: 'clara' | 'arthur' | 'guardian' | 'bright' | 'shadow';
  antiCadence?: boolean;
  pseudoSpeakerSeed?: string;
  chunkSize?: number;
  onProcessedFrame?: (frame: ArrayBuffer) => void;
  onControlMessage?: (message: VoiceWorkerControlMessage) => void;
  onError?: (error: Error) => void;
};

export class StreamingVoiceClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private keepAlive: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly options: StreamingVoiceClientOptions) {}

  async start(track: MediaStreamTrack) {
    if (this.ws) return;

    const AudioCtx = getAudioContextCtor();
    const audioContext = new AudioCtx();
    this.audioContext = audioContext;

    const ws = new WebSocket(withAuthParams({
      url: this.options.url,
      token: this.options.token,
      sessionId: this.options.sessionId,
      participantIdentity: this.options.participantIdentity,
    }));
    ws.binaryType = 'arraybuffer';
    this.ws = ws;

    await new Promise<void>((resolve, reject) => {
      ws.addEventListener('open', () => resolve(), { once: true });
      ws.addEventListener('error', () => reject(new Error('Voice worker WebSocket failed to open.')), {
        once: true,
      });
    });

    ws.addEventListener('message', (event) => this.handleMessage(event));
    ws.addEventListener('error', () => this.options.onError?.(new Error('Voice worker WebSocket error.')));

    ws.send(JSON.stringify({
      type: 'start',
      sessionId: this.options.sessionId,
      participantIdentity: this.options.participantIdentity,
      sampleRate: audioContext.sampleRate,
      chunkMs: estimateChunkMs(this.options.chunkSize ?? 2048, audioContext.sampleRate),
      ...(this.options.persona ? { persona: this.options.persona } : {}),
      ...(typeof this.options.antiCadence === 'boolean' ? { antiCadence: this.options.antiCadence } : {}),
      ...(this.options.pseudoSpeakerSeed ? { pseudoSpeakerSeed: this.options.pseudoSpeakerSeed } : {}),
    }));

    const stream = new MediaStream([track]);
    this.source = audioContext.createMediaStreamSource(stream);
    this.processor = audioContext.createScriptProcessor(this.options.chunkSize ?? 2048, 1, 1);

    this.processor.onaudioprocess = (event) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const input = event.inputBuffer.getChannelData(0);
      ws.send(float32ToPcm16(input));
    };

    const mutedGain = audioContext.createGain();
    mutedGain.gain.value = 0;
    this.source.connect(this.processor);
    this.processor.connect(mutedGain);
    mutedGain.connect(audioContext.destination);

    this.keepAlive = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', sentAt: Date.now() }));
      }
    }, 10_000);
  }

  stop() {
    if (this.keepAlive) clearInterval(this.keepAlive);
    this.keepAlive = null;

    this.processor?.disconnect();
    this.source?.disconnect();
    this.processor = null;
    this.source = null;

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'stop' }));
    }
    this.ws?.close();
    this.ws = null;

    void this.audioContext?.close();
    this.audioContext = null;
  }

  private handleMessage(event: MessageEvent) {
    if (event.data instanceof ArrayBuffer) {
      this.options.onProcessedFrame?.(event.data);
      return;
    }

    if (typeof event.data !== 'string') return;

    try {
      this.options.onControlMessage?.(JSON.parse(event.data) as VoiceWorkerControlMessage);
    } catch {
      this.options.onError?.(new Error('Voice worker returned an invalid control message.'));
    }
  }
}

function float32ToPcm16(input: Float32Array): ArrayBuffer {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
  }
  return output.buffer;
}

function estimateChunkMs(chunkSize: number, sampleRate: number): number {
  return Math.max(10, Math.round((chunkSize / sampleRate) * 1000));
}

function withAuthParams(options: {
  url: string;
  token: string | undefined;
  sessionId: string;
  participantIdentity: string;
}): string {
  const { url, token, sessionId, participantIdentity } = options;
  const parsed = new URL(url);
  if (token) parsed.searchParams.set('token', token);
  parsed.searchParams.set('sessionId', sessionId);
  parsed.searchParams.set('participantIdentity', participantIdentity);
  return parsed.toString();
}

function getAudioContextCtor(): typeof AudioContext {
  return window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
    AudioContext;
}
