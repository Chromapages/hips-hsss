"use client";

import type { Avatar2DConfig } from "@hips/types";
import { layerRenderOrder } from "@/lib/avatar-asset-registry";
import { avatar2DCssVars } from "@/lib/avatar2d-utils";
import { SvgLayer } from "./SvgLayer";
import { PremiumAvatarFilters } from "./PremiumAvatarFilters";

type AvatarCompositorProps = {
  config: Avatar2DConfig;
  className?: string;
  isMini?: boolean;
  isOnline?: boolean;
};

export function AvatarCompositor({ config, className, isMini, isOnline = true }: AvatarCompositorProps) {
  const layers = layerRenderOrder(config, isOnline);
  const bgLayer = layers[0];
  const characterLayers = layers.slice(1);

  // Dynamic shadow scale based on selected face shape
  let shadowScale = "scale(1.0)";
  if (config.faceShape === "face_round_01") shadowScale = "scale(1.1, 0.95)";
  else if (config.faceShape === "face_square_01") shadowScale = "scale(1.15, 0.9)";
  else if (config.faceShape === "face_heart_01") shadowScale = "scale(0.95, 1.05)";

  return (
    <div
      aria-label="Avatar preview"
      className={`relative aspect-square w-full overflow-hidden rounded-2xl [filter:url(#premium-noise-grain)] ${className ?? ""}`}
      role="img"
      style={avatar2DCssVars(config)}
      data-avatar-compositor
      data-avatar-compositor-mini={isMini ? "true" : undefined}
    >
      <PremiumAvatarFilters skinTone={config.skinTone} />
      
      {/* Background layer rendered statically */}
      {bgLayer && <SvgLayer src={bgLayer} />}

      {/* Breathing character layers group */}
      <div className={`absolute inset-0 ${isMini ? "" : "animate-[avatar-breathe_3s_ease-in-out_infinite]"}`}>
        {/* Dynamic ambient occlusion shadow under jawline */}
        <div 
          className="absolute left-[37.5%] top-[66.25%] w-[25%] h-[6.25%] rounded-[50%] bg-black/15 blur-[5px] pointer-events-none transition-transform duration-300"
          style={{ transform: shadowScale }}
        />

        {characterLayers.map((src, index) => (
          <SvgLayer key={`${src ?? "empty"}-${index}`} src={src} />
        ))}
      </div>
    </div>
  );
}
