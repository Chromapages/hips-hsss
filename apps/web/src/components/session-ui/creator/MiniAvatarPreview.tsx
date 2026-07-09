"use client";

import type { Avatar2DConfig } from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";

interface MiniAvatarPreviewProps {
  partType: string;
  partId: string | null;
}

export function MiniAvatarPreview({ partType, partId }: MiniAvatarPreviewProps) {
  const previewConfig: Avatar2DConfig = {
    ...DEFAULT_AVATAR_2D,
    skinTone: "#C68642",
    hairColor: "#2B211D",
    clothingColor: "#252D37",
    background: "bg_solid_cloud",
    expression: "neutral",
    [partType]: partId,
  } as any;

  return (
    <div className="w-[48px] h-[48px] overflow-hidden rounded-lg relative scale-[0.9] origin-center bg-zinc-900 pointer-events-none">
      <AvatarCompositor config={previewConfig} className="w-full h-full" isMini />
    </div>
  );
}
