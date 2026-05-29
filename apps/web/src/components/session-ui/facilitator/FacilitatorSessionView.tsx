"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useParticipants, useRoomContext, useDataChannel } from "@livekit/components-react";
import {
  Hand,
  PhoneOff,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import type { AvatarGesture } from "@hips/types";
import { VoiceControlsBar } from "../VoiceControlsBar";
import { SessionHeader } from "../SessionHeader";

interface ParticipantInfo {
  identity: string;
  isSpeaking: boolean;
  raisedHand: boolean;
}

// Task 5.15 — Facilitator session view with notes panel and participant list
export function FacilitatorSessionView({
  anonymousIdentity,
  roomName,
  avatar,
  canFacilitate,
  onCrisis,
  onKick,
}: {
  anonymousIdentity: string;
  roomName: string;
  avatar: { style: number; palette: "coastal" | "sunrise" | "forest" };
  canFacilitate: boolean;
  onCrisis: (reason: string) => void;
  onKick: (reason: string) => void;
}) {
  const room = useRoomContext();
  const livekitParticipants = useParticipants();

  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [micEnabled, setMicEnabled] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const [localHandRaised, setLocalHandRaised] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [facilitatorNotes, setFacilitatorNotes] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);

  const textEncoder = useRef(new TextEncoder());

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Task 5.10 — Active speaker detection from LiveKit
  const participants: ParticipantInfo[] = useMemo(() => {
    return livekitParticipants.map((p) => ({
      identity: p.identity,
      isSpeaking: p.isSpeaking,
      raisedHand: raisedHands.has(p.identity),
    }));
  }, [livekitParticipants, raisedHands]);

  // Task 5.10 — Active speaker identity for ring animation
  const activeSpeakerIdentity = useMemo(() => {
    const speaking = participants.filter((p) => p.isSpeaking && p.identity !== room.localParticipant.identity);
    return speaking.length > 0 ? speaking[0].identity : null;
  }, [participants, room.localParticipant.identity]);

  // Data channel for hand control messages
  const { send } = useDataChannel("session-control", (message) => {
    try {
      const parsed = JSON.parse(new TextDecoder().decode(message.payload)) as {
        type: string;
        participantIdentity: string;
      };
      if (parsed.type === "HAND_RAISED") {
        setRaisedHands((prev) => new Set([...prev, parsed.participantIdentity]));
      } else if (parsed.type === "HAND_LOWERED") {
        setRaisedHands((prev) => {
          const next = new Set(prev);
          next.delete(parsed.participantIdentity);
          return next;
        });
      }
    } catch {
      // Invalid message
    }
  });

  const publishControlMessage = useCallback(
    async (type: "HAND_RAISED" | "HAND_LOWERED") => {
      if (!send) return;
      const msg = {
        type,
        participantIdentity: room.localParticipant.identity,
        at: new Date().toISOString(),
      };
      await send(textEncoder.current.encode(JSON.stringify(msg)), {
        reliable: true,
        topic: "session-control",
      });
    },
    [send, room.localParticipant.identity],
  );

  const toggleHand = useCallback(async () => {
    const next = !localHandRaised;
    setLocalHandRaised(next);
    await publishControlMessage(next ? "HAND_RAISED" : "HAND_LOWERED");
  }, [localHandRaised, publishControlMessage]);

  const handleFlag = useCallback(() => {
    const reason = window.prompt("Please describe the safety concern:");
    if (!reason) return;

    fetch("/api/safety/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: roomName,
        reporterId: room.localParticipant.identity,
        level: "HIGH",
        reason,
      }),
    });
  }, [roomName, room.localParticipant.identity]);

  const leaveSession = useCallback(async () => {
    await room.disconnect();
    window.location.href = "/dashboard";
  }, [room]);

  const connectionQuality: "good" | "fair" | "poor" = "good";

  const fallbackColors = ["#6366f1", "#a78bfa", "#f43f5e", "#f59e0b", "#34d399", "#38bdf8"];
  const paletteColors = {
    coastal: "#06b6d4",
    sunrise: "#f59e0b",
    forest: "#10b981",
  } as const;

  const participantList = useMemo(
    () =>
      livekitParticipants.map((p, index) => ({
        identity: p.identity,
        isSpeaking: p.isSpeaking,
        color: p.identity === room.localParticipant.identity
          ? paletteColors[avatar.palette]
          : fallbackColors[index % fallbackColors.length] ?? "#6366f1",
        styleIndex: p.identity === room.localParticipant.identity
          ? avatar.style
          : index + 1,
        isLocal: p.identity === room.localParticipant.identity,
      })),
    [livekitParticipants, room.localParticipant.identity, avatar],
  );

  return (
    <main className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black text-white">
      {/* Task 5.8 — Session header */}
      <SessionHeader
        anonymousHandle={anonymousIdentity}
        sessionSeconds={sessionSeconds}
        connectionQuality={connectionQuality}
        roomName={roomName}
      />

      {/* Main content */}
      <section className="grid min-h-0 grid-cols-[1fr_360px]">
        {/* Avatar canvas area */}
        <div className="relative min-w-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black]">
          {/* Placeholder for AvatarCanvas - would be integrated with Three.js */}
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-zinc-500">
              <p className="text-sm">Virtual Sanctuary</p>
              <p className="mt-2 font-mono text-xs text-indigo-300">
                {participants.length} participant{participants.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Task 5.10 — Active speaker ring overlay */}
          {activeSpeakerIdentity && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 animate-pulse rounded-full border-2 border-indigo-500/30 opacity-50" />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="grid min-h-0 grid-rows-[auto_1fr] border-l border-white/10 bg-zinc-950">
          {/* Hand Queue (facilitator) */}
          {canFacilitate ? (
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Facilitator Queue
                </p>
                <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-200">
                  {raisedHands.size}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {raisedHands.size === 0 ? (
                  <p className="text-sm text-zinc-500">No raised hands.</p>
                ) : (
                  Array.from(raisedHands).map((identity) => (
                    <div
                      key={identity}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"
                    >
                      <span className="font-mono text-xs text-zinc-300">
                        anon-{identity.slice(0, 8)}
                      </span>
                      <button
                        className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300 hover:bg-white/10"
                        onClick={() => publishControlMessage("HAND_LOWERED")}
                        type="button"
                      >
                        Lower
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="border-b border-white/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Hand Queue
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Raise your hand when you would like facilitator attention.
              </p>
            </div>
          )}

          {/* Participant list */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Participants
            </p>
            <div className="space-y-2">
              {participantList.map((p) => (
                <div
                  key={p.identity}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold`}
                    style={{ backgroundColor: p.isLocal ? p.color : undefined }}
                  >
                    {p.isLocal ? "Y" : p.identity.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm">
                      anon-{p.identity.slice(0, 8)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {p.isLocal ? "You" : "Peer"}
                    </p>
                  </div>
                  {p.isSpeaking && (
                    <div className="flex h-3 items-end gap-0.5">
                      <span className="h-2 w-1 animate-bounce rounded-sm bg-indigo-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-3 w-1 animate-bounce rounded-sm bg-indigo-400" style={{ animationDelay: "100ms" }} />
                      <span className="h-1.5 w-1 animate-bounce rounded-sm bg-indigo-400" style={{ animationDelay: "200ms" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Task 5.15 — Facilitator notes panel */}
          {canFacilitate ? (
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-zinc-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Session Notes
                </p>
              </div>
              <textarea
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                placeholder="Notes for this session (not persisted)..."
                rows={3}
                value={facilitatorNotes}
                onChange={(e) => setFacilitatorNotes(e.target.value)}
              />
            </div>
          ) : null}
        </aside>
      </section>

      {/* Task 5.7 — Voice controls bar */}
      <footer className="flex items-center justify-center border-t border-white/10 bg-black/75 px-6 py-4 backdrop-blur-2xl">
        <VoiceControlsBar
          micEnabled={micEnabled}
          micBusy={micBusy}
          raisedHand={localHandRaised}
          onToggleMute={() => setMicEnabled((v) => !v)}
          onToggleHand={toggleHand}
          onFlag={handleFlag}
          onLeave={() => setConfirmLeave(true)}
        />
      </footer>

      {/* Leave confirmation */}
      {confirmLeave ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
        >
          <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-10">
            <h2 className="mb-4 text-2xl font-black tracking-tighter">
              Leave this session?
            </h2>
            <p className="leading-relaxed text-zinc-400">
              Your audio will stop and you will return to the dashboard.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                className="h-12 flex-1 rounded-2xl border border-white/10 font-bold hover:bg-white/5"
                onClick={() => setConfirmLeave(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-12 flex-1 rounded-2xl bg-red-600 font-bold hover:bg-red-500"
                onClick={leaveSession}
                type="button"
              >
                Leave
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}