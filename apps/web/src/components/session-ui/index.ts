// Session UI Components - Phase 5 Implementation
// Re-exports for the session engine

export { VoiceControlsBar } from "./VoiceControlsBar";
export { SessionHeader } from "./SessionHeader";
export { GroupSessionLobby } from "./GroupSessionLobby";
export { MobileBlockPage, useIsMobile } from "./MobileBlockPage";
export { WebGLFallback, isWebGLAvailable, useWebGLSupport } from "./WebGLFallback";

// Avatar system
export {
  default as VirtualOfficeAvatar,
  avatarStyles,
  fallbackColors,
  paletteColors,
  avatarGestures,
} from "./avatars/VirtualOfficeAvatar";

export type { AvatarStyle, AvatarPalette, AvatarGesture } from "./avatars/VirtualOfficeAvatar";

// Office scene
export { OfficeRoomScene } from "./office/OfficeRoomScene";

// Facilitator view
export { FacilitatorSessionView } from "./facilitator/FacilitatorSessionView";