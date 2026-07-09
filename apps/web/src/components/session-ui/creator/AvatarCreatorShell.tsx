"use client";

import { useDeferredValue, useCallback, useEffect, useRef, useState } from "react";
import type { AvatarBodyType, Avatar2DConfig, AvatarEmotion } from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { toast } from "sonner";
import { User, Sparkles, Shirt, Mic, Smile } from "lucide-react";

import { useAvatarStore } from "@/store/useAvatarStore";
import { normalizeAvatarEmotion } from "../avatar-options";
import { getBrowserMediaDevices } from "@/lib/browser-media";

import {
  MAN_HAIR_STYLES,
  WOMAN_HAIR_STYLES,
  voicePresets,
  pickRandom,
} from "./creator-constants";

import { useAvatarDraft } from "./useAvatarDraft";
import { useAvatarHistory } from "./useAvatarHistory";
import { useAvatarLiveSync } from "./useAvatarLiveSync";

import { AvatarPreviewStage } from "./AvatarPreviewStage";
import { IdentityPanel } from "./IdentityPanel";
import { HairPanel } from "./HairPanel";
import { FacePanel } from "./FacePanel";
import { WardrobePanel } from "./WardrobePanel";
import { VoicePanel } from "./VoicePanel";
import { ExpressionPanel } from "./ExpressionPanel";
import { AvatarExportMenu } from "./AvatarExportMenu";

interface AvatarCreatorShellProps {
  initialConfig?: {
    avatarColor?: string;
    avatarStyle?: number;
    bodyType?: AvatarBodyType;
    skinTone?: string;
    hairStyle?: number;
    hairColor?: string;
    backgroundColor?: string;
    eyeColor?: string;
    faceShape?: number;
    noseStyle?: number;
    eyeStyle?: any;
    eyebrowStyle?: any;
    mouthStyle?: any;
    clothingType?: any;
    clothingColor?: string;
    accessoryType?: any;
    avatarRenderMode?: any;
    emotion?: AvatarEmotion;
    avatar2D?: Avatar2DConfig;
    voicePreset?: string;
    semitones?: number;
    reverbLevel?: "low" | "medium" | "high";
    anonymizationMode?: "dsp" | "neural";
    selectedPersona?: "clara" | "arthur";
    isAntiCadenceEnabled?: boolean;
    isEnhancedNeuralConsentAccepted?: boolean;
  };
  onSave: (config: any) => void;
  onCancel?: () => void;
  showVoice?: boolean;
  saving?: boolean;
}

export function AvatarCreatorShell({
  initialConfig,
  onSave,
  onCancel,
  showVoice = true,
  saving = false,
}: AvatarCreatorShellProps) {
  const rawStore = useAvatarStore();
  const hydrateAvatarConfig = rawStore.setAvatarConfig;

  const draft = useAvatarDraft(initialConfig, DEFAULT_AVATAR_2D);
  const history = useAvatarHistory(initialConfig?.avatar2D || rawStore.avatar2D || DEFAULT_AVATAR_2D);
  const [voicePreviewStatus, setVoicePreviewStatus] = useState<string | null>(null);
  const [voicePreviewAudioUrl, setVoicePreviewAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!initialConfig) return;

    hydrateAvatarConfig({
      ...(initialConfig.voicePreset ? { voicePreset: initialConfig.voicePreset } : {}),
      ...(typeof initialConfig.semitones === "number" ? { semitones: initialConfig.semitones } : {}),
      ...(initialConfig.reverbLevel ? { reverbLevel: initialConfig.reverbLevel } : {}),
      ...(initialConfig.anonymizationMode ? { anonymizationMode: initialConfig.anonymizationMode } : {}),
      ...(initialConfig.selectedPersona ? { selectedPersona: initialConfig.selectedPersona } : {}),
      ...(typeof initialConfig.isAntiCadenceEnabled === "boolean" ? { isAntiCadenceEnabled: initialConfig.isAntiCadenceEnabled } : {}),
      ...(typeof initialConfig.isEnhancedNeuralConsentAccepted === "boolean" ? { isEnhancedNeuralConsentAccepted: initialConfig.isEnhancedNeuralConsentAccepted } : {}),
      ...(initialConfig.emotion ? { emotion: normalizeAvatarEmotion(initialConfig.emotion) } : {}),
    });
  }, [hydrateAvatarConfig, initialConfig]);

  const setLocalAvatar2D = (config: Partial<Avatar2DConfig>) => {
    history.set({
      ...history.state.present,
      ...config,
      version: 1,
    });
  };

  const store = new Proxy(rawStore, {
    get(target, prop, receiver) {
      if (prop === "avatar2D") {
        return history.state.present;
      }
      if (prop === "setAvatar2D") {
        return setLocalAvatar2D;
      }
      if (prop === "resetAvatar2D") {
        return () => history.reset(DEFAULT_AVATAR_2D);
      }
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === "function" && prop === "setAvatarConfig") {
        return (...args: any[]) => {
          draft.startTransition(() => {
            val.apply(target, args);
          });
        };
      }
      return val;
    },
  });

  const deferredAvatar2D = useDeferredValue(history.state.present);

  const effectiveSemitones = store.voicePreset === "custom"
    ? store.semitones
    : (voicePresets.find((v) => v.id === store.voicePreset)?.semitones ?? 0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previewPlaybackRef = useRef<HTMLAudioElement | null>(null);
  const previewPlaybackUrlRef = useRef<string | null>(null);
  const previewRecordingTimerRef = useRef<number | null>(null);
  const previewActiveRef = useRef(false);

  const stopVoicePreview = useCallback(() => {
    previewActiveRef.current = false;
    if (previewRecordingTimerRef.current !== null) {
      window.clearTimeout(previewRecordingTimerRef.current);
      previewRecordingTimerRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (previewPlaybackRef.current) {
      previewPlaybackRef.current.pause();
      previewPlaybackRef.current.src = "";
      previewPlaybackRef.current.remove();
      previewPlaybackRef.current = null;
    }
    if (previewPlaybackUrlRef.current) {
      URL.revokeObjectURL(previewPlaybackUrlRef.current);
      previewPlaybackUrlRef.current = null;
    }
    setVoicePreviewAudioUrl(null);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVoicePreviewStatus(null);
    draft.setIsSpeaking(false);
    draft.setVoiceLevel(0);
    draft.setIsPreviewing(false);
  }, [draft]);

  const playPreviewBlob = useCallback(async (blob: Blob, successStatus: string) => {
    if (previewPlaybackRef.current) {
      previewPlaybackRef.current.pause();
      previewPlaybackRef.current.src = "";
      previewPlaybackRef.current.remove();
      previewPlaybackRef.current = null;
    }
    if (previewPlaybackUrlRef.current) {
      URL.revokeObjectURL(previewPlaybackUrlRef.current);
      previewPlaybackUrlRef.current = null;
    }

    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.autoplay = true;
    audio.volume = 1;
    audio.controls = true;
    audio.setAttribute("playsinline", "true");
    audio.className = "hidden";
    previewPlaybackUrlRef.current = url;
    previewPlaybackRef.current = audio;
    setVoicePreviewAudioUrl(url);
    document.body.appendChild(audio);
    setVoicePreviewStatus(successStatus);
    await audio.play();
  }, []);

  const failVoicePreview = useCallback((message: string, error?: unknown) => {
    if (error) {
      console.warn("[AvatarCreatorShell] Voice preview failed:", error);
    }
    stopVoicePreview();
    setVoicePreviewStatus(message);
    toast.error(message);
  }, [stopVoicePreview]);

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

  const handleSpeakerTest = useCallback(async () => {
    stopVoicePreview();
    try {
      setVoicePreviewStatus("Playing speaker test tone...");
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
      window.setTimeout(() => {
        void ctx.close().catch(() => undefined);
        if (audioContextRef.current === ctx) audioContextRef.current = null;
      }, 700);
      setVoicePreviewStatus("Speaker test sent. If you heard a beep, output works.");
    } catch (error) {
      failVoicePreview("Speaker test failed. Browser audio output may be blocked.", error);
    }
  }, [failVoicePreview, stopVoicePreview]);

  const handleRawMicSample = useCallback(async () => {
    stopVoicePreview();
    if (typeof MediaRecorder === "undefined") {
      failVoicePreview("This browser cannot record a mic sample here.");
      return;
    }

    try {
      setVoicePreviewStatus("Requesting microphone...");
      draft.setIsPreviewing(true);
      const stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setVoicePreviewStatus("Recording raw mic sample. Speak now...");

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());
        if (mediaStreamRef.current === stream) mediaStreamRef.current = null;
        draft.setIsPreviewing(false);
        if (chunks.length === 0) {
          setVoicePreviewStatus("Mic recording produced no audio data.");
          toast.error("Mic recording produced no audio data.");
          return;
        }
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        playPreviewBlob(blob, "Raw mic sample played. If you heard it, mic capture and playback work.").catch((error) => {
          failVoicePreview("Raw mic sample recorded, but playback was blocked.", error);
        });
      });
      recorder.start();
      window.setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 1800);
    } catch (error) {
      failVoicePreview("Raw mic sample failed. Check microphone permission for this site.", error);
    }
  }, [draft, failVoicePreview, playPreviewBlob, stopVoicePreview]);

  const handlePreviewVoice = useCallback(async () => {
    // Toggle off if already previewing
    if (previewActiveRef.current || draft.isPreviewing) {
      stopVoicePreview();
      return;
    }
    if (store.anonymizationMode === "neural") {
      toast.error("Enhanced Neural is locked until the server can return converted audio into the session. Use Effects Mode for live microphone audio.");
      return;
    }
    draft.setIsPreviewing(true);
    draft.setIsSpeaking(false);
    draft.setVoiceLevel(0);
    previewActiveRef.current = true;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioContextRef.current = ctx;
    setVoicePreviewStatus("Starting Effects Mode preview...");

    try {
      setVoicePreviewStatus("Requesting microphone...");
      const stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setVoicePreviewStatus("Microphone captured. Speak now...");
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);

      const samples = new Uint8Array(analyser.fftSize);
      let speaking = false;
      const monitorVoiceActivity = () => {
        if (!previewActiveRef.current) return; // Guard if stopped mid-loop
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
        draft.setVoiceLevel(level);
        draft.setIsSpeaking(speaking);
        animationFrameRef.current = requestAnimationFrame(monitorVoiceActivity);
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
      const monitorGain = ctx.createGain();
      const recorderDestination = typeof MediaRecorder !== "undefined"
        ? ctx.createMediaStreamDestination()
        : null;

      const dryLevel = store.voicePreset === "deep" ? 0.8 : (store.voicePreset === "high" ? 0.85 : (store.voicePreset === "cyber" ? 0.85 : 0.78));
      const wetLevel = store.voicePreset === "deep" ? 0.2 : (store.voicePreset === "high" ? 0.15 : (store.voicePreset === "cyber" ? 0.15 : 0.22));

      dryGain.gain.value = dryLevel;
      wetGain.gain.value = wetLevel;
      monitorGain.gain.value = 1.15;

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

      // Keep creator preview on the reliable non-worklet monitor path.
      // The full in-session Effects Mode still uses the low-latency processor.
      source.connect(preEmphasis);
      preEmphasis.connect(highpass);
      highpass.connect(formantLow);
      formantLow.connect(formantMid);
      formantMid.connect(formantHigh);
      formantHigh.connect(formantVeryHigh);
      formantVeryHigh.connect(lowpass);
      lowpass.connect(compressor);

      compressor.connect(dryGain);
      compressor.connect(convolver);
      dryGain.connect(monitorGain);
      convolver.connect(wetGain);
      wetGain.connect(monitorGain);
      monitorGain.connect(ctx.destination);
      if (recorderDestination) {
        monitorGain.connect(recorderDestination);
      }

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (recorderDestination && typeof MediaRecorder !== "undefined") {
        setVoicePreviewStatus("Recording masked sample. Speak now...");
        const chunks: BlobPart[] = [];
        const recorder = new MediaRecorder(recorderDestination.stream);
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        });
        recorder.addEventListener("stop", () => {
          previewRecordingTimerRef.current = null;
          if (!previewActiveRef.current) return;
          if (chunks.length === 0) {
            setVoicePreviewStatus("Masked sample produced no audio data.");
            toast.error("Masked sample produced no audio data.");
            return;
          }
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          playPreviewBlob(blob, "Masked Effects Mode sample played.").catch((playbackError) => {
            failVoicePreview("Masked sample recorded, but browser playback was blocked.", playbackError);
          });
        });
        recorder.start();
        previewRecordingTimerRef.current = window.setTimeout(() => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }, 1800);
      } else {
        setVoicePreviewStatus("Live preview is running. Sample recording is unavailable in this browser.");
      }
    } catch (err) {
      failVoicePreview("Voice test could not start. Check microphone permission and speaker output.", err);
    }
  }, [draft, effectiveSemitones, failVoicePreview, playPreviewBlob, store.voicePreset, store.reverbLevel, store.anonymizationMode, stopVoicePreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoicePreview();
    };
  }, [stopVoicePreview]);

  // Stop preview when voice settings change
  useEffect(() => {
    if (draft.isPreviewing) {
      stopVoicePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.voicePreset, store.semitones, store.reverbLevel]);

  const handleRandomizeAvatar = useCallback(() => {
    if (draft.isShuffling) return;
    draft.setIsShuffling(true);

    let count = 0;
    const interval = setInterval(() => {
      const isMan = draft.bodyType === 0;
      const validHairStyles = isMan ? MAN_HAIR_STYLES : WOMAN_HAIR_STYLES;
      const { avatar2DOptions, skinTonePalette, hairColors, clothingColors } = require("./creator-constants");
      const { pickRandom } = require("./creator-constants");
      const registryOptions = require("@/lib/avatar-asset-registry").avatar2DOptions;

      const hairColor = pickRandom(hairColors);
      const clothingColor = pickRandom(clothingColors);
      const faceShape = pickRandom(registryOptions.faceShapes);
      const hairStyle2D = pickRandom(registryOptions.hairStyles.filter((h: any) => validHairStyles.includes(h.id)));
      const eyebrow = pickRandom(registryOptions.eyebrows);
      const mouth = pickRandom(registryOptions.mouths);
      const facialHair = isMan ? pickRandom(registryOptions.facialHair) : { id: null };
      const accessory2D = pickRandom(registryOptions.accessories);
      const clothing = pickRandom(registryOptions.clothing);
      const background = pickRandom(registryOptions.backgrounds);
      const skinTone = pickRandom(require("@/lib/avatar-asset-registry").skinTonePalette);

      store.setAvatar2D({
        faceShape: faceShape.id,
        skinTone,
        hairStyle: hairStyle2D.id,
        hairColor: hairColor.hex,
        eyeShape: "eyes_almond_01",
        eyeColor: "#1F1B18",
        eyebrow: eyebrow.id,
        nose: "nose_button_01",
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
        draft.setIsShuffling(false);
        toast.success("Avatar randomized!");
      }
    }, 60);
  }, [draft, store]);

  const handleResetAvatar = () => {
    store.resetAvatar2D();
    toast.success("Avatar reset to defaults");
  };

  const handleShareAvatar = async () => {
    const shareState = {
      bodyType: draft.bodyType,
      skinTone: store.avatar2D.skinTone,
      hairStyle: 0,
      hairColor: store.avatar2D.hairColor,
      backgroundColor: store.avatar2D.background,
      eyeColor: store.avatar2D.eyeColor,
      faceShape: 0,
      noseStyle: 0,
      eyeStyle: 0,
      eyebrowStyle: 0,
      mouthStyle: 0,
      clothingType: 0,
      clothingColor: store.avatar2D.clothingColor,
      accessoryType: 0,
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

  useAvatarLiveSync({
    baseSkinTone: draft.baseSkinTone,
    skinOffset: draft.skinOffset,
    presentConfig: history.state.present,
    setLocalAvatar2D,
    handleRandomizeAvatar,
  });

  const handleSaveConfig = () => {
    draft.setSavingState(true);
    setTimeout(() => {
      draft.setSavingState(false);
      draft.setShowConfetti(true);

      // Commit to Zustand store
      rawStore.setAvatar2D(history.state.present);

      onSave({
        avatarColor: history.state.present.clothingColor,
        avatarStyle: 0,
        bodyType: draft.bodyType,
        skinTone: history.state.present.skinTone,
        hairStyle: 0,
        hairColor: history.state.present.hairColor,
        backgroundColor: history.state.present.background,
        eyeColor: history.state.present.eyeColor,
        faceShape: 0,
        noseStyle: 0,
        eyeStyle: 0,
        eyebrowStyle: 0,
        mouthStyle: 0,
        clothingType: 0,
        clothingColor: history.state.present.clothingColor,
        accessoryType: 0,
        avatarRenderMode: "2d",
        avatar2D: history.state.present,
        emotion: store.emotion,
        voicePreset: store.voicePreset,
        semitones: effectiveSemitones,
        reverbLevel: store.reverbLevel,
        anonymizationMode: store.anonymizationMode,
        selectedPersona: store.selectedPersona,
        isAntiCadenceEnabled: store.isAntiCadenceEnabled,
        isEnhancedNeuralConsentAccepted: store.isEnhancedNeuralConsentAccepted,
      });

      toast.success("Configuration saved successfully!");
      setTimeout(() => {
        draft.setShowConfetti(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      {draft.showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes confetti-fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
            }
          `}} />
          {Array.from({ length: 50 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 2 + 2;
            const size = Math.random() * 8 + 6;
            const color = pickRandom(["#06b6d4", "#a855f7", "#10b981", "#fbbf24", "#f43f5e"]);
            return (
              <div
                key={i}
                className="absolute top-[-20px] rounded-sm opacity-90"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `confetti-fall ${duration}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 lg:gap-8 h-full items-stretch">
        <AvatarPreviewStage
          deferredAvatar2D={deferredAvatar2D}
          isSpeaking={draft.isSpeaking}
          voiceLevel={draft.voiceLevel}
          isPreviewing={draft.isPreviewing}
          voicePreviewStatus={voicePreviewStatus}
          voicePreviewAudioUrl={voicePreviewAudioUrl}
          isShuffling={draft.isShuffling}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          handlePreviewVoice={handlePreviewVoice}
          handleUndo={history.undo}
          handleRedo={history.redo}
          handleShareAvatar={handleShareAvatar}
          handleExportAvatar={handleExportAvatar}
          handleRandomizeAvatar={handleRandomizeAvatar}
          handleResetAvatar={handleResetAvatar}
        />

        {/* ── Right Side: Tabbed Configurator UI ── */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[520px] lg:min-h-[520px] bg-zinc-900 lg:bg-transparent rounded-t-3xl lg:rounded-none p-5 lg:p-0 -mx-5 lg:mx-0 -mb-5 lg:mb-0 border-t border-white/10 lg:border-t-0">
          <div>
            {/* Tabs header */}
            <div className="flex border-b border-white/10 pb-3 gap-2 overflow-x-auto" role="tablist">
              <button
                onClick={() => draft.setActiveTab("identity")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  draft.activeTab === "identity"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={draft.activeTab === "identity"}
                type="button"
              >
                <User className="h-3.5 w-3.5" />
                Identity
              </button>
              <button
                onClick={() => draft.setActiveTab("styling")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  draft.activeTab === "styling"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={draft.activeTab === "styling"}
                type="button"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Styling
              </button>
              <button
                onClick={() => draft.setActiveTab("wardrobe")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  draft.activeTab === "wardrobe"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={draft.activeTab === "wardrobe"}
                type="button"
              >
                <Shirt className="h-3.5 w-3.5" />
                Wardrobe
              </button>
              {showVoice && (
                <button
                  onClick={() => draft.setActiveTab("voice")}
                  className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                    draft.activeTab === "voice"
                      ? "bg-white/10 text-white border-b-2 border-accent"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                  role="tab"
                  aria-selected={draft.activeTab === "voice"}
                  type="button"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Voice
                </button>
              )}
              <button
                onClick={() => draft.setActiveTab("expression")}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold font-ui uppercase tracking-wider transition ${
                  draft.activeTab === "expression"
                    ? "bg-white/10 text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                role="tab"
                aria-selected={draft.activeTab === "expression"}
                type="button"
              >
                <Smile className="h-3.5 w-3.5" />
                Expression
              </button>
            </div>

            {/* Tabs Body */}
            <div className="mt-6 min-h-[300px] overflow-y-auto max-h-[380px] pr-2">
              {draft.activeTab === "identity" && (
                <IdentityPanel
                  bodyType={draft.bodyType}
                  setBodyType={draft.setBodyType}
                  skinOffset={draft.skinOffset}
                  setSkinOffset={draft.setSkinOffset}
                  setLocalAvatar2D={setLocalAvatar2D}
                />
              )}

              {draft.activeTab === "styling" && (
                <div className="space-y-6">
                  <HairPanel
                    bodyType={draft.bodyType}
                    avatar2D={history.state.present}
                    setLocalAvatar2D={setLocalAvatar2D}
                  />
                  <FacePanel
                    avatar2D={history.state.present}
                    setLocalAvatar2D={setLocalAvatar2D}
                  />
                </div>
              )}

              {draft.activeTab === "wardrobe" && (
                <WardrobePanel
                  bodyType={draft.bodyType}
                  avatar2D={history.state.present}
                  setLocalAvatar2D={setLocalAvatar2D}
                />
              )}

              {draft.activeTab === "voice" && showVoice && (
                <VoicePanel
                  voicePreset={store.voicePreset}
                  semitones={store.semitones}
                  reverbLevel={store.reverbLevel}
                  anonymizationMode={store.anonymizationMode}
                  selectedPersona={store.selectedPersona}
                  isAntiCadenceEnabled={store.isAntiCadenceEnabled}
                  isEnhancedNeuralConsentAccepted={store.isEnhancedNeuralConsentAccepted}
                  neuralBackendAvailable={draft.neuralBackendAvailable}
                  isPreviewing={draft.isPreviewing}
                  isSpeaking={draft.isSpeaking}
                  effectiveSemitones={effectiveSemitones}
                  voicePreviewStatus={voicePreviewStatus}
                  voicePreviewAudioUrl={voicePreviewAudioUrl}
                  setAvatarConfig={store.setAvatarConfig}
                  handleSpeakerTest={handleSpeakerTest}
                  handleRawMicSample={handleRawMicSample}
                  handlePreviewVoice={handlePreviewVoice}
                />
              )}

              {draft.activeTab === "expression" && (
                <ExpressionPanel
                  avatar2D={history.state.present}
                  setLocalAvatar2D={setLocalAvatar2D}
                  setAvatarConfig={store.setAvatarConfig}
                />
              )}
            </div>
          </div>

          <AvatarExportMenu
            saving={saving}
            savingState={draft.savingState}
            onCancel={onCancel}
            handleSaveConfig={handleSaveConfig}
          />
        </div>
      </div>
    </>
  );
}
