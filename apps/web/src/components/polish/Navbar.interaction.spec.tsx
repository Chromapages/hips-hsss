/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => ({
  default: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ href, children, ...props }, ref) => <a ref={ref} href={href} {...props}>{children}</a>,
  ),
}));
vi.mock("next/image", () => ({
  default: ({ alt, priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => <img alt={alt} {...props} />,
}));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("@/components/theme/ThemeToggle", () => ({
  ThemeToggle: ({ showLabel, tabIndex }: { showLabel?: boolean; tabIndex?: number }) => <button type="button" tabIndex={tabIndex} aria-label="Switch to dark mode">{showLabel ? "Dark mode" : "Theme"}</button>,
}));

import { Navbar } from "./Navbar";

describe("Navbar interactions", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("keeps every closed-drawer control out of the tab order", () => {
    render(<Navbar />);

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
    for (const control of within(dialog).getAllByRole("link", { hidden: true })) {
      expect(control.tabIndex).toBe(-1);
    }
    expect(within(dialog).getByRole("button", { name: "Switch to dark mode", hidden: true }).tabIndex).toBe(-1);
  });

  it("opens as a modal drawer, closes on Escape, and restores trigger focus", async () => {
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Open menu" });

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-hidden")).toBe("false");
    expect(within(dialog).getByRole("link", { name: "Find support" }).tabIndex).toBe(0);

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps About as a direct primary destination", () => {
    render(<Navbar />);
    const aboutLinks = screen.getAllByRole("link", { name: "About", hidden: true });
    expect(aboutLinks.some((link) => link.getAttribute("href") === "/about")).toBe(true);
    expect(screen.queryByRole("button", { name: "About" })).toBeNull();
  });
});
