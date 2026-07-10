"use client";

import type { AvatarBodyType, AvatarEmotion } from "@hips/types";

export const skinTones = [
  "#E8B092",
  "#C58A63",
  "#905C38",
  "#5C3826",
] as const;

export const defaultSkinTone = skinTones[0];

export function normalizeSkinTone(value?: string | null) {
  return skinTones.includes(value as (typeof skinTones)[number])
    ? (value as (typeof skinTones)[number])
    : defaultSkinTone;
}

export function normalizeAvatarEmotion(value?: string | null): AvatarEmotion {
  return value === "distressed" ? "distressed" : "neutral";
}

export function normalizeAvatarBodyType(value?: string | number | null): AvatarBodyType {
  return Number(value) === 1 ? 1 : 0;
}

export const paletteColors = {
  coastal: "#06b6d4",
  sunrise: "#f59e0b",
  forest: "#10b981",
} as const;

export const fallbackColors = [
  "#173B57",
  "#a78bfa",
  "#f43f5e",
  "#f59e0b",
  "#34d399",
  "#38bdf8",
] as const;
