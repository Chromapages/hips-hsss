"use client";

import { useState, useEffect, useRef } from "react";
import { AvatarCustomizer } from "./AvatarCustomizer";
import { normalizeAvatarEmotion } from "./avatar-options";
import type { Avatar2DConfig } from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";

import { parseAvatar2DConfigString } from "@/lib/avatar2d-schema";

const parseStoredAvatar2D = (): Avatar2DConfig | undefined => {
  if (typeof window === "undefined") return undefined;
  const raw = sessionStorage.getItem("hips-avatar-2d");
  if (!raw) return undefined;
  return parseAvatar2DConfigString(raw) ?? undefined;
};

export function AvatarSelectorModal() {
  const [open, setOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("hips-avatar-color") === null,
  );

  const [announcement, setAnnouncement] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Focus containment & escape key handlers
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }

      if (e.key === "Tab") {
        const focusableElements = wrapperRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const getInitialConfig = () => {
    if (typeof window === "undefined") {
      return {
        avatar2D: DEFAULT_AVATAR_2D,
        emotion: "neutral" as const,
        isAntiCadenceEnabled: false,
        isEnhancedNeuralConsentAccepted: false,
      };
    }

    const config: any = {
      avatar2D: parseStoredAvatar2D() || DEFAULT_AVATAR_2D,
      isAntiCadenceEnabled: sessionStorage.getItem("hips-voice-anticadence") === "true",
      isEnhancedNeuralConsentAccepted: sessionStorage.getItem("hips-voice-enhanced-neural-consent") === "true",
    };

    const emotion = sessionStorage.getItem("hips-avatar-emotion");
    if (emotion) config.emotion = normalizeAvatarEmotion(emotion);

    const voicePreset = sessionStorage.getItem("hips-voice-preset");
    if (voicePreset) config.voicePreset = voicePreset;

    const semitones = sessionStorage.getItem("hips-voice-semitones");
    if (semitones) config.semitones = parseInt(semitones, 10);

    const reverb = sessionStorage.getItem("hips-voice-reverb");
    if (reverb) config.reverbLevel = reverb;

    const anonymization = sessionStorage.getItem("hips-voice-anonymization");
    if (anonymization) {
      config.anonymizationMode =
        anonymization === "neural" && !config.isEnhancedNeuralConsentAccepted
          ? "dsp"
          : anonymization;
    }

    const persona = sessionStorage.getItem("hips-voice-persona");
    if (persona) config.selectedPersona = persona;

    return config;
  };

  const handleSave = (config: any) => {
    if (config.avatar2D) {
      sessionStorage.setItem("hips-avatar-2d", JSON.stringify(config.avatar2D));
    }
    sessionStorage.setItem("hips-avatar-emotion", config.emotion || "neutral");
    // Save voice preferences
    sessionStorage.setItem("hips-voice-preset", config.voicePreset || "subtle");
    sessionStorage.setItem("hips-voice-semitones", String(config.semitones ?? -2));
    sessionStorage.setItem("hips-voice-reverb", config.reverbLevel || "medium");
    sessionStorage.setItem("hips-voice-anonymization", config.anonymizationMode || "dsp");
    sessionStorage.setItem("hips-voice-persona", config.selectedPersona || "clara");
    sessionStorage.setItem("hips-voice-anticadence", String(config.isAntiCadenceEnabled));
    sessionStorage.setItem("hips-voice-enhanced-neural-consent", String(config.isEnhancedNeuralConsentAccepted));

    setAnnouncement("Avatar and voice configuration locked successfully.");
    setTimeout(() => {
      setOpen(false);
      window.location.reload();
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 text-white backdrop-blur-2xl"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="avatar-title"
    >
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <div
        ref={wrapperRef}
        className="w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-1"
      >
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-xl font-bold font-heading text-white" id="avatar-title">
            Personalise Your Sanctuary Presence
          </h2>
          <p className="text-xs text-text-muted font-body mt-1">
            Choose your humanoid avatar proportions, styles, and voice protection filter. All profiles are stored in your temporary browser session.
          </p>
        </div>

        <AvatarCustomizer
          initialConfig={getInitialConfig()}
          onSave={handleSave}
          onCancel={() => setOpen(false)}
          showVoice={true}
        />
      </div>
    </div>
  );
}
