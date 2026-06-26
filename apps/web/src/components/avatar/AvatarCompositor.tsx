"use client";

import type { Avatar2DConfig } from "@hips/types";
import { layerRenderOrder } from "@/lib/avatar-asset-registry";
import { avatar2DCssVars } from "@/lib/avatar2d-utils";
import { SvgLayer } from "./SvgLayer";

type AvatarCompositorProps = {
  config: Avatar2DConfig;
  className?: string;
};

export function AvatarCompositor({ config, className }: AvatarCompositorProps) {
  const layers = layerRenderOrder(config);

  return (
    <div
      aria-label="Avatar preview"
      className={`relative aspect-square w-full overflow-hidden rounded-2xl ${className ?? ""}`}
      role="img"
      style={avatar2DCssVars(config)}
    >
      {layers.map((src, index) => (
        <SvgLayer key={`${src ?? "empty"}-${index}`} src={src} />
      ))}
    </div>
  );
}
