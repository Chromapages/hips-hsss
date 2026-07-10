import { z } from "zod";
import type { Avatar2DConfig } from "@hips/types";
import { DEFAULT_AVATAR_2D } from "@hips/types";

export function clampHexColor(color: unknown, fallback: string): string {
  if (typeof color !== "string") return fallback;
  const clean = color.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(clean)) {
    return clean;
  }
  if (/^#[0-9a-f]{3}$/.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  if (/^[0-9a-f]{6}$/.test(clean)) {
    return `#${clean}`;
  }
  if (/^[0-9a-f]{3}$/.test(clean)) {
    return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  }
  return fallback;
}

export const avatar2DSchema = z.object({
  version: z.literal(1).catch(1),
  faceShape: z.enum(["face_oval_01", "face_round_01", "face_square_01", "face_heart_01"]).catch("face_oval_01"),
  skinTone: z.preprocess((val) => clampHexColor(val, "#D28A5C"), z.string()),
  hairStyle: z.enum([
    "hair_short_01",
    "hair_long_01",
    "hair_bob_01",
    "hair_bun_01",
    "hair_curly_tight_01",
    "hair_locs_long_01",
    "hair_shaved_01",
    "cover_hijab_01",
    "hair_pixie_01",
    "hair_waves_01",
    "hair_spacebuns_01"
  ]).catch("hair_short_01"),
  hairColor: z.preprocess((val) => clampHexColor(val, "#2B211D"), z.string()),
  eyeShape: z.enum(["eyes_almond_01", "eyes_sleepy_01"]).catch("eyes_almond_01"),
  eyeColor: z.preprocess((val) => clampHexColor(val, "#1F1B18"), z.string()),
  eyebrow: z.enum(["brow_arch_01", "brow_soft_01", "brow_straight_01"]).catch("brow_arch_01"),
  nose: z.enum(["nose_button_01"]).catch("nose_button_01"),
  mouth: z.enum(["mouth_neutral_01", "mouth_smile_01", "mouth_thin_01", "mouth_open_01"]).catch("mouth_neutral_01"),
  facialHair: z.enum(["beard_stubble_01", "beard_goatee_01", "beard_full_01"]).nullable().catch(null),
  accessory: z.enum(["acc_glasses_round_01", "acc_headband_01"]).nullable().catch(null),
  clothingStyle: z.enum(["top_tshirt_01", "top_hoodie_01", "top_sweater_01", "top_blazer_01"]).catch("top_tshirt_01"),
  clothingColor: z.preprocess((val) => clampHexColor(val, "#252D37"), z.string()),
  background: z.enum([
    "bg_gradient_cool",
    "bg_gradient_warm",
    "bg_gradient_mint",
    "bg_gradient_rose",
    "bg_solid_cloud",
    "bg_solid_charcoal"
  ]).catch("bg_gradient_cool"),
  expression: z.enum(["neutral", "happy", "thinking", "surprised", "concerned"]).catch("neutral"),
});

export function safeParseAvatar2DConfig(raw: unknown): Avatar2DConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_AVATAR_2D;
  }
  const result = avatar2DSchema.safeParse(raw);
  if (result.success) {
    return result.data as Avatar2DConfig;
  }
  return DEFAULT_AVATAR_2D;
}

export function parseAvatar2DConfigString(raw: string | null | undefined): Avatar2DConfig {
  if (!raw) return DEFAULT_AVATAR_2D;
  try {
    const parsed = JSON.parse(raw);
    return safeParseAvatar2DConfig(parsed);
  } catch {
    return DEFAULT_AVATAR_2D;
  }
}

export function sanitizeLiveKitAttributes(attrs: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined) {
      continue;
    }
    const str = typeof value === "string" ? value : JSON.stringify(value);
    result[key] = str.slice(0, 1000);
  }
  return result;
}

export function migrateLegacySessionStorage(): Avatar2DConfig | null {
  if (typeof window === "undefined") return null;

  // If we already have the new avatar2d config in sessionStorage, no need to migrate legacy
  if (sessionStorage.getItem("hips-avatar-2d")) {
    return null;
  }

  const bodyTypeRaw = sessionStorage.getItem("hips-avatar-body");
  const skinToneRaw = sessionStorage.getItem("hips-avatar-skin-tone");
  const hairStyleRaw = sessionStorage.getItem("hips-avatar-hair");
  const hairColorRaw = sessionStorage.getItem("hips-avatar-hair-color");
  const eyeColorRaw = sessionStorage.getItem("hips-avatar-eye-color");
  const faceShapeRaw = sessionStorage.getItem("hips-avatar-face-shape");
  const noseRaw = sessionStorage.getItem("hips-avatar-nose");
  const eyebrowRaw = sessionStorage.getItem("hips-avatar-eyebrow");
  const mouthRaw = sessionStorage.getItem("hips-avatar-mouth");
  const clothingRaw = sessionStorage.getItem("hips-avatar-clothing");
  const clothingColorRaw = sessionStorage.getItem("hips-avatar-clothing-color");
  const accessoryRaw = sessionStorage.getItem("hips-avatar-accessory");

  // If none of these exist, there is nothing to migrate
  if (!bodyTypeRaw && !skinToneRaw && !hairStyleRaw) {
    return null;
  }

  // Map legacy values to Avatar2DConfig
  const migrated: Partial<Avatar2DConfig> = {
    version: 1,
  };

  const body = bodyTypeRaw === "0" ? 0 : 1;

  if (skinToneRaw) migrated.skinTone = skinToneRaw;

  if (hairStyleRaw) {
    const idx = parseInt(hairStyleRaw, 10);
    const manHairs = ["hair_short_01", "hair_curly_tight_01", "hair_locs_long_01", "hair_shaved_01"];
    const womanHairs = ["hair_long_01", "hair_bob_01", "hair_bun_01", "hair_curly_tight_01", "hair_locs_long_01", "cover_hijab_01", "hair_pixie_01", "hair_waves_01", "hair_spacebuns_01"];
    migrated.hairStyle = body === 0
      ? ((manHairs[idx] || "hair_short_01") as any)
      : ((womanHairs[idx] || "hair_long_01") as any);
  }

  if (hairColorRaw) migrated.hairColor = hairColorRaw;
  if (eyeColorRaw) migrated.eyeColor = eyeColorRaw;

  if (faceShapeRaw) {
    const idx = parseInt(faceShapeRaw, 10);
    const faces = ["face_oval_01", "face_round_01", "face_square_01", "face_heart_01"];
    migrated.faceShape = (faces[idx] || "face_oval_01") as any;
  }

  migrated.nose = "nose_button_01"; // default nose

  if (mouthRaw) {
    const idx = parseInt(mouthRaw, 10);
    const mouths = ["mouth_neutral_01", "mouth_smile_01", "mouth_thin_01", "mouth_open_01"];
    migrated.mouth = (mouths[idx] || "mouth_neutral_01") as any;
  }

  if (eyebrowRaw) {
    const idx = parseInt(eyebrowRaw, 10);
    const brows = ["brow_arch_01", "brow_soft_01", "brow_straight_01"];
    migrated.eyebrow = (brows[idx] || "brow_arch_01") as any;
  }

  if (clothingRaw) {
    const idx = parseInt(clothingRaw, 10);
    const clothing = ["top_tshirt_01", "top_hoodie_01", "top_sweater_01", "top_blazer_01"];
    migrated.clothingStyle = (clothing[idx] || "top_tshirt_01") as any;
  }

  if (clothingColorRaw) migrated.clothingColor = clothingColorRaw;

  if (accessoryRaw) {
    const idx = parseInt(accessoryRaw, 10);
    const accs = [null, "acc_glasses_round_01", "acc_headband_01"];
    migrated.accessory = (accs[idx] || null) as any;
  }

  const finalConfig = {
    ...DEFAULT_AVATAR_2D,
    ...migrated,
  } as Avatar2DConfig;

  // Save it back to sessionStorage
  sessionStorage.setItem("hips-avatar-2d", JSON.stringify(finalConfig));

  // Clean up legacy keys from sessionStorage to prevent redundant migration
  const legacyKeys = [
    "hips-avatar-body",
    "hips-avatar-skin-tone",
    "hips-avatar-hair",
    "hips-avatar-hair-color",
    "hips-avatar-eye-color",
    "hips-avatar-face-shape",
    "hips-avatar-nose",
    "hips-avatar-eyebrow",
    "hips-avatar-mouth",
    "hips-avatar-clothing",
    "hips-avatar-clothing-color",
    "hips-avatar-accessory",
    "hips-avatar-style",
    "hips-avatar-color",
  ];
  for (const key of legacyKeys) {
    sessionStorage.removeItem(key);
  }

  return finalConfig;
}
