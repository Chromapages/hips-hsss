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
  // Layer order is hair-back, shoulders, face, clothing, pattern, eyes, then
  // facial details/hair/accessories. Keeping the eyes in their own transform
  // group gives us a real blink without timers or re-rendering the avatar.
  const eyeLayerIndex = 5;
  const beforeEyes = characterLayers.slice(0, eyeLayerIndex);
  const eyeLayer = characterLayers[eyeLayerIndex];
  const afterEyes = characterLayers.slice(eyeLayerIndex + 1);

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

      {/* Lightweight 2D idle rig: posture drift, chest rise, and eye blink. */}
      <div className={`avatar-idle-posture absolute inset-0 ${isMini ? "avatar-idle-static" : ""}`}>
        <div className="avatar-idle-breathe absolute inset-0">
        {/* Dynamic ambient occlusion shadow under jawline */}
        <div 
          className="absolute left-[37.5%] top-[66.25%] w-[25%] h-[6.25%] rounded-[50%] bg-black/15 blur-[5px] pointer-events-none transition-transform duration-300"
          style={{ transform: shadowScale }}
        />

        {beforeEyes.map((src, index) => (
          <SvgLayer key={`${src ?? "empty"}-${index}`} src={src} />
        ))}
        <div className="avatar-idle-blink absolute inset-0">
          <SvgLayer src={eyeLayer ?? null} />
        </div>
        {afterEyes.map((src, index) => (
          <SvgLayer key={`${src ?? "empty"}-after-${index}`} src={src} />
        ))}
        </div>
      </div>
      <AvatarFrameOverlay frameStyle={config.frameStyle} />
    </div>
  );
}

function AvatarFrameOverlay({ frameStyle = "frame_none" }: { frameStyle: Avatar2DConfig["frameStyle"] }) {
  if (frameStyle === "frame_none") return null;
  if (frameStyle === "frame_orbit") {
    return <div aria-hidden="true" className="pointer-events-none absolute inset-[7%] rounded-[42%] border border-white/25 shadow-[inset_0_0_24px_rgba(255,255,255,0.08)]" />;
  }
  if (frameStyle === "frame_brackets") {
    return <div aria-hidden="true" className="avatar-frame-brackets pointer-events-none absolute inset-[8%]" />;
  }
  return <div aria-hidden="true" className="avatar-frame-signal pointer-events-none absolute inset-[6%] rounded-[38%] border border-dashed border-white/25" />;
}
