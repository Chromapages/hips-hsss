"use client";

import { DEFAULT_AVATAR_2D } from "@hips/types";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";

export function MiniAvatarPreview({ partType, partId }) {
  const previewConfig = {
    ...DEFAULT_AVATAR_2D,
    skinTone: "#C68642",
    hairColor: "#2B211D",
    clothingColor: "#252D37",
    background: "bg_solid_cloud",
    expression: "neutral",
    [partType]: partId,
  };

  return (
    <div className="w-[48px] h-[48px] overflow-hidden rounded-lg relative scale-[0.9] origin-center bg-av-bg-input pointer-events-none">
      <AvatarCompositor config={previewConfig} className="w-full h-full" isMini />
    </div>
  );
}
