import { create } from "zustand";
import type {
  Avatar2DConfig,
  AvatarEmotion,
} from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";

export interface AvatarState {
  // Canonical Avatar Configuration
  avatar2D: Avatar2DConfig;
  emotion: AvatarEmotion;

  // Voice Anonymization Configuration
  voicePreset: string;
  semitones: number;
  reverbLevel: "low" | "medium" | "high";
  anonymizationMode: "dsp" | "neural";
  selectedPersona: "clara" | "arthur";
  isAntiCadenceEnabled: boolean;
  isEnhancedNeuralConsentAccepted: boolean;

  // State Actions
  setAvatarConfig: (config: Partial<Omit<
    AvatarState,
    "setAvatarConfig" | "setAvatar2D" | "resetAvatar2D" | "exportAvatar2DPNG" | "resetConfig"
  >>) => void;
  setAvatar2D: (config: Partial<Avatar2DConfig>) => void;
  resetAvatar2D: () => void;
  exportAvatar2DPNG: () => Promise<string>;
  resetConfig: () => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  avatar2D: DEFAULT_AVATAR_2D,
  emotion: "neutral",

  voicePreset: "subtle",
  semitones: -2,
  reverbLevel: "medium",
  anonymizationMode: "dsp",
  selectedPersona: "clara",
  isAntiCadenceEnabled: false,
  isEnhancedNeuralConsentAccepted: false,

  setAvatarConfig: (config) =>
    set((state) => ({
      ...state,
      ...config,
    })),

  setAvatar2D: (config) =>
    set((state) => ({
      ...state,
      avatar2D: {
        ...state.avatar2D,
        ...config,
        version: 1,
      },
    })),

  resetAvatar2D: () =>
    set((state) => ({
      ...state,
      avatar2D: DEFAULT_AVATAR_2D,
    })),

  exportAvatar2DPNG: async (): Promise<string> => {
    const { exportAvatarDataUrl } = await import("@/lib/export-avatar-png");
    return exportAvatarDataUrl(get().avatar2D);
  },

  resetConfig: () =>
    set({
      avatar2D: DEFAULT_AVATAR_2D,
      emotion: "neutral",

      voicePreset: "subtle",
      semitones: -2,
      reverbLevel: "medium",
      anonymizationMode: "dsp",
      selectedPersona: "clara",
      isAntiCadenceEnabled: false,
      isEnhancedNeuralConsentAccepted: false,
    }),
}));
