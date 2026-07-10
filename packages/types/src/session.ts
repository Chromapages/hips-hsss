export type SessionLifecycleStatus =
  | "created"
  | "lobby"
  | "active"
  | "ended"
  | "interrupted";

export type AvatarStyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type AvatarPalette = "coastal" | "sunrise" | "forest";
export type AvatarEmotion = "neutral" | "distressed";

export type AvatarGesture =
  | "idle"
  | "nodding"
  | "raised-hand";

export type AvatarBodyType = 0 | 1 | 2;
export type AvatarClothingType = 0 | 1 | 2 | 3 | 4 | 5;
export type AvatarAccessoryType = 0 | 1 | 2 | 3 | 4 | 5;
export type AvatarFaceStyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AvatarRenderMode = "2d" | "3d";

export type AvatarProfile = {
  style: AvatarStyle;
  palette: AvatarPalette;
  gesture: AvatarGesture;
  emotion?: AvatarEmotion;
  bodyType?: AvatarBodyType;
  skinTone?: string;
  hairStyle?: number;
  hairColor?: string;
  backgroundColor?: string;
  eyeColor?: string;
  faceShape?: number;
  noseStyle?: number;
  eyeStyle?: AvatarFaceStyle;
  eyebrowStyle?: AvatarFaceStyle;
  mouthStyle?: AvatarFaceStyle;
  clothingType?: AvatarClothingType;
  clothingColor?: string;
  accessoryType?: AvatarAccessoryType;
  renderMode?: AvatarRenderMode;
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
