export type SafetyFlag = {
  anonymousParticipantId: string;
  roomId: string;
  level: "watch" | "urgent" | "crisis";
  reason: string;
  createdAt: Date;
};

export function canRequestVaultDisclosure(flag: SafetyFlag) {
  return flag.level === "crisis";
}

export function canDisplayCrisisOverlay(flag: SafetyFlag) {
  return flag.level === "crisis" || flag.level === "urgent";
}
