import { describe, expect, it } from "vitest";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { safeParseAvatar2DConfig } from "./avatar2d-schema";

describe("avatar2d style-layer schema", () => {
  it("retains non-identifying accessory, pattern, and frame selections", () => {
    const parsed = safeParseAvatar2DConfig({
      ...DEFAULT_AVATAR_2D,
      accessory: "acc_visor_01",
      pattern: "pattern_circuit_01",
      frameStyle: "frame_brackets",
    });

    expect(parsed.accessory).toBe("acc_visor_01");
    expect(parsed.pattern).toBe("pattern_circuit_01");
    expect(parsed.frameStyle).toBe("frame_brackets");
  });

  it("uses privacy-safe defaults for unknown style layers", () => {
    const parsed = safeParseAvatar2DConfig({
      ...DEFAULT_AVATAR_2D,
      accessory: "photo-real-mask",
      pattern: "fingerprint",
      frameStyle: "tracking-ring",
    });

    expect(parsed.accessory).toBeNull();
    expect(parsed.pattern).toBeNull();
    expect(parsed.frameStyle).toBe("frame_none");
  });
});
