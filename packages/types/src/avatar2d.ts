export type AvatarFaceShape =
  | "face_oval_01"
  | "face_round_01"
  | "face_square_01"
  | "face_heart_01";

export type AvatarHairStyle =
  | "hair_short_01"
  | "hair_long_01"
  | "hair_bob_01"
  | "hair_bun_01"
  | "hair_curly_tight_01"
  | "hair_locs_long_01"
  | "hair_shaved_01"
  | "cover_hijab_01";

export type AvatarEyeShape =
  | "eyes_almond_01"
  | "eyes_round_01"
  | "eyes_wide_01"
  | "eyes_sleepy_01";

export type AvatarEyebrow =
  | "brow_arch_01"
  | "brow_soft_01"
  | "brow_straight_01";

export type AvatarNose =
  | "nose_button_01"
  | "nose_soft_01"
  | "nose_wide_01";

export type AvatarMouth =
  | "mouth_neutral_01"
  | "mouth_smile_01"
  | "mouth_thin_01"
  | "mouth_open_01";

export type AvatarFacialHair =
  | "beard_stubble_01"
  | "beard_goatee_01"
  | "beard_full_01";

export type AvatarAccessory =
  | "acc_glasses_round_01"
  | "acc_headband_01";

export type AvatarClothingStyle =
  | "top_tshirt_01"
  | "top_hoodie_01"
  | "top_sweater_01"
  | "top_blazer_01";

export type AvatarBackground =
  | "bg_gradient_cool"
  | "bg_gradient_warm"
  | "bg_gradient_mint"
  | "bg_gradient_rose"
  | "bg_solid_cloud"
  | "bg_solid_charcoal";

export type Avatar2DExpression =
  | "neutral"
  | "happy"
  | "thinking"
  | "surprised"
  | "concerned";

export interface Avatar2DConfig {
  version: 1;
  faceShape: AvatarFaceShape;
  skinTone: string;
  hairStyle: AvatarHairStyle;
  hairColor: string;
  eyeShape: AvatarEyeShape;
  eyeColor: string;
  eyebrow: AvatarEyebrow;
  nose: AvatarNose;
  mouth: AvatarMouth;
  facialHair: AvatarFacialHair | null;
  accessory: AvatarAccessory | null;
  clothingStyle: AvatarClothingStyle;
  clothingColor: string;
  background: AvatarBackground;
  expression: Avatar2DExpression;
}

export const DEFAULT_AVATAR_2D: Avatar2DConfig = {
  version: 1,
  faceShape: "face_oval_01",
  skinTone: "#D28A5C",
  hairStyle: "hair_short_01",
  hairColor: "#2B211D",
  eyeShape: "eyes_almond_01",
  eyeColor: "#1F1B18",
  eyebrow: "brow_arch_01",
  nose: "nose_button_01",
  mouth: "mouth_neutral_01",
  facialHair: null,
  accessory: null,
  clothingStyle: "top_tshirt_01",
  clothingColor: "#252D37",
  background: "bg_gradient_cool",
  expression: "neutral",
};
