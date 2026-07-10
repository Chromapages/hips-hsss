"use client";

import { useState, useTransition } from "react";
import type { Avatar2DConfig } from "@hips/types";
import { normalizeAvatarBodyType } from "../avatar-options";
import { MAN_HAIR_STYLES, WOMAN_HAIR_STYLES } from "./creator-constants";

export function useAvatarDraft(initialConfig: any, defaultAvatar2D: Avatar2DConfig) {
  const [isPending, startTransition] = useTransition();

  const [bodyType, setBodyType] = useState<0 | 1>(() => {
    if (initialConfig?.avatar2D) {
      const hair = initialConfig.avatar2D.hairStyle;
      if (MAN_HAIR_STYLES.includes(hair)) return 0;
      if (WOMAN_HAIR_STYLES.includes(hair)) return 1;
    }
    if (initialConfig?.bodyType !== undefined) {
      return normalizeAvatarBodyType(initialConfig.bodyType) === 1 ? 1 : 0;
    }
    return 0; // Default to Man
  });

  const [activeTab, setActiveTab] = useState<"identity" | "styling" | "wardrobe" | "voice" | "expression">("identity");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [neuralBackendAvailable, setNeuralBackendAvailable] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [baseSkinTone, setBaseSkinTone] = useState(initialConfig?.avatar2D?.skinTone || defaultAvatar2D.skinTone || "#C68642");
  const [skinOffset, setSkinOffset] = useState(0);
  const [savingState, setSavingState] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  return {
    isPending,
    startTransition,
    bodyType,
    setBodyType,
    activeTab,
    setActiveTab,
    isSpeaking,
    setIsSpeaking,
    voiceLevel,
    setVoiceLevel,
    isPreviewing,
    setIsPreviewing,
    neuralBackendAvailable,
    setNeuralBackendAvailable,
    showConfetti,
    setShowConfetti,
    baseSkinTone,
    setBaseSkinTone,
    skinOffset,
    setSkinOffset,
    savingState,
    setSavingState,
    isShuffling,
    setIsShuffling,
  };
}
export type UseAvatarDraftReturn = ReturnType<typeof useAvatarDraft>;
