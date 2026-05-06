import { z } from 'zod';

// Device type validation for laptop-only enforcement
export const DeviceTypeSchema = z.enum(['desktop', 'mobile', 'tablet']);
export type DeviceType = z.infer<typeof DeviceTypeSchema>;

// Session token request
export const CreateSessionTokenSchema = z.object({
  sessionId: z.string().uuid(),
  deviceType: DeviceTypeSchema.default('desktop'),
  deviceFingerprintHash: z.string().optional(),
  clientTimestamp: z.string().datetime(),
});

export type CreateSessionTokenInput = z.infer<typeof CreateSessionTokenSchema>;

// Session token response
export interface SessionTokenResponse {
  token: string;
  expiresAt: string;
  roomId: string;
  webrtcConfig: WebRTCConfig;
}

// WebRTC configuration
export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  dtlsRole: 'client' | 'server';
  maxParticipants: number;
}

// Flag request
export const FlagSessionSchema = z.object({
  sessionId: z.string().uuid(),
  flagType: z.enum(['concern', 'crisis', 'technical', 'other']),
  description: z.string().optional(),
  timestamp: z.string().datetime(),
});

export type FlagSessionInput = z.infer<typeof FlagSessionSchema>;

// End session request
export const EndSessionSchema = z.object({
  sessionId: z.string().uuid(),
  reason: z.enum(['completed', 'abandoned', 'technical', 'escalated']).optional(),
  notes: z.string().optional(),
});

export type EndSessionInput = z.infer<typeof EndSessionSchema>;

// Group session lobby join
export const JoinLobbySchema = z.object({
  groupId: z.string().uuid(),
  avatarStyle: z.string().optional(),
  avatarColor: z.string().optional(),
});

export type JoinLobbyInput = z.infer<typeof JoinLobbySchema>;

// Moderator controls
export const ModeratorActionSchema = z.object({
  action: z.enum(['mute', 'unmute', 'remove', 'end']),
  targetAnonId: z.string().optional(),
  reason: z.string().optional(),
});

export type ModeratorActionInput = z.infer<typeof ModeratorActionSchema>;

// Recording consent
export const RecordingConsentSchema = z.object({
  sessionId: z.string().uuid(),
  consent: z.boolean(),
});

export type RecordingConsentInput = z.infer<typeof RecordingConsentSchema>;

// Facilitator notes
export const UpdateFacilitatorNotesSchema = z.object({
  sessionId: z.string().uuid(),
  notes: z.string(),
});

export type UpdateFacilitatorNotesInput = z.infer<typeof UpdateFacilitatorNotesSchema>;

// Standard API response
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;