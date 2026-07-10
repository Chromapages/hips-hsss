export type UserRole =
  | "PARTICIPANT"
  | "LEADER"
  | "ORGBUYER"
  | "FACILITATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

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

export * from "./copy-policy.js";
export * from "./email.js";
export * from "./safety.js";
export * from "./session.js";
export * from "./avatar2d.js";
export * from "./packages.js";
