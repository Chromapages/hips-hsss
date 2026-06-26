"use client";

import { useState, useEffect, useRef } from "react";
import { AvatarCustomizer } from "./AvatarCustomizer";
import { normalizeAvatarBodyType, normalizeAvatarEmotion } from "./avatar-options";
import type {
  Avatar2DConfig,
  AvatarBodyType,
  AvatarClothingType,
  AvatarAccessoryType,
  AvatarFaceStyle,
  AvatarRenderMode,
} from "@hips/types";

const parseStoredAvatar2D = (): Avatar2DConfig | undefined => {
  if (typeof window === "undefined") return undefined;
  const raw = sessionStorage.getItem("hips-avatar-2d");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Avatar2DConfig;
  } catch {
    return undefined;
  }
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
	        avatarColor: undefined,
	        avatarStyle: undefined,
	        bodyType: undefined,
	        skinTone: undefined,
	        hairStyle: undefined,
	        hairColor: undefined,
	        backgroundColor: undefined,
	        eyeColor: undefined,
	        faceShape: undefined,
	        noseStyle: undefined,
	        eyeStyle: undefined,
	        eyebrowStyle: undefined,
	        mouthStyle: undefined,
	        clothingType: undefined,
        clothingColor: undefined,
        accessoryType: undefined,
        avatarRenderMode: "2d" as AvatarRenderMode,
        avatar2D: undefined,
        emotion: undefined,
        voicePreset: undefined,
        semitones: undefined,
        reverbLevel: undefined,
        anonymizationMode: undefined,
        selectedPersona: undefined,
        isAntiCadenceEnabled: false,
      };
    }
    return {
	      avatarColor: sessionStorage.getItem("hips-avatar-color") || undefined,
	      avatarStyle: sessionStorage.getItem("hips-avatar-style") ? parseInt(sessionStorage.getItem("hips-avatar-style")!, 10) : undefined,
	      bodyType: normalizeAvatarBodyType(sessionStorage.getItem("hips-avatar-body")),
	      skinTone: sessionStorage.getItem("hips-avatar-skin-tone") || undefined,
	      hairStyle: sessionStorage.getItem("hips-avatar-hair") ? parseInt(sessionStorage.getItem("hips-avatar-hair")!, 10) : undefined,
	      hairColor: sessionStorage.getItem("hips-avatar-hair-color") || undefined,
	      backgroundColor: sessionStorage.getItem("hips-avatar-background") || undefined,
	      eyeColor: sessionStorage.getItem("hips-avatar-eye-color") || undefined,
	      faceShape: sessionStorage.getItem("hips-avatar-face-shape") ? parseInt(sessionStorage.getItem("hips-avatar-face-shape")!, 10) : undefined,
	      noseStyle: sessionStorage.getItem("hips-avatar-nose") ? parseInt(sessionStorage.getItem("hips-avatar-nose")!, 10) : undefined,
	      eyeStyle: sessionStorage.getItem("hips-avatar-eye") ? parseInt(sessionStorage.getItem("hips-avatar-eye")!, 10) as AvatarFaceStyle : undefined,
	      eyebrowStyle: sessionStorage.getItem("hips-avatar-eyebrow") ? parseInt(sessionStorage.getItem("hips-avatar-eyebrow")!, 10) as AvatarFaceStyle : undefined,
	      mouthStyle: sessionStorage.getItem("hips-avatar-mouth") ? parseInt(sessionStorage.getItem("hips-avatar-mouth")!, 10) as AvatarFaceStyle : undefined,
	      clothingType: sessionStorage.getItem("hips-avatar-clothing") ? parseInt(sessionStorage.getItem("hips-avatar-clothing")!, 10) as AvatarClothingType : undefined,
      clothingColor: sessionStorage.getItem("hips-avatar-clothing-color") || undefined,
      accessoryType: sessionStorage.getItem("hips-avatar-accessory") ? parseInt(sessionStorage.getItem("hips-avatar-accessory")!, 10) as AvatarAccessoryType : undefined,
      avatarRenderMode: "2d" as AvatarRenderMode,
      avatar2D: parseStoredAvatar2D(),
      emotion: normalizeAvatarEmotion(sessionStorage.getItem("hips-avatar-emotion")),
      // Guest voice options
      voicePreset: sessionStorage.getItem("hips-voice-preset") || undefined,
      semitones: sessionStorage.getItem("hips-voice-semitones") ? parseInt(sessionStorage.getItem("hips-voice-semitones")!, 10) : undefined,
      reverbLevel: (sessionStorage.getItem("hips-voice-reverb") as any) || undefined,
      anonymizationMode: (sessionStorage.getItem("hips-voice-anonymization") as any) || undefined,
      selectedPersona: (sessionStorage.getItem("hips-voice-persona") as any) || undefined,
      isAntiCadenceEnabled: sessionStorage.getItem("hips-voice-anticadence") === "true",
    };
  };

  const handleSave = (config: any) => {
	    sessionStorage.setItem("hips-avatar-color", config.avatarColor);
	    sessionStorage.setItem("hips-avatar-style", String(config.avatarStyle));
	    sessionStorage.setItem("hips-avatar-body", String(normalizeAvatarBodyType(config.bodyType)));
	    sessionStorage.setItem("hips-avatar-skin-tone", config.skinTone);
	    sessionStorage.setItem("hips-avatar-hair", String(config.hairStyle));
	    sessionStorage.setItem("hips-avatar-hair-color", config.hairColor);
	    sessionStorage.setItem("hips-avatar-background", config.backgroundColor || "#eef0ff");
	    sessionStorage.setItem("hips-avatar-eye-color", config.eyeColor || "#1c1917");
	    sessionStorage.setItem("hips-avatar-face-shape", String(config.faceShape ?? 0));
	    sessionStorage.setItem("hips-avatar-nose", String(config.noseStyle ?? 0));
	    sessionStorage.setItem("hips-avatar-eye", String(config.eyeStyle));
	    sessionStorage.setItem("hips-avatar-eyebrow", String(config.eyebrowStyle));
	    sessionStorage.setItem("hips-avatar-mouth", String(config.mouthStyle));
	    sessionStorage.setItem("hips-avatar-clothing", String(config.clothingType));
    sessionStorage.setItem("hips-avatar-clothing-color", config.clothingColor);
    sessionStorage.setItem("hips-avatar-accessory", String(config.accessoryType));
    sessionStorage.setItem("hips-avatar-render-mode", "2d");
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
