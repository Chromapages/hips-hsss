import { z } from 'zod';

export const EscalationQueueQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['all', 'pending', 'resolved']).default('pending'),
});

export type EscalationQueueQueryDto = z.infer<typeof EscalationQueueQuerySchema>;

export const EscalateAlertSchema = z.object({
  alertId: z.string().uuid(),
  reason: z.string().min(1).max(500),
  crisisLevel: z.enum(['STANDARD', 'URGENT', 'EMERGENCY']).default('STANDARD'),
});

export type EscalateAlertDto = z.infer<typeof EscalateAlertSchema>;

export const ResolveAlertSchema = z.object({
  alertId: z.string().uuid(),
  resolution: z.enum(['RESOLVED', 'ESCALATED', 'DISMISSED']).default('RESOLVED'),
  notes: z.string().max(1000).optional(),
});

export type ResolveAlertDto = z.infer<typeof ResolveAlertSchema>;
