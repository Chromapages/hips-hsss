import type {
  Avatar2DConfig,
  Avatar2DExpression,
  AvatarEyeShape,
  AvatarEyebrow,
  AvatarMouth,
} from "@hips/types";

const avatarAssetRoot = "/avatars/2d";

export const skinTonePalette = [
  "#FDDBB4",
  "#F5CBA7",
  "#E8B88A",
  "#D4956A",
  "#C68642",
  "#B5743A",
  "#A0593B",
  "#8B4513",
  "#7B3F00",
  "#5C2C0A",
  "#3B1A08",
  "#2D1307",
] as const;

export const avatar2DOptions = {
  faceShapes: [
    { id: "face_oval_01", label: "Oval" },
    { id: "face_round_01", label: "Round" },
    { id: "face_square_01", label: "Square" },
    { id: "face_heart_01", label: "Heart" },
  ],
  hairStyles: [
    { id: "hair_short_01", label: "Short" },
    { id: "hair_long_01", label: "Long" },
    { id: "hair_bob_01", label: "Bob" },
    { id: "hair_bun_01", label: "Bun" },
    { id: "hair_curly_tight_01", label: "Curly" },
    { id: "hair_locs_long_01", label: "Locs" },
    { id: "hair_shaved_01", label: "Bald" },
    { id: "cover_hijab_01", label: "Hijab" },
    { id: "hair_pixie_01", label: "Pixie" },
    { id: "hair_waves_01", label: "Waves" },
    { id: "hair_spacebuns_01", label: "Space Buns" },
  ],
  eyeShapes: [
    { id: "eyes_almond_01", label: "Almond" },
    { id: "eyes_sleepy_01", label: "Soft" },
  ],
  eyebrows: [
    { id: "brow_natural_01", label: "Natural Default" },
    { id: "brow_raised_01", label: "Raised" },
    { id: "brow_furrowed_01", label: "Furrowed" },
    { id: "brow_soft_curved_01", label: "Soft Curved" },
    { id: "brow_thick_natural_01", label: "Thick Natural" },
    { id: "brow_flat_neutral_01", label: "Flat Neutral" },
  ],
  noses: [
    { id: "nose_button_01", label: "Button" },
  ],
  mouths: [
    { id: "mouth_neutral_01", label: "Neutral" },
    { id: "mouth_gentle_grin_01", label: "Gentle Grin" },
    { id: "mouth_concerned_01", label: "Concerned" },
    { id: "mouth_talking_01", label: "Talking" },
    { id: "mouth_smirk_01", label: "Smirk" },
    { id: "mouth_reserved_01", label: "Reserved" },
  ],
  facialHair: [
    { id: null, label: "None" },
    { id: "beard_stubble_01", label: "Stubble" },
    { id: "beard_goatee_01", label: "Goatee" },
    { id: "beard_full_01", label: "Full" },
  ],
  accessories: [
    { id: null, label: "None" },
    { id: "acc_glasses_round_01", label: "Glasses" },
    { id: "acc_headband_01", label: "Headband" },
    { id: "acc_visor_01", label: "Abstract visor" },
    { id: "acc_cap_abstract_01", label: "Protective cap" },
    { id: "acc_signal_arc_01", label: "Signal arc" },
  ],
  patterns: [
    { id: null, label: "None" },
    { id: "pattern_grid_01", label: "Grid" },
    { id: "pattern_wave_01", label: "Wave" },
    { id: "pattern_speckle_01", label: "Speckle" },
    { id: "pattern_circuit_01", label: "Circuit" },
  ],
  frameStyles: [
    { id: "frame_none", label: "None" },
    { id: "frame_orbit", label: "Orbit" },
    { id: "frame_brackets", label: "Brackets" },
    { id: "frame_signal", label: "Signal" },
  ],
  clothing: [
    { id: "top_tshirt_01", label: "T-Shirt" },
    { id: "top_hoodie_01", label: "Hoodie" },
    { id: "top_sweater_01", label: "Sweater" },
    { id: "top_blazer_01", label: "Blazer" },
  ],
  backgrounds: [
    { id: "bg_gradient_cool", label: "Cool" },
    { id: "bg_gradient_warm", label: "Warm" },
    { id: "bg_gradient_mint", label: "Mint" },
    { id: "bg_gradient_rose", label: "Rose" },
    { id: "bg_solid_cloud", label: "Cloud" },
    { id: "bg_solid_charcoal", label: "Charcoal" },
  ],
  expressions: [
    { id: "neutral", label: "Neutral" },
    { id: "happy", label: "Happy" },
    { id: "thinking", label: "Thinking" },
    { id: "surprised", label: "Surprised" },
    { id: "concerned", label: "Concerned" },
  ],
} as const;

export const expressionPresets: Record<Avatar2DExpression, {
  eyes: AvatarEyeShape;
  mouth: AvatarMouth;
  brow: AvatarEyebrow;
}> = {
  neutral: { eyes: "eyes_almond_01", mouth: "mouth_neutral_01", brow: "brow_natural_01" },
  happy: { eyes: "eyes_sleepy_01", mouth: "mouth_smile_01", brow: "brow_soft_curved_01" },
  thinking: { eyes: "eyes_almond_01", mouth: "mouth_reserved_01", brow: "brow_flat_neutral_01" },
  surprised: { eyes: "eyes_wide_01", mouth: "mouth_talking_01", brow: "brow_raised_01" },
  concerned: { eyes: "eyes_almond_01", mouth: "mouth_concerned_01", brow: "brow_furrowed_01" },
};

// Suggested pairings (not enforced):
// furrowed + concerned, raised + gentleGrin, softCurved + smile, flatNeutral + reserved.

function src(folder: string, file: string | null) {
  return file ? `${avatarAssetRoot}/${folder}/${file}.svg` : null;
}

export function getHairBackSrc(hairStyle: Avatar2DConfig["hairStyle"]) {
  if (hairStyle === "hair_long_01") return src("hair-back", "hair_long_back_01");
  if (hairStyle === "hair_locs_long_01") return src("hair-back", "hair_locs_long_back_01");
  if (hairStyle === "cover_hijab_01") return src("hair-back", "cover_hijab_back_01");
  if (
    hairStyle === "hair_waves_01" ||
    hairStyle === "hair_spacebuns_01"
  ) {
    return src("hair-back", hairStyle);
  }
  return null;
}

export function getHairFrontSrc(hairStyle: Avatar2DConfig["hairStyle"]) {
  if (hairStyle === "hair_shaved_01") return null;
  return src("hair-front", hairStyle);
}

export function layerRenderOrder(config: Avatar2DConfig, isOnline: boolean = true) {
  const finalConfig = {
    ...config,
    eyeShape: isOnline ? "eyes_almond_01" as const : "eyes_sleepy_01" as const,
  };
  const preset = finalConfig.expression === "neutral"
    ? { eyes: finalConfig.eyeShape, mouth: finalConfig.mouth, brow: finalConfig.eyebrow }
    : expressionPresets[finalConfig.expression];

  const eyesToRender = isOnline ? preset.eyes : "eyes_sleepy_01";

  return [
    src("background", finalConfig.background),
    getHairBackSrc(finalConfig.hairStyle),
    src("body", "body_shoulders_01"),
    src("face", finalConfig.faceShape),
    src("clothing", finalConfig.clothingStyle),
    src("patterns", finalConfig.pattern ?? null),
    src("eyes", eyesToRender),
    src("brows", preset.brow),
    src("nose", finalConfig.nose),
    src("mouth", preset.mouth),
    src("beard", finalConfig.facialHair),
    getHairFrontSrc(finalConfig.hairStyle),
    src("accessories", finalConfig.accessory),
  ];
}
