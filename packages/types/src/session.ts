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
export type AvatarStyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type AvatarEmotion = "neutral" | "happy" | "thoughtful" | "distressed";

export type AvatarProfile = {
  style: AvatarStyle;
  palette: AvatarPalette;
  gesture: AvatarGesture;
  emotion?: AvatarEmotion;
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
