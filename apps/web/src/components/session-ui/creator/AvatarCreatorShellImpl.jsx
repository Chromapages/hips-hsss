"use client";

import { useDeferredValue, useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { toast } from "sonner";

import { useAvatarStore } from "@/store/useAvatarStore";
import { normalizeAvatarEmotion } from "../avatar-options";
import { getBrowserMediaDevices } from "@/lib/browser-media";

import {
  MAN_HAIR_STYLES,
  WOMAN_HAIR_STYLES,
  clothingColors,
  hairColors,
  voicePresets,
  pickRandom,
} from "./creator-constants";
import { avatar2DOptions, skinTonePalette } from "@/lib/avatar-asset-registry";

import { useAvatarDraft } from "./useAvatarDraft";
import { useAvatarHistory } from "./useAvatarHistory";
import { useAvatarLiveSync } from "./useAvatarLiveSync";

import { AvatarPreviewStage } from "./AvatarPreviewStage";
import { GuidedAvatarWizard } from "./GuidedAvatarWizard";
import { BASE_FORMS, accentOptions, backdropOptions, getOptionsForBase, privacyOptions } from "./avatarOptions";
import { useWizardStore } from "./wizardStore";

const VOICE_PREVIEW_MIC_CONSTRAINTS = {
  audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  },
};

export function AvatarCreatorShell(props) {
  const {
    initialConfig,
    onSave,
    onCancel,
    showVoice = true,
    saving = false,
  } = props;
  const rawStore = useAvatarStore();
  const hydrateAvatarConfig = rawStore.setAvatarConfig;

  const draft = useAvatarDraft(initialConfig, DEFAULT_AVATAR_2D);
  const history = useAvatarHistory(initialConfig?.avatar2D || rawStore.avatar2D || DEFAULT_AVATAR_2D);
  const [voicePreviewStatus, setVoicePreviewStatus] = useState(null);
  const [voicePreviewAudioUrl, setVoicePreviewAudioUrl] = useState(null);
  const [avatarChangeAnnouncement, setAvatarChangeAnnouncement] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const hasMountedLiveRegionRef = useRef(false);
  const baseForm = useWizardStore((state) => state.baseForm);
  const backdrop = useWizardStore((state) => state.backdrop);
  const accent = useWizardStore((state) => state.accent);
  const privacy = useWizardStore((state) => state.privacy);
  const wizardStep = useWizardStore((state) => state.step);
  const resetWizard = useWizardStore((state) => state.reset);

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

  const setLocalAvatar2D = (config) => {
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
        return (...args) => {
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

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const previewPlaybackRef = useRef(null);
  const previewPlaybackUrlRef = useRef(null);
  const previewRecordingTimerRef = useRef(null);
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

  const playPreviewBlob = useCallback(async (blob, successStatus) => {
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
    try {
      await audio.play();
    } catch (error) {
      console.warn("[AvatarCreatorShell] Voice preview autoplay was blocked:", error);
      setVoicePreviewStatus("Sample is ready. Press play in the audio control to hear it.");
    }
  }, []);

  const failVoicePreview = useCallback((message, error) => {
    if (error) {
      console.warn("[AvatarCreatorShell] Voice preview failed:", error);
    }
    stopVoicePreview();
    setVoicePreviewStatus(message);
    toast.error(message);
  }, [stopVoicePreview]);

  const buildReverbIR = (ctx, durationSec, decay) => {
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

  useEffect(() => {
    if (!hasMountedLiveRegionRef.current) {
      hasMountedLiveRegionRef.current = true;
      return;
    }
    setAvatarChangeAnnouncement("Avatar preview updated.");
  }, [
    draft.bodyType,
    effectiveSemitones,
    history.state.present,
    store.anonymizationMode,
    store.reverbLevel,
    store.selectedPersona,
    store.voicePreset,
  ]);

  const handleSpeakerTest = useCallback(async () => {
    stopVoicePreview();
    try {
      setVoicePreviewStatus("Playing speaker test tone...");
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
      const stream = await getBrowserMediaDevices().getUserMedia(VOICE_PREVIEW_MIC_CONSTRAINTS);
      mediaStreamRef.current = stream;
      setVoicePreviewStatus("Recording raw mic sample. Speak now...");

      const chunks = [];
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

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    audioContextRef.current = ctx;
    setVoicePreviewStatus("Starting Effects Mode preview...");

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      setVoicePreviewStatus("Requesting microphone...");
      const stream = await getBrowserMediaDevices().getUserMedia(VOICE_PREVIEW_MIC_CONSTRAINTS);
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

      if (recorderDestination && typeof MediaRecorder !== "undefined") {
        setVoicePreviewStatus("Recording masked sample. Speak now...");
        const chunks = [];
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
      const timer = window.setTimeout(() => {
        stopVoicePreview();
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.voicePreset, store.semitones, store.reverbLevel]);

  const handleRandomizeAvatar = () => {
    if (draft.isShuffling) return;
    draft.setIsShuffling(true);
    const wizard = useWizardStore.getState();
    const randomizedBaseForm = wizard.baseForm || pickRandom([...BASE_FORMS]);
    if (!wizard.baseForm) wizard.setBaseForm(randomizedBaseForm);
    const randomizedBackdrop = pickRandom(getOptionsForBase(backdropOptions, randomizedBaseForm));
    const randomizedAccent = pickRandom(getOptionsForBase(accentOptions, randomizedBaseForm));
    const randomizedPrivacy = pickRandom(getOptionsForBase(privacyOptions, randomizedBaseForm));
    wizard.setBackdrop(randomizedBackdrop.id);
    wizard.setAccent(randomizedAccent.id);
    wizard.setPrivacy(randomizedPrivacy.id);
    draft.setBodyType(randomizedBaseForm === "man" ? 0 : 1);

    let count = 0;
    const interval = setInterval(() => {
      const isMan = randomizedBaseForm === "man";
      const validHairStyles = isMan ? MAN_HAIR_STYLES : WOMAN_HAIR_STYLES;
      const hairColor = pickRandom(hairColors);
      const clothingColor = pickRandom(clothingColors);
      const faceShape = pickRandom(avatar2DOptions.faceShapes);
      const hairStyle2D = pickRandom(avatar2DOptions.hairStyles.filter((h) => validHairStyles.includes(h.id)));
      const eyebrow = pickRandom(avatar2DOptions.eyebrows);
      const mouth = pickRandom(avatar2DOptions.mouths);
      const facialHair = isMan ? pickRandom(avatar2DOptions.facialHair) : { id: null };
      const accessory2D = pickRandom(avatar2DOptions.accessories);
      const clothing = pickRandom(avatar2DOptions.clothing);
      const background = pickRandom(avatar2DOptions.backgrounds);
      const skinTone = pickRandom(skinTonePalette);

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
        setLocalAvatar2D({ ...randomizedBackdrop.avatarPatch, ...randomizedAccent.avatarPatch });
        draft.setIsShuffling(false);
        toast.success("Avatar randomized!");
      }
    }, 60);
  };

  const handleResetAvatar = () => {
    const resetByStep = [
      null,
      { hairStyle: "hair_short_01", facialHair: null },
      { background: "bg_gradient_cool" },
      { accessory: null },
      { expression: "neutral" },
      {},
    ];
    setLocalAvatar2D(resetByStep[wizardStep] || {});
    const wizard = useWizardStore.getState();
    if (wizardStep === 2) wizard.setBackdrop(null);
    if (wizardStep === 3) wizard.setAccent(null);
    if (wizardStep === 4) wizard.setPrivacy(null);
    if (wizardStep === 5) wizard.setVoiceMode(null);
    if (wizardStep === 1) {
      draft.setSkinOffset(0);
      resetWizard();
    }
    toast.success("This step was reset");
  };

  const chooseBaseForm = (id) => {
    const forms = {
      man: { bodyType: 0, hairStyle: "hair_short_01", clothingStyle: "top_tshirt_01" },
      woman: { bodyType: 1, hairStyle: "hair_bob_01", clothingStyle: "top_hoodie_01" },
    };
    const form = forms[id];
    if (!form) return;
    draft.setBodyType(form.bodyType);
    setLocalAvatar2D({ hairStyle: form.hairStyle, clothingStyle: form.clothingStyle, facialHair: null, background: "bg_gradient_cool", accessory: null });
  };

  const chooseBackdrop = (id) => {
    const backdropOption = backdropOptions.find((option) => option.id === id);
    if (backdropOption) setLocalAvatar2D(backdropOption.avatarPatch);
  };

  const chooseAccent = (id) => {
    const accentOption = accentOptions.find((option) => option.id === id);
    if (accentOption) setLocalAvatar2D(accentOption.avatarPatch);
  };

  const handleExportAvatar = async () => {
    try {
      const dataUrl = await store.exportAvatar2DPNG();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `hips-avatar-${baseForm || "persona"}.png`;
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
      // Commit to Zustand store
      rawStore.setAvatar2D(history.state.present);

      onSave({
        avatarColor: history.state.present.clothingColor,
        avatarStyle: 0,
        bodyType: draft.bodyType,
        baseForm,
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

      toast.success("Protected persona saved for this session.");
    }, 1500);
  };

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {avatarChangeAnnouncement}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full items-start bg-av-bg-base text-av-text-primary">
        <AvatarPreviewStage
          deferredAvatar2D={deferredAvatar2D} baseForm={baseForm} backdrop={backdrop} accent={accent} privacy={privacy}
          anonymizationMode={store.anonymizationMode}
          voicePreset={store.voicePreset}
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
          handleExportAvatar={handleExportAvatar}
          handleRandomizeAvatar={handleRandomizeAvatar}
          handleResetAvatar={handleResetAvatar}
        />

        <GuidedAvatarWizard
          advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen}
          avatar2D={history.state.present} bodyType={draft.bodyType} setBodyType={draft.setBodyType}
          skinOffset={draft.skinOffset} setSkinOffset={draft.setSkinOffset} setLocalAvatar2D={setLocalAvatar2D}
          setAvatarConfig={store.setAvatarConfig} chooseBaseForm={chooseBaseForm} chooseBackdrop={chooseBackdrop} chooseAccent={chooseAccent}
          onRandomize={handleRandomizeAvatar} onReset={handleResetAvatar} onSave={handleSaveConfig}
          saving={saving || draft.savingState} onCancel={onCancel} canUndo={history.canUndo} canRedo={history.canRedo}
          onUndo={history.undo} onRedo={history.redo} showVoice={showVoice} voiceProps={{ voicePreset: store.voicePreset, semitones: store.semitones, reverbLevel: store.reverbLevel, anonymizationMode: store.anonymizationMode, selectedPersona: store.selectedPersona, isAntiCadenceEnabled: store.isAntiCadenceEnabled, isEnhancedNeuralConsentAccepted: store.isEnhancedNeuralConsentAccepted, neuralBackendAvailable: draft.neuralBackendAvailable, isPreviewing: draft.isPreviewing, isSpeaking: draft.isSpeaking, effectiveSemitones, voicePreviewStatus, voicePreviewAudioUrl, handleSpeakerTest, handleRawMicSample, handlePreviewVoice }}
          onSessionSetupChange={props.onSessionSetupChange}
        />
      </div>
    </>
  );
}
