import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => ({ default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => createElement("a", { href, ...props }, children) }));
vi.mock("next/image", () => ({ default: ({ alt, priority: _priority, ...props }: { alt: string; priority?: boolean }) => createElement("img", { alt, ...props }) }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: null, role: null, logout: vi.fn() }) }));
vi.mock("@/components/theme/ThemeToggle", () => ({ ThemeToggle: ({ showLabel, tabIndex }: { showLabel?: boolean; tabIndex?: number }) => createElement("button", { type: "button", tabIndex, "aria-label": "Switch to dark mode", "aria-pressed": false }, showLabel ? "Dark mode" : null) }));

import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders the trust-first three-lane desktop navigation", () => {
    const markup = renderToStaticMarkup(createElement(Navbar));

    expect(markup).toContain(">Privacy</a>");
    expect(markup).toContain('href="/privacy"');
    expect(markup).toContain('href="/about"');
    expect(markup).not.toContain('hips-about-disclosure');
    expect(markup).toContain('aria-label="Primary"');
    expect(markup).toContain('aria-label="Open menu"');
    expect(markup).toContain('aria-label="Switch to dark mode"');
    expect(markup).toContain('id="hips-mobile-drawer"');
    expect(markup).toContain('aria-label="Mobile menu"');
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('tabindex="-1"');

    const centerMarkup = markup.slice(markup.indexOf('class="hips-nav-main"'), markup.indexOf('class="hips-nav-actions"'));
    const utilityMarkup = markup.slice(markup.indexOf('class="hips-nav-actions"'), markup.indexOf('class="hips-mobile-actions"'));
    expect(centerMarkup).not.toContain("For organizations");
    expect(utilityMarkup).not.toContain("For organizations");
    expect(utilityMarkup).toContain('href="/services"');
    expect(utilityMarkup).toContain("Find support");
    expect(utilityMarkup).not.toContain('href="/crisis"');
    expect(utilityMarkup).toContain('href="/login"');
    expect(utilityMarkup).toContain("Login");
    expect(utilityMarkup).toContain('role="group"');
    expect(utilityMarkup).toContain('aria-label="Account and display settings"');
    expect(utilityMarkup).toContain("Dark mode");
    expect(utilityMarkup.indexOf("Find support")).toBeLessThan(utilityMarkup.indexOf("Login"));
    expect(utilityMarkup.indexOf("Login")).toBeLessThan(utilityMarkup.indexOf("Switch to dark mode"));

    const mobileMarkup = markup.slice(markup.indexOf('id="hips-mobile-drawer"'));
    expect(mobileMarkup).toContain("How it works");
    expect(mobileMarkup).toContain("Privacy");
    expect(mobileMarkup).toContain("About");
    expect(mobileMarkup).toContain("Find support");
    expect(mobileMarkup).toContain("Crisis options");
    expect(mobileMarkup).toContain("Login");
    expect(mobileMarkup).not.toContain("Mission &amp; approach");
    expect(mobileMarkup).not.toContain("Contact us");
    expect(mobileMarkup).not.toContain("Get involved");
    expect(mobileMarkup).not.toContain("For organizations");
    expect(markup).not.toContain('aria-current="page"');
  });
});
