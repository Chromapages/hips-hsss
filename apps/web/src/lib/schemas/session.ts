import { z } from 'zod';

export const Phase5SessionSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'active', 'ended', 'flagged']),
  createdAt: z.string(),
  activeAt: z.string().optional(),
  endedAt: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  participantCount: z.number().int().nonnegative(),
  maxParticipants: z.number().int().positive().default(2),
  roomName: z.string(),
  flagged: z.boolean(),
  flaggedBy: z.string().optional(),
  flaggedReason: z.string().optional(),
  flaggedAt: z.string().optional(),
  createdBy: z.string().optional(),
  facilitatorId: z.string().optional(),
  userId: z.string().optional(),
  participantIdentities: z.array(z.string()).optional(),
  metadata: z.object({
    serviceType: z.string().optional(),
    facilitatorId: z.string().optional(),
    topic: z.string().optional(),
    notes: z.string().optional(),
  }).catchall(z.unknown()).optional(),
});
export type Phase5Session = z.infer<typeof Phase5SessionSchema>;

export const ReconnectRecordSchema = z.object({
  sessionId: z.string(),
  originalIdentity: z.string(),
  reconnectCount: z.number().int().nonnegative(),
  lastReconnectAt: z.string(),
  expiresAt: z.string(),
});
export type ReconnectRecord = z.infer<typeof ReconnectRecordSchema>;
