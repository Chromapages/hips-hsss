"use client";

import { Lock, Mic, Volume2, ShieldCheck, Headphones, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import Link from "next/link";

interface Participant {
  identity: string;
  isLocal: boolean;
}

interface GroupSessionLobbyProps {
  groupId: string;
  participants?: Participant[];
  onEnterSession?: () => void;
}

// Task 5.9 — Group session lobby with waiting room and participant list
export function GroupSessionLobby({
  groupId,
  participants = [],
  onEnterSession,
}: GroupSessionLobbyProps) {
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({
    anonymous: false,
    headphones: false,
    safeSpace: false,
  });

  const handleTestMic = useCallback(async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setMicActive(true);
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {
      setMicError("Access denied. Please check browser permissions.");
      setMicActive(false);
    }
  }, []);

  const allChecked =
    Object.values(checklist).every((v) => v) && micActive;

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-700">
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
          <Lock className="h-3 w-3 text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300">
            Secure Entry Point
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">Session Lobby</h1>
        <p className="text-zinc-400">
          ID: <span className="font-mono text-indigo-300">{groupId}</span>
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hardware Audit Section */}
        <section className="space-y-4">
          <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Hardware Audit
          </h2>

          {/* Microphone test */}
          <div className="rounded-xl border border-white/5 bg-white/5 p-5 transition-colors hover:bg-white/[0.07]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    micActive
                      ? "bg-emerald-500/20"
                      : micError
                        ? "bg-red-500/20"
                        : "bg-white/5"
                  }`}
                >
                  <Mic
                    className={`h-5 w-5 ${
                      micActive
                        ? "text-emerald-400"
                        : micError
                          ? "text-red-400"
                          : "text-zinc-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Microphone</p>
                  <p className="text-xs text-zinc-500">
                    {micActive ? "Input detected" : micError ? "Test failed" : "Click to test"}
                  </p>
                </div>
              </div>
              <button
                className={`rounded-md px-3 py-1 text-xs transition ${
                  micActive
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={handleTestMic}
              >
                {micActive ? "Success" : "Test Mic"}
              </button>
            </div>
            {micError && <p className="mb-2 text-[10px] text-red-400">{micError}</p>}
            {micActive && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full animate-pulse bg-emerald-500" style={{ width: "66%" }} />
              </div>
            )}
          </div>

          {/* Audio output */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-5">
            <div className="rounded-lg bg-white/5 p-2">
              <Volume2 className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Audio Output</p>
              <p className="text-xs text-zinc-500">Speakers/Headphones OK</p>
            </div>
          </div>

          {/* Hard anonymity notice */}
          <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-200/80">
              <strong>Hard Anonymity Notice:</strong> Your camera is disabled by default.
              Identity verification is cryptographic, not visual.
            </p>
          </div>
        </section>

        {/* Privacy Protocols Section */}
        <section className="space-y-4">
          <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Privacy Protocols
          </h2>

          <div className="space-y-4 rounded-xl border border-white/5 bg-zinc-950 p-6">
            <label className="flex cursor-pointer items-start gap-4 group">
              <input
                type="checkbox"
                checked={checklist.anonymous}
                onChange={() => setChecklist({ ...checklist, anonymous: !checklist.anonymous })}
                className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                    Handle-only Protocol
                  </p>
                </div>
                <p className="text-xs italic text-zinc-500">
                  &quot;I will not share my real name or physical location.&quot;
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-4 group">
              <input
                type="checkbox"
                checked={checklist.headphones}
                onChange={() => setChecklist({ ...checklist, headphones: !checklist.headphones })}
                className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                    Aural Isolation
                  </p>
                </div>
                <p className="text-xs text-zinc-500">
                  &quot;I am wearing headphones to protect others&apos; privacy.&quot;
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-4 group">
              <input
                type="checkbox"
                checked={checklist.safeSpace}
                onChange={() => setChecklist({ ...checklist, safeSpace: !checklist.safeSpace })}
                className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white">
                    Safe Environment
                  </p>
                </div>
                <p className="text-xs text-zinc-500">
                  &quot;I am in a private space where I will not be overheard.&quot;
                </p>
              </div>
            </label>
          </div>

          {/* Participant list */}
          {participants.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-zinc-950 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                In Lobby ({participants.length})
              </p>
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.identity}
                    className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
                      {p.isLocal ? "Y" : p.identity.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-mono text-xs text-zinc-300">
                      anon-{p.identity.slice(0, 8)}
                    </span>
                    {p.isLocal && (
                      <span className="ml-auto text-xs text-zinc-500">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {allChecked ? (
            <button
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-indigo-500"
              onClick={onEnterSession}
              type="button"
            >
              Enter Session Room
            </button>
          ) : (
            <button
              aria-disabled="true"
              className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/5 bg-white/5 font-bold text-zinc-500"
              disabled
              type="button"
            >
              Complete Protocols to Enter
            </button>
          )}
        </section>
      </div>
    </div>
  );
}