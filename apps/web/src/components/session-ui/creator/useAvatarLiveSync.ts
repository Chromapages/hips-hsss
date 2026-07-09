"use client";

import { useEffect } from "react";
import type { Avatar2DConfig } from "@hips/types";

interface LiveSyncProps {
  baseSkinTone: string;
  skinOffset: number;
  presentConfig: Avatar2DConfig;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
  handleRandomizeAvatar: () => void;
}

export function useAvatarLiveSync({
  baseSkinTone,
  skinOffset,
  presentConfig,
  setLocalAvatar2D,
  handleRandomizeAvatar,
}: LiveSyncProps) {
  // OKLCH fine-tuned skin tone adjustment listener
  useEffect(() => {
    let active = true;
    import("@/lib/avatar2d-utils").then(({ darken }) => {
      if (!active) return;
      try {
        const adjusted = darken(baseSkinTone, -skinOffset);
        if (presentConfig.skinTone !== adjusted) {
          setLocalAvatar2D({ skinTone: adjusted });
        }
      } catch (e) {
        console.error(e);
      }
    });
    return () => {
      active = false;
    };
  }, [baseSkinTone, skinOffset, presentConfig.skinTone, setLocalAvatar2D]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        handleRandomizeAvatar();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleRandomizeAvatar]);
}
