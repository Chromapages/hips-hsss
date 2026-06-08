"use client";
import { Flag, Mic, MicOff, PhoneOff, Hand, Waves } from "lucide-react";
import { useState, useCallback } from "react";
import type { AvatarGesture } from "@hips/types";
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
  onVoicePresetChange?: (preset: VoicePreset) => void;
  onVoiceSemitoneChange?: (semitones: number) => void;
  /**
   * Visual variant. `'dark'` (default) is the immersive stage chrome used by
   * the live `/session/[id]` room. `'light'` re-themes the bar for surfaces
   * that sit on a light page — currently the demo-room.
   */
  variant?: "light" | "dark";
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
  voicePreset = "subtle",
  voiceSemitones = 4,
  onVoicePresetChange,
  onVoiceSemitoneChange,
  variant = "dark",
}: VoiceControlsBarProps) {
  const isLight = variant === "light";
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showFxPanel, setShowFxPanel] = useState(false);

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
                : "border border-destructive/20 bg-destructive0/10 text-destructive0 hover:bg-destructive0/20",
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

        // Gestures removed

        <div className={`mx-1 h-8 w-px ${dividerLine}`} />

        {/* FX button */}
        {hasFxControls && (
          <div className="relative">
            <button
              aria-label="Voice effects"
              aria-pressed={showFxPanel}
              onClick={() => setShowFxPanel(!showFxPanel)}
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full transition-all group",
                showFxPanel
                  ? isLight
                    ? "border border-accent/40 bg-accent/15 text-accent"
                    : "border border-primary/40 bg-primary/20 text-text"
                  : idleButton,
              ].join(" ")}
            >
              <Waves className="h-6 w-6 transition-transform group-hover:scale-110" />
            </button>

            {showFxPanel && (
              <>
                {/* Backdrop to close */}
                <div
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setShowFxPanel(false)}
                />
                <VoiceEffectsPanel
                  activePreset={voicePreset}
                  semitones={voiceSemitones}
                  onPresetChange={onVoicePresetChange!}
                  onSemitoneChange={onVoiceSemitoneChange!}
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
          className="ml-1 flex h-14 items-center justify-center rounded-full bg-destructive px-8 font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-destructive0 hover:scale-105"
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
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive0/10">
              <PhoneOff className="h-8 w-8 text-destructive0" />
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
                className="h-14 flex-1 rounded-2xl bg-destructive font-bold shadow-lg shadow-red-900/40 hover:bg-destructive0 transition-all"
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
