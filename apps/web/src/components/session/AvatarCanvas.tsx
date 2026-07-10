"use client";

import { useParticipants } from "@livekit/components-react";
import type { Avatar2DConfig, Avatar2DExpression, AvatarEmotion, AvatarGesture, AvatarProfile } from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";

import { parseAvatar2DConfigString } from "@/lib/avatar2d-schema";

const parseAvatar2DConfig = (raw: string | undefined): Avatar2DConfig | null => {
  if (!raw) return null;
  return parseAvatar2DConfigString(raw);
};

const mapEmotionToExpression = (emotion: AvatarEmotion): Avatar2DExpression => {
  if (emotion === "distressed") return "concerned";
  return "neutral";
};

interface AvatarCanvasProps {
  avatar: AvatarProfile;
  localIdentity: string;
  raisedHands: Set<string>;
  activeSpeakerIdentity?: string | null;
  gesture?: AvatarGesture;
  localEmotion?: AvatarEmotion;
}

export default function AvatarCanvas({
  localIdentity,
  raisedHands,
  activeSpeakerIdentity,
  localEmotion = "neutral",
}: AvatarCanvasProps) {
  const participants = useParticipants();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-8 overflow-y-auto bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.08),transparent_50%),black]">
      <div className="w-full max-w-5xl flex flex-wrap justify-center gap-6 md:gap-8">
        {participants.map((participant) => {
          const isLocal = participant.identity === localIdentity;
          const remoteEmotion = participant.attributes["avatar-emotion"];
          const emotion = isLocal ? localEmotion : ((remoteEmotion as AvatarEmotion) || "neutral");
          const isSpeaking = participant.isSpeaking || participant.identity === activeSpeakerIdentity;
          const isHandRaised = raisedHands.has(participant.identity);
          const avatar2D = {
            ...DEFAULT_AVATAR_2D,
            ...(parseAvatar2DConfig(participant.attributes["avatar-2d"]) ?? {}),
            expression: isSpeaking ? "surprised" : mapEmotionToExpression(emotion),
          } satisfies Avatar2DConfig;

          let isHost = false;
          if (participant.metadata) {
            try {
              const parsed = JSON.parse(participant.metadata);
              isHost = ["FACILITATOR", "ADMIN", "SUPER_ADMIN"].includes(parsed.role);
            } catch {}
          }

          const displayName = isLocal
            ? "You"
            : participant.identity.startsWith("anon-")
              ? participant.identity
              : `anon-${participant.identity.slice(0, 6)}`;

          return (
            <div
              key={participant.identity}
              className={`relative rounded-2xl border bg-zinc-900/40 p-5 flex flex-col items-center justify-between shadow-xl transition-all duration-300 backdrop-blur-md overflow-hidden w-full sm:w-[200px] aspect-[4/5] ${
                isSpeaking
                  ? "border-accent/40 shadow-[0_0_24px_rgba(6,182,212,0.15)] ring-1 ring-accent/30"
                  : "border-white/5"
              }`}
            >
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2 pointer-events-none">
                {isHost ? (
                  <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/20 text-[8px] font-bold text-accent tracking-wider uppercase font-ui">
                    Host
                  </span>
                ) : (
                  <span />
                )}
                {isHandRaised ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[8px] font-bold text-amber-200 tracking-wider uppercase font-ui flex items-center gap-1 animate-bounce">
                    Hand
                  </span>
                ) : null}
              </div>

              <div className="w-32 h-32 mt-4 flex items-center justify-center">
                <AvatarCompositor
                  config={avatar2D}
                  className={`h-full w-full rounded-2xl border border-white/10 bg-slate-100 transition-transform duration-300 ${
                    isSpeaking ? "scale-105" : ""
                  } ${isHandRaised ? "ring-2 ring-amber-300/60" : ""}`}
                />
              </div>

              <div className="text-center w-full mt-4">
                <div className="text-xs font-bold text-white tracking-wide font-ui truncate px-2">
                  {displayName}
                </div>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? "bg-accent animate-ping" : "bg-emerald-500"}`} />
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-ui font-semibold">
                    {isSpeaking ? "Speaking" : "Connected"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
