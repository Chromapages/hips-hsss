"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Check,
  Mic,
  Volume2,
  Loader2,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { pitchShiftWorkletSource } from "@/lib/voice-mask-processor";
import { checkWebGPUSupport } from "@/lib/webgpu-detect";
import { getBrowserMediaDevices } from "@/lib/browser-media";

// ─── Lazy-load the 3D canvas (heavy — R3F) ────────────────────────────────────
const AvatarPreviewCanvas = dynamic(
  () => import("@/components/host/AvatarPreviewCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-primary rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    ),
  }
);

// ─── Avatar presets ───────────────────────────────────────────────────────────

interface AvatarPreset {
  id: string;
  label: string;
  color: string;
  style: number;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "indigo", label: "Indigo", color: "#6366F1", style: 0 },
  { id: "gold", label: "Gold", color: "#C59A35", style: 1 },
  { id: "emerald", label: "Emerald", color: "#10B981", style: 2 },
  { id: "rose", label: "Rose", color: "#F43F5E", style: 3 },
  { id: "sky", label: "Sky", color: "#0EA5E9", style: 4 },
  { id: "violet", label: "Violet", color: "#8B5CF6", style: 5 },
  { id: "amber", label: "Amber", color: "#FBBF24", style: 6 },
  { id: "navy", label: "Navy", color: "#173B57", style: 7 },
];

// ─── Voice presets ────────────────────────────────────────────────────────────

interface VoiceOption {
  id: string;
  label: string;
  semitones: number;
  description: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: "subtle", label: "Subtle", semitones: -2, description: "Slight pitch down — natural and calm cover" },
  { id: "deep", label: "Deep", semitones: -6, description: "Voice Shield — deep, anonymous register" },
  { id: "high", label: "High", semitones: 6, description: "Bright Veil — high, light register" },
  { id: "cyber", label: "Cyber", semitones: -2, description: "Robotic synthesis — ring modulation anonymiser" },
  { id: "custom", label: "Custom", semitones: 0, description: "Set your own semitone shift" },
];

// Reverb impulse response generator
function buildReverbIR(ctx: AudioContext, durationSec: number, decay: number): AudioBuffer {
  const len = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return ir;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AvatarSetupPage() {
  const [selectedPreset, setSelectedPreset] = useState<AvatarPreset>(AVATAR_PRESETS[0]!);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICE_OPTIONS[0]!);
  const [customSemitones, setCustomSemitones] = useState(0);
  const [reverbLevel, setReverbLevel] = useState<"low" | "medium" | "high">("medium");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [savedConfig, setSavedConfig] = useState<any>(null);

  // Two-tier voice replacement state
  const [anonymizationMode, setAnonymizationMode] = useState<"dsp" | "neural">("dsp");
  const [selectedPersona, setSelectedPersona] = useState<"clara" | "arthur">("clara");
  const [isAntiCadenceEnabled, setIsAntiCadenceEnabled] = useState(false);
  const [webgpuSupported, setWebgpuSupported] = useState(false);
  const [neuralBackendAvailable, setNeuralBackendAvailable] = useState(false);
  const [modelDownloadProgress, setModelDownloadProgress] = useState<number | null>(null);
  const [modelDownloaded, setModelDownloaded] = useState(false);

  const effectiveSemitones =
    selectedVoice.id === "custom" ? customSemitones : selectedVoice.semitones;

  const isDirty = !savedConfig || 
    savedConfig.avatarPresetId !== selectedPreset.id ||
    savedConfig.avatarColor !== selectedPreset.color ||
    savedConfig.avatarStyle !== selectedPreset.style ||
    savedConfig.voicePreset !== selectedVoice.id ||
    savedConfig.semitones !== effectiveSemitones ||
    savedConfig.reverbLevel !== reverbLevel ||
    savedConfig.anonymizationMode !== anonymizationMode ||
    savedConfig.selectedPersona !== selectedPersona ||
    savedConfig.isAntiCadenceEnabled !== isAntiCadenceEnabled;

  useEffect(() => {
    async function checkGPU() {
      const support = await checkWebGPUSupport();
      setWebgpuSupported(support);
    }
    checkGPU();
  }, []);

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

  useEffect(() => {
    const configStr = localStorage.getItem("hips-host-avatar");
    if (configStr) {
      try {
        const config = JSON.parse(configStr);
        if (config.avatarPresetId) {
          const preset = AVATAR_PRESETS.find(p => p.id === config.avatarPresetId);
          if (preset) setSelectedPreset(preset);
        }
        if (config.voicePreset) {
          const voice = VOICE_OPTIONS.find(v => v.id === config.voicePreset);
          if (voice) setSelectedVoice(voice);
        }
        if (typeof config.semitones === "number") {
          setCustomSemitones(config.semitones);
        }
        if (config.reverbLevel) {
          setReverbLevel(config.reverbLevel);
        }
        if (config.anonymizationMode) {
          setAnonymizationMode(config.anonymizationMode);
          if (config.anonymizationMode === "neural") {
            setModelDownloaded(true);
          }
        }
        if (config.selectedPersona) {
          setSelectedPersona(config.selectedPersona);
        }
        if (typeof config.isAntiCadenceEnabled === "boolean") {
          setIsAntiCadenceEnabled(config.isAntiCadenceEnabled);
        }
        setSavedConfig(config);
      } catch (err) {
        console.warn("Failed to parse host avatar config:", err);
      }
    } else {
      const defaultConfig = {
        avatarPresetId: AVATAR_PRESETS[0]!.id,
        avatarColor: AVATAR_PRESETS[0]!.color,
        avatarStyle: AVATAR_PRESETS[0]!.style,
        voicePreset: VOICE_OPTIONS[0]!.id,
        semitones: VOICE_OPTIONS[0]!.semitones,
        reverbLevel: "medium",
        anonymizationMode: "dsp" as const,
        selectedPersona: "clara" as const,
        isAntiCadenceEnabled: false,
      };
      setSavedConfig(defaultConfig);
    }
  }, []);

  const handleDownloadModel = useCallback(() => {
    if (modelDownloadProgress !== null) return;
    setModelDownloadProgress(0);
    const interval = setInterval(() => {
      setModelDownloadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setModelDownloaded(true);
          return null;
        }
        return prev + 10;
      });
    }, 150);
  }, [modelDownloadProgress]);

  const handlePresetSelect = useCallback((preset: AvatarPreset) => {
    setSelectedPreset(preset);
    setSaved(false);
  }, []);

  const handleVoiceSelect = useCallback((voice: VoiceOption) => {
    setSelectedVoice(voice);
    setSaved(false);
  }, []);

  const handlePreviewVoice = useCallback(async () => {
    if (isPreviewing) return;
    if (anonymizationMode === "neural" && webgpuSupported && !modelDownloaded) {
      toast.error("Please download the AI Voice Model first.");
      return;
    }
    setIsPreviewing(true);
    setIsSpeaking(true);

    let ctx: AudioContext | null = null;
    let stream: MediaStream | null = null;

    try {
      // Request mic access and play back through voice processor for 3 seconds
      stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 90;

      const preEmphasis = ctx.createBiquadFilter();
      preEmphasis.type = "highshelf";
      preEmphasis.frequency.value = 3500;
      
      const semitonesOverride = anonymizationMode === "neural"
        ? (selectedPersona === "clara" ? 1 : -4)
        : effectiveSemitones;

      preEmphasis.gain.value = semitonesOverride < 0 ? 4.0 : 0.0;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = anonymizationMode === "neural"
        ? (selectedPersona === "clara" ? 7000 : 5000)
        : (selectedVoice.id === "deep" ? 5000 : (selectedVoice.id === "cyber" ? 6000 : 7000));
      
      if (anonymizationMode === "dsp" && selectedVoice.id === "high") {
        highpass.frequency.value = 150;
      } else if (anonymizationMode === "neural" && selectedPersona === "clara") {
        highpass.frequency.value = 150; // Clara is a higher pitch range
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

      const dryLevel = anonymizationMode === "neural"
        ? (selectedPersona === "clara" ? 0.85 : 0.8)
        : (selectedVoice.id === "deep" ? 0.8 : (selectedVoice.id === "high" ? 0.85 : (selectedVoice.id === "cyber" ? 0.85 : 0.78)));
      const wetLevel = anonymizationMode === "neural"
        ? (selectedPersona === "clara" ? 0.15 : 0.2)
        : (selectedVoice.id === "deep" ? 0.2 : (selectedVoice.id === "high" ? 0.15 : (selectedVoice.id === "cyber" ? 0.15 : 0.22)));

      dryGain.gain.value = dryLevel;
      wetGain.gain.value = wetLevel;

      // Reverb duration/decay based on UI selection
      const reverbDuration = reverbLevel === "low" ? 0.4 : (reverbLevel === "high" ? 1.5 : 0.75);
      const reverbDecay = reverbLevel === "low" ? 3.5 : (reverbLevel === "high" ? 1.8 : 2.8);

      try {
        convolver.buffer = buildReverbIR(ctx, reverbDuration, reverbDecay);
      } catch (e) {
        console.warn("Reverb IR failed:", e);
      }

      // Create peaking filters for formant compensation in preview
      const formantLow = ctx.createBiquadFilter();
      const formantMid = ctx.createBiquadFilter();
      const formantHigh = ctx.createBiquadFilter();
      const formantVeryHigh = ctx.createBiquadFilter();

      // Vocal tract length simulation scaling
      const formantScale = Math.pow(2, (semitonesOverride * 0.6) / 12);

      formantLow.type      = 'peaking'; formantLow.frequency.value      = Math.min(2000, Math.max(100, 600 * formantScale));  formantLow.Q.value      = 1.2;
      formantMid.type      = 'peaking'; formantMid.frequency.value      = Math.min(4000, Math.max(300, 1400 * formantScale)); formantMid.Q.value      = 1.2;
      formantHigh.type     = 'peaking'; formantHigh.frequency.value     = Math.min(6000, Math.max(800, 2400 * formantScale)); formantHigh.Q.value     = 1.2;
      formantVeryHigh.type = 'peaking'; formantVeryHigh.frequency.value = Math.min(10000, Math.max(1500, 3400 * formantScale)); formantVeryHigh.Q.value = 1.2;

      if (semitonesOverride < 0) {
        formantLow.gain.value      = -3.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = 4.0;
        formantVeryHigh.gain.value = 6.0;
      } else if (semitonesOverride > 0) {
        formantLow.gain.value      = 4.0;
        formantMid.gain.value      = 2.0;
        formantHigh.gain.value     = -3.0;
        formantVeryHigh.gain.value = -5.0;
      } else {
        formantLow.gain.value      = 0.0;
        formantMid.gain.value      = 0.0;
        formantHigh.gain.value     = 0.0;
        formantVeryHigh.gain.value = 0.0;
      }

      // Check if AudioWorklet is supported
      if (ctx.audioWorklet) {
        const blob = new Blob([pitchShiftWorkletSource], { type: "application/javascript" });
        const workletUrl = URL.createObjectURL(blob);
        await ctx.audioWorklet.addModule(workletUrl);

        const isCyber = anonymizationMode === "dsp" && selectedVoice.id === "cyber";
        const pitchShiftNode = new AudioWorkletNode(ctx, "hips-pitch-shift", {
          processorOptions: {
            semitones: semitonesOverride,
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
        // Fallback to passthrough filter chain if no worklet support
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
        if (stream) stream.getTracks().forEach((t) => t.stop());
        if (ctx) ctx.close();
        setIsSpeaking(false);
        setIsPreviewing(false);
      }, 3000);
    } catch (err) {
      console.error("Preview voice failed:", err);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (ctx) ctx.close();
      setIsSpeaking(false);
      setIsPreviewing(false);
    }
  }, [isPreviewing, effectiveSemitones, selectedVoice.id, reverbLevel, anonymizationMode, selectedPersona, modelDownloaded, webgpuSupported]);

  const handleSave = async () => {
    setSaving(true);
    const config = {
      avatarPresetId: selectedPreset.id,
      avatarColor: selectedPreset.color,
      avatarStyle: selectedPreset.style,
      voicePreset: selectedVoice.id,
      semitones: effectiveSemitones,
      reverbLevel,
      anonymizationMode,
      selectedPersona,
      isAntiCadenceEnabled,
    };
    // Persist to localStorage — no backend needed for the demo
    localStorage.setItem("hips-host-avatar", JSON.stringify(config));
    await new Promise((r) => setTimeout(r, 600));
    setSavedConfig(config);
    setSaved(true);
    setSaving(false);

    // Auto-reset saved checkmark after 4 seconds (MIN-25)
    setTimeout(() => {
      setSaved(false);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-text-muted font-ui">
          <li>
            <Link href="/host/dashboard" className="hover:text-text transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-bold text-text">Avatar &amp; Voice Setup</li>
        </ol>
      </nav>

      <h1 className="font-heading text-3xl font-bold text-text mb-2">
        Avatar &amp; Voice Setup
      </h1>
      <p className="text-text-muted font-body mb-10">
        Personalise your host presence. Your avatar and voice settings apply to all sessions.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: Avatar Preview + Presets ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* 3D Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-border bg-primary" style={{ height: 320 }}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              }
            >
              <AvatarPreviewCanvas
                color={selectedPreset.color}
                styleIndex={selectedPreset.style}
                isSpeaking={isSpeaking}
              />
            </Suspense>
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-ui">
                Live Preview
              </span>
            </div>
          </div>

          {/* Avatar presets grid */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui mb-4">
              Select Preset
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3" role="radiogroup" aria-label="Avatar color presets">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${preset.label} avatar`}
                    onClick={() => handlePresetSelect(preset)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handlePresetSelect(preset);
                    }}
                    className="relative aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: preset.color,
                      boxShadow: isSelected
                        ? `0 0 0 3px white, 0 0 0 5px ${preset.color}`
                        : undefined,
                    }}
	                  >
	                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow" aria-hidden="true" />}
	                  </button>
	                );
	              })}
	            </div>
	          </div>
	        </div>

	        {/* ── Right: Voice Settings ── */}
	        <div className="lg:col-span-2 space-y-5">
          {/* Voice Settings Card */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-4 h-4 text-accent" aria-hidden="true" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui">
                Voice Personalization
              </h2>
            </div>

            {/* Anonymisation Mode Toggle */}
            <div className="mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui block mb-3">
                Voice Anonymisation Mode
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Voice anonymisation mode">
                <button
                  type="button"
                  role="radio"
                  aria-checked={anonymizationMode === "dsp"}
                  onClick={() => {
                    setAnonymizationMode("dsp");
                    setSaved(false);
                  }}
                  className={`py-3 px-4 rounded-xl text-left border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    anonymizationMode === "dsp"
                      ? "border-accent bg-accent/8 text-accent font-bold"
                      : "border-border text-text hover:border-primary/30"
                  }`}
                >
                  <div className="text-xs font-bold font-ui">Tier 1: Effects Mode</div>
                  <div className="text-[9px] text-text-muted font-body mt-0.5">Local fallback DSP</div>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={anonymizationMode === "neural"}
                  onClick={() => {
                    setAnonymizationMode("neural");
                    setSaved(false);
                  }}
                  className={`py-3 px-4 rounded-xl text-left border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    anonymizationMode === "neural"
                      ? "border-accent bg-accent/8 text-accent font-bold"
                      : "border-border text-text hover:border-primary/30"
                  }`}
                >
                  <div className="text-xs font-bold font-ui">Tier 2: Enhanced Neural</div>
                  <div className="text-[9px] text-text-muted font-body mt-0.5">
                    {neuralBackendAvailable ? "Server backend ready" : "Backend not connected"}
                  </div>
                </button>
              </div>
            </div>

            {anonymizationMode === "dsp" ? (
              <div className="space-y-4">
                <div className="space-y-2" role="radiogroup" aria-label="Voice preset options">
                  {VOICE_OPTIONS.map((voice) => {
                    const isSelected = selectedVoice.id === voice.id;
                    return (
                      <button
                        key={voice.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleVoiceSelect(voice)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleVoiceSelect(voice);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          isSelected
                            ? "border-accent bg-accent/8"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold font-ui ${isSelected ? "text-accent" : "text-text"}`}>
                            {voice.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-accent" aria-hidden="true" />}
                        </div>
                        <p className="text-[11px] text-text-muted font-body mt-0.5">{voice.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Custom semitone slider */}
                {selectedVoice.id === "custom" && (
                  <div className="mt-4 p-3 rounded-xl bg-bg-subtle">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="semitone-slider" className="text-[10px] font-bold uppercase tracking-wider text-text-muted font-ui flex items-center gap-1">
                        <Sliders className="w-3 h-3" aria-hidden="true" />
                        Pitch Shift
                      </label>
                      <span className="text-xs font-mono font-bold text-text">
                        {customSemitones > 0 ? `+${customSemitones}` : customSemitones} st
                      </span>
                    </div>
                    <input
                      id="semitone-slider"
                      type="range"
                      min={-6}
                      max={6}
                      step={1}
                      value={customSemitones}
                      onChange={(e) => {
                        setCustomSemitones(Number(e.target.value));
                        setSaved(false);
                      }}
                      aria-label="Semitone pitch shift"
                      aria-valuemin={-6}
                      aria-valuemax={6}
                      aria-valuenow={customSemitones}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-[9px] text-text-muted font-mono mt-1">
                      <span>−6</span>
                      <span>0</span>
                      <span>+6</span>
                    </div>
                  </div>
                )}

                {/* Reverb */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted font-ui mb-2">
                    Reverb Intensity
                  </p>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Reverb level">
                    {(["low", "medium", "high"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        role="radio"
                        aria-checked={reverbLevel === level}
                        onClick={() => { setReverbLevel(level); setSaved(false); }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") { setReverbLevel(level); setSaved(false); }
                        }}
                        className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-ui transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          reverbLevel === level
                            ? "bg-primary text-white border-primary"
                            : "bg-surface text-text-muted border-border hover:border-primary/40"
                        }`}
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui block mb-3">
                    Select Persona Voice
                  </label>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="AI voice persona">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPersona === "clara"}
                      onClick={() => {
                        setSelectedPersona("clara");
                        setSaved(false);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        selectedPersona === "clara"
                          ? "border-accent bg-accent/8 text-accent font-bold"
                          : "border-border text-text hover:border-primary/30"
                      }`}
                    >
                      <div className="font-bold text-sm font-ui">Clara</div>
                      <div className="text-[10px] text-text-muted font-body mt-1 leading-relaxed">Soft, warm, and highly conversational.</div>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPersona === "arthur"}
                      onClick={() => {
                        setSelectedPersona("arthur");
                        setSaved(false);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        selectedPersona === "arthur"
                          ? "border-accent bg-accent/8 text-accent font-bold"
                          : "border-border text-text hover:border-primary/30"
                      }`}
                    >
                      <div className="font-bold text-sm font-ui">Arthur</div>
                      <div className="text-[10px] text-text-muted font-body mt-1 leading-relaxed">Steady, deep, and professional register.</div>
                    </button>
                  </div>
                </div>

                {/* Anti-Cadence Pacing Delay Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/30">
                  <div className="pr-4">
                    <label htmlFor="anti-cadence-toggle" className="text-xs font-bold font-ui text-text block">
                      Anti-Cadence Pacing Delay
                    </label>
                    <span className="text-[10px] text-text-muted font-body leading-normal block mt-0.5">
                      Modulates and randomizes breathing/speech pacing to eliminate biometric cadence cues (+0.8s latency).
                    </span>
                  </div>
                  <button
                    id="anti-cadence-toggle"
                    type="button"
                    role="switch"
                    aria-checked={isAntiCadenceEnabled}
                    onClick={() => {
                      setIsAntiCadenceEnabled(!isAntiCadenceEnabled);
                      setSaved(false);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      isAntiCadenceEnabled ? "bg-accent" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAntiCadenceEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Neural backend readiness banner */}
                <div className="p-4 rounded-xl border border-border bg-bg-subtle/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${neuralBackendAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className="text-xs font-bold uppercase tracking-wider font-ui text-text">
                      {neuralBackendAvailable ? "Enhanced Neural Backend Ready" : "Enhanced Neural Backend Pending"}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted font-body leading-normal">
                    {neuralBackendAvailable
                      ? "Enhanced Neural Masking processes opted-in microphone audio on H.I.P.S.-controlled server infrastructure, then publishes only the converted voice into the session."
                      : "Enhanced Neural Masking needs the VPS voice-conversion backend before it can provide stronger voice replacement. Until then, sessions fall back to local DSP masking."}
                  </p>

                  {/* Simulated Download Model Button / Progress */}
                  {webgpuSupported && neuralBackendAvailable && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      {modelDownloaded ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-ui">
                          <Check className="w-4 h-4" />
                          Voice Model Ready (Cached)
                        </div>
                      ) : modelDownloadProgress !== null ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-text">
                            <span>Downloading model files...</span>
                            <span>{modelDownloadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all duration-150"
                              style={{ width: `${modelDownloadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleDownloadModel}
                          className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-text border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-wider font-ui transition-colors"
                        >
                          📥 Download Voice Model (18.4 MB)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview voice button */}
            <button
              type="button"
              onClick={handlePreviewVoice}
              disabled={isPreviewing}
              aria-label="Preview your voice with current settings"
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary/20 text-text text-xs font-bold uppercase tracking-wider font-ui hover:bg-primary/5 disabled:opacity-50 transition-all"
            >
              {isPreviewing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mic className="w-4 h-4" aria-hidden="true" />
              )}
              {isPreviewing ? "Listening... (3s)" : "▶ Preview Voice"}
            </button>
          </div>

          {/* Test your setup */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui mb-2">
              Preview Session
            </h3>
            <p className="text-xs text-text-muted font-body mb-4">
              Launch a sandboxed practice room to see exactly how your avatar and voice will appear to clients.
            </p>
            <Link
              href="/host/practice"
              aria-label="Test your avatar and voice in a practice session"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/8 border border-primary/20 text-text text-xs font-bold uppercase tracking-wider font-ui hover:bg-primary hover:text-white transition-all duration-200"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Test Your Setup
            </Link>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || (!isDirty && !saved)}
            aria-label="Save avatar and voice settings"
            className={`relative w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-bold uppercase tracking-wider font-ui text-sm transition-all duration-200 ${
              saved
                ? "bg-emerald-500 text-white"
                : isDirty
                  ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
            }`}
          >
            {/* Dirty indicator dot */}
            {isDirty && !saved && !saving && (
              <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-5 h-5" aria-hidden="true" />
                Saved!
              </>
            ) : (
              <>
                Save Settings
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
