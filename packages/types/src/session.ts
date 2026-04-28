export type SessionLifecycleStatus =
  | "created"
  | "lobby"
  | "active"
  | "ended"
  | "interrupted";

export type AvatarGesture =
  | "idle"
  | "nodding"
  | "raised-hand"
  | "thinking"
  | "applause";

export type AvatarPalette = "coastal" | "sunrise" | "forest";

export type AvatarProfile = {
  style: number;
  palette: AvatarPalette;
  gesture: AvatarGesture;
  locked: boolean;
};

export type AnonymousLiveSessionToken = {
  jwt: string;
  roomName: string;
  anonymousIdentity: string;
  expiresAt: Date;
  avatar: AvatarProfile;
};

export type SessionLifecycleRecord = {
  sessionId: string;
  roomName: string;
  status: SessionLifecycleStatus;
  participantLimit: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
};

export type ConnectionQuality = "good" | "unstable" | "poor";
