"use client";

import { Flag, Mic, MicOff, PhoneOff, Settings } from "lucide-react";
import { useState } from "react";

export function VoiceControlsBar() {
  const [muted, setMuted] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/75 p-2 shadow-2xl backdrop-blur-xl">
        <button
          aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          className={[
            "min-h-11 min-w-11 rounded-full transition focus:outline-none focus:ring-2 focus:ring-indigo-400",
            muted ? "bg-red-500/20 text-red-200" : "bg-white/10 text-white hover:bg-white/15",
          ].join(" ")}
          onClick={() => setMuted((value) => !value)}
          type="button"
        >
          {muted ? <MicOff className="mx-auto h-5 w-5" /> : <Mic className="mx-auto h-5 w-5" />}
        </button>
        <button
          aria-label="Open settings"
          className="min-h-11 min-w-11 rounded-full bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="button"
        >
          <Settings className="mx-auto h-5 w-5" />
        </button>
        <button
          aria-label="Report session"
          className="min-h-11 min-w-11 rounded-full bg-amber-400/15 text-amber-200 transition hover:bg-amber-400/25 focus:outline-none focus:ring-2 focus:ring-amber-300"
          type="button"
        >
          <Flag className="mx-auto h-5 w-5" />
        </button>
        <button
          aria-label="End session"
          className="min-h-11 min-w-11 rounded-full bg-red-500/20 text-red-200 transition hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={() => setConfirmEnd(true)}
          type="button"
        >
          <PhoneOff className="mx-auto h-5 w-5" />
        </button>
      </div>
      {confirmEnd ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6 text-white backdrop-blur-xl">
          <section className="max-w-md rounded-lg border border-white/10 bg-gray-950 p-6">
            <h2 className="text-2xl font-bold">End this session?</h2>
            <p className="mt-3 text-gray-400">You can return to the dashboard after leaving.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="min-h-11 rounded-md border border-white/10 px-4" onClick={() => setConfirmEnd(false)} type="button">
                Cancel
              </button>
              <button className="min-h-11 rounded-md bg-red-600 px-4 font-semibold" type="button">
                End session
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
