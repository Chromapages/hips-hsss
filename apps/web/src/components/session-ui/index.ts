// Session UI Components - Phase 5 Implementation
// Re-exports for the session engine

export { VoiceControlsBar } from "./VoiceControlsBar";
export { SessionHeader } from "./SessionHeader";
export { MobileBlockPage, useIsMobile } from "./MobileBlockPage";
export { WebGLFallback, isWebGLAvailable, useWebGLSupport } from "./WebGLFallback";

// Avatar system
export { fallbackColors, paletteColors } from "./avatar-options";

export type { AvatarStyle, AvatarPalette, AvatarGesture, AvatarRenderMode } from "@hips/types";

// Facilitator view
export { FacilitatorSessionView } from "./facilitator/FacilitatorSessionView";
