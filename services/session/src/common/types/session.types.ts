import 'express';

declare global {
  namespace Express {
    interface Request {
      sessionToken?: SessionTokenPayload;
    }
  }
}

export interface SessionTokenPayload {
  anonSessionToken: string;
  sessionRecordId: string;
  roomId: string;
  role: 'participant' | 'facilitator';
  deviceFingerprintHash?: string;
}