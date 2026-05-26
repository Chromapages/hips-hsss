"use client";

import { Monitor, Volume2 } from "lucide-react";
import type { AvatarProfile } from "@hips/types";

// Task 5.13 — WebGL fallback (audio-only if WebGL unavailable)
export function WebGLFallback({ avatar, roomName }: { avatar: AvatarProfile; roomName: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black] p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
        <Monitor className="h-8 w-8 text-indigo-300" />
      </div>
      <h2 className="text-xl font-bold text-white">3D Avatars Unavailable</h2>
      <p className="mt-2 max-w-xs text-sm text-zinc-400">
        Your browser does not support WebGL. Audio is still working and you can participate in
        the session.
      </p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Audio Active
          </p>
        </div>
        <p className="font-mono text-sm text-indigo-300">anon-{roomName.slice(0, 8)}</p>
      </div>
      <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
        <p className="text-xs text-amber-200">
          ✋ Hand raising and voice controls still work in audio-only mode
        </p>
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