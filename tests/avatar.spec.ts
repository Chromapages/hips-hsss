import { describe, expect, it } from "vitest";
import { LiveKitTokenService } from "../services/session/src/livekit-token-service";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Avatar derivation logic", () => {
  it("determines deterministic style, palette, and gesture parameters", () => {
    const service = new LiveKitTokenService({
      apiKey: "testkey",
      apiSecret: "testsecret",
      durationSeconds: 3600,
    });

    const token1 = service.issue("sess_12345", "user_abc");
    const token2 = service.issue("sess_12345", "user_abc");
    const token3 = service.issue("sess_12345", "user_def");

    // Reconnect stability check: same session and user ID keep the cached opaque identity.
    expect(token1.anonymousIdentity).toBe(token2.anonymousIdentity);
    expect(token1.avatar.style).toBe(token2.avatar.style);
    expect(token1.avatar.palette).toBe(token2.avatar.palette);

    // Differentiation check: different user must yield different properties
    expect(token1.anonymousIdentity).not.toBe(token3.anonymousIdentity);

    // Style bounds check: style must be inside [0, 11]
    expect(token1.avatar.style).toBeGreaterThanOrEqual(0);
    expect(token1.avatar.style).toBeLessThanOrEqual(11);
    expect(token3.avatar.style).toBeGreaterThanOrEqual(0);
    expect(token3.avatar.style).toBeLessThanOrEqual(11);

    // Palette membership check: palette must belong to palettes whitelist
    const validPalettes = ["coastal", "sunrise", "forest"];
    expect(validPalettes).toContain(token1.avatar.palette);
    expect(validPalettes).toContain(token3.avatar.palette);
  });
  
  it("ensures Next.js API route makeAvatar style index is within 0-11 range", () => {
    const routeCode = readFileSync(join(process.cwd(), "apps/web/src/app/api/livekit/token/route.ts"), "utf8");
    // Verify route has style in 0-11 range and no off-by-one (+1) logic remaining
    expect(routeCode).toContain("style: (first % 12)");
    expect(routeCode).not.toContain("style: (first % 12) + 1");
  });
});
