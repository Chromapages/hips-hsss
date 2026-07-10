import type { Avatar2DConfig } from "@hips/types";
import type { CSSProperties } from "react";

export function hexToRgb(hex: string) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#FFFFFF";
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbToOklch(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const l = 0.4122214708 * rn + 0.5363325363 * gn + 0.0514459929 * bn;
  const m = 0.2119034982 * rn + 0.6806995477 * gn + 0.1073969541 * bn;
  const s = 0.0883024619 * rn + 0.2817188376 * gn + 0.6299787005 * bn;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  const H = Math.atan2(b_, a) * (180 / Math.PI);

  return { L, C, H: H < 0 ? H + 360 : H };
}

export function oklchToHex(L: number, C: number, H: number) {
  const hRad = H * (Math.PI / 180);
  const a = C * Math.cos(hRad);
  const b_ = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b_;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = Math.round(Math.min(255, Math.max(0, (4.0767416621 * l - 3.3077115913 * m + 0.2309699294 * s) * 255)));
  const g = Math.round(Math.min(255, Math.max(0, (-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) * 255)));
  const b = Math.round(Math.min(255, Math.max(0, (-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s) * 255)));

  const toHex = (num: number) => num.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function darken(hex: string, amount: number) {
  try {
    const { L, C, H } = rgbToOklch(hex);
    return oklchToHex(Math.max(0, L - amount), C, H);
  } catch {
    // Fallback to simple RGB scaling if conversion errors
    const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#C68642";
    const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `#${[r, g, b]
      .map((channel) => clamp(channel * (1 - amount)).toString(16).padStart(2, "0"))
      .join("")}`;
  }
}

export function getFitzpatrickCurves(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const rTable = [0, Math.max(0, rn * 0.18), rn * 0.5, Math.min(1, rn * 0.85 + 0.05), 1]
    .map((v) => v.toFixed(3))
    .join(" ");

  const gTable = [0, Math.max(0, gn * 0.2), gn * 0.5, Math.min(1, gn * 0.82 + 0.02), 1]
    .map((v) => v.toFixed(3))
    .join(" ");

  const bTable = [0.03, Math.min(1, bn * 0.32 + 0.03), bn * 0.48, Math.max(0, bn * 0.72 - 0.03), 0.95]
    .map((v) => v.toFixed(3))
    .join(" ");

  return { rTable, gTable, bTable };
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
