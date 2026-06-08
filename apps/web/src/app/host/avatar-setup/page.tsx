"use client";

import { useState, useCallback, Suspense } from "react";
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
  { id: "subtle", label: "Subtle", semitones: 3, description: "Slight pitch shift — still sounds natural" },
  { id: "deep", label: "Deep", semitones: -4, description: "Lower register, more authoritative" },
  { id: "high", label: "High", semitones: 4, description: "Raised pitch, softer presence" },
  { id: "custom", label: "Custom", semitones: 0, description: "Set your own semitone shift" },
];

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

  const effectiveSemitones =
    selectedVoice.id === "custom" ? customSemitones : selectedVoice.semitones;

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
    setIsPreviewing(true);
    setIsSpeaking(true);

    try {
      // Request mic access and play back through voice processor for 3 seconds
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);

      // Simple passthrough for now — full granular shift via voice-mask-processor
      const dest = ctx.createMediaStreamDestination();
      source.connect(dest);

      // Play back the stream to the user
      const audio = new Audio();
      audio.srcObject = dest.stream;
      audio.play();

      setTimeout(() => {
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
        setIsSpeaking(false);
        setIsPreviewing(false);
      }, 3000);
    } catch {
      setIsSpeaking(false);
      setIsPreviewing(false);
    }
  }, [isPreviewing]);

  const handleSave = async () => {
    setSaving(true);
    const config = {
      avatarPresetId: selectedPreset.id,
      avatarColor: selectedPreset.color,
      avatarStyle: selectedPreset.style,
      voicePreset: selectedVoice.id,
      semitones: effectiveSemitones,
      reverbLevel,
    };
    // Persist to localStorage — no backend needed for the demo
    localStorage.setItem("hips-host-avatar", JSON.stringify(config));
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setSaving(false);
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
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" aria-hidden="true" />
                    )}
                    <span className="sr-only">{preset.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-text-muted font-body">
              Selected: <strong className="text-text">{selectedPreset.label}</strong>
            </p>
          </div>
        </div>

        {/* ── Right: Voice Settings ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Voice preset selection */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-4 h-4 text-accent" aria-hidden="true" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-ui">
                Voice Personalization
              </h2>
            </div>

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
            disabled={saving}
            aria-label="Save avatar and voice settings"
            className={`w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-bold uppercase tracking-wider font-ui text-sm transition-all duration-200 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-accent text-white hover:bg-accent shadow-lg shadow-accent/25"
            } disabled:opacity-50`}
          >
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
