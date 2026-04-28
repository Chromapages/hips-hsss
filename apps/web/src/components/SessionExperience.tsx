"use client";

import { useMemo, useState } from "react";
import type { AvatarGesture, ConnectionQuality } from "@hips/types";
import { CrisisEscalation } from "./CrisisEscalation";

const gestures: AvatarGesture[] = [
  "idle",
  "nodding",
  "raised-hand",
  "thinking",
  "applause",
];

const participants = [
  { handle: "Participant #7", palette: "bg-[var(--color-brand-accent)]" },
  { handle: "Peer guide", palette: "bg-[var(--color-brand-warm)]" },
  { handle: "Participant #3", palette: "bg-[var(--color-brand-secondary)]" },
] as const;

export function SessionExperience({ sessionId }: { sessionId: string }) {
  const [muted, setMuted] = useState(false);
  const [gesture, setGesture] = useState<AvatarGesture>("idle");
  const [showCrisis, setShowCrisis] = useState(false);
  const [quality] = useState<ConnectionQuality>("good");
  const canUseWebGl = useMemo(
    () => typeof window !== "undefined" && Boolean(window.WebGLRenderingContext),
    [],
  );

  return (
    <main data-layer="session" className="min-h-screen bg-[var(--session-bg)] text-white">
      <div className="lg:hidden flex min-h-screen items-center justify-center p-6 text-center">
        <section className="max-w-md rounded-lg border border-white/20 bg-white/10 p-6">
          <h1 className="text-2xl font-semibold">Laptop or desktop required</h1>
          <p className="mt-3 text-white/80">
            Voice sessions use the virtual office and require a screen at least
            1024px wide.
          </p>
        </section>
      </div>

      <div className="hidden min-h-screen grid-rows-[auto_1fr_auto] lg:grid">
        <header className="grid grid-cols-3 items-center border-b border-white/10 px-6 py-4">
          <p className="font-mono text-sm text-[var(--color-brand-accent)]">
            anon-{sessionId.slice(0, 6)}
          </p>
          <p className="text-center font-mono text-sm">00:24:18</p>
          <div className="flex items-center justify-end gap-2 text-sm">
            <span>{quality}</span>
            <span className="inline-flex gap-1" aria-label="Connection quality">
              <span className="h-3 w-1 rounded bg-[var(--color-success)]" />
              <span className="h-4 w-1 rounded bg-[var(--color-success)]" />
              <span className="h-5 w-1 rounded bg-[var(--color-success)]" />
            </span>
          </div>
        </header>

        <section className="grid grid-cols-[1fr_320px] overflow-hidden">
          <div className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-2/5 bg-[var(--session-wall)]" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-[var(--session-floor)]" />
            <div className="absolute bottom-24 left-1/2 h-36 w-64 -translate-x-1/2 rounded-md bg-[#654C3B]" />
            <div className="absolute bottom-52 left-1/2 h-20 w-80 -translate-x-1/2 rounded-md bg-[#32465C]" />
            <div className="absolute bottom-28 left-1/2 grid w-[680px] -translate-x-1/2 grid-cols-3 gap-12">
              {participants.map((participant, index) => (
                <article className="text-center" key={participant.handle}>
                  <div
                    className={[
                      "mx-auto h-28 w-28 rounded-full border-4",
                      index === 0
                        ? "animate-pulse border-[var(--session-avatar-ring)]"
                        : "border-white/20",
                      participant.palette,
                    ].join(" ")}
                  />
                  <p className="mt-3 font-mono text-sm">{participant.handle}</p>
                </article>
              ))}
            </div>
            {!canUseWebGl ? (
              <div className="absolute left-6 top-6 rounded-md border border-white/20 bg-black/30 px-4 py-3 text-sm">
                WebGL unavailable. Audio-only fallback is active.
              </div>
            ) : null}
          </div>

          <aside className="border-l border-white/10 bg-black/20 p-5">
            <h2 className="text-lg font-semibold">Facilitator notes</h2>
            <textarea
              className="mt-4 h-48 w-full rounded-md border border-white/20 bg-black/20 p-3 text-sm text-white"
              placeholder="Private notes"
            />
            <h3 className="mt-6 font-semibold">Participants</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {participants.map((participant) => (
                <li key={participant.handle}>{participant.handle}</li>
              ))}
            </ul>
          </aside>
        </section>

        <footer className="flex items-center justify-center gap-3 bg-[var(--session-controls-bg)] px-6 py-4">
          <button
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            className="min-h-11 rounded-md border border-white/20 px-4 py-2"
            onClick={() => setMuted((value) => !value)}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <select
            aria-label="Gesture"
            className="min-h-11 rounded-md border border-white/20 bg-[var(--session-bg)] px-4 py-2"
            value={gesture}
            onChange={(event) => setGesture(event.target.value as AvatarGesture)}
          >
            {gestures.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            className="min-h-11 rounded-md border border-white/20 px-4 py-2"
            onClick={() => setShowCrisis(true)}
          >
            Flag
          </button>
          <button className="min-h-11 rounded-md bg-[var(--color-error)] px-4 py-2 font-semibold">
            End session
          </button>
        </footer>
      </div>
      {showCrisis ? <CrisisEscalation region="State resources" country="United States" /> : null}
    </main>
  );
}
