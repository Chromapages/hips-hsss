"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Loader2, TriangleAlert } from "lucide-react";
import type { AvatarBodyType, AvatarEmotion, AvatarGesture } from "@hips/types";
import { isWebGLAvailable } from "../WebGLFallback";
import {
  normalizeAvatarBodyType,
  normalizeAvatarEmotion,
  normalizeSkinTone,
} from "../avatar-options";

export const TALKING_HEAD_WOMAN_ASSET_URL =
  "/demo-assets/talkinghead/brunette.glb";
export const TALKING_HEAD_MAN_ASSET_URL =
  "/demo-assets/talkinghead/avatarsdk-male.glb";
export const TALKING_HEAD_DEMO_ASSET_URL = TALKING_HEAD_WOMAN_ASSET_URL;
const TALKING_HEAD_MODULE_URL =
  "https://esm.sh/@met4citizen/talkinghead@1.7.0?bundle";

type TalkingHeadInstance = {
  showAvatar(avatar: Record<string, unknown>, onprogress?: ((url: string, event: ProgressEvent) => void) | null): Promise<void>;
  start(): void;
  stop(): void;
  setMood(mood: string): void;
  setView(view: string, options?: Record<string, unknown> | null): void;
  setLighting(options?: Record<string, unknown> | null): void;
  lookAtCamera(durationMs: number): void;
  playGesture(name: string, duration?: number, mirror?: boolean, transitionMs?: number): void;
  stopGesture(transitionMs?: number): void;
  speakBreak(durationMs: number): Promise<void>;
  animMoods: Record<string, {
    baseline: Record<string, number>;
    speech: { deltaRate: number; deltaPitch: number; deltaVolume: number };
    anims: unknown[];
  }>;
  [key: string]: unknown;
};

type TalkingHeadModule = {
  TalkingHead: new (node: HTMLElement, options?: Record<string, unknown>) => TalkingHeadInstance;
};

type TalkingHeadAvatarProps = {
  isSpeaking?: boolean;
  voiceLevel?: number;
  emotion?: AvatarEmotion;
  gesture?: AvatarGesture;
  className?: string;
  assetUrl?: string;
  bodyType?: AvatarBodyType;
  compact?: boolean;
  skinTone?: string;
  hairColor?: string;
  eyeColor?: string;
  clothingColor?: string;
  backgroundColor?: string;
  hairStyle?: number;
  eyeStyle?: number;
  accessoryType?: number;
  onUnavailable?: (reason: string) => void;
};

type ThreeLikeMaterial = {
  name?: string;
  color?: { set?: (value: string | number) => void };
  map?: THREE.Texture | null;
  emissive?: { set?: (value: string | number) => void };
  transparent?: boolean;
  alphaTest?: number;
  roughness?: number;
  metalness?: number;
  needsUpdate?: boolean;
};

type ThreeLikeObject = {
  name?: string;
  type?: string;
  isMesh?: boolean;
  isObject3D?: boolean;
  visible?: boolean;
  material?: ThreeLikeMaterial | ThreeLikeMaterial[];
  morphTargetDictionary?: Record<string, number>;
  morphTargetInfluences?: number[];
  traverse?: (callback: (object: ThreeLikeObject) => void) => void;
};

type AvatarMaterialConfig = {
  bodyType: AvatarBodyType;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
  clothingColor: string;
  hairStyle: number;
  eyeStyle: number;
  accessoryType: number;
  emotion: AvatarEmotion;
};

const moodByEmotion: Record<AvatarEmotion, string> = {
  neutral: "hips-neutral",
  distressed: "hips-distressed",
};

function registerEmotionMoods(head: TalkingHeadInstance) {
  const neutralMood = head.animMoods.neutral;
  const speech = neutralMood?.speech ?? { deltaRate: 0, deltaPitch: 0, deltaVolume: 0 };
  const anims = neutralMood?.anims ?? [];
  const neutralBaseline = neutralMood?.baseline ?? {};

  head.animMoods["hips-neutral"] = {
    baseline: { ...neutralBaseline },
    speech,
    anims,
  };
  head.animMoods["hips-distressed"] = {
    baseline: {
      ...neutralBaseline,
      browInnerUp: 0.58,
      browDownLeft: 0.18,
      browDownRight: 0.18,
      mouthFrownLeft: 0.64,
      mouthFrownRight: 0.64,
      mouthShrugLower: 0.18,
      mouthShrugUpper: 0.12,
    },
    speech,
    anims,
  };
}

function gestureName(gesture?: AvatarGesture) {
  if (gesture === "raised-hand") return "handup";
  if (gesture === "nodding") return "thumbup";
  return null;
}

function isTalkingHeadTextureError(args: unknown[]) {
  return args.some((arg) =>
    typeof arg === "string" &&
    arg.includes("THREE.GLTFLoader: Couldn't load texture")
  );
}

function isHexColor(value: string | undefined, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value ?? "") ? value! : fallback;
}

function collectObject3DRoots(value: unknown, roots: Set<ThreeLikeObject>, seen = new WeakSet<object>(), depth = 0) {
  if (!value || typeof value !== "object" || seen.has(value) || depth > 5) return;
  seen.add(value);

  const candidate = value as ThreeLikeObject;
  if (typeof candidate.traverse === "function" && (candidate.isObject3D || candidate.type || candidate.name)) {
    roots.add(candidate);
  }

  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (nested && typeof nested === "object") {
      collectObject3DRoots(nested, roots, seen, depth + 1);
    }
  }
}

function setMaterialColor(material: ThreeLikeMaterial, color: string, options: { keepMap?: boolean; emissive?: boolean } = {}) {
  material.color?.set?.(color);
  if (!options.keepMap) material.map = null;
  if (options.emissive) material.emissive?.set?.(color);
  if (typeof material.roughness === "number") material.roughness = 0.72;
  if (typeof material.metalness === "number") material.metalness = 0.02;
  material.needsUpdate = true;
}

type TextureRecolorMode = "skin" | "head" | "eye" | "clothing";
type MaleTextureKey = "body" | "head" | "eyes" | "top" | "bottom";

const originalMaterialMaps = new WeakMap<object, THREE.Texture>();
const recoloredTextureCache = new Map<string, THREE.Texture>();
const maleTextureImages = new Map<MaleTextureKey, HTMLImageElement>();
const maleTextureTemplates = new Map<MaleTextureKey, THREE.Texture>();
let maleTextureLoadPromise: Promise<void> | null = null;

const maleTexturePaths: Record<MaleTextureKey, string> = {
  body: "/demo-assets/talkinghead/male-textures/body.jpg",
  head: "/demo-assets/talkinghead/male-textures/head.jpg",
  eyes: "/demo-assets/talkinghead/male-textures/eyes.jpg",
  top: "/demo-assets/talkinghead/male-textures/top.jpg",
  bottom: "/demo-assets/talkinghead/male-textures/bottom.jpg",
};

function preloadMaleTextureImages() {
  if (maleTextureLoadPromise) return maleTextureLoadPromise;

  maleTextureLoadPromise = Promise.all(
    Object.entries(maleTexturePaths).map(([key, src]) =>
      new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          maleTextureImages.set(key as MaleTextureKey, image);
          resolve();
        };
        image.onerror = () => reject(new Error(`Could not load ${src}`));
        image.src = src;
      }),
    ),
  ).then(() => undefined);

  return maleTextureLoadPromise;
}

function hexToRgb(color: string) {
  return {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };
}

function recolorChannel(channel: number, luminance: number, reference: number) {
  const shade = Math.max(0.34, Math.min(1.38, luminance / reference));
  return Math.max(0, Math.min(255, Math.round(channel * shade)));
}

function createRecoloredTexture(
  source: THREE.Texture,
  mode: TextureRecolorMode,
  primaryColor: string,
  secondaryColor = primaryColor,
  sourceKey?: MaleTextureKey,
) {
  const cacheKey = `${source.uuid}:${sourceKey ?? "embedded"}:${mode}:${primaryColor}:${secondaryColor}`;
  const cached = recoloredTextureCache.get(cacheKey);
  if (cached) return cached;

  const textureImage = (sourceKey ? maleTextureImages.get(sourceKey) : source.image) as {
    data?: CanvasImageSource & { width?: number; height?: number };
    width?: number;
    height?: number;
  } | CanvasImageSource;
  const image = (
    typeof textureImage === "object" &&
    textureImage !== null &&
    "data" in textureImage &&
    textureImage.data
      ? textureImage.data
      : textureImage
  ) as CanvasImageSource & { width?: number; height?: number };
  const width = Number(image?.width ?? 0);
  const height = Number(image?.height ?? 0);
  if (!image || width <= 0 || height <= 0) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  try {
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const sourcePixels = new Uint8ClampedArray(pixels);
    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);

    for (let index = 0; index < pixels.length; index += 4) {
      const r = pixels[index]!;
      const g = pixels[index + 1]!;
      const b = pixels[index + 2]!;
      const pixel = index / 4;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      let target = primary;
      let reference = 0.72;
      let shouldRecolor = true;

      if (mode === "head") {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        const normalizedX = x / width;
        const normalizedY = y / height;
        const isScalpHair =
          normalizedY < 0.43 &&
          (
            normalizedY < 0.14 ||
            normalizedX < 0.35 ||
            normalizedX > 0.65
          );
        const isLipDetail =
          normalizedY > 0.5 &&
          normalizedY < 0.55 &&
          normalizedX > 0.4 &&
          normalizedX < 0.6;
        const isBakedFacialHair =
          normalizedY > 0.43 &&
          normalizedY < 0.68 &&
          normalizedX > 0.2 &&
          normalizedX < 0.8 &&
          !isLipDetail &&
          (
            (
              normalizedY < 0.52 &&
              normalizedX > 0.34 &&
              normalizedX < 0.66
            ) ||
            normalizedY > 0.5 ||
            normalizedX < 0.38 ||
            normalizedX > 0.62
          );
        const isHair =
          isScalpHair &&
          luminance < 0.68 &&
          r >= b * 0.82 &&
          saturation > 0.08;
        target = isHair ? secondary : primary;
        reference = isHair ? 0.28 : 0.72;
        if (isBakedFacialHair) {
          luminance = 0.72;
        }
      } else if (mode === "eye") {
        const dx = x / width - 0.5;
        const dy = y / height - 0.47;
        const insideIris = Math.sqrt(dx * dx + dy * dy) < 0.125;
        const isPupil = luminance < 0.075;
        shouldRecolor = insideIris && !isPupil;
        reference = 0.34;
      } else if (mode === "clothing") {
        const normalizedX = x / width;
        const normalizedY = y / height;
        const isDemoLogo =
          sourceKey === "top" &&
          normalizedX > 0.42 &&
          normalizedX < 0.84 &&
          normalizedY > 0.42 &&
          normalizedY < 0.74;
        if (isDemoLogo) {
          const sampleX = Math.max(0, Math.round(x - width * 0.28));
          const sampleIndex = (y * width + sampleX) * 4;
          const sampleR = sourcePixels[sampleIndex]!;
          const sampleG = sourcePixels[sampleIndex + 1]!;
          const sampleB = sourcePixels[sampleIndex + 2]!;
          luminance = (0.2126 * sampleR + 0.7152 * sampleG + 0.0722 * sampleB) / 255;
        }
        reference = 0.5;
      }

      if (!shouldRecolor) continue;
      pixels[index] = target.r;
      pixels[index + 1] = target.g;
      pixels[index + 2] = target.b;
    }

    context.putImageData(imageData, 0, 0);
    const texture = source.clone();
    texture.image = canvas;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    recoloredTextureCache.set(cacheKey, texture);
    return texture;
  } catch {
    return null;
  }
}

function setMaleTexturedMaterial(
  material: ThreeLikeMaterial,
  mode: TextureRecolorMode,
  primaryColor: string,
  secondaryColor = primaryColor,
  sourceKey?: MaleTextureKey,
) {
  const materialKey = material as object;
  if (material.map && !originalMaterialMaps.has(materialKey)) {
    originalMaterialMaps.set(materialKey, material.map);
  }

  const originalMap = originalMaterialMaps.get(materialKey);
  let textureTemplate = originalMap;
  if (!textureTemplate && sourceKey) {
    textureTemplate = maleTextureTemplates.get(sourceKey);
    if (!textureTemplate) {
      textureTemplate = new THREE.Texture();
      textureTemplate.flipY = false;
      textureTemplate.colorSpace = THREE.SRGBColorSpace;
      maleTextureTemplates.set(sourceKey, textureTemplate);
    }
  }
  const recoloredMap = textureTemplate
    ? createRecoloredTexture(
      textureTemplate,
      mode,
      primaryColor,
      secondaryColor,
      sourceKey,
    )
    : null;

  material.color?.set?.("#ffffff");
  if (recoloredMap) {
    material.map = recoloredMap;
  } else {
    material.color?.set?.(primaryColor);
  }
  material.emissive?.set?.("#000000");
  if (typeof material.roughness === "number") {
    material.roughness = mode === "eye" ? 0.16 : 0.68;
  }
  if (typeof material.metalness === "number") material.metalness = 0;
  material.needsUpdate = true;
}

function setMorph(object: ThreeLikeObject, name: string, value: number) {
  const index = object.morphTargetDictionary?.[name];
  if (typeof index === "number" && object.morphTargetInfluences) {
    object.morphTargetInfluences[index] = value;
  }
}

function applyEyeMorphs(object: ThreeLikeObject, eyeStyle: number) {
  setMorph(object, "eyesClosed", 0);
  setMorph(object, "eyesLookUp", 0);
  setMorph(object, "eyesLookDown", 0);
  setMorph(object, "eyeBlinkLeft", 0);
  setMorph(object, "eyeBlinkRight", 0);
  setMorph(object, "eyeLookUpLeft", 0);
  setMorph(object, "eyeLookUpRight", 0);
  setMorph(object, "eyeLookDownLeft", 0);
  setMorph(object, "eyeLookDownRight", 0);
  setMorph(object, "eyeSquintLeft", 0);
  setMorph(object, "eyeSquintRight", 0);
  setMorph(object, "eyeWideLeft", 0);
  setMorph(object, "eyeWideRight", 0);

  if (eyeStyle === 0) {
    setMorph(object, "eyeWideLeft", 0.18);
    setMorph(object, "eyeWideRight", 0.18);
  } else if (eyeStyle === 1 || eyeStyle === 4) {
    setMorph(object, "eyeSquintLeft", 0.14);
    setMorph(object, "eyeSquintRight", 0.14);
  } else if (eyeStyle === 2) {
    setMorph(object, "eyeBlinkRight", 0.52);
  } else if (eyeStyle === 5) {
    setMorph(object, "eyeBlinkLeft", 0.2);
    setMorph(object, "eyeBlinkRight", 0.2);
  }
}

const expressionMorphs = [
  "mouthSmile",
  "mouthSmileLeft",
  "mouthSmileRight",
  "mouthFrownLeft",
  "mouthFrownRight",
  "mouthPucker",
  "mouthPressLeft",
  "mouthPressRight",
  "mouthShrugLower",
  "mouthShrugUpper",
  "browDownLeft",
  "browDownRight",
  "browInnerUp",
  "browOuterUpLeft",
  "browOuterUpRight",
  "cheekSquintLeft",
  "cheekSquintRight",
  "eyeSquintLeft",
  "eyeSquintRight",
] as const;

const speechMorphs = [
  "jawOpen",
  "mouthOpen",
  "mouthClose",
  "mouthFunnel",
  "mouthPucker",
  "mouthStretchLeft",
  "mouthStretchRight",
  "viseme_PP",
  "viseme_FF",
  "viseme_aa",
  "viseme_E",
  "viseme_I",
  "viseme_O",
  "viseme_U",
] as const;

const speechTargetCache = new WeakMap<object, ThreeLikeObject[]>();

function getSpeechTargets(head: TalkingHeadInstance) {
  const cached = speechTargetCache.get(head);
  if (cached) return cached;

  const roots = new Set<ThreeLikeObject>();
  const targets = new Set<ThreeLikeObject>();
  collectObject3DRoots(head, roots);
  roots.forEach((root) => {
    root.traverse?.((object) => {
      if (object.morphTargetDictionary && object.morphTargetInfluences) {
        targets.add(object);
      }
    });
  });

  const result = [...targets];
  speechTargetCache.set(head, result);
  return result;
}

function applyEmotionMorphs(object: ThreeLikeObject, emotion: AvatarEmotion) {
  expressionMorphs.forEach((name) => setMorph(object, name, 0));

  if (emotion === "distressed") {
    setMorph(object, "browInnerUp", 0.58);
    setMorph(object, "browDownLeft", 0.18);
    setMorph(object, "browDownRight", 0.18);
    setMorph(object, "mouthFrownLeft", 0.62);
    setMorph(object, "mouthFrownRight", 0.62);
    setMorph(object, "mouthShrugLower", 0.18);
    setMorph(object, "mouthShrugUpper", 0.12);
  }
}

function applySpeechMorphs(head: TalkingHeadInstance | null, amount: number, phase: number) {
  if (!head) return;

  const shape = Math.floor(phase * 6) % 6;
  const openness = Math.max(0, Math.min(1, amount));

  getSpeechTargets(head).forEach((object) => {
    speechMorphs.forEach((name) => setMorph(object, name, 0));
    if (openness <= 0.01) return;

    setMorph(object, "jawOpen", openness * (shape === 3 ? 0.18 : 0.72));
    setMorph(object, "mouthOpen", openness * (shape === 3 ? 0.08 : 0.5));

    if (shape === 0) {
      setMorph(object, "viseme_aa", openness * 0.9);
    } else if (shape === 1) {
      setMorph(object, "viseme_E", openness * 0.78);
      setMorph(object, "mouthStretchLeft", openness * 0.28);
      setMorph(object, "mouthStretchRight", openness * 0.28);
    } else if (shape === 2) {
      setMorph(object, "viseme_O", openness * 0.86);
      setMorph(object, "mouthFunnel", openness * 0.45);
    } else if (shape === 3) {
      setMorph(object, "viseme_PP", openness * 0.9);
      setMorph(object, "mouthClose", openness * 0.65);
    } else if (shape === 4) {
      setMorph(object, "viseme_I", openness * 0.76);
      setMorph(object, "viseme_FF", openness * 0.22);
    } else {
      setMorph(object, "viseme_U", openness * 0.82);
      setMorph(object, "mouthPucker", openness * 0.34);
    }
  });
}

const eyeTextureCache = new Map<string, THREE.CanvasTexture>();

function getNaturalEyeTexture(eyeColor: string) {
  const cached = eyeTextureCache.get(eyeColor);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const centerX = 128;
  const centerY = 128;
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scleraGradient = ctx.createRadialGradient(centerX - 20, centerY - 24, 12, centerX, centerY, 130);
  scleraGradient.addColorStop(0, "#ffffff");
  scleraGradient.addColorStop(0.75, "#f8fafc");
  scleraGradient.addColorStop(1, "#dbe2ea");
  ctx.fillStyle = scleraGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 116, 86, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 47, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 48, 0, Math.PI * 2);
  ctx.stroke();

  const irisGradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 4, centerX, centerY, 48);
  irisGradient.addColorStop(0, "rgba(255,255,255,0.25)");
  irisGradient.addColorStop(0.55, "rgba(0,0,0,0)");
  irisGradient.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = irisGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 47, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 19, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.beginPath();
  ctx.arc(centerX - 15, centerY - 17, 7, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  eyeTextureCache.set(eyeColor, texture);
  return texture;
}

function setEyeMaterial(material: ThreeLikeMaterial, eyeColor: string) {
  material.color?.set?.("#ffffff");
  material.map = getNaturalEyeTexture(eyeColor);
  material.emissive?.set?.("#000000");
  material.transparent = false;
  material.alphaTest = 0;
  if (typeof material.roughness === "number") material.roughness = 0.18;
  if (typeof material.metalness === "number") material.metalness = 0;
  material.needsUpdate = true;
}

function classifyAvatarPart(objectName: string, materialName: string) {
  const name = `${objectName} ${materialName}`.toLowerCase();
  if (name.includes("footwear") || name.includes("shoe")) return "hidden";
  if (name.includes("glasses")) return "accessory";
  if (name.includes("hair")) return "hair";
  if (name.includes("eyeleft") || name.includes("eyeright") || name.includes("eyeball") || /\beye\b/.test(name)) return "eye";
  if (name.includes("teeth") || name.includes("tongue")) return "mouth";
  if (name.includes("outfit") || name.includes("shirt") || name.includes("top") || name.includes("bottom")) return "clothing";
  if (name.includes("head") || name.includes("body") || name.includes("skin") || name.includes("hand") || name.includes("arm")) return "skin";
  return "unknown";
}

function applyAvatarMaterials(head: TalkingHeadInstance | null, config: AvatarMaterialConfig) {
  if (!head) return;

  const roots = new Set<ThreeLikeObject>();
  collectObject3DRoots(head, roots);

  roots.forEach((root) => {
    root.traverse?.((object) => {
      applyEyeMorphs(object, config.eyeStyle);
      applyEmotionMorphs(object, config.emotion);

      const materialList = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : [];

      const objectName = object.name ?? "";
      for (const material of materialList) {
        const part = classifyAvatarPart(objectName, material.name ?? "");
        const isMaleModel = config.bodyType === 0;

        if (isMaleModel) {
          (material as any).flatShading = true;
          if ((material as any).normalMap) (material as any).normalMap = null;
          if ((material as any).bumpMap) (material as any).bumpMap = null;
        } else {
          (material as any).flatShading = false;
        }
        material.needsUpdate = true;

        if (part === "hidden") {
          object.visible = false;
          continue;
        }

        if (part === "accessory") {
          object.visible = config.accessoryType !== 0;
          if (object.visible) setMaterialColor(material, "#f8fafc", { keepMap: true });
          continue;
        }

        if (part === "hair") {
          object.visible = config.hairStyle !== 15;
          if (object.visible) setMaterialColor(material, config.hairColor);
          continue;
        }

        if (part === "eye") {
          object.visible = true;
          if (isMaleModel) {
            setMaleTexturedMaterial(material, "eye", config.eyeColor, config.eyeColor, "eyes");
          } else {
            setEyeMaterial(material, config.eyeColor);
          }
          continue;
        }

        if (part === "clothing") {
          setMaterialColor(material, config.clothingColor);
          continue;
        }

        if (part === "skin") {
          if (isMaleModel) {
            const mode = objectName.toLowerCase().includes("head") ? "head" : "skin";
            const skinTexture = mode === "head" ? "head" : "body";
            setMaleTexturedMaterial(
              material,
              mode,
              config.skinTone,
              config.hairStyle === 15 ? config.skinTone : config.hairColor,
              skinTexture,
            );
          } else {
            setMaterialColor(material, config.skinTone);
          }
        }
      }
    });
  });
}

export default function TalkingHeadAvatar({
  isSpeaking = false,
  voiceLevel = 0,
  emotion = "neutral",
  gesture = "idle",
  className = "h-full w-full",
  assetUrl,
  bodyType = 1,
  compact = false,
  skinTone = "#E8B092",
  hairColor = "#1c1917",
  eyeColor = "#1c1917",
  clothingColor = "#173B57",
  backgroundColor = "transparent",
  hairStyle = 0,
  eyeStyle = 0,
  accessoryType = 0,
  onUnavailable,
}: TalkingHeadAvatarProps) {
  const normalizedBodyType = normalizeAvatarBodyType(bodyType);
  const avatarModel = normalizedBodyType === 0
    ? {
        url: assetUrl ?? TALKING_HEAD_MAN_ASSET_URL,
        body: "M",
        baseline: {
          headRotateX: -0.04,
          eyeBlinkLeft: 0.05,
          eyeBlinkRight: 0.05,
        },
        retarget: {
          Neck: { z: -0.01, rx: -0.15 },
          Neck1: { z: -0.01, rx: -0.15 },
          Neck2: { z: -0.01, rx: -0.15 },
          LeftShoulder: { rz: -0.3 },
          RightShoulder: { rz: 0.3 },
          scaleToEyesLevel: 1,
          origin: { y: -0.1 },
        },
      }
    : {
        url: assetUrl ?? TALKING_HEAD_WOMAN_ASSET_URL,
        body: "F",
        baseline: undefined,
        retarget: undefined,
      };
  const mountRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<TalkingHeadInstance | null>(null);
  const lastGestureRef = useRef<string | null>(null);
  const speechFrameRef = useRef<number | null>(null);
  const voiceLevelRef = useRef(voiceLevel);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function initialize() {
      if (!mountRef.current) return;
      if (!isWebGLAvailable()) {
        const reason = "WebGL is unavailable";
        setError(reason);
        setLoading(false);
        onUnavailable?.(reason);
        return;
      }

      try {
        const importDynamic = new Function("url", "return import(url)");
        const { TalkingHead } = (await importDynamic(
          TALKING_HEAD_MODULE_URL
        )) as TalkingHeadModule;
        if (cancelled || !mountRef.current) return;

        const head = new TalkingHead(mountRef.current, {
          // V1 does not use true lip-sync. Loading language modules through a CDN
          // makes TalkingHead chase nested dynamic imports that can fail in dev/prod.
          lipsyncModules: [],
          avatarMood: "neutral",
          avatarMute: true,
          modelFPS: compact ? 24 : 30,
          modelPixelRatio: compact ? 0.85 : 1,
          cameraView: compact ? "head" : "upper",
          cameraRotateEnable: false,
          cameraPanEnable: false,
          cameraZoomEnable: false,
          cameraDistance: compact ? -0.25 : -0.12,
          cameraY: compact ? 0.03 : 0.06,
          lightAmbientColor: 0xffffff,
          lightAmbientIntensity: normalizedBodyType === 0 ? 0.72 : 1.1,
          lightDirectColor: 0xfff1dc,
          lightDirectIntensity: normalizedBodyType === 0 ? 3.2 : 8,
          lightDirectPhi: 0.75,
          lightDirectTheta: 2.1,
          lightSpotColor: 0x7dd3fc,
          lightSpotIntensity: normalizedBodyType === 0 ? 0.35 : 0.7,
          lightSpotPhi: 0.5,
          lightSpotTheta: 3.8,
          avatarSpeakingEyeContact: 0.65,
          avatarSpeakingHeadMove: 0.65,
          avatarIdleEyeContact: 0.25,
          avatarIdleHeadMove: 0.35,
        });

        headRef.current = head;
        registerEmotionMoods(head);
        const originalConsoleError = console.error;
        console.error = (...args: unknown[]) => {
          if (isTalkingHeadTextureError(args)) {
            return;
          }
          originalConsoleError(...args);
        };
        try {
          await head.showAvatar({
            url: avatarModel.url,
            body: avatarModel.body,
            avatarMood: moodByEmotion[emotion],
            baseline: avatarModel.baseline,
            retarget: avatarModel.retarget,
          });
          if (normalizedBodyType === 0) {
            await preloadMaleTextureImages();
          }
        } finally {
          console.error = originalConsoleError;
        }

        if (cancelled) {
          head.stop();
          return;
        }

        head.setLighting({
          lightAmbientIntensity: normalizedBodyType === 0 ? 0.72 : 1.1,
          lightDirectIntensity: normalizedBodyType === 0 ? 3.2 : 8,
          lightSpotIntensity: normalizedBodyType === 0 ? 0.35 : 0.7,
        });
        head.setView(compact ? "head" : "upper", {
          cameraDistance: compact ? -0.25 : -0.12,
          cameraY: compact ? 0.03 : 0.06,
        });
        head.setMood(moodByEmotion[normalizeAvatarEmotion(emotion)]);
        applyAvatarMaterials(head, {
          bodyType: normalizedBodyType,
          skinTone: normalizeSkinTone(skinTone),
          hairColor: isHexColor(hairColor, "#1c1917"),
          eyeColor: isHexColor(eyeColor, "#1c1917"),
          clothingColor: isHexColor(clothingColor, "#173B57"),
          hairStyle,
          eyeStyle,
          accessoryType,
          emotion: normalizeAvatarEmotion(emotion),
        });
        head.start();
        setLoading(false);
      } catch (err) {
        const reason = err instanceof Error ? err.message : "TalkingHead failed to load";
        console.warn("[TalkingHeadAvatar] 3D avatar unavailable:", err);
        setError(reason);
        setLoading(false);
        onUnavailable?.(reason);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      try {
        headRef.current?.stop();
      } catch {}
      if (speechFrameRef.current !== null) {
        cancelAnimationFrame(speechFrameRef.current);
        speechFrameRef.current = null;
      }
      headRef.current = null;
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [avatarModel.body, avatarModel.url, compact]);

  useEffect(() => {
    applyAvatarMaterials(headRef.current, {
      bodyType: normalizedBodyType,
      skinTone: normalizeSkinTone(skinTone),
      hairColor: isHexColor(hairColor, "#1c1917"),
      eyeColor: isHexColor(eyeColor, "#1c1917"),
      clothingColor: isHexColor(clothingColor, "#173B57"),
      hairStyle,
      eyeStyle,
      accessoryType,
      emotion: normalizeAvatarEmotion(emotion),
    });
  }, [accessoryType, clothingColor, emotion, eyeColor, eyeStyle, hairColor, hairStyle, skinTone]);

  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    try {
      const activeEmotion = normalizeAvatarEmotion(emotion);
      head.setMood(moodByEmotion[activeEmotion]);
      applyAvatarMaterials(head, {
        bodyType: normalizedBodyType,
        skinTone: normalizeSkinTone(skinTone),
        hairColor: isHexColor(hairColor, "#1c1917"),
        eyeColor: isHexColor(eyeColor, "#1c1917"),
        clothingColor: isHexColor(clothingColor, "#173B57"),
        hairStyle,
        eyeStyle,
        accessoryType,
        emotion: activeEmotion,
      });
      if (isSpeaking) head.lookAtCamera(700);
    } catch (err) {
      console.warn("[TalkingHeadAvatar] Failed to update speaking state:", err);
    }
  }, [accessoryType, clothingColor, emotion, eyeColor, eyeStyle, hairColor, hairStyle, isSpeaking, skinTone]);

  useEffect(() => {
    voiceLevelRef.current = voiceLevel;
  }, [voiceLevel]);

  useEffect(() => {
    if (speechFrameRef.current !== null) {
      cancelAnimationFrame(speechFrameRef.current);
      speechFrameRef.current = null;
    }

    if (!isSpeaking) {
      applySpeechMorphs(headRef.current, 0, 0);
      return;
    }

    const startedAt = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const detectedLevel = Math.max(0, Math.min(1, voiceLevelRef.current * 3.2));
      const fallbackLevel = 0.42 + Math.sin(elapsed / 105) * 0.16 + Math.sin(elapsed / 47) * 0.08;
      const amount = Math.max(0.12, detectedLevel || fallbackLevel);
      applySpeechMorphs(headRef.current, amount, elapsed / 720);
      speechFrameRef.current = requestAnimationFrame(animate);
    };

    speechFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (speechFrameRef.current !== null) {
        cancelAnimationFrame(speechFrameRef.current);
        speechFrameRef.current = null;
      }
      applySpeechMorphs(headRef.current, 0, 0);
    };
  }, [isSpeaking]);

  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    const nextGesture = gestureName(gesture);
    if (nextGesture === lastGestureRef.current) return;

    try {
      if (lastGestureRef.current) head.stopGesture(350);
      if (nextGesture) head.playGesture(nextGesture, 2.2, false, 450);
      lastGestureRef.current = nextGesture;
    } catch (err) {
      console.warn("[TalkingHeadAvatar] Failed to update gesture:", err);
    }
  }, [gesture]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: backgroundColor === "transparent" ? "transparent" : isHexColor(backgroundColor, "#eef0ff") }}
    >
      <div ref={mountRef} className="absolute inset-0" aria-label="Experimental 3D avatar preview" />
      <div className="absolute left-2 top-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-amber-100">
        Experimental 3D
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10 text-slate-700">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/85 p-4 text-center text-white/70">
          <TriangleAlert className="h-5 w-5 text-amber-300" />
          <p className="text-[10px] font-semibold leading-relaxed">
            3D preview unavailable. Check WebGL support, the model asset, or network access.
          </p>
        </div>
      )}
    </div>
  );
}
