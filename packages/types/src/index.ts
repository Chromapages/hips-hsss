export type UserRole =
  | "PARTICIPANT"
  | "LEADER"
  | "ORGBUYER"
  | "FACILITATOR"
  | "ADMIN";

export type AnonymousSessionToken = {
  token: string;
  sessionId: string;
  expiresAt: Date;
};

export type SessionTokenRequest = {
  commerceSessionId: string;
  firebaseUid: string;
};

export type SessionTokenValidation = {
  sessionId: string;
  anonymousParticipantId: string;
};

export type ServiceCategory =
  | "INDIVIDUAL_SUPPORT"
  | "GROUP_SUPPORT"
  | "SUPPORT_NAVIGATION"
  | "CRISIS_PLANNING"
  | "FAMILY_SUPPORT"
  | "ORGANIZATION_TRAINING";

export * from "./copy-policy";
export * from "./email";
export * from "./safety";
export * from "./session";
