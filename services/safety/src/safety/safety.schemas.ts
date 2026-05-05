import { z } from 'zod';

export const IngestTranscriptSchema = z.object({
  sessionId: z.string().min(1),
  text: z.string().min(1).max(50000),
  participantId: z.string().min(1),
});

export type IngestTranscriptDto = z.infer<typeof IngestTranscriptSchema>;

export const ManualFlagSchema = z.object({
  sessionId: z.string().min(1),
  reporterId: z.string().min(1),
  level: z.enum(['HIGH', 'CRITICAL']),
  reason: z.string().min(1),
});

export type ManualFlagDto = z.infer<typeof ManualFlagSchema>;

export const EscalateAlertSchema = z.object({
  actorId: z.string().min(1),
  reason: z.string().min(1),
});

export type EscalateAlertDto = z.infer<typeof EscalateAlertSchema>;