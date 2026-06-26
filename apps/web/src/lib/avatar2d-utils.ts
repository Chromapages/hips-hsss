import type { Avatar2DConfig } from "@hips/types";
import type { CSSProperties } from "react";

export function darken(hex: string, amount: number) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#C68642";
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `#${[r, g, b]
    .map((channel) => clamp(channel * (1 - amount)).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function avatar2DCssVars(config: Avatar2DConfig) {
  return {
    "--avatar-skin": config.skinTone,
    "--avatar-skin-shadow": darken(config.skinTone, 0.15),
    "--avatar-hair": config.hairColor,
    "--avatar-eye-iris": config.eyeColor,
    "--avatar-clothing": config.clothingColor,
    "--avatar-clothing-2": darken(config.clothingColor, 0.2),
  } as CSSProperties;
}

export function resolveAvatarSvgVars(svgText: string, config: Avatar2DConfig) {
  return svgText
    .replaceAll("var(--avatar-skin-shadow)", darken(config.skinTone, 0.15))
    .replaceAll("var(--avatar-skin)", config.skinTone)
    .replaceAll("var(--avatar-hair)", config.hairColor)
    .replaceAll("var(--avatar-eye-iris)", config.eyeColor)
    .replaceAll("var(--avatar-clothing-2)", darken(config.clothingColor, 0.2))
    .replaceAll("var(--avatar-clothing)", config.clothingColor);
}
