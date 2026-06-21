import { z } from 'zod';

export const DEFAULT_SAMPLE_RATE = 24_000;
export const DEFAULT_CHUNK_MS = 40;
export const DEFAULT_VAD_THRESHOLD = 0.012;

export const startMessageSchema = z.object({
  type: z.literal('start'),
  sessionId: z.string().min(1).max(128),
  participantIdentity: z.string().min(1).max(128),
  sampleRate: z.number().int().min(8_000).max(48_000).default(DEFAULT_SAMPLE_RATE),
  chunkMs: z.number().int().min(10).max(100).default(DEFAULT_CHUNK_MS),
  persona: z.enum(['clara', 'arthur', 'guardian', 'bright', 'shadow']).default('guardian'),
  antiCadence: z.boolean().default(false),
  pseudoSpeakerSeed: z.string().min(8).max(128).optional(),
});

export const controlMessageSchema = z.discriminatedUnion('type', [
  startMessageSchema,
  z.object({ type: z.literal('stop') }),
  z.object({ type: z.literal('ping'), sentAt: z.number().optional() }),
]);

export type StartMessage = z.infer<typeof startMessageSchema>;
export type ControlMessage = z.infer<typeof controlMessageSchema>;

export type ServerControlMessage =
  | {
      type: 'ready';
      runtime: 'transport-passthrough-vad' | 'cpu-dsp-v1';
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

export function encodeControl(message: ServerControlMessage): string {
  return JSON.stringify(message);
}
