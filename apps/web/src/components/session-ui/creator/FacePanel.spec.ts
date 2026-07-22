import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_AVATAR_2D } from "@hips/types";
import { FacePanel } from "./FacePanel";

describe("FacePanel", () => {
  it("does not show the Smile mouth option", () => {
    const markup = renderToStaticMarkup(
      createElement(FacePanel, {
        bodyType: 0,
        avatar2D: DEFAULT_AVATAR_2D,
        setLocalAvatar2D: () => {},
        setAvatarConfig: () => {},
      }),
    );

    expect(markup).not.toContain('aria-label="Smile"');
  });
});
