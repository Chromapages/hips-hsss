"use client";

import { Flag, Mic, MicOff, PhoneOff, Hand } from "lucide-react";
import { useState, useCallback } from "react";
import type { AvatarGesture } from "@hips/types";

// Task 5.6 — 5 gesture presets for voice controls
const gestureOptions: { value: AvatarGesture; label: string; icon: string }[] = [
  { value: "idle", label: "Idle", icon: "🤚" },
  { value: "nodding", label: "Nod", icon: "👍" },
  { value: "raised-hand", label: "Raise", icon: "✋" },
  { value: "thinking", label: "Think", icon: "🤔" },
  { value: "applause", label: "Clap", icon: "👏" },
];

interface VoiceControlsBarProps {
  micEnabled: boolean;
  micBusy: boolean;
  raisedHand: boolean;
  onToggleMute: () => void;
  onToggleHand: () => void;
  onFlag: () => void;
  onLeave: () => void;
  gesture?: AvatarGesture;
  onGestureChange?: (g: AvatarGesture) => void;
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
  gesture = "idle",
  onGestureChange,
}: VoiceControlsBarProps) {
  const [confirmEnd, setConfirmEnd] = useState(false);

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

  return (
    <>
      <div className="fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/80 p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all">
        {/* Mute button */}
        <button
          aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          className={[
            "flex h-14 w-14 items-center justify-center rounded-full transition-all group",
            micBusy
              ? "cursor-wait opacity-50"
              : micEnabled
                ? "border border-white/5 bg-white/5 text-white hover:bg-white/10"
                : "border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20",
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
              : "border border-white/5 bg-white/5 text-white hover:bg-white/10",
          ].join(" ")}
          onClick={onToggleHand}
          type="button"
        >
          <Hand className="h-6 w-6 transition-transform group-hover:scale-110" />
        </button>

        {/* Gesture selector */}
        {onGestureChange && (
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            {gestureOptions.map((opt) => (
              <button
                key={opt.value}
                aria-label={`Set gesture to ${opt.label}`}
                aria-pressed={gesture === opt.value}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all",
                  gesture === opt.value
                    ? "border border-indigo-500/30 bg-indigo-500/20 text-indigo-300"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
                onClick={() => onGestureChange(opt.value)}
                title={opt.label}
                type="button"
              >
                {opt.icon}
              </button>
            ))}
          </div>
        )}

        <div className="mx-1 h-8 w-px bg-white/10" />

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
          className="ml-1 flex h-14 items-center justify-center rounded-full bg-red-600 px-8 font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 text-white backdrop-blur-2xl animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-modal-title"
        >
          <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-10 animate-in zoom-in-95 duration-300">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <PhoneOff className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-black tracking-tighter" id="leave-modal-title">
              End this session?
            </h2>
            <p className="leading-relaxed text-zinc-400">
              Are you sure you want to leave the Virtual Sanctuary? You can return to the
              dashboard after leaving.
            </p>
            <div className="mt-10 flex gap-4">
              <button
                className="h-14 flex-1 rounded-2xl border border-white/10 bg-transparent font-bold hover:bg-white/5 transition-all"
                onClick={handleCancelLeave}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-14 flex-1 rounded-2xl bg-red-600 font-bold shadow-lg shadow-red-900/40 hover:bg-red-500 transition-all"
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