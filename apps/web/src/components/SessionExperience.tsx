"use client";

import { useMemo, useState } from "react";
import type { AvatarGesture } from "@hips/types";
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
  const canUseWebGl = useMemo(
    () => typeof window !== "undefined" && Boolean(window.WebGLRenderingContext),
    [],
  );

  return (
    <main data-layer="session" className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] mix-blend-screen" />

      <div className="lg:hidden flex min-h-screen items-center justify-center p-6 text-center relative z-20">
        <section className="max-w-md rounded-3xl border border-white/10 bg-black/60 p-10 backdrop-blur-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">💻</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-4">Wider screen required</h1>
          <p className="text-zinc-400 leading-relaxed">
            For your security and immersion, the Virtual Sanctuary requires a desktop or laptop screen.
          </p>
        </section>
      </div>

      <div className="hidden min-h-screen grid-rows-[auto_1fr_auto] lg:grid relative z-10">
        <header className="grid grid-cols-3 items-center border-b border-white/5 bg-black/40 backdrop-blur-2xl px-8 py-4 z-20">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Session Token</p>
            <p className="font-mono text-sm font-bold text-indigo-400">
              anon-{sessionId.slice(0, 6)}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Safety Engine Active
            </p>
            <p className="font-mono text-xl font-bold tracking-widest text-white">00:24:18</p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Network</span>
            <span className="inline-flex gap-1 items-end h-5" aria-label="Connection quality">
              <span className="h-2 w-1.5 rounded-sm bg-emerald-500" />
              <span className="h-3.5 w-1.5 rounded-sm bg-emerald-500" />
              <span className="h-5 w-1.5 rounded-sm bg-emerald-500" />
            </span>
          </div>
        </header>

        <section className="relative overflow-hidden flex flex-col items-center justify-center perspective-[1000px]">
          {/* Abstract Virtual Space */}
          <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
            {/* The "Table" / Center piece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-[100%] border border-white/5 bg-white/[0.01] shadow-[inset_0_0_100px_rgba(255,255,255,0.02)] rotate-x-[60deg]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-[100%] border border-indigo-500/10 bg-indigo-500/[0.02] shadow-[0_0_50px_rgba(99,102,241,0.1)] rotate-x-[60deg]" />
            
            {/* Participants */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[800px] flex justify-between items-center px-12 z-10">
              {participants.map((participant, index) => (
                <article className="flex flex-col items-center group" key={participant.handle}>
                  <div className="relative mb-6">
                    {/* Active Speaker Ring */}
                    {index === 0 && (
                      <div className="absolute -inset-4 rounded-full border border-indigo-500/30 animate-ping opacity-50" />
                    )}
                    
                    <div
                      className={[
                        "relative h-32 w-32 rounded-full border border-white/10 shadow-2xl flex items-center justify-center transition-all duration-700",
                        index === 0 ? "scale-110 shadow-[0_0_40px_rgba(99,102,241,0.3)]" : "opacity-80 scale-90",
                        participant.palette, // This maps to the CSS variable colors defined in tokens
                      ].join(" ")}
                    >
                      {/* Inner avatar core */}
                      <div className="w-16 h-16 rounded-full bg-white/20 blur-md mix-blend-overlay" />
                    </div>
                  </div>
                  
                  <div className="px-4 py-1.5 rounded-full bg-black/50 border border-white/5 backdrop-blur-md">
                    <p className="font-mono text-xs font-bold text-white tracking-widest">{participant.handle}</p>
                  </div>
                  
                  {/* Status indicator (e.g. mic off, speaking) */}
                  <div className="mt-3">
                    {index === 0 ? (
                      <div className="flex gap-1 h-3 items-end">
                        <span className="w-1 rounded-sm bg-indigo-400 animate-[bounce_1s_infinite_100ms] h-2" />
                        <span className="w-1 rounded-sm bg-indigo-400 animate-[bounce_1s_infinite_200ms] h-3" />
                        <span className="w-1 rounded-sm bg-indigo-400 animate-[bounce_1s_infinite_300ms] h-1.5" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            
            {!canUseWebGl ? (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-amber-500/20 bg-amber-500/10 px-6 py-2 text-xs font-bold text-amber-200 tracking-widest uppercase">
                WebGL Off • Low Fidelity Mode Active
              </div>
            ) : null}
          </div>
        </section>

        {/* Floating Controls Bar */}
        <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-3xl border border-white/10 p-3 rounded-3xl shadow-2xl shadow-black/50">
            <button
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              className={[
                "flex items-center gap-2 h-14 rounded-2xl px-6 font-bold text-sm transition-all",
                muted 
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
                  : "bg-white/5 text-white border border-white/5 hover:bg-white/10"
              ].join(" ")}
              onClick={() => setMuted((value) => !value)}
            >
              {muted ? "Unmuted" : "Mute Mic"}
            </button>
            
            <div className="h-8 w-px bg-white/10 mx-2" />
            
            <select
              aria-label="Gesture"
              className="h-14 rounded-2xl border border-white/5 bg-white/5 px-6 font-bold text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none appearance-none hover:bg-white/10 transition-colors cursor-pointer"
              value={gesture}
              onChange={(event) => setGesture(event.target.value as AvatarGesture)}
            >
              {gestures.map((item) => (
                <option key={item} value={item} className="bg-zinc-900 text-white">
                  Express: {item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <div className="h-8 w-px bg-white/10 mx-2" />

            <button
              className="h-14 w-14 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-500 hover:bg-amber-500/20 transition-all hover:scale-105"
              onClick={() => setShowCrisis(true)}
              aria-label="Flag Issue"
              title="Escalate Issue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </button>
            
            <button className="h-14 rounded-2xl bg-red-600 px-8 font-bold text-white text-sm hover:bg-red-500 transition-all shadow-lg shadow-red-900/20 hover:scale-105 ml-2">
              Leave
            </button>
          </div>
        </footer>
      </div>
      
      {showCrisis ? <CrisisEscalation region="State resources" country="United States" onStayInSession={() => setShowCrisis(false)} onEndSession={() => router.push('/dashboard')} /> : null}
    </main>
  );
}
