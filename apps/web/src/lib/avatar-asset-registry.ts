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
  ],
  eyeShapes: [
    { id: "eyes_almond_01", label: "Almond" },
    { id: "eyes_round_01", label: "Round" },
    { id: "eyes_wide_01", label: "Wide" },
    { id: "eyes_sleepy_01", label: "Soft" },
  ],
  eyebrows: [
    { id: "brow_arch_01", label: "Arch" },
    { id: "brow_soft_01", label: "Soft" },
    { id: "brow_straight_01", label: "Straight" },
  ],
  noses: [
    { id: "nose_button_01", label: "Button" },
    { id: "nose_soft_01", label: "Soft" },
    { id: "nose_wide_01", label: "Wide" },
  ],
  mouths: [
    { id: "mouth_neutral_01", label: "Neutral" },
    { id: "mouth_smile_01", label: "Smile" },
    { id: "mouth_thin_01", label: "Calm" },
    { id: "mouth_open_01", label: "Open" },
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
  neutral: { eyes: "eyes_almond_01", mouth: "mouth_neutral_01", brow: "brow_arch_01" },
  happy: { eyes: "eyes_sleepy_01", mouth: "mouth_smile_01", brow: "brow_soft_01" },
  thinking: { eyes: "eyes_almond_01", mouth: "mouth_thin_01", brow: "brow_arch_01" },
  surprised: { eyes: "eyes_wide_01", mouth: "mouth_open_01", brow: "brow_arch_01" },
  concerned: { eyes: "eyes_almond_01", mouth: "mouth_thin_01", brow: "brow_straight_01" },
};

function src(folder: string, file: string | null) {
  return file ? `${avatarAssetRoot}/${folder}/${file}.svg` : null;
}

export function getHairBackSrc(_hairStyle: Avatar2DConfig["hairStyle"]) {
  return null;
}

export function getHairFrontSrc(hairStyle: Avatar2DConfig["hairStyle"]) {
  return src("hair-front", hairStyle);
}

export function layerRenderOrder(config: Avatar2DConfig) {
  const preset = config.expression === "neutral"
    ? { eyes: config.eyeShape, mouth: config.mouth, brow: config.eyebrow }
    : expressionPresets[config.expression];
  return [
    src("background", config.background),
    src("body", "body_shoulders_01"),
    src("face", config.faceShape),
    src("clothing", config.clothingStyle),
    getHairBackSrc(config.hairStyle),
    src("eyes", preset.eyes),
    src("brows", preset.brow),
    src("nose", config.nose),
    src("mouth", preset.mouth),
    src("beard", config.facialHair),
    getHairFrontSrc(config.hairStyle),
    src("accessories", config.accessory),
  ];
}
