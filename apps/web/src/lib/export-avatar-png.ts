"use client";

import type { Avatar2DConfig } from "@hips/types";
import { layerRenderOrder } from "./avatar-asset-registry";
import { resolveAvatarSvgVars } from "./avatar2d-utils";

function loadImageFromSvg(svgText: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Avatar SVG layer could not be drawn"));
    };
    image.src = url;
  });
}

export async function exportAvatarPNG(config: Avatar2DConfig, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  for (const src of layerRenderOrder(config)) {
    if (!src) continue;
    const response = await fetch(src);
    if (!response.ok) continue;
    const rawSvg = await response.text();
    const resolvedSvg = resolveAvatarSvgVars(rawSvg, config);
    const image = await loadImageFromSvg(resolvedSvg);
    context.drawImage(image, 0, 0, size, size);
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Avatar PNG export failed"));
    }, "image/png", 0.95);
  });
}

export async function exportAvatarDataUrl(config: Avatar2DConfig, size = 512) {
  const blob = await exportAvatarPNG(config, size);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Avatar PNG read failed"));
    reader.readAsDataURL(blob);
  });
}
