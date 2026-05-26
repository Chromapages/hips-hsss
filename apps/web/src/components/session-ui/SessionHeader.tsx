"use client";

import { Shield, ShieldAlert } from "lucide-react";

interface SessionHeaderProps {
  anonymousHandle: string;
  sessionSeconds: number;
  connectionQuality: "good" | "fair" | "poor";
  connectionLabel?: string;
  roomName?: string;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function QualityIndicator({
  quality,
}: {
  quality: "good" | "fair" | "poor";
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Network
      </span>
      <span
        className="inline-flex items-end gap-0.5 h-5"
        aria-label={`Connection quality: ${quality}`}
      >
        <span
          className={[
            "h-2 w-1.5 rounded-sm",
            quality === "good"
              ? "bg-emerald-500"
              : quality === "fair"
                ? "bg-amber-500"
                : "bg-red-500",
          ].join(" ")}
        />
        <span
          className={[
            "h-3.5 w-1.5 rounded-sm",
            quality === "good"
              ? "bg-emerald-500"
              : quality === "fair"
                ? "bg-amber-500"
                : "bg-zinc-700",
          ].join(" ")}
        />
        <span
          className={[
            "h-5 w-1.5 rounded-sm",
            quality === "good"
              ? "bg-emerald-500"
              : "bg-zinc-700",
          ].join(" ")}
        />
      </span>
    </div>
  );
}

// Task 5.8 — Session header with anon handle, timer, connection quality
export function SessionHeader({
  anonymousHandle,
  sessionSeconds,
  connectionQuality,
  connectionLabel = "Connected",
  roomName,
}: SessionHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-black/70 px-6 py-4 backdrop-blur-2xl">
      {/* Left: Anonymous handle */}
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Anonymous Room
        </p>
        <p className="font-mono text-sm font-bold text-indigo-300">
          anon-{anonymousHandle.slice(0, 8)}
        </p>
      </div>

      {/* Center: Timer + Safety status */}
      <div className="flex flex-col items-center gap-1">
        <p className="font-mono text-2xl font-black tracking-widest text-white">
          {formatTime(sessionSeconds)}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={[
                "h-2 w-2 rounded-full",
                connectionQuality === "good"
                  ? "bg-emerald-400"
                  : connectionQuality === "fair"
                    ? "bg-amber-400"
                    : "bg-red-400",
              ].join(" ")}
            />
            <span className="text-xs font-bold text-zinc-400">{connectionLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <ShieldAlert className="h-4 w-4" />
            Safety Engine Active
          </div>
        </div>
      </div>

      {/* Right: Room hash */}
      {roomName && (
        <div className="flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Room Hash
          </p>
          <p className="font-mono text-xs text-zinc-400">{roomName.slice(0, 12)}</p>
        </div>
      )}
    </header>
  );
}