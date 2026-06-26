import { create } from "zustand";
import type {
  Avatar2DConfig,
  AvatarBodyType,
  AvatarClothingType,
  AvatarAccessoryType,
  AvatarFaceStyle,
  AvatarRenderMode,
  AvatarEmotion,
} from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";

export interface AvatarState {
  // Avatar Styling Configuration
  avatarColor: string;
  avatarStyle: number;
  bodyType: AvatarBodyType;
  skinTone: string;
  hairStyle: number;
  hairColor: string;
  backgroundColor: string;
  eyeColor: string;
  faceShape: number;
  noseStyle: number;
  eyeStyle: AvatarFaceStyle;
  eyebrowStyle: AvatarFaceStyle;
  mouthStyle: AvatarFaceStyle;
  clothingType: AvatarClothingType;
  clothingColor: string;
  accessoryType: AvatarAccessoryType;
  avatarRenderMode: AvatarRenderMode;
  emotion: AvatarEmotion;
  avatar2D: Avatar2DConfig;


  // Voice Anonymization Configuration
  voicePreset: string;
  semitones: number;
  reverbLevel: "low" | "medium" | "high";
  anonymizationMode: "dsp" | "neural";
  selectedPersona: "clara" | "arthur";
  isAntiCadenceEnabled: boolean;

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
  avatarColor: "#173B57",
  avatarStyle: 0,
  bodyType: 1,
  skinTone: "#E8B092",
  hairStyle: 0,
  hairColor: "#1c1917",
  backgroundColor: "#eef0ff",
  eyeColor: "#1c1917",
  faceShape: 0,
  noseStyle: 0,
  eyeStyle: 0,
  eyebrowStyle: 0,
  mouthStyle: 0,
  clothingType: 0,
  clothingColor: "#173B57",
  accessoryType: 0,
  avatarRenderMode: "2d",
  emotion: "neutral",
  avatar2D: DEFAULT_AVATAR_2D,

  voicePreset: "subtle",
  semitones: -2,
  reverbLevel: "medium",
  anonymizationMode: "dsp",
  selectedPersona: "clara",
  isAntiCadenceEnabled: false,

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
      avatarColor: "#173B57",
      avatarStyle: 0,
      bodyType: 1,
      skinTone: "#E8B092",
      hairStyle: 0,
      hairColor: "#1c1917",
      backgroundColor: "#eef0ff",
      eyeColor: "#1c1917",
      faceShape: 0,
      noseStyle: 0,
      eyeStyle: 0,
      eyebrowStyle: 0,
      mouthStyle: 0,
      clothingType: 0,
      clothingColor: "#173B57",
      accessoryType: 0,
      avatarRenderMode: "2d",
      emotion: "neutral",
      avatar2D: DEFAULT_AVATAR_2D,

      voicePreset: "subtle",
      semitones: -2,
      reverbLevel: "medium",
      anonymizationMode: "dsp",
      selectedPersona: "clara",
      isAntiCadenceEnabled: false,
    }),
}));
