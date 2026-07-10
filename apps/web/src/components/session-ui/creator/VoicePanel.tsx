"use client";

import { Check, Info, Sliders, Mic, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { voicePresets } from "./creator-constants";

interface VoicePanelProps {
  voicePreset: string;
  semitones: number;
  reverbLevel: "low" | "medium" | "high";
  anonymizationMode: "dsp" | "neural";
  selectedPersona: "clara" | "arthur";
  isAntiCadenceEnabled: boolean;
  isEnhancedNeuralConsentAccepted: boolean;
  neuralBackendAvailable: boolean;
  isPreviewing: boolean;
  isSpeaking: boolean;
  effectiveSemitones: number;
  voicePreviewStatus: string | null;
  voicePreviewAudioUrl: string | null;
  setAvatarConfig: (config: any) => void;
  handleSpeakerTest: () => void;
  handleRawMicSample: () => void;
  handlePreviewVoice: () => void;
}

export function VoicePanel({
  voicePreset,
  semitones,
  reverbLevel,
  anonymizationMode,
  selectedPersona,
  isAntiCadenceEnabled,
  isEnhancedNeuralConsentAccepted,
  neuralBackendAvailable,
  isPreviewing,
  isSpeaking,
  effectiveSemitones,
  voicePreviewStatus,
  voicePreviewAudioUrl,
  setAvatarConfig,
  handleSpeakerTest,
  handleRawMicSample,
  handlePreviewVoice,
}: VoicePanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui block mb-3">
          Voice Anonymisation Mode
        </h3>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Anonymisation Mode">
          <button
            onClick={() => setAvatarConfig({ anonymizationMode: "dsp" })}
            className={`py-3 px-4 rounded-xl text-left border transition-all ${
              anonymizationMode === "dsp"
                ? "border-accent bg-accent/8 text-accent font-bold"
                : "border-white/10 text-white/60 hover:border-white/20"
            }`}
            type="button"
            role="radio"
            aria-checked={anonymizationMode === "dsp"}
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
              if (!isEnhancedNeuralConsentAccepted) {
                toast.error("Review and accept Enhanced Neural consent before enabling it.");
                return;
              }
              setAvatarConfig({ anonymizationMode: "neural" });
            }}
            className={`py-3 px-4 rounded-xl text-left border transition-all ${
              anonymizationMode === "neural"
                ? "border-accent bg-accent/8 text-accent font-bold"
                : neuralBackendAvailable
                  ? "border-white/10 text-white/60 hover:border-white/20"
                  : "border-white/10 text-white/40 cursor-not-allowed opacity-60"
            }`}
            type="button"
            role="radio"
            aria-checked={anonymizationMode === "neural"}
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
        {neuralBackendAvailable && (
          <label className="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-3 text-[10px] text-white/70 font-body leading-relaxed">
            <input
              type="checkbox"
              checked={isEnhancedNeuralConsentAccepted}
              onChange={(event) => {
                const accepted = event.target.checked;
                setAvatarConfig({
                  isEnhancedNeuralConsentAccepted: accepted,
                  ...(accepted ? {} : { anonymizationMode: "dsp" }),
                });
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
            />
            <span>
              I understand that Enhanced Neural Masking sends my microphone audio to a H.I.P.S.-controlled voice worker for live conversion. H.I.P.S. does not record this audio, use it for training, or publish my raw microphone track to the session.
            </span>
          </label>
        )}
      </div>

      {anonymizationMode === "dsp" ? (
        <div className="space-y-4">
          <div className="space-y-2" role="radiogroup" aria-label="Voice Presets">
            {voicePresets.map((voice) => (
              <button
                key={voice.id}
                onClick={() => {
                  setAvatarConfig({ voicePreset: voice.id });
                  if (voice.id !== "custom") {
                    setAvatarConfig({ semitones: voice.semitones });
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  voicePreset === voice.id
                    ? "border-accent bg-accent/8 text-accent font-bold"
                    : "border-white/5 text-white/60 hover:border-white/15"
                }`}
                type="button"
                role="radio"
                aria-checked={voicePreset === voice.id}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-ui">{voice.label}</span>
                  {voicePreset === voice.id && <Check className="w-4 h-4 text-accent" />}
                </div>
                <p className="text-[10px] opacity-70 font-body mt-0.5">{voice.description}</p>
              </button>
            ))}
          </div>

          {voicePreset === "custom" && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="semitone-slider" className="text-[10px] font-bold uppercase tracking-wider text-white/60 font-ui flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  Pitch Shift (Semitones)
                </label>
                <span className="text-xs font-mono font-bold text-white">
                  {semitones > 0 ? `+${semitones}` : semitones} st
                </span>
              </div>
              <input
                id="semitone-slider"
                type="range"
                min={-6}
                max={6}
                step={1}
                value={semitones}
                onChange={(e) => setAvatarConfig({ semitones: Number(e.target.value) })}
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
                  onClick={() => setAvatarConfig({ reverbLevel: level })}
                  className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider font-ui border transition ${
                    reverbLevel === level
                      ? "bg-white text-zinc-950 border-white font-bold"
                      : "bg-transparent text-white/60 border-white/10 hover:border-white/20"
                  }`}
                  type="button"
                  role="radio"
                  aria-checked={reverbLevel === level}
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
                onClick={() => setAvatarConfig({ selectedPersona: "clara" })}
                className={`p-4 rounded-xl text-left border transition ${
                  selectedPersona === "clara"
                    ? "border-accent bg-accent/8 text-accent font-bold"
                    : "border-white/5 text-white/60 hover:border-white/15"
                }`}
                type="button"
                role="radio"
                aria-checked={selectedPersona === "clara"}
              >
                <div className="font-bold text-sm font-ui">Clara</div>
                <div className="text-[9px] opacity-75 font-body mt-1 leading-relaxed">Soft, warm, and highly conversational.</div>
              </button>
              <button
                onClick={() => setAvatarConfig({ selectedPersona: "arthur" })}
                className={`p-4 rounded-xl text-left border transition ${
                  selectedPersona === "arthur"
                    ? "border-accent bg-accent/8 text-accent font-bold"
                    : "border-white/5 text-white/60 hover:border-white/15"
                }`}
                type="button"
                role="radio"
                aria-checked={selectedPersona === "arthur"}
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
              onClick={() => setAvatarConfig({ isAntiCadenceEnabled: !isAntiCadenceEnabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 ${
                isAntiCadenceEnabled ? "bg-accent" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={isAntiCadenceEnabled}
              type="button"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  isAntiCadenceEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Preview button */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSpeakerTest}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider font-ui transition hover:bg-white/5"
          type="button"
        >
          Speaker Test
        </button>
        <button
          onClick={handleRawMicSample}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider font-ui transition hover:bg-white/5"
          type="button"
        >
          Raw Mic Test
        </button>
      </div>
      <button
        onClick={handlePreviewVoice}
        className={`mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-white text-xs font-bold uppercase tracking-wider font-ui transition ${
          isPreviewing
            ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
            : "border-white/10 hover:bg-white/5"
        }`}
        type="button"
      >
        {isPreviewing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {isPreviewing ? "■ Stop Voice Preview" : "▶ Record Voice Sample"}
      </button>
      <p className="text-[10px] text-white/40 font-body text-center">
        {voicePreviewStatus ?? (isPreviewing ? "Speak now. A short masked sample will play back automatically." : "Run speaker, raw mic, then Effects Mode sample.")}
      </p>
      {voicePreviewAudioUrl ? (
        <audio className="w-full" controls src={voicePreviewAudioUrl} />
      ) : null}
    </div>
  );
}
