import { useState, useEffect } from 'react';
import { Volume2, Shield } from "lucide-react";

// Task 5.13 — WebGL fallback notice if 3D rendering is unavailable.
export function WebGLFallback({ roomName }: { roomName: string }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.12),transparent_50%),black] p-8 text-center select-none"
      role="status"
      aria-live="polite"
    >
      <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/60 p-4 shadow-xl">
        <Shield className="h-16 w-16 text-amber-300/80" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Shield className="w-5 h-5 text-accent" />
        3D Avatar Unavailable
      </h2>
      <p className="mt-2 max-w-sm text-xs text-text/70 leading-relaxed">
        WebGL acceleration is not supported or was lost. Reopen this page on a WebGL-capable browser or device to use the TalkingHead avatar.
      </p>
      
      <div className="mt-6 flex gap-4 items-center rounded-2xl border border-white/5 bg-zinc-900/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-emerald-400" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Audio Link Established
          </p>
        </div>
        <span className="w-px h-4 bg-white/10" />
        <p className="font-mono text-xs text-accent">anon-{roomName.slice(0, 8)}</p>
      </div>
    </div>
  );
}

// Utility to check WebGL availability
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Hook to track WebGL availability
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  return supported;
}
