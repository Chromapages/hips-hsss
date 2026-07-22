"use client";

import { Check, Info, Sliders } from "lucide-react";
import { toast } from "sonner";
import { voicePresets } from "./creator-constants";

export function VoicePanel({
  voicePreset,
  semitones,
  reverbLevel,
  anonymizationMode,
  selectedPersona,
  isAntiCadenceEnabled,
  isEnhancedNeuralConsentAccepted,
  neuralBackendAvailable,
  setAvatarConfig,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui block mb-3">
          Voice Anonymisation Mode
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Anonymisation mode">
          <button
            onClick={() => setAvatarConfig({ anonymizationMode: "dsp" })}
            className={`min-h-[44px] py-3 px-4 rounded-lg text-left border transition ${
              anonymizationMode === "dsp"
                ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
            }`}
            type="button"
            role="radio"
            aria-checked={anonymizationMode === "dsp"}
            aria-label="Effects Mode"
          >
            <div className="text-xs font-bold font-ui">Tier 1: Effects Mode</div>
            <div className="text-[9px] text-av-text-subtle font-body mt-0.5">Available now - browser DSP</div>
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
            className={`min-h-[44px] py-3 px-4 rounded-lg text-left border transition ${
              anonymizationMode === "neural"
                ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                : neuralBackendAvailable
                  ? "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
                  : "border-av-border bg-av-bg-input text-av-text-muted cursor-not-allowed"
            }`}
            type="button"
            role="radio"
            aria-checked={anonymizationMode === "neural"}
            aria-label="Enhanced Neural"
            disabled={!neuralBackendAvailable}
          >
            <div className="text-xs font-bold font-ui">Tier 2: Enhanced Neural</div>
            <div className="text-[9px] text-av-text-subtle font-body mt-0.5">
              {neuralBackendAvailable ? "Backend ready" : "Roadmap preview — unavailable"}
            </div>
          </button>
        </div>
        {!neuralBackendAvailable && (
          <div className="mt-3 rounded-lg border border-[#8F6335] bg-av-warn-bg px-3 py-2 text-[10px] text-av-accent-fg font-body leading-relaxed">
            <div className="flex items-start gap-2"><Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" /><span>Effects Mode is the only supported live path today and runs locally in your browser. Raw unmasked microphone audio is never published.</span></div>
            <details className="mt-1" onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.removeAttribute("open"); }}>
              <summary className="min-h-[44px] cursor-pointer py-2 font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD6A5]">Why Enhanced Neural matters</summary>
              <div className="pb-2 text-[#D6C4A8]"><p>It is intended to replace vocal characteristics more deeply than local effects while returning only converted audio to the session.</p><p className="mt-2"><strong className="text-av-accent-fg">Timeline:</strong> planned after returned-audio reliability and privacy review pass; no release date is promised yet.</p></div>
            </details>
          </div>
        )}
        {neuralBackendAvailable && (
          <label className="mt-3 flex min-h-[44px] items-start gap-3 rounded-lg border border-av-border bg-av-bg-input px-3 py-3 text-[10px] text-av-text-secondary font-body leading-relaxed">
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
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#F4A261]"
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
                className={`min-h-[44px] w-full text-left px-4 py-3 rounded-lg border transition ${
                  voicePreset === voice.id
                    ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                    : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={voicePreset === voice.id}
                aria-label={voice.label}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-ui">{voice.label}</span>
                  {voicePreset === voice.id && <Check className="w-4 h-4 text-av-accent" />}
                </div>
                <p className="text-[10px] text-av-text-subtle font-body mt-0.5">{voice.description}</p>
              </button>
            ))}
          </div>

          {voicePreset === "custom" && (
            <div className="p-3 rounded-lg bg-av-bg-input border border-av-border">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="semitone-slider" className="text-[10px] font-bold uppercase tracking-wider text-av-text-subtle font-ui flex items-center gap-1">
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
                className="min-h-[44px] w-full accent-[#F4A261] bg-av-border-strong"
              />
              <div className="flex justify-between text-[9px] text-av-text-muted font-mono mt-1">
                <span>−6</span>
                <span>0</span>
                <span>+6</span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-av-text-subtle font-ui mb-2">
              Reverb Pacing (Visual Size Effect)
            </h4>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Reverb Intensity">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  onClick={() => setAvatarConfig({ reverbLevel: level })}
                  className={`min-h-[44px] rounded-lg text-[10px] font-bold uppercase tracking-wider font-ui border transition ${
                    reverbLevel === level
                      ? "bg-av-accent text-av-bg-elevated border-av-accent font-bold"
                      : "bg-av-bg-input text-av-text-secondary border-av-border hover:border-av-accent"
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
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui block mb-3">
              Select Voice Persona
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Voice persona">
              <button
                onClick={() => setAvatarConfig({ selectedPersona: "clara" })}
                className={`min-h-[44px] p-4 rounded-lg text-left border transition ${
                  selectedPersona === "clara"
                    ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                    : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={selectedPersona === "clara"}
                aria-label="Clara voice persona"
              >
                <div className="font-bold text-sm font-ui">Clara</div>
                <div className="text-[9px] text-av-text-subtle font-body mt-1 leading-relaxed">Soft, warm, and highly conversational.</div>
              </button>
              <button
                onClick={() => setAvatarConfig({ selectedPersona: "arthur" })}
                className={`min-h-[44px] p-4 rounded-lg text-left border transition ${
                  selectedPersona === "arthur"
                    ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                    : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={selectedPersona === "arthur"}
                aria-label="Arthur voice persona"
              >
                <div className="font-bold text-sm font-ui">Arthur</div>
                <div className="text-[9px] text-av-text-subtle font-body mt-1 leading-relaxed">Steady, deep, and professional register.</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-av-border bg-av-bg-input">
            <div className="pr-4">
              <label htmlFor="anti-cadence" className="text-xs font-bold font-ui text-white block">
                Anti-Cadence Speech Delay
              </label>
              <span className="text-[9px] text-av-text-muted font-body leading-normal block mt-0.5">
                Randomly offsets pauses and breathing intervals to block speech cadence biometric profiling.
              </span>
            </div>
            <button
              id="anti-cadence"
              onClick={() => setAvatarConfig({ isAntiCadenceEnabled: !isAntiCadenceEnabled })}
              className={`relative inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent px-1 transition-colors ease-in-out duration-200 ${
                isAntiCadenceEnabled ? "bg-av-accent" : "bg-av-border"
              }`}
              role="switch"
              aria-checked={isAntiCadenceEnabled}
              type="button"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  isAntiCadenceEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
