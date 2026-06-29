"use client";

import type { Avatar2DConfig } from "@hips/types";
import { layerRenderOrder } from "./avatar-asset-registry";
import { resolveAvatarSvgVars, getFitzpatrickCurves } from "./avatar2d-utils";

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

function getLayerFilterAndOpacity(src: string) {
  let filter = "";
  let opacity = 1.0;

  if (src.includes("/face/") || src.includes("/body/")) {
    filter = "url(#premium-fitzpatrick-recolor) url(#premium-inner-glow)";
  } else if (src.includes("/hair-back/")) {
    filter = "url(#premium-drop-shadow)";
    opacity = 0.85;
  } else if (
    src.includes("/hair-front/") ||
    src.includes("/accessories/") ||
    src.includes("/clothing/")
  ) {
    filter = "url(#premium-drop-shadow)";
  } else if (src.includes("/brows/") || src.includes("/nose/")) {
    filter = "url(#premium-feature-shadow)";
  }

  return { filter, opacity };
}

async function compileAvatarSvg(config: Avatar2DConfig, size: number): Promise<string> {
  const { rTable, gTable, bTable } = getFitzpatrickCurves(config.skinTone);

  // Gather all layers
  const layers = layerRenderOrder(config);
  const bgLayer = layers[0];
  const characterLayers = layers.slice(1);

  // Build background SVG layer string
  let bgLayerSvg = "";
  if (bgLayer) {
    try {
      const response = await fetch(bgLayer);
      if (response.ok) {
        const rawSvg = await response.text();
        bgLayerSvg = resolveAvatarSvgVars(rawSvg, config);
      }
    } catch (e) {
      console.warn("Could not fetch background layer for export:", e);
    }
  }

  // Build character SVG layers string
  let characterLayersSvgs = "";
  for (const src of characterLayers) {
    if (!src) continue;
    try {
      const response = await fetch(src);
      if (!response.ok) continue;
      const rawSvg = await response.text();
      const resolved = resolveAvatarSvgVars(rawSvg, config);
      const { filter, opacity } = getLayerFilterAndOpacity(src);
      const filterAttr = filter ? `filter="${filter}"` : "";
      const opacityAttr = opacity < 1.0 ? `opacity="${opacity}"` : "";
      characterLayersSvgs += `<g ${filterAttr} ${opacityAttr}>${resolved}</g>`;
    } catch (e) {
      console.warn(`Could not fetch layer ${src} for export:`, e);
    }
  }

  // Calculate jaw shadow scale transformation
  let shadowScale = "scale(1.0)";
  if (config.faceShape === "face_round_01") shadowScale = "scale(1.1, 0.95)";
  else if (config.faceShape === "face_square_01") shadowScale = "scale(1.15, 0.9)";
  else if (config.faceShape === "face_heart_01") shadowScale = "scale(0.95, 1.05)";

  const jawShadowSvg = `
    <ellipse
      cx="200"
      cy="277.5"
      rx="50"
      ry="12.5"
      fill="#000000"
      opacity="0.15"
      filter="url(#jaw-shadow-blur)"
      transform="${shadowScale}"
      transform-origin="200 277.5"
    />
  `;

  // Build the complete combined SVG document
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${size}" height="${size}">
  <defs>
    <filter id="premium-fitzpatrick-recolor" x="-10%" y="-10%" width="120%" height="120%">
      <feComponentTransfer>
        <feFuncR type="table" tableValues="${rTable}" />
        <feFuncG type="table" tableValues="${gTable}" />
        <feFuncB type="table" tableValues="${bTable}" />
      </feComponentTransfer>
    </filter>

    <filter id="premium-noise-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" result="coloredNoise" />
      <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="clippedNoise" />
      <feBlend mode="multiply" in="SourceGraphic" in2="clippedNoise" />
    </filter>

    <filter id="premium-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
      <feOffset dx="-3" dy="-3" />
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
      <feFlood floodColor="rgba(255, 255, 255, 0.35)" />
      <feComposite in2="shadowDiff" operator="in" result="highlight" />
      
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur2" />
      <feOffset dx="3" dy="3" />
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff2" />
      <feFlood floodColor="rgba(0, 0, 0, 0.12)" />
      <feComposite in2="shadowDiff2" operator="in" result="shadow" />
      
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="highlight" />
        <feMergeNode in="shadow" />
      </feMerge>
    </filter>

    <filter id="premium-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.1" />
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.06" />
    </filter>
    
    <filter id="premium-feature-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.08" />
    </filter>

    <filter id="jaw-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>

  <style>
    svg [id*="highlight"],
    svg [class*="highlight"],
    svg [id*="Highlight"],
    svg path[opacity="0.12"] {
      fill: #ffffff !important;
      opacity: 0.20 !important;
      mix-blend-mode: screen !important;
    }
  </style>

  <g filter="url(#premium-noise-grain)">
    <g>
      ${bgLayerSvg}
    </g>
    <g>
      ${jawShadowSvg}
      ${characterLayersSvgs}
    </g>
  </g>
</svg>
`;
}

export async function exportAvatarPNG(config: Avatar2DConfig, size = 2048) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  const fullSvg = await compileAvatarSvg(config, size);
  const image = await loadImageFromSvg(fullSvg);
  context.drawImage(image, 0, 0, size, size);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Avatar PNG export failed"));
    }, "image/png", 0.95);
  });
}

export async function exportAvatarDataUrl(config: Avatar2DConfig, size = 2048) {
  const blob = await exportAvatarPNG(config, size);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Avatar PNG read failed"));
    reader.readAsDataURL(blob);
  });
}
