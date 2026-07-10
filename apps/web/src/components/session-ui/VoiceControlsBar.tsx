"use client";
import { Flag, Mic, MicOff, PhoneOff, Hand, Waves, Smile } from "lucide-react";
import { useState, useCallback } from "react";
import type { AvatarGesture, AvatarEmotion } from "@hips/types";
import type { VoicePreset } from "@/lib/voice-mask-presets";
import { VoiceEffectsPanel } from "./VoiceEffectsPanel";
// Gestures removed

interface VoiceControlsBarProps {
  micEnabled: boolean;
  micBusy: boolean;
  raisedHand: boolean;
  onToggleMute: () => void;
  onToggleHand: () => void;
  onFlag: () => void;
  onLeave: () => void;
  // Gestures removed
  voicePreset?: VoicePreset;
  voiceSemitones?: number;
  voiceWetDryRatio?: number;
  onVoicePresetChange?: (preset: VoicePreset) => void;
  onVoiceSemitoneChange?: (semitones: number) => void;
  onVoiceWetDryChange?: (ratio: number) => void;
  /** Set to true when the voice mask processor is successfully active, to show a positive indicator. */
  voiceMaskActive?: boolean;
  /**
   * Visual variant. `'dark'` (default) is the immersive stage chrome used by
   * the live `/session/[id]` room. `'light'` re-themes the bar for surfaces
   * that sit on a light page — currently the demo-room.
   */
  variant?: "light" | "dark";
  activeEmotion?: AvatarEmotion;
  onEmotionChange?: (emotion: AvatarEmotion) => void;
}

// Task 5.7 — Voice controls bar (mute, gesture, flag, end)
export function VoiceControlsBar({
  micEnabled,
  micBusy,
  raisedHand,
  onToggleMute,
  onToggleHand,
  onFlag,
  onLeave,
  // Gestures removed
  voicePreset = "sofi",
  voiceSemitones = 4,
  voiceWetDryRatio = 0.22,
  onVoicePresetChange,
  onVoiceSemitoneChange,
  onVoiceWetDryChange,
  voiceMaskActive = false,
  variant = "dark",
  activeEmotion = "neutral",
  onEmotionChange,
}: VoiceControlsBarProps) {
  const isLight = variant === "light";
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showFxPanel, setShowFxPanel] = useState(false);
  const [showEmotionMenu, setShowEmotionMenu] = useState(false);

  const handleLeaveClick = useCallback(() => {
    setConfirmEnd(true);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    setConfirmEnd(false);
    onLeave();
  }, [onLeave]);

  const handleCancelLeave = useCallback(() => {
    setConfirmEnd(false);
  }, []);

  const hasFxControls = Boolean(onVoicePresetChange && onVoiceSemitoneChange);

  // Variant-driven tokens
  const barShell = isLight
    ? "fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-background/95 p-3 shadow-elevated backdrop-blur-3xl transition-all"
    : "fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/80 p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all";

  const idleButton = isLight
    ? "border border-border bg-surface text-primary hover:bg-surface-alt"
    : "border border-white/5 bg-surface/5 text-white hover:bg-surface/10";
  const divider = isLight ? "border-l border-border" : "border-l border-white/10";
  const dividerLine = isLight ? "bg-border" : "bg-surface/10";
  // Gestures removed
  const modalBackdrop = isLight
    ? "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6 text-foreground backdrop-blur-2xl animate-in fade-in duration-300"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 text-white backdrop-blur-2xl animate-in fade-in duration-300";
  const modalCard = isLight
    ? "w-full max-w-md rounded-[2rem] border border-border bg-background p-10 animate-in zoom-in-95 duration-300"
    : "w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-10 animate-in zoom-in-95 duration-300";
  const modalCancel = isLight
    ? "h-14 flex-1 rounded-2xl border border-border bg-transparent font-bold hover:bg-surface transition-all"
    : "h-14 flex-1 rounded-2xl border border-white/10 bg-transparent font-bold hover:bg-surface/5 transition-all";
  const modalLead = isLight ? "leading-relaxed text-text-muted" : "leading-relaxed text-text";

  return (
    <>
      <div className={barShell}>
        {/* Mute button */}
        <button
          aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          className={[
            "flex h-14 w-14 items-center justify-center rounded-full transition-all group",
            micBusy
              ? "cursor-wait opacity-50"
              : micEnabled
                ? idleButton
                : "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
          ].join(" ")}
          disabled={micBusy}
          onClick={onToggleMute}
          type="button"
        >
          {micEnabled ? (
            <Mic className="h-6 w-6 transition-transform group-hover:scale-110" />
          ) : (
            <MicOff className="h-6 w-6 transition-transform group-hover:scale-110" />
          )}
        </button>

        {/* Raise hand button */}
        <button
          aria-label={raisedHand ? "Lower hand" : "Raise hand"}
          aria-pressed={raisedHand}
          className={[
            "flex h-14 w-14 items-center justify-center rounded-full transition-all group",
            raisedHand
              ? "border border-amber-500/30 bg-amber-500/20 text-amber-200"
              : idleButton,
          ].join(" ")}
          onClick={onToggleHand}
          type="button"
        >
          <Hand className="h-6 w-6 transition-transform group-hover:scale-110" />
        </button>

        {/* Expression selector button */}
        {onEmotionChange && (
          <div className="relative">
            <button
              aria-label={`Expression: ${activeEmotion}`}
              aria-expanded={showEmotionMenu}
              aria-haspopup="menu"
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full transition-all group relative",
                showEmotionMenu
                  ? isLight
                    ? "border border-accent/40 bg-accent/15 text-accent"
                    : "border border-primary/40 bg-primary/20 text-text"
                  : idleButton,
              ].join(" ")}
              onClick={() => setShowEmotionMenu(!showEmotionMenu)}
              type="button"
            >
              <Smile className="h-6 w-6 transition-transform group-hover:scale-110" />
            </button>

            {showEmotionMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowEmotionMenu(false)}
                />
                <div
                  role="menu"
                  className={[
                    "absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-250",
                    isLight
                      ? "border border-border bg-background/95"
                      : "border border-white/10 bg-zinc-950/95"
                  ].join(" ")}
                >
                  {(["neutral", "distressed"] as AvatarEmotion[]).map((emo) => {
                    const labelMap = {
                      neutral: "😐 Neutral",
                      distressed: "😟 Distressed",
                    };
                    const isSelected = activeEmotion === emo;
                    return (
                      <button
                        key={emo}
                        role="menuitem"
                        className={[
                          "px-4 py-2 text-sm rounded-xl font-bold transition-all whitespace-nowrap",
                          isSelected
                            ? isLight
                              ? "bg-accent/15 text-accent"
                              : "bg-primary/20 text-text"
                            : isLight
                              ? "text-primary hover:bg-surface-alt"
                              : "text-white/60 hover:bg-surface/5 hover:text-white"
                        ].join(" ")}
                        onClick={() => {
                          onEmotionChange(emo);
                          setShowEmotionMenu(false);
                        }}
                      >
                        {labelMap[emo]}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <div className={`mx-1 h-8 w-px ${dividerLine}`} />

        {/* FX button */}
        {hasFxControls && (
          <div className="relative">
            <button
              aria-label="Voice effects"
              aria-expanded={showFxPanel}
              aria-haspopup="dialog"
              aria-pressed={showFxPanel}
              onClick={() => setShowFxPanel(!showFxPanel)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setShowFxPanel(false);
              }}
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full transition-all group relative",
                showFxPanel
                  ? isLight
                    ? "border border-accent/40 bg-accent/15 text-accent"
                    : "border border-primary/40 bg-primary/20 text-text"
                  : idleButton,
              ].join(" ")}
            >
              <Waves className="h-6 w-6 transition-transform group-hover:scale-110" />
              {/* Positive indicator: green dot when masking is successfully active and panel is closed */}
              {!showFxPanel && voiceMaskActive && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              )}
            </button>

            {showFxPanel && (
              <>
                {/* Backdrop to close */}
                <div
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setShowFxPanel(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowFxPanel(false);
                  }}
                />
                <VoiceEffectsPanel
                  activePreset={voicePreset}
                  semitones={voiceSemitones}
                  wetDryRatio={voiceWetDryRatio}
                  onPresetChange={onVoicePresetChange!}
                  onSemitoneChange={onVoiceSemitoneChange!}
                  onWetDryChange={onVoiceWetDryChange!}
                  onClose={() => setShowFxPanel(false)}
                />
              </>
            )}
          </div>
        )}

        {/* Flag button */}
        <button
          aria-label="Flag a safety concern"
          className="group flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 transition-all hover:bg-amber-500/20"
          onClick={onFlag}
          type="button"
        >
          <Flag className="h-6 w-6 transition-transform group-hover:scale-110" />
        </button>

        {/* Leave button */}
        <button
          aria-label="Leave session"
          className="ml-1 flex h-14 items-center justify-center rounded-full bg-destructive px-8 font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-destructive/10 hover:scale-105"
          onClick={handleLeaveClick}
          type="button"
        >
          <PhoneOff className="mr-2 h-5 w-5" />
          Leave
        </button>
      </div>

      {/* Leave confirmation modal */}
      {confirmEnd ? (
        <div
          className={modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-modal-title"
        >
          <section className={modalCard}>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
              <PhoneOff className="h-8 w-8 text-destructive" />
            </div>
            <h2
              className="font-heading mb-4 text-3xl font-extrabold tracking-tighter text-primary"
              id="leave-modal-title"
            >
              End this session?
            </h2>
            <p className={modalLead}>
              Are you sure you want to leave the Virtual Sanctuary? You can return to the
              dashboard after leaving.
            </p>
            <div className="mt-10 flex gap-4">
              <button className={modalCancel} onClick={handleCancelLeave} type="button">
                Cancel
              </button>
              <button
                className="h-14 flex-1 rounded-2xl bg-destructive font-bold shadow-lg shadow-red-900/40 hover:bg-destructive/10 transition-all"
                onClick={handleConfirmLeave}
                type="button"
              >
                End Session
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
