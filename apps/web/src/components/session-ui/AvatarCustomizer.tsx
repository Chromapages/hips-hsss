"use client";

import { useState, useEffect, useCallback, useTransition, useDeferredValue, useReducer } from "react";
import {
  User,
  Sparkles,
  Shirt,
  Mic,
  Loader2,
  Check,
  Info,
  Sliders,
  Shuffle,
  RotateCcw,
  Share2,
  Smile,
  Download,
  Undo,
  Redo,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_AVATAR_2D,
  type Avatar2DConfig,
  type AvatarBodyType,
  type AvatarClothingType,
  type AvatarAccessoryType,
  type AvatarFaceStyle,
  type AvatarRenderMode,
  type AvatarEmotion,
} from "@hips/types";
import {
  normalizeAvatarBodyType,
  normalizeAvatarEmotion,
  normalizeSkinTone,
} from "./avatar-options";
import { pitchShiftWorkletSource } from "@/lib/voice-mask-processor";
import { getBrowserMediaDevices } from "@/lib/browser-media";
import { useAvatarStore } from "@/store/useAvatarStore";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";
import {
  avatar2DOptions,
  skinTonePalette,
} from "@/lib/avatar-asset-registry";

function MiniAvatarPreview({ partType, partId }: { partType: string; partId: string | null }) {
  const previewConfig: Avatar2DConfig = {
    ...DEFAULT_AVATAR_2D,
    skinTone: "#C68642",
    hairColor: "#2B211D",
    clothingColor: "#252D37",
    background: "bg_solid_cloud",
    expression: "neutral",
    [partType]: partId,
  } as any;

  return (
    <div className="w-[48px] h-[48px] overflow-hidden rounded-lg relative scale-[0.9] origin-center bg-zinc-900 pointer-events-none">
      <AvatarCompositor config={previewConfig} className="w-full h-full" isMini />
    </div>
  );
}


// Predefined premium colors
const hairColors = [
  { hex: "#1c1917", label: "Charcoal" },
  { hex: "#292524", label: "Dark Brown" },
  { hex: "#44403c", label: "Medium Brown" },
  { hex: "#78716c", label: "Auburn" },
  { hex: "#ca8a04", label: "Blonde" },
  { hex: "#d97706", label: "Ginger" },
  { hex: "#f5d0a9", label: "Sand" },
  { hex: "#ef4444", label: "Cherry" },
  { hex: "#8b5cf6", label: "Violet" },
  { hex: "#0ea5e9", label: "Blue" },
  { hex: "#10b981", label: "Green" },
  { hex: "#ec4899", label: "Pink" },
];

const clothingColors = [
  { hex: "#173B57", label: "Navy" },
  { hex: "#C59A35", label: "Gold" },
  { hex: "#10B981", label: "Emerald" },
  { hex: "#FBBF24", label: "Amber" },
  { hex: "#EF4444", label: "Crimson" },
  { hex: "#06B6D4", label: "Cyan" },
  { hex: "#8B5CF6", label: "Violet" },
  { hex: "#F43F5E", label: "Rose" },
  { hex: "#111827", label: "Ink" },
  { hex: "#F8FAFC", label: "Cloud" },
  { hex: "#FB7185", label: "Coral" },
  { hex: "#A3E635", label: "Lime" },
];

const eyeColors = [
  { hex: "#1c1917", label: "Black" },
  { hex: "#3f2d20", label: "Brown" },
  { hex: "#6b7280", label: "Gray" },
  { hex: "#2563eb", label: "Blue" },
  { hex: "#059669", label: "Green" },
  { hex: "#a16207", label: "Amber" },
  { hex: "#7c3aed", label: "Violet" },
  { hex: "#be123c", label: "Rose" },
] as const;

const pickRandom = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)]!;

const voicePresets = [
  { id: "subtle", label: "Subtle", semitones: -2, description: "Slight pitch down — natural and calm cover" },
  { id: "deep", label: "Deep", semitones: -6, description: "Voice Shield — deep, anonymous register" },
  { id: "high", label: "High", semitones: 6, description: "Bright Veil — high, light register" },
  { id: "cyber", label: "Cyber", semitones: -2, description: "Robotic synthesis — ring modulation anonymiser" },
  { id: "custom", label: "Custom", semitones: 0, description: "Set your own semitone shift" },
];

interface AvatarCustomizerProps {
  initialConfig?: {
	    avatarColor?: string | undefined;
	    avatarStyle?: number | undefined;
	    bodyType?: AvatarBodyType | undefined;
	    skinTone?: string | undefined;
	    hairStyle?: number | undefined;
	    hairColor?: string | undefined;
	    backgroundColor?: string | undefined;
	    eyeColor?: string | undefined;
	    faceShape?: number | undefined;
	    noseStyle?: number | undefined;
	    eyeStyle?: AvatarFaceStyle | undefined;
	    eyebrowStyle?: AvatarFaceStyle | undefined;
		    mouthStyle?: AvatarFaceStyle | undefined;
	    clothingType?: AvatarClothingType | undefined;
	    clothingColor?: string | undefined;
	    accessoryType?: AvatarAccessoryType | undefined;
	    avatarRenderMode?: AvatarRenderMode | undefined;
	    emotion?: AvatarEmotion | undefined;
      avatar2D?: Avatar2DConfig | undefined;
	    voicePreset?: string | undefined;
    semitones?: number | undefined;
    reverbLevel?: "low" | "medium" | "high" | undefined;
    anonymizationMode?: "dsp" | "neural" | undefined;
    selectedPersona?: "clara" | "arthur" | undefined;
    isAntiCadenceEnabled?: boolean | undefined;
  };
  onSave: (config: any) => void;
  onCancel?: () => void;
  showVoice?: boolean;
  saving?: boolean;
}

interface HistoryState {
  past: Avatar2DConfig[];
  present: Avatar2DConfig;
  future: Avatar2DConfig[];
}

type HistoryAction =
  | { type: "SET"; config: Avatar2DConfig }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; config: Avatar2DConfig };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1]!;
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0]!;
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    case "SET": {
      if (JSON.stringify(action.config) === JSON.stringify(state.present)) {
        return state;
      }
      return {
        past: [...state.past, state.present],
        present: action.config,
        future: [],
      };
    }
    case "RESET": {
      return {
        past: [],
        present: action.config,
        future: [],
      };
    }
    default:
      return state;
  }
}

export function AvatarCustomizer({
  initialConfig,
  onSave,
  onCancel,
  showVoice = true,
  saving = false,
}: AvatarCustomizerProps) {
  // Pull states and actions directly from the Zustand useAvatarStore
  const rawStore = useAvatarStore();
  const [isPending, startTransition] = useTransition();

  // Intercept store setter calls using a Proxy to run them inside transitions
  const store = new Proxy(rawStore, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === "function" && (prop === "setAvatar2D" || prop === "setAvatarConfig")) {
        return (...args: any[]) => {
          startTransition(() => {
            val.apply(target, args);
          });
        };
      }
      return val;
    }
  });

  // Local UI-only state
  const [activeTab, setActiveTab] = useState<"identity" | "styling" | "wardrobe" | "voice" | "expression">("identity");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [neuralBackendAvailable, setNeuralBackendAvailable] = useState(false);

  // Transition deferral for low-latency rendering
  const deferredAvatar2D = useDeferredValue(rawStore.avatar2D);

  // Confetti micro-celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // Skin tone Pill Swatches + fine range slider states
  const [baseSkinTone, setBaseSkinTone] = useState(rawStore.avatar2D.skinTone || "#C68642");
  const [skinOffset, setSkinOffset] = useState(0);

  // Undo / Redo history stack states using useReducer
  const [historyState, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: rawStore.avatar2D,
    future: [],
  });

  // Synchronize history reducer's present state to rawStore.avatar2D
  useEffect(() => {
    if (JSON.stringify(historyState.present) !== JSON.stringify(rawStore.avatar2D)) {
      rawStore.setAvatar2D(historyState.present);
    }
  }, [historyState.present]);

  // Synchronize rawStore.avatar2D updates (e.g. from user clicks, randomizer, reset) back to history reducer
  useEffect(() => {
    if (JSON.stringify(rawStore.avatar2D) !== JSON.stringify(historyState.present)) {
      dispatchHistory({ type: "SET", config: rawStore.avatar2D });
    }
  }, [rawStore.avatar2D]);

  // OKLCH fine-tuned skin tone adjustment listener
  useEffect(() => {
    let active = true;
    import("@/lib/avatar2d-utils").then(({ darken }) => {
      if (!active) return;
      try {
        const adjusted = darken(baseSkinTone, -skinOffset);
        // Avoid redundant state triggers if values match
        if (rawStore.avatar2D.skinTone !== adjusted) {
          rawStore.setAvatar2D({ skinTone: adjusted });
          rawStore.setAvatarConfig({ skinTone: adjusted });
        }
      } catch (e) {
        console.error(e);
      }
    });
    return () => {
      active = false;
    };
  }, [baseSkinTone, skinOffset]);

  // Initialize Zustand store from initialConfig if present
  useEffect(() => {
    if (initialConfig) {
      store.setAvatarConfig({
	        avatarColor: initialConfig.avatarColor ?? clothingColors[0]!.hex,
	        avatarStyle: initialConfig.avatarStyle ?? 0,
		        bodyType: normalizeAvatarBodyType(initialConfig.bodyType),
	        skinTone: normalizeSkinTone(initialConfig.skinTone),
	        hairStyle: initialConfig.hairStyle ?? 0,
	        hairColor: initialConfig.hairColor ?? hairColors[0]!.hex,
	        backgroundColor: initialConfig.backgroundColor ?? "#eef0ff",
	        eyeColor: initialConfig.eyeColor ?? eyeColors[0]!.hex,
	        faceShape: initialConfig.faceShape ?? 0,
	        noseStyle: initialConfig.noseStyle ?? 0,
	        eyeStyle: initialConfig.eyeStyle ?? 0,
	        eyebrowStyle: initialConfig.eyebrowStyle ?? 0,
	        mouthStyle: initialConfig.mouthStyle ?? 0,
	        clothingType: initialConfig.clothingType ?? 0,
        clothingColor: initialConfig.clothingColor ?? clothingColors[0]!.hex,
        accessoryType: initialConfig.accessoryType ?? 0,
        avatarRenderMode: "2d",
        emotion: normalizeAvatarEmotion(initialConfig.emotion),
        voicePreset: initialConfig.voicePreset ?? "subtle",
        semitones: initialConfig.semitones ?? -2,
        reverbLevel: initialConfig.reverbLevel ?? "medium",
        anonymizationMode: initialConfig.anonymizationMode ?? "dsp",
        selectedPersona: initialConfig.selectedPersona ?? "clara",
        isAntiCadenceEnabled: initialConfig.isAntiCadenceEnabled ?? false,
      });
      if (initialConfig.avatar2D) {
        store.setAvatar2D(initialConfig.avatar2D);
      }
    }
  }, [initialConfig]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const match = window.location.hash.match(/state=([^&]+)/);
    if (!match?.[1]) return;
    try {
      const restored = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
      store.setAvatarConfig({
        bodyType: normalizeAvatarBodyType(restored.bodyType),
        skinTone: normalizeSkinTone(restored.skinTone),
        hairStyle: restored.hairStyle,
        hairColor: restored.hairColor,
        backgroundColor: restored.backgroundColor,
        eyeColor: restored.eyeColor,
        faceShape: restored.faceShape,
        noseStyle: restored.noseStyle,
        eyeStyle: restored.eyeStyle,
        eyebrowStyle: restored.eyebrowStyle,
        mouthStyle: restored.mouthStyle,
        clothingType: restored.clothingType,
        clothingColor: restored.clothingColor,
        accessoryType: restored.accessoryType,
        avatarRenderMode: "2d",
        emotion: normalizeAvatarEmotion(restored.emotion),
      });
      if (restored.avatar2D) {
        store.setAvatar2D(restored.avatar2D);
      }
      toast.success("Avatar state restored from share link");
    } catch {
      toast.error("Could not restore avatar share link");
    }
  }, []);

  // Formant shift scaling preview helpers
  const effectiveSemitones = store.voicePreset === "custom"
    ? store.semitones
    : (voicePresets.find((v) => v.id === store.voicePreset)?.semitones ?? 0);

  useEffect(() => {
    let cancelled = false;
    async function checkNeuralBackend() {
      try {
        const response = await fetch("/api/voice-masking/status", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled) {
          setNeuralBackendAvailable(Boolean(data?.neural?.readyForSessionUse));
        }
      } catch {
        if (!cancelled) {
          setNeuralBackendAvailable(false);
        }
      }
    }
    void checkNeuralBackend();
    return () => {
      cancelled = true;
    };
  }, []);

  // Map state variations to keep backward compatibility
  useEffect(() => {
    store.setAvatarConfig({
      avatarStyle: store.hairStyle,
      avatarColor: store.clothingColor,
    });
  }, [store.hairStyle, store.clothingColor]);

  // Audio reverb buffer builder for preview
  const buildReverbIR = (ctx: AudioContext, durationSec: number, decay: number) => {
    const len = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return ir;
  };

  const handlePreviewVoice = useCallback(async () => {
    if (isPreviewing) return;
    if (store.anonymizationMode === "neural") {
      toast.error("Enhanced Neural is locked until the server can return converted audio into the session. Use Effects Mode for live microphone audio.");
      return;
    }
    setIsPreviewing(true);
    setIsSpeaking(false);
    setVoiceLevel(0);

    let ctx: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let analyserFrame: number | null = null;

    try {
      stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);

      const samples = new Uint8Array(analyser.fftSize);
      let speaking = false;
      const monitorVoiceActivity = () => {
        analyser.getByteTimeDomainData(samples);
        let sumSquares = 0;
        for (let index = 0; index < samples.length; index += 1) {
          const normalized = ((samples[index] ?? 128) - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / samples.length);
        const level = Math.min(1, rms * 7);
        if (!speaking && level > 0.12) speaking = true;
        if (speaking && level < 0.055) speaking = false;
        setVoiceLevel(level);
        setIsSpeaking(speaking);
        analyserFrame = requestAnimationFrame(monitorVoiceActivity);
      };
      monitorVoiceActivity();

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 90;

      const preEmphasis = ctx.createBiquadFilter();
      preEmphasis.type = "highshelf";
      preEmphasis.frequency.value = 3500;
      preEmphasis.gain.value = effectiveSemitones < 0 ? 4.0 : 0.0;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = store.voicePreset === "deep" ? 5000 : (store.voicePreset === "cyber" ? 6000 : 7000);

      if (store.voicePreset === "high") {
        highpass.frequency.value = 150;
      }

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -22;
      compressor.knee.value = 20;
      compressor.ratio.value = 2.8;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.22;

      const convolver = ctx.createConvolver();
      const dryGain = ctx.createGain();
      const wetGain = ctx.createGain();

      const dryLevel = store.voicePreset === "deep" ? 0.8 : (store.voicePreset === "high" ? 0.85 : (store.voicePreset === "cyber" ? 0.85 : 0.78));
      const wetLevel = store.voicePreset === "deep" ? 0.2 : (store.voicePreset === "high" ? 0.15 : (store.voicePreset === "cyber" ? 0.15 : 0.22));

      dryGain.gain.value = dryLevel;
      wetGain.gain.value = wetLevel;

      const reverbDuration = store.reverbLevel === "low" ? 0.4 : (store.reverbLevel === "high" ? 1.5 : 0.75);
      const reverbDecay = store.reverbLevel === "low" ? 3.5 : (store.reverbLevel === "high" ? 1.8 : 2.8);

      try {
        convolver.buffer = buildReverbIR(ctx, reverbDuration, reverbDecay);
      } catch (e) {
        console.warn("Reverb IR failed:", e);
      }

      const formantLow = ctx.createBiquadFilter();
      const formantMid = ctx.createBiquadFilter();
      const formantHigh = ctx.createBiquadFilter();
      const formantVeryHigh = ctx.createBiquadFilter();

      const formantScale = Math.pow(2, (effectiveSemitones * 0.6) / 12);

      formantLow.type      = 'peaking'; formantLow.frequency.value      = Math.min(2000, Math.max(100, 600 * formantScale));  formantLow.Q.value      = 1.2;
      formantMid.type      = 'peaking'; formantMid.frequency.value      = Math.min(4000, Math.max(300, 1400 * formantScale)); formantMid.Q.value      = 1.2;
      formantHigh.type     = 'peaking'; formantHigh.frequency.value     = Math.min(6000, Math.max(800, 2400 * formantScale)); formantHigh.Q.value     = 1.2;
      formantVeryHigh.type = 'peaking'; formantVeryHigh.frequency.value = Math.min(10000, Math.max(1500, 3400 * formantScale)); formantVeryHigh.Q.value = 1.2;

      if (effectiveSemitones < 0) {
        formantLow.gain.value      = -3.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = 4.0;
        formantVeryHigh.gain.value = 6.0;
      } else if (effectiveSemitones > 0) {
        formantLow.gain.value      = 4.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = -3.0;
        formantVeryHigh.gain.value = -5.0;
      }

      if (ctx.audioWorklet) {
        const blob = new Blob([pitchShiftWorkletSource], { type: "application/javascript" });
        const workletUrl = URL.createObjectURL(blob);
        await ctx.audioWorklet.addModule(workletUrl);

        const isCyber = store.voicePreset === "cyber";
        const pitchShiftNode = new AudioWorkletNode(ctx, "hips-pitch-shift", {
          processorOptions: {
            semitones: effectiveSemitones,
            ringModFreq: isCyber ? 75 : 0
          },
        });

        source.connect(preEmphasis);
        preEmphasis.connect(highpass);
        highpass.connect(pitchShiftNode);
        pitchShiftNode.connect(formantLow);
        formantLow.connect(formantMid);
        formantMid.connect(formantHigh);
        formantHigh.connect(formantVeryHigh);
        formantVeryHigh.connect(lowpass);
        lowpass.connect(compressor);
        URL.revokeObjectURL(workletUrl);
      } else {
        source.connect(preEmphasis);
        preEmphasis.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(compressor);
      }

      compressor.connect(dryGain);
      compressor.connect(convolver);
      dryGain.connect(ctx.destination);
      convolver.connect(wetGain);
      wetGain.connect(ctx.destination);

      setTimeout(() => {
        if (analyserFrame !== null) cancelAnimationFrame(analyserFrame);
        if (stream) stream.getTracks().forEach((t) => t.stop());
        if (ctx) ctx.close();
        setIsSpeaking(false);
        setVoiceLevel(0);
        setIsPreviewing(false);
      }, 3000);
    } catch (err) {
      console.error("Preview voice failed:", err);
      if (analyserFrame !== null) cancelAnimationFrame(analyserFrame);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (ctx) ctx.close();
      setIsSpeaking(false);
      setVoiceLevel(0);
      setIsPreviewing(false);
    }
  }, [isPreviewing, effectiveSemitones, store.voicePreset, store.reverbLevel, store.anonymizationMode]);

  const [savingState, setSavingState] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleSaveConfig = () => {
    setSavingState(true);
    setTimeout(() => {
      setSavingState(false);
      setShowConfetti(true);

      onSave({
        avatarColor: store.avatarColor,
        avatarStyle: store.avatarStyle,
        bodyType: store.bodyType,
        skinTone: store.skinTone,
        hairStyle: store.hairStyle,
        hairColor: store.hairColor,
        backgroundColor: store.backgroundColor,
        eyeColor: store.eyeColor,
        faceShape: store.faceShape,
        noseStyle: store.noseStyle,
        eyeStyle: store.eyeStyle,
        eyebrowStyle: store.eyebrowStyle,
        mouthStyle: store.mouthStyle,
        clothingType: store.clothingType,
        clothingColor: store.clothingColor,
        accessoryType: store.accessoryType,
        avatarRenderMode: "2d",
        avatar2D: store.avatar2D,
        emotion: store.emotion,
        voicePreset: store.voicePreset,
        semitones: effectiveSemitones,
        reverbLevel: store.reverbLevel,
        anonymizationMode: store.anonymizationMode,
        selectedPersona: store.selectedPersona,
        isAntiCadenceEnabled: store.isAntiCadenceEnabled,
      });

      toast.success("Configuration saved successfully!");

      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 1500);
  };

  const handleRandomizeAvatar = useCallback(() => {
    if (isShuffling) return;
    setIsShuffling(true);

    let count = 0;
    const interval = setInterval(() => {
      const hairColor = pickRandom(hairColors);
      const clothingColor = pickRandom(clothingColors);
      const faceShape = pickRandom(avatar2DOptions.faceShapes);
      const hairStyle2D = pickRandom(avatar2DOptions.hairStyles);
      const eyeShape = pickRandom(avatar2DOptions.eyeShapes);
      const eyebrow = pickRandom(avatar2DOptions.eyebrows);
      const nose = pickRandom(avatar2DOptions.noses);
      const mouth = pickRandom(avatar2DOptions.mouths);
      const facialHair = pickRandom(avatar2DOptions.facialHair);
      const accessory2D = pickRandom(avatar2DOptions.accessories);
      const clothing = pickRandom(avatar2DOptions.clothing);
      const background = pickRandom(avatar2DOptions.backgrounds);
      const skinTone = pickRandom(skinTonePalette);
      const eyeColor = pickRandom(eyeColors).hex;

      store.setAvatarConfig({
        avatarRenderMode: "2d",
        skinTone,
        hairColor: hairColor.hex,
        eyeColor,
        clothingColor: clothingColor.hex,
        avatarColor: clothingColor.hex,
      });
      store.setAvatar2D({
        faceShape: faceShape.id,
        skinTone,
        hairStyle: hairStyle2D.id,
        hairColor: hairColor.hex,
        eyeShape: eyeShape.id,
        eyeColor,
        eyebrow: eyebrow.id,
        nose: nose.id,
        mouth: mouth.id,
        facialHair: facialHair.id,
        accessory: accessory2D.id,
        clothingStyle: clothing.id,
        clothingColor: clothingColor.hex,
        background: background.id,
      });

      count++;
      if (count >= 8) {
        clearInterval(interval);
        setIsShuffling(false);
        toast.success("Avatar randomized!");
      }
    }, 60);
  }, [isShuffling, store]);

  const handleResetAvatar = () => {
    store.resetConfig();
    toast.success("Avatar reset to defaults");
  };

  const handleShareAvatar = async () => {
    const shareState = {
      bodyType: store.bodyType,
      skinTone: store.skinTone,
      hairStyle: store.hairStyle,
      hairColor: store.hairColor,
      backgroundColor: store.backgroundColor,
      eyeColor: store.eyeColor,
      faceShape: store.faceShape,
      noseStyle: store.noseStyle,
      eyeStyle: store.eyeStyle,
      eyebrowStyle: store.eyebrowStyle,
      mouthStyle: store.mouthStyle,
      clothingType: store.clothingType,
      clothingColor: store.clothingColor,
      accessoryType: store.accessoryType,
      avatarRenderMode: "2d",
      avatar2D: store.avatar2D,
      emotion: store.emotion,
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareState))));
    const url = `${window.location.origin}${window.location.pathname}#state=${encoded}`;
    await navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", `#state=${encoded}`);
    toast.success("Avatar share link copied");
  };

  const handleExportAvatar = async () => {
    try {
      const dataUrl = await store.exportAvatar2DPNG();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "hips-avatar.png";
      link.click();
      toast.success("Avatar PNG exported");
    } catch (error) {
      console.error("Avatar export failed:", error);
      toast.error("Could not export avatar PNG");
    }
  };

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        handleRandomizeAvatar();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleRandomizeAvatar]);

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes confetti-fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
            }
          `}} />
          {Array.from({ length: 80 }).map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const duration = 1.5 + Math.random() * 1.5;
            const size = 6 + Math.random() * 8;
            const colors = ["#FBBF24", "#F472B6", "#60A5FA", "#34D399", "#A78BFA", "#F87171"];
            const color = colors[idx % colors.length];
            const shape = idx % 2 === 0 ? "rounded-full" : "rounded-sm";
            return (
              <div
                key={idx}
                className={`absolute ${shape}`}
                style={{
                  left: `${left}%`,
                  top: `-20px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `confetti-fall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s 1 forwards`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl backdrop-blur-2xl overflow-hidden min-h-[640px]">
        {/* ── Left Side: Modular 2D Preview ── */}
        <div className="lg:col-span-7 flex flex-col gap-4 relative">
          <div
            id="avatar-2d-container"
            className="relative h-[520px] min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,#1e293b_0%,#0f172a_100%)] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] px-6 pt-8"
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <div className="w-[800px] h-[800px] scale-[0.5] shrink-0 origin-center flex items-center justify-center">
                <AvatarCompositor
                  config={deferredAvatar2D}
                  className="w-[800px] h-[800px] border border-white/5 shadow-2xl"
                />
              </div>
            </div>

            {/* Overlays */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm select-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-ui">
                Custom 2D Preview
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
            {/* Quick speaking test button */}
            <button
              onClick={handlePreviewVoice}
              disabled={isPreviewing}
              className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider font-ui transition-all ${
                isSpeaking
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
              } disabled:cursor-wait disabled:opacity-60`}
              type="button"
              aria-label={`Test speech, current voice activity ${Math.round(voiceLevel * 100)} percent`}
            >
              {isPreviewing ? (isSpeaking ? "Voice Ok" : "Listening...") : "Voice Test"}
            </button>

            <button
              onClick={() => dispatchHistory({ type: "UNDO" })}
              disabled={historyState.past.length === 0}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <Undo className="w-3 h-3" />
              Undo
            </button>

            <button
              onClick={() => dispatchHistory({ type: "REDO" })}
              disabled={historyState.future.length === 0}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <Redo className="w-3 h-3" />
              Redo
            </button>

            <button
              onClick={handleShareAvatar}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
              type="button"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
            <button
              onClick={handleExportAvatar}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
              type="button"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <button
              onClick={handleRandomizeAvatar}
              disabled={isShuffling}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
              type="button"
            >
              <Shuffle className={`w-3 h-3 ${isShuffling ? "animate-spin" : ""}`} />
              Random
            </button>
            <button
              onClick={handleResetAvatar}
              className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
              type="button"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* ── Right Side: Tabbed Configurator UI ── */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[520px] lg:min-h-[520px] bg-zinc-900 lg:bg-transparent rounded-t-3xl lg:rounded-none p-5 lg:p-0 -mx-5 lg:mx-0 -mb-5 lg:mb-0 border-t border-white/10 lg:border-t-0">
          <div>
            {/* Tabs header */}
            <div className="flex border-b border-white/10 pb-3 gap-2 overflow-x-auto" role="tablist">
              <button
                onClick={() => setActiveTab("identity")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  activeTab === "identity"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={activeTab === "identity"}
                type="button"
              >
                <User className="h-3.5 w-3.5" />
                Identity
              </button>
              <button
                onClick={() => setActiveTab("styling")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  activeTab === "styling"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={activeTab === "styling"}
                type="button"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Styling
              </button>
              <button
                onClick={() => setActiveTab("wardrobe")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  activeTab === "wardrobe"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={activeTab === "wardrobe"}
                type="button"
              >
                <Shirt className="h-3.5 w-3.5" />
                Wardrobe
              </button>
              {showVoice && (
                <button
                  onClick={() => setActiveTab("voice")}
                  className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                    activeTab === "voice"
                      ? "bg-white/10 text-white border-b-2 border-accent"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={activeTab === "voice"}
                type="button"
              >
                <Mic className="h-3.5 w-3.5" />
                Voice
              </button>
              )}
              <button
                onClick={() => setActiveTab("expression")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  activeTab === "expression"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={activeTab === "expression"}
                type="button"
              >
                <Smile className="h-3.5 w-3.5" />
                Expression
              </button>
            </div>

            {/* Tabs Body */}
            <div className="mt-6 min-h-[300px] overflow-y-auto max-h-[380px] pr-2">
              {/* Identity Tab */}
              {activeTab === "identity" && (
                <div className="space-y-6">
                  <div>
                    {/* Fine range slider for micro adjustments in OKLCH */}
                    <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="skin-slider" className="text-[10px] font-bold uppercase tracking-wider text-white/60 font-ui flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5" />
                          Fine Adjustment (Luminance)
                        </label>
                        <span className="text-xs font-mono font-bold text-white">
                          {skinOffset > 0 ? `+${Math.round(skinOffset * 100)}` : Math.round(skinOffset * 100)}%
                        </span>
                      </div>
                      <input
                        id="skin-slider"
                        type="range"
                        min={-0.12}
                        max={0.12}
                        step={0.01}
                        value={skinOffset}
                        onChange={(e) => setSkinOffset(Number(e.target.value))}
                        className="w-full accent-accent bg-zinc-800 cursor-ew-resize"
                      />
                      <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
                        <span>Lighter</span>
                        <span>Neutral</span>
                        <span>Darker</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Styling Tab */}
              {activeTab === "styling" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Select Hair Style
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Hair Style">
                      {avatar2DOptions.hairStyles.map((hair) => {
                        const isSelected = store.avatar2D.hairStyle === hair.id;
                        return (
                          <button
                            key={hair.id}
                            onClick={() => store.setAvatar2D({ hairStyle: hair.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={hair.label}
                          >
                            <MiniAvatarPreview partType="hairStyle" partId={hair.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Select Hair Color
                    </h3>
                    <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Hair Color">
                      {hairColors.map((color) => {
                        const isSelected = store.avatar2D.hairColor.toLowerCase() === color.hex.toLowerCase();
                        return (
                          <button
                            key={color.hex}
                            onClick={() => {
                              store.setAvatar2D({ hairColor: color.hex });
                              store.setAvatarConfig({ hairColor: color.hex });
                            }}
                            className={`aspect-square rounded-xl flex items-center justify-center transition hover:scale-105`}
                            style={{
                              backgroundColor: color.hex,
                              boxShadow: isSelected
                                ? `0 0 0 2px #09090b, 0 0 0 4px ${color.hex}`
                                : undefined,
                            }}
                            type="button"
                            aria-label={color.label}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={store.avatar2D.hairColor}
                        onChange={(event) => {
                          store.setAvatar2D({ hairColor: event.target.value });
                          store.setAvatarConfig({ hairColor: event.target.value });
                        }}
                        className="h-9 w-11 rounded-lg border border-white/10 bg-transparent"
                        aria-label="Custom hair color"
                      />
                      <input
                        type="text"
                        value={store.avatar2D.hairColor}
                        onChange={(event) => {
                          store.setAvatar2D({ hairColor: event.target.value });
                          store.setAvatarConfig({ hairColor: event.target.value });
                        }}
                        className="h-9 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 text-xs font-mono text-white"
                        aria-label="Hair color hex value"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Eyes
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Eye Style">
                      {avatar2DOptions.eyeShapes.map((eye) => {
                        const isSelected = store.avatar2D.eyeShape === eye.id;
                        return (
                          <button
                            key={eye.id}
                            onClick={() => store.setAvatar2D({ eyeShape: eye.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={eye.label}
                          >
                            <MiniAvatarPreview partType="eyeShape" partId={eye.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Brows
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Brow Style">
                      {avatar2DOptions.eyebrows.map((brow) => {
                        const isSelected = store.avatar2D.eyebrow === brow.id;
                        return (
                          <button
                            key={brow.id}
                            onClick={() => store.setAvatar2D({ eyebrow: brow.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={brow.label}
                          >
                            <MiniAvatarPreview partType="eyebrow" partId={brow.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Nose
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Nose Style">
                      {avatar2DOptions.noses.map((nose) => {
                        const isSelected = store.avatar2D.nose === nose.id;
                        return (
                          <button
                            key={nose.id}
                            onClick={() => store.setAvatar2D({ nose: nose.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={nose.label}
                          >
                            <MiniAvatarPreview partType="nose" partId={nose.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Mouth
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Mouth Style">
                      {avatar2DOptions.mouths.map((mouth) => {
                        const isSelected = store.avatar2D.mouth === mouth.id && store.avatar2D.expression === "neutral";
                        return (
                          <button
                            key={mouth.id}
                            onClick={() => store.setAvatar2D({ mouth: mouth.id, expression: "neutral" })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={mouth.label}
                          >
                            <MiniAvatarPreview partType="mouth" partId={mouth.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Eye Color
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" role="radiogroup" aria-label="Eye Color">
                      {eyeColors.map((color) => {
                        const isSelected = store.avatar2D.eyeColor.toLowerCase() === color.hex.toLowerCase();
                        return (
                          <button
                            key={color.hex}
                            onClick={() => {
                              store.setAvatar2D({ eyeColor: color.hex });
                              store.setAvatarConfig({ eyeColor: color.hex });
                            }}
                            className="aspect-square rounded-full flex items-center justify-center transition hover:scale-105"
                            style={{
                              backgroundColor: color.hex,
                              boxShadow: isSelected
                                ? `0 0 0 2px #09090b, 0 0 0 4px ${color.hex}`
                                : undefined,
                            }}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`${color.label} eye color`}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Wardrobe Tab */}
              {activeTab === "wardrobe" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Clothing Style
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Clothing Style">
                      {avatar2DOptions.clothing.map((item) => {
                        const isSelected = store.avatar2D.clothingStyle === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => store.setAvatar2D({ clothingStyle: item.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={item.label}
                          >
                            <MiniAvatarPreview partType="clothingStyle" partId={item.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Clothing Color
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" role="radiogroup" aria-label="Clothing Color">
                      {clothingColors.map((color) => {
                        const isSelected = store.avatar2D.clothingColor.toLowerCase() === color.hex.toLowerCase();
                        return (
                          <button
                            key={color.hex}
                            onClick={() => {
                              store.setAvatar2D({ clothingColor: color.hex });
                              store.setAvatarConfig({ clothingColor: color.hex, avatarColor: color.hex });
                            }}
                            className={`aspect-square rounded-xl flex items-center justify-center transition hover:scale-105`}
                            style={{
                              backgroundColor: color.hex,
                              boxShadow: isSelected
                                ? `0 0 0 2px #09090b, 0 0 0 4px ${color.hex}`
                                : undefined,
                            }}
                            type="button"
                            aria-label={color.label}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={store.avatar2D.clothingColor}
                        onChange={(event) => {
                          store.setAvatar2D({ clothingColor: event.target.value });
                          store.setAvatarConfig({ clothingColor: event.target.value, avatarColor: event.target.value });
                        }}
                        className="h-9 w-11 rounded-lg border border-white/10 bg-transparent"
                        aria-label="Custom clothing color"
                      />
                      <input
                        type="text"
                        value={store.avatar2D.clothingColor}
                        onChange={(event) => {
                          store.setAvatar2D({ clothingColor: event.target.value });
                          store.setAvatarConfig({ clothingColor: event.target.value, avatarColor: event.target.value });
                        }}
                        className="h-9 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 text-xs font-mono text-white"
                        aria-label="Clothing color hex value"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Facial Hair
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial Hair">
                      {avatar2DOptions.facialHair.map((item) => {
                        const isSelected = store.avatar2D.facialHair === item.id;
                        return (
                          <button
                            key={item.id ?? "none"}
                            onClick={() => store.setAvatar2D({ facialHair: item.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={item.label}
                          >
                            <MiniAvatarPreview partType="facialHair" partId={item.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Accessories
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Accessories">
                      {avatar2DOptions.accessories.map((acc) => {
                        const isSelected = store.avatar2D.accessory === acc.id;
                        return (
                          <button
                            key={acc.id ?? "none"}
                            onClick={() => store.setAvatar2D({ accessory: acc.id })}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={acc.label}
                          >
                            <MiniAvatarPreview partType="accessory" partId={acc.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Background
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Background">
                      {avatar2DOptions.backgrounds.map((background) => {
                        const isSelected = store.avatar2D.background === background.id;
                        return (
                          <button
                            key={background.id}
                            onClick={() => store.setAvatar2D({ background: background.id })}
                            className={`rounded-lg border px-3 py-2 text-center transition-all ${
                              isSelected
                                ? "border-accent bg-accent/8 text-accent font-bold"
                                : "border-white/5 text-white/60 hover:border-white/15 hover:text-white"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <span className="text-xs font-ui">{background.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Tab */}
              {activeTab === "voice" && showVoice && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui block mb-3">
                      Voice Anonymisation Mode
                    </h3>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Anonymisation Mode">
                      <button
                        onClick={() => store.setAvatarConfig({ anonymizationMode: "dsp" })}
                        className={`py-3 px-4 rounded-xl text-left border transition-all ${
                          store.anonymizationMode === "dsp"
                            ? "border-accent bg-accent/8 text-accent font-bold"
                            : "border-white/10 text-white/60 hover:border-white/20"
                        }`}
                        type="button"
                        role="radio"
                        aria-checked={store.anonymizationMode === "dsp"}
                      >
                        <div className="text-xs font-bold font-ui">Tier 1: Effects Mode</div>
                        <div className="text-[9px] opacity-70 font-body mt-0.5">Available now - browser DSP</div>
                      </button>
                      <button
                        onClick={() => {
                          if (!neuralBackendAvailable) {
                            toast.error("Enhanced Neural is locked until the H.I.P.S. voice-conversion backend is live.");
                            return;
                          }
                          store.setAvatarConfig({ anonymizationMode: "neural" });
                        }}
                        className={`py-3 px-4 rounded-xl text-left border transition-all ${
                          store.anonymizationMode === "neural"
                            ? "border-accent bg-accent/8 text-accent font-bold"
                            : "border-white/10 text-white/40 cursor-not-allowed opacity-60"
                        }`}
                        type="button"
                        role="radio"
                        aria-checked={store.anonymizationMode === "neural"}
                        disabled={!neuralBackendAvailable}
                      >
                        <div className="text-xs font-bold font-ui">Tier 2: Enhanced Neural</div>
                        <div className="text-[9px] opacity-70 font-body mt-0.5">
                          {neuralBackendAvailable ? "Backend ready" : "Locked (VPS server offline)"}
                        </div>
                      </button>
                    </div>
                    {!neuralBackendAvailable && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-[10px] text-amber-200 font-body leading-relaxed">
                        <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <span>
                          Effects Mode is the only live voice masking path in the browser sandbox. Raw unmasked microphone audio is never published.
                        </span>
                      </div>
                    )}
                  </div>

                  {store.anonymizationMode === "dsp" ? (
                    <div className="space-y-4">
                      <div className="space-y-2" role="radiogroup" aria-label="Voice Presets">
                        {voicePresets.map((voice) => (
                          <button
                            key={voice.id}
                            onClick={() => {
                              store.setAvatarConfig({ voicePreset: voice.id });
                              if (voice.id !== "custom") {
                                store.setAvatarConfig({ semitones: voice.semitones });
                              }
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                              store.voicePreset === voice.id
                                ? "border-accent bg-accent/8 text-accent font-bold"
                                : "border-white/5 text-white/60 hover:border-white/15"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={store.voicePreset === voice.id}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-ui">{voice.label}</span>
                              {store.voicePreset === voice.id && <Check className="w-4 h-4 text-accent" />}
                            </div>
                            <p className="text-[10px] opacity-70 font-body mt-0.5">{voice.description}</p>
                          </button>
                        ))}
                      </div>

                      {store.voicePreset === "custom" && (
                        <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="semitone-slider" className="text-[10px] font-bold uppercase tracking-wider text-white/60 font-ui flex items-center gap-1">
                              <Sliders className="w-3 h-3" />
                              Pitch Shift (Semitones)
                            </label>
                            <span className="text-xs font-mono font-bold text-white">
                              {store.semitones > 0 ? `+${store.semitones}` : store.semitones} st
                            </span>
                          </div>
                          <input
                            id="semitone-slider"
                            type="range"
                            min={-6}
                            max={6}
                            step={1}
                            value={store.semitones}
                            onChange={(e) => store.setAvatarConfig({ semitones: Number(e.target.value) })}
                            className="w-full accent-accent bg-zinc-800"
                          />
                          <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
                            <span>−6</span>
                            <span>0</span>
                            <span>+6</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/60 font-ui mb-2">
                          Reverb Pacing (Visual Size Effect)
                        </h4>
                        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Reverb Intensity">
                          {(["low", "medium", "high"] as const).map((level) => (
                            <button
                              key={level}
                              onClick={() => store.setAvatarConfig({ reverbLevel: level })}
                              className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-ui border transition ${
                                store.reverbLevel === level
                                  ? "bg-white text-zinc-950 border-white font-bold"
                                  : "bg-transparent text-white/60 border-white/10 hover:border-white/20"
                              }`}
                              type="button"
                              role="radio"
                              aria-checked={store.reverbLevel === level}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-ui block mb-3">
                          Select Voice Persona
                        </h4>
                        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Voice Persona">
                          <button
                            onClick={() => store.setAvatarConfig({ selectedPersona: "clara" })}
                            className={`p-4 rounded-xl text-left border transition ${
                              store.selectedPersona === "clara"
                                ? "border-accent bg-accent/8 text-accent font-bold"
                                : "border-white/5 text-white/60 hover:border-white/15"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={store.selectedPersona === "clara"}
                          >
                            <div className="font-bold text-sm font-ui">Clara</div>
                            <div className="text-[9px] opacity-75 font-body mt-1 leading-relaxed">Soft, warm, and highly conversational.</div>
                          </button>
                          <button
                            onClick={() => store.setAvatarConfig({ selectedPersona: "arthur" })}
                            className={`p-4 rounded-xl text-left border transition ${
                              store.selectedPersona === "arthur"
                                ? "border-accent bg-accent/8 text-accent font-bold"
                                : "border-white/5 text-white/60 hover:border-white/15"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={store.selectedPersona === "arthur"}
                          >
                            <div className="font-bold text-sm font-ui">Arthur</div>
                            <div className="text-[9px] opacity-75 font-body mt-1 leading-relaxed">Steady, deep, and professional register.</div>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-zinc-900/50">
                        <div className="pr-4">
                          <label htmlFor="anti-cadence" className="text-xs font-bold font-ui text-white block">
                            Anti-Cadence Speech Delay
                          </label>
                          <span className="text-[9px] text-white/40 font-body leading-normal block mt-0.5">
                            Randomly offsets pauses and breathing intervals to block speech cadence biometric profiling.
                          </span>
                        </div>
                        <button
                          id="anti-cadence"
                          onClick={() => store.setAvatarConfig({ isAntiCadenceEnabled: !store.isAntiCadenceEnabled })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 ${
                            store.isAntiCadenceEnabled ? "bg-accent" : "bg-zinc-700"
                          }`}
                          role="switch"
                          aria-checked={store.isAntiCadenceEnabled}
                          type="button"
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                              store.isAntiCadenceEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preview button */}
                  <button
                    onClick={handlePreviewVoice}
                    disabled={isPreviewing}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-white/10 text-white text-xs font-bold uppercase tracking-wider font-ui hover:bg-white/5 disabled:opacity-50 transition"
                    type="button"
                  >
                    {isPreviewing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                    {isPreviewing ? "Listening... (3s)" : "▶ Preview Voice Output"}
                  </button>
                </div>
              )}

              {/* Expression Tab */}
              {activeTab === "expression" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
                      Facial Expression
                    </h3>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial Expression">
                      {avatar2DOptions.expressions.map((expression) => {
                        const isSelected = store.avatar2D.expression === expression.id;
                        return (
                          <button
                            key={expression.id}
                            onClick={() => {
                              store.setAvatar2D({ expression: expression.id });
                              store.setAvatarConfig({
                                emotion: expression.id === "concerned" ? "distressed" : "neutral",
                              });
                            }}
                            className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                              isSelected
                                ? "border-accent ring-2 ring-accent/40"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            title={expression.label}
                          >
                            <MiniAvatarPreview partType="expression" partId={expression.id} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Save and Cancel Actions ── */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3 font-ui">
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={saving || savingState}
                className="py-3 px-6 rounded-xl text-white/70 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                type="button"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveConfig}
              disabled={saving || savingState}
              className="py-3 px-8 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-accent/25 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
              type="button"
            >
              {saving || savingState ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving || savingState ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
