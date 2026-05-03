"use client";

import { Flag, Mic, MicOff, PhoneOff, Settings } from "lucide-react";
import { useState } from "react";

export function VoiceControlsBar() {
  const [muted, setMuted] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  return (
    <>
      <div className="fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/80 p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-all">
        <button
          aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          className={[
            "flex items-center justify-center h-14 w-14 rounded-full transition-all group",
            muted ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-white/5 text-white border border-white/5 hover:bg-white/10",
          ].join(" ")}
          onClick={() => setMuted((value) => !value)}
          type="button"
        >
          {muted ? <MicOff className="h-6 w-6 group-hover:scale-110 transition-transform" /> : <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" />}
        </button>
        
        <button
          aria-label="Open settings"
          className="flex items-center justify-center h-14 w-14 rounded-full bg-white/5 text-white transition-all hover:bg-white/10 border border-white/5 group"
          type="button"
        >
          <Settings className="h-6 w-6 group-hover:rotate-45 transition-transform" />
        </button>
        
        <div className="w-px h-8 bg-white/10 mx-1" />
        
        <button
          aria-label="Report session"
          className="flex items-center justify-center h-14 w-14 rounded-full bg-amber-500/10 text-amber-500 transition-all hover:bg-amber-500/20 border border-amber-500/20 group"
          type="button"
        >
          <Flag className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          aria-label="End session"
          className="flex items-center justify-center h-14 px-8 rounded-full bg-red-600 text-white transition-all hover:bg-red-500 font-bold ml-1 shadow-lg shadow-red-900/40 hover:scale-105"
          onClick={() => setConfirmEnd(true)}
          type="button"
        >
          <PhoneOff className="h-5 w-5 mr-2" />
          Leave
        </button>
      </div>
      {confirmEnd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 text-white backdrop-blur-2xl animate-in fade-in duration-300">
          <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
              <PhoneOff className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">End this session?</h2>
            <p className="text-zinc-400 leading-relaxed">
              Are you sure you want to leave the Virtual Sanctuary? You can return to the dashboard after leaving.
            </p>
            <div className="mt-10 flex gap-4">
              <button 
                className="flex-1 h-14 rounded-2xl border border-white/10 bg-transparent font-bold hover:bg-white/5 transition-all" 
                onClick={() => setConfirmEnd(false)} 
                type="button"
              >
                Cancel
              </button>
              <button 
                className="flex-1 h-14 rounded-2xl bg-red-600 font-bold shadow-lg shadow-red-900/40 hover:bg-red-500 transition-all" 
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
