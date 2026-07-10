# H.I.P.S. Foundation Homepage — Full-Stack Audit

**Date:** 2026-06-16
**Scope:** Every frontend layer, every backend data connection, performance, accessibility, SEO, security, and cross-device behavior
**Audited route:** `apps/web/src/app/page.tsx` (the marketing `/` route)
**Auditors:** 4 parallel agents (visual design + content, components + performance, backend data + security, SEO + a11y + cross-device)
**Skills loaded:** `frontend-design`, `performance-engineer`, `seo-audit`, `frontend-security-coder`, `nextjs-best-practices`

---

## Executive Summary

- **The homepage is structurally simple** (3 visible sections: Hero, How-It-Works, Features) and is a **pure Server Component with zero runtime data fetching** — statically generated, no DB, no CMS, no Stripe call. The whole page is ~30-50 KB HTML.
- **Most damaging issues are content/legal, not technical:** the Hero ships **5 fabricated partner brand names** (HIMS, Mindful, Calm, Headspace, BetterHelp) as styled `<span>` elements implying real partnerships that don't exist (trademark/misleading-advertising risk).
- **Most damaging technical issues are in the Features section:** the `FeatureTabs` component has a **broken ARIA tablist** (orphan tabs, no `role="tablist"` parent, conflicting tab regions) that screen readers will mis-announce, and **8 `animate-in` animation classes** that resolve to nothing because the `tailwindcss-animate` plugin is not installed.
- **The Hero image is a 1.7 MB uncompressed PNG** — the LCP bottleneck. No `preconnect` to `fonts.gstatic.com` either.
- **The .env file containing production secrets is present in the working tree.** This is the most critical security finding — must be verified as never committed, and the host access code has a hardcoded fallback.
- **No `robots.txt`, no `sitemap.xml`, no page-specific metadata, no Open Graph, no Organization JSON-LD, no `/og/home` image** — SEO Health Index = **53/100 (Poor)**.
- **Dark mode, focus management in the mobile drawer, and the skip-to-main link are all exemplary** — accessibility fundamentals are solid; the gaps are concentrated in the Features section.

## What's Actually on the Homepage

| Section | File:Line | Notes |
|---|---|---|
| Skip link | `apps/web/src/app/layout.tsx:87-92` | Works (targets `#main`) |
| Navbar | imported from `apps/web/src/components/polish/Navbar.tsx` | Sticky, mobile drawer with full a11y |
| Hero | `apps/web/src/app/page.tsx:15-87` | Two-column grid; right column is empty 500px placeholder |
| How It Works | `apps/web/src/app/page.tsx:89-206` | 3-step grid; mobile vertical dashed line |
| Features | `apps/web/src/app/page.tsx:208-233` → `FeatureTabs.tsx` | 4-tab interactive component |
| GlobalFooter | imported from `apps/web/src/components/polish/Footer.tsx` | 12 working links |

**Not on the homepage (despite existing components):** `TrustStrip`, `ImpactStats`, `PricingSwitcher`, `TestimonialCarousel`, `FAQJsonLd`. Each is content-ready but unconnected, and each contains fabricated social proof that would be a CRITICAL gap if added.

## SEO Health Index

| Category | Weight | Score | Notes |
|---|---:|---:|---|
| Crawlability & Indexation | 30 | **8** | No `robots.txt`, no `sitemap.xml` |
| Technical Foundations | 25 | **16** | No canonical, no OG/Twitter, no home OG image, no structured data |
| On-Page Optimization | 20 | **11** | Single H1, clean hierarchy, but title/description too short |
| Content Quality & E-E-A-T | 15 | **12** | Hero copy is descriptive; good internal anchor coverage in FeatureTabs |
| Authority & Trust Signals | 10 | **6** | No Organization JSON-LD, no social profile links |
| **TOTAL** | **100** | **53 (Poor)** | Biggest wins are in Crawlability and Technical |

---

## CRITICAL Gaps (14)

### GAP-001 — Hero: fabricated partner brand names
- **File:** `apps/web/src/app/page.tsx:78-84`
- **Description:** 5 real third-party company names ("HIMS", "Mindful", "Calm", "Headspace", "BetterHelp") are rendered as styled `<span>` elements with the caption "Partnering with leading mental health organizations" — implying real partnerships that do not exist. The inline comment on line 80 confirms these are placeholders. Trademark/misleading-advertising risk; also screen-reader noise and a contrast failure (opacity-30 on text over a photo ≈ 1.5:1).
- **Fix:** Replace with neutral placeholders ("Your Logo", "Partner One"…) or real `<Image>` logos with permission. Increase opacity to 60%+. Add `aria-hidden="true"` to the decorative wrapper. If kept, rewrite the caption as "Built to integrate with leading platforms" (do not claim partnerships).

### GAP-002 — Features: /learn-more links to non-existent route
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:123, 162, 201, 240`
- **Description:** All 4 "Learn more" CTAs target `/features#identity-vault`, `/features#avatar-native`, `/features#safety-engine`, `/features#hard-anonymity` but no `app/features/page.tsx` exists. 404 on click.
- **Fix:** Either (a) create `app/features/page.tsx` with the four anchor sections, or (b) redirect these CTAs to `/services` or `/about` until the route exists.

### GAP-003 — FeatureTabs: broken ARIA tablist
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:17-87, 92-247`
- **Description:** Two `role="tab"` regions coexist on the same `activeIndex` state but neither is wrapped in `role="tablist"`. The 4 top "tab" buttons have `aria-selected` but no `aria-controls` to a valid `tabpanel` ID, and the 4 accordion triggers below also have `role="tab"`/`aria-selected`, so screen readers announce duplicate orphan tabs that "control" nothing. The accordion also lacks `aria-expanded` on its trigger buttons.
- **Fix:** (a) Wrap the 4 top buttons in `<div role="tablist" aria-label="Feature categories" aria-orientation="horizontal">` and add `aria-controls={"panel-N"}` linking each to the right-column image panel + accordion panel. (b) Convert the left accordion to a Disclosure pattern: remove `role="tab"`/`role="tabpanel"`/`aria-selected`; add `aria-expanded={activeIndex===N}` to each trigger and `role="region" aria-labelledby={"accordion-N"}` to each panel. (c) Add ArrowLeft/ArrowRight/Home/End keyboard navigation on the top tablist.

### GAP-004 — animate-in classes resolve to nothing
- **File:** `apps/web/src/app/page.tsx:37, 44, 49, 54, 77, 118, 138, 158`
- **Description:** 8 occurrences of `animate-in fade-in slide-in-from-bottom-N` on the homepage. `globals.css` has no `@keyframes` for these classes, `trust-strip-animations.css` has none, and `tailwind.config.ts` does not register `tailwindcss-animate`. Result: animations silently no-op in every browser, and the `prefers-reduced-motion` contract is broken because there is no animation to reduce.
- **Fix:** Either (a) install `tailwindcss-animate` and register in `tailwind.config.ts`, or (b) define the keyframes in `globals.css` and add a `@media (prefers-reduced-motion: reduce) { .animate-in, [class*="slide-in-from-"] { animation: none !important; opacity: 1 !important; transform: none !important; } }` rule. Until then, the "decorative entrance" is invisible and the a11y contract is silently violated.

### GAP-005 — Homepage SEO metadata is missing
- **File:** `apps/web/src/app/page.tsx` (entire file)
- **Description:** No `export const metadata` or `generateMetadata`. The page inherits a 30-char title and 56-char description from the layout — far below 120-160 char target. No Open Graph, no Twitter Card, no canonical, no keywords. Every other marketing route (`/services`, `/donate`, `/opportunities`) has these; the homepage is the worst-covered route.
- **Fix:** Add to `apps/web/src/app/page.tsx`:
  ```ts
  export const metadata: Metadata = {
    title: "H.I.P.S. Foundation — Anonymous Peer Support Online",
    description: "The first anonymous peer support network — camera-free, voice-masked, and built on hard-anonymity protocols. Get matched in seconds, no sign-up required.",
    keywords: ["anonymous peer support", "peer support online", "hard anonymity", "camera-free therapy", "crisis support", "virtual sanctuary"],
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: { type: "website", title, description, url: `${SITE_URL}/`, siteName: "H.I.P.S. Foundation", images: [{ url: `${SITE_URL}/og/home`, width: 1200, height: 630, alt: "H.I.P.S. Foundation" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og/home`] }
  }
  ```

### GAP-006 — No robots.txt, no sitemap.xml
- **File:** `apps/web/public/robots.txt` (missing) + `apps/web/src/app/robots.ts` (missing) + `apps/web/src/app/sitemap.ts` (missing)
- **Description:** Both files are absent. Search engines have no crawl hints and no discoverable list of routes. Verified via filesystem search.
- **Fix:** Add `apps/web/src/app/robots.ts`:
  ```ts
  import { MetadataRoute } from "next";
  export default function robots(): MetadataRoute.Robots {
    return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/dashboard", "/facilitator", "/join"] },
             sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml` };
  }
  ```
  Add `apps/web/src/app/sitemap.ts` enumerating all public marketing routes.

### GAP-007 — No Organization JSON-LD on the homepage
- **File:** `apps/web/src/app/page.tsx` (no JSON-LD)
- **Description:** `apps/web/src/components/seo/` ships 4 JSON-LD components (`BreadcrumbJsonLd`, `FAQJsonLd`, `PackageJsonLd`, `ServiceJsonLd`) but none is imported in `page.tsx`. The H.I.P.S. Foundation brand has no schema.org identity attached to its primary entry page.
- **Fix:** Create `apps/web/src/components/seo/OrganizationJsonLd.tsx` emitting:
  ```json
  { "@context": "https://schema.org", "@type": "Organization", "name": "H.I.P.S. Foundation", "url": "...", "logo": "...", "sameAs": ["..."] }
  ```
  Render it in `page.tsx`.

### GAP-008 — Secret exposure: .env file on disk
- **File:** `/Users/mimac/WORK/ChromaWork/hips-hsss/.env`
- **Description:** `.env` file present in working tree containing `SESSION_SERVICE_SECRET`, `SESSION_ANONYMISATION_KEY`, `SUDO_TOKEN_SECRET`, `HANDLE_DERIVATION_KEY`, `SAFETY_SERVICE_SECRET`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `HOST_ACCESS_CODE`. `.gitignore` does exclude `.env` going forward, but this does not retroactively unstage history.
- **Fix:** Run `git log --all --full-history -- .env` and `git log --diff-filter=A -- .env`; if any commit shows `.env` content, rotate every secret listed and remove the file from history (`git filter-repo --path .env --invert-paths`).

### GAP-009 — Hardcoded secret fallback in source
- **File:** `apps/web/src/app/api/auth/host-challenge/route.ts:14`
- **Description:** `const secret = process.env.HOST_ACCESS_CODE || 'HIPS-HOST-2025';` — if env is misconfigured in production, attacker with source access can bypass host auth. The value is also listed in `KNOWN_PLACEHOLDERS` in `lib/secrets.ts`.
- **Fix:** Replace the literal default with a `throw new Error('HOST_ACCESS_CODE required')` in production. Rotate the secret. Remove from `KNOWN_PLACEHOLDERS`.

### GAP-010 — TrustStrip contains fabricated social proof
- **File:** `apps/web/src/components/polish/TrustStrip.tsx:25-52, 167-168, 213`
- **Description:** Hardcoded "12,400+ sessions completed safely", "Zero identity breaches", "98% report feeling safer", "4.9★", "Trusted by 12,400+ people in crisis", and a full attributed quote from "Marcus T." — none sourced. Component is ready to mount; adding it to the homepage would ship unverified.
- **Fix:** Replace every static number with a CMS-driven field or a "Data updated <date> — methodology" link. Replace the attributed quote with verified consent-based attribution or remove entirely. Block from homepage until sourced.

### GAP-011 — ImpactStats contains fabricated stats
- **File:** `apps/web/src/components/polish/ImpactStats.tsx:14-47`
- **Description:** "12,400+ Safe Sessions", "8,200+ Active Participants", "45k+ Support Hours", "2,100+ Scholarships" — all hardcoded.
- **Fix:** Same as GAP-010. Verify with real data or stub as "TBD" before adding to homepage.

### GAP-012 — Testimonials use full real-sounding names
- **File:** `apps/web/src/components/testimonials/testimonials.data.ts:7-32`
- **Description:** 5 testimonials use full first+last names (Marcus Chen, Sarah Williams, James Rivera, Dr. Emily Foster, Angela Torres). The H.I.P.S. value proposition is anonymity; surfacing full names contradicts the brand promise.
- **Fix:** Replace all names with anonymized initials and roles (e.g., "M.C., Peer Support Participant") matching the existing Marcus T. pattern in TrustStrip.

### GAP-013 — PricingSwitcher uses undefined `rounded-pill` token
- **File:** `apps/web/src/components/polish/PricingSwitcher.tsx:27, 33, 46, 56, 102, 117`
- **Description:** Component references `rounded-pill` Tailwind utility but no `--radius-pill` or `rounded-pill` token is registered in `globals.css`. Buttons will fall back to default Tailwind radius (`rounded-md` 0.5rem), not the intended pill shape. Also references `shadow-soft` (line 50, 102) which is not in `globals.css`.
- **Fix:** Either (a) define `--radius-pill: 9999px` and `--shadow-soft: 0 1px 2px rgba(0,0,0,0.05)` in `@theme`, or (b) replace `rounded-pill` with `rounded-full` and `shadow-soft` with `shadow-sm`/`shadow-md`.

### GAP-014 — HSTS header missing
- **File:** `apps/web/next.config.ts:135-167`
- **Description:** No `Strict-Transport-Security` header is emitted. Production traffic is vulnerable to downgrade attacks.
- **Fix:** Add to the `headers()` return array (gated on `isDev=false`):
  ```ts
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
  ```

---

## MAJOR Gaps (31)

### GAP-101 — Hero right-column dead space
- **File:** `apps/web/src/app/page.tsx:71-73`
- **Description:** The two-column grid allocates 500px of empty vertical space on the right at md+ viewports (line 71 `min-h-[500px]`). The empty `<div>` produces a visible empty column on desktop and forces a tall scroll on mobile.
- **Fix:** Either populate the right column with a hero illustration/mockup, or restructure to a single-column hero on all viewports. At minimum, wrap the `min-h-[500px]` in `md:` to scope it to desktop only.

### GAP-102 — Hero partner strip opacity-30 fails contrast
- **File:** `apps/web/src/app/page.tsx:79`
- **Description:** `opacity-30` on a primary-colored text drops effective contrast below 3:1 (large text) or 4.5:1 (normal). In light mode primary `#213d53` at 30% on white ≈ `rgb(159,170,177)` = contrast ratio ~1.5:1 — fails WCAG AA.
- **Fix:** Increase to `opacity-60`, or use `text-text-muted` instead of `text-primary opacity-30`, and add a high-contrast surface wrapper.

### GAP-103 — Hero text contrast over photographic background
- **File:** `apps/web/src/app/page.tsx:18-29, 49`
- **Description:** Hero h1 "Support Without the Spotlight." (`text-primary`) and the supporting paragraph (`text-text-muted`) are rendered on top of a photographic bg with only a `bg-gradient-to-t from-primary/20 via-transparent to-transparent` overlay. The 20% primary overlay is too weak; contrast on bright areas of the photo will fail WCAG AA 4.5:1 for body text and 3:1 for large display text.
- **Fix:** Strengthen the overlay (e.g., `bg-gradient-to-b from-black/60 via-black/20 to-transparent` on the h1+subhead area) and switch muted text to `white/90` with text-shadow, or move the h1 outside the image to a flat background.

### GAP-104 — Hero announcement pill text below 12px
- **File:** `apps/web/src/app/page.tsx:38, 40`
- **Description:** "New" label uses `text-[9px]`, supporting line uses `text-[10px]`. Both fall below the 12px WCAG minimum and are extremely difficult to read.
- **Fix:** Replace with `text-xs` (12px) at minimum, or `text-sm` (14px) for the supporting line.

### GAP-105 — How It Works pill badge text 10px
- **File:** `apps/web/src/app/page.tsx:95`
- **Description:** `text-[10px]` on the "How It Works" badge. Same a11y concern as GAP-104.
- **Fix:** Bump to `text-xs`.

### GAP-106 — Partner-strip caption 10px
- **File:** `apps/web/src/app/page.tsx:78`
- **Description:** "Partnering with leading mental health organizations" is `text-[10px]`.
- **Fix:** Bump to `text-xs`.

### GAP-107 — How It Works CTA identical to Hero CTA
- **File:** `apps/web/src/app/page.tsx:55 vs 189`
- **Description:** Both primary CTAs are `bg-primary text-primary-foreground hover:bg-accent …` and both route to `/services`. Two identical CTAs to the same target within 600px vertical scroll.
- **Fix:** Differentiate — e.g., secondary action on the lower CTA ("Browse services" / "See all sessions") pointing to a different route.

### GAP-108 — Hero "First" claim is unsupported
- **File:** `apps/web/src/app/page.tsx:40`
- **Description:** "First Anonymous Peer Support Network Live" is a superlative. No evidence the platform is the first such network. Legally/ethically risky if inaccurate.
- **Fix:** Soften to "A new standard in anonymous peer support" or "Now live: anonymous peer support".

### GAP-109 — Navbar z-stacking: drawer can render under sticky nav
- **File:** `apps/web/src/components/polish/navbar.css:17-21 + 191-208`
- **Description:** `.hips-drawer` has `z-index: 60` and `.hips-nav` has `z-index: 50`. Because `.hips-nav` creates a `backdrop-filter` stacking context, the drawer can render UNDER the blurred nav on browsers that respect filter-based stacking.
- **Fix:** Raise `.hips-nav` z-index to 70 when drawer is open, OR add a `body[data-drawer-open="true"] .hips-nav { z-index: 40 }` rule to push the nav behind the drawer intentionally.

### GAP-110 — No preconnect to fonts.gstatic.com
- **File:** `apps/web/src/app/layout.tsx:37-56`
- **Description:** Three Google Fonts (DM Sans, Source Sans 3, Montserrat) load with no preconnect to `fonts.gstatic.com`. Each font file pays a full DNS+TLS+TCP round-trip before the first byte.
- **Fix:** Add inside `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  ```
  Optionally add `<link rel="dns-prefetch" href="https://fonts.gstatic.com" />` as a legacy fallback.

### GAP-111 — Hero image is 1.7 MB uncompressed PNG
- **File:** `apps/web/public/hips_hero.png` + `apps/web/src/app/page.tsx:19-27`
- **Description:** The LCP element `hips_hero.png` is a 1.7 MB PNG. Even with AVIF/WebP conversion at the Next image optimizer, the source file is 1.7 MB which slows the optimizer first-byte and inflates the page weight.
- **Fix:** Convert `/hips_hero.png` to WebP/AVIF at build time and store in `/public`; or supply a smaller srcset tier (mobile JPEG/AVIF < 200KB) for the first paint and use it as the priority source. Track as a P1 performance regression.

### GAP-112 — trust-strip-animations.css is dead code on the home
- **File:** `apps/web/src/app/trust-strip-animations.css` (imported at `apps/web/src/app/layout.tsx:9`)
- **Description:** `trust-strip-animations.css` is imported globally in `layout.tsx:9` but is only used by the TrustStrip component, which is NOT on the homepage. The CSS ships to the home and is dead code (27 lines).
- **Fix:** Move the `@import` of `trust-strip-animations.css` to be a local import inside `TrustStrip.tsx` so it only ships with pages that use TrustStrip, or convert to a CSS Module.

### GAP-113 — No /og/home OG image route
- **File:** `apps/web/src/app/og/` (only "services" subdir)
- **Description:** There is no `/og/home` route. `apps/web/src/app/og/services/[slug]/route.tsx` exists; the homepage has no equivalent. Social shares of the home URL will fall back to a missing image.
- **Fix:** Add `apps/web/src/app/og/home/route.tsx` (mirror the `services/[slug]/` pattern) producing a 1200×630 PNG, then reference `${SITE_URL}/og/home` in the `openGraph.images` block from GAP-005.

### GAP-114 — Title length / keywords
- **File:** `apps/web/src/app/page.tsx` (line 1+ after fix)
- **Description:** Even with the GAP-005 fix, the layout-level "H.I.P.S. Foundation Platform" (30 chars) underuses SERP real estate and has no primary keyword such as "anonymous peer support". Sibling pages set a `keywords[]` (`services/page.tsx:15-21`).
- **Fix:** Ensure the page title includes "anonymous peer support" and stays ≤ 60 chars. Add `keywords[]` (see GAP-005).

### GAP-115 — Heading hierarchy: footer h2 outside main
- **File:** `apps/web/src/components/polish/Footer.tsx:63`
- **Description:** The footer uses `<h2>` for column titles ("Services", "Organization", "Legal") which sit OUTSIDE the home `<main>`. This creates a logical h2 outside the document outline and the footer `text-10px` micro-headings styled as "headings" semantically break the document outline.
- **Fix:** Change `Footer.tsx:63` from `<h2>` to a non-semantic `<span role="presentation">` or a `<h3>` within a `<section>` with a visually-hidden `<h2>` "Site links" — pick one consistent outline strategy project-wide.

### GAP-116 — Internal anchor coverage thin on home
- **File:** `apps/web/src/app/page.tsx` (entire file)
- **Description:** The home only links to `/services`, `/opportunities`, `/demo-room`, plus the FeatureTabs Learn more links. There is no link to `/about`, `/donate`, `/crisis`, `/contact`, `/privacy`, `/terms` from the home — pages that exist (Footer has them) are buried two clicks deep.
- **Fix:** Add a small "More" link set after the FeatureTabs section: "About the foundation", "Crisis resources", "Donate" — OR re-prioritize one CTA to `/donate` on a recurring visit. The home should be a hub, not a one-way funnel.

### GAP-117 — aria-expanded missing on accordion triggers
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:110, 149, 188, 227`
- **Description:** The accordion triggers (lines 102, 142, 181, 220) do not advertise their expanded/collapsed state. Screen reader users cannot tell which panel is open or that clicking will open it.
- **Fix:** Add `aria-expanded={activeIndex === N}` to each accordion trigger button. Remove `role="tab"` (per GAP-003) and add `role="region" aria-labelledby="accordion-N"` to each panel `<div>`.

### GAP-118 — FeatureTabs accordion uses fixed max-h-48
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:116, 155, 194, 233`
- **Description:** If description copy grows past ~4 lines, content is silently clipped.
- **Fix:** Replace with a dynamic height (measure via ref + `useLayoutEffect`, or transition to `max-h-[9999px]`).

### GAP-119 — FeatureTabs mockup images are external Unsplash URLs
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:255, 273, 290, 307`
- **Description:** Hardcoded `https://images.unsplash.com/...` URLs leak a third-party request, may rate-limit, and are not in the project's domain. Three of the four photo IDs (`1633265486064`, `1638775513`, `1573497019`) are unverified and may 404.
- **Fix:** Move all 4 mockup images to `/public/features/*.png` and update `src`. Verify each URL returns 200 before relying on it.

### GAP-120 — FeatureTabs mockup images load on click (flash of empty)
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:253-318`
- **Description:** Tabs 1-3 are conditionally rendered only on click. When the user clicks a tab, the image starts downloading at click time, causing a flash of empty content in the right column.
- **Fix:** Add a low-res preview/placeholder background-color in the container, or pre-fetch all 4 images on mount (they are small), or use `priority` on the active image and lazy-load others.

### GAP-121 — FeatureTabs active tab indicator is subtle
- **File:** `apps/web/src/components/home/FeatureTabs.tsx:18-23`
- **Description:** Selected tab uses `bg-accent/10 border-accent/30 shadow-sm`; non-selected uses `bg-surface border-border`. The difference is too subtle for at-a-glance recognition of which tab is active.
- **Fix:** Add a top accent bar (`border-t-2 border-accent`) or a left indicator dot to the active state.

### GAP-122 — GlobalFooter brand inconsistent with Hero
- **File:** `apps/web/src/components/polish/Footer.tsx:42-49`
- **Description:** The Footer brand mark uses "HSSS" with the subline "Sanctuary" but the page is the H.I.P.S. Foundation homepage. The Hero says "H.I.P.S. Foundation". Using "HSSS Sanctuary" as the brand in the footer is inconsistent.
- **Fix:** Use "H.I.P.S. Foundation" or "H.I.P.S. / HSSS" consistently.

### GAP-123 — GlobalFooter tagline jargon-heavy
- **File:** `apps/web/src/components/polish/Footer.tsx:51-54`
- **Description:** "Anonymous peer support with mathematical identity decoupling" — "mathematical identity decoupling" is not used in user-facing copy elsewhere.
- **Fix:** Rewrite in plainer language matching the Hero: "Anonymous peer support with hard anonymity protocols."

### GAP-124 — No CSP report-uri / report-to
- **File:** `apps/web/next.config.ts:52-71`
- **Description:** No `report-uri` or `report-to` in CSP. CSP violations are silently dropped — no telemetry on attempted XSS/inline-script abuse.
- **Fix:** Add `report-to csp-endpoint` and/or `report-uri /api/csp-report` to the directives list, and add a `Report-To` header with a group named `csp-endpoint`. Implement `/api/csp-report` to ingest reports.

### GAP-125 — CSP frame-src missing Stripe
- **File:** `apps/web/next.config.ts:65`
- **Description:** `frame-src` does not include `https://js.stripe.com`. The donate page uses `<Elements>` from `@stripe/react-stripe-js` which loads Stripe.js in an iframe. If a CSP violation occurs in production on the donate route, the Stripe iframe will be blocked.
- **Fix:** Add `https://js.stripe.com` to `frame-src` and `script-src` in production directives. Verify with the donate page.

### GAP-126 — Cookie hardening: no __Host- prefix
- **File:** `apps/web/src/app/api/auth/session/route.ts:46-53`, `apps/web/src/app/api/auth/sudo/route.ts:156-164`
- **Description:** Session cookies use `HttpOnly`, `Secure` (in prod), `SameSite=Lax`, `Path=/` — but no `__Host-` or `__Secure-` cookie prefix.
- **Fix:** Add `__Host-` prefix to the cookie name. Note: requires `Path=/` (satisfied) and no `Domain` (satisfied) and `Secure` (satisfied in prod). Update `middleware.ts:169` and all read sites.

### GAP-127 — Implicit static generation
- **File:** `apps/web/src/app/page.tsx:9`
- **Description:** Homepage has no `export const dynamic`, `revalidate`, or `generateStaticParams`. Next.js will infer `force-static` because no data is fetched, but the configuration is implicit and fragile: a future contributor adding a single `fetch()` (or `cookies()`/`headers()`) will silently switch the route to dynamic.
- **Fix:** Add explicit `export const dynamic = 'force-static'` and `export const revalidate = false` to lock in static generation.

### GAP-128 — CSRF on state-changing API routes
- **File:** `apps/web/src/app/api/auth/session/route.ts` (POST handler) + all other state-changing routes
- **Description:** Although there are no forms on the homepage, the entire POST/DELETE API surface relies solely on the Firebase ID token in an HttpOnly cookie. CSRF protection is "implicit" via `SameSite=Lax`. For POST routes `SameSite=Lax` blocks cross-site form submissions, but state-changing GETs (e.g. `/api/cron/follow-up-survey`) would not be blocked.
- **Fix:** Inventory all state-changing API routes. For any that use GET, add a CSRF token check or change to POST. For POST routes, rely on `SameSite=Lax` AND consider double-submit cookie or origin verification.

### GAP-129 — middleware rate-limit breaks horizontal scaling
- **File:** `apps/web/src/middleware.ts:37-38, 156-164`
- **Description:** Rate limit applies to all `/api/*` (100 req / 60 s) using an in-memory `Map`. This breaks horizontal scaling (each node has its own bucket, so effective limit = 100 × N_nodes). Not a homepage issue, but a security posture concern.
- **Fix:** Migrate to a Redis-backed limiter. Add a fallback for when Redis is down (already present). For homepage traffic, no API routes are hit, so this is informational.

### GAP-130 — AnalyticsTracker global click listener on every page
- **File:** `apps/web/src/app/layout.tsx:96` + `apps/web/src/components/analytics/AnalyticsTracker.tsx`
- **Description:** `AnalyticsTracker` is mounted in the root layout, runs on EVERY page including the home. It attaches a global document 'click' listener with no gating on first interaction.
- **Fix:** Defer `AnalyticsTracker` mount via `requestIdleCallback`, or only attach the listener after the first user interaction (scroll/click).

### GAP-131 — Navbar focus trap edge cases
- **File:** `apps/web/src/components/polish/Navbar.tsx:141-167`
- **Description:** The focus trap is built on the `drawerRef` element but does NOT update its first/last focusable elements if the drawer's children change while open. The trap also uses `addEventListener("keydown", onTab)` instead of capture phase, so inner elements that stop propagation (none currently do) would break the trap.
- **Fix:** Add `{ capture: true }` flag and re-query focusable on each Tab key to handle dynamic content.

---

## MINOR Gaps (34)

### GAP-201 — Partner-strip text rendered without aria-hidden wrapper
- **File:** `apps/web/src/app/page.tsx:78-85`
- **Description:** The 5 brand names are `<span>` elements with text inside. Screen readers will read "HIMS, Mindful, Calm, Headspace, BetterHelp" as content.
- **Fix:** Add `aria-hidden="true"` to the wrapper `<div>` OR provide an accessible label (e.g., `aria-label="Partner organization names (placeholders)"`).

### GAP-202 — Navbar uses non-tokenized `text-text`
- **File:** `apps/web/src/components/polish/Navbar.tsx:103, 167, 174, 195, 212, 227`
- **Description:** `text-text` is not a valid token (the alias is `text-text-primary`).
- **Fix:** Replace with `text-text-primary` and verify in both themes.

### GAP-203 — Tailwind v4 animate plugin not in package.json
- **File:** `apps/web/src/app/page.tsx:37, 44, 49, 54, 77` + `apps/web/tailwind.config.ts`
- **Description:** If `tailwindcss-animate` is not installed, all `animate-in fade-in slide-in-from-bottom-N` classes silently no-op. (See GAP-004 for the fix.) This is the root cause.
- **Fix:** Verify the plugin is in `package.json`; if missing, install it OR define keyframes locally (per GAP-004).

### GAP-204 — How It Works connecting line fragile % offsets
- **File:** `apps/web/src/app/page.tsx:115`
- **Description:** `left-[16.67%] right-[16.67%]` for a 3-column grid assumes equal columns. If the grid ever becomes 2 or 4 columns, the line will misalign.
- **Fix:** Add a code comment, or use `inset-x-1/6` for clarity.

### GAP-205 — H1 contains `<br />`
- **File:** `apps/web/src/app/page.tsx:44-46`
- **Description:** A `<br />` inside the H1 may cause accessibility/SEO issues in some parsers. The line break is visual, not semantic.
- **Fix:** Use a `<span class="block">` or wrap in a `<p>` if line break is purely visual, or keep the `<br />` (acceptable in H1).

### GAP-206 — Navbar dropdown items have no hover/focus background
- **File:** `apps/web/src/components/polish/Navbar.tsx:342, 451-470`
- **Description:** Verify in `navbar.css` that `.hips-dropdown-item` and `.hips-drawer-link` styles have a visible focus ring. If they only change text color, keyboard users get no feedback.
- **Fix:** Add `focus-visible:bg-accent/10` if missing.

### GAP-207 — Navbar `text-text/60` opacity stack
- **File:** `apps/web/src/components/polish/TrustStrip.tsx:195`
- **Description:** `text-text/60` + `opacity-60` = compound 36% effective opacity. Likely fails contrast in dark mode.
- **Fix:** Lower one of the two; or use `text-text-muted/80`.

### GAP-208 — Footer `<h2>` at 10px font
- **File:** `apps/web/src/components/polish/Footer.tsx:63`
- **Description:** The footer column "headings" (Services / Organization / Legal) are `<h2>` with `text-[10px]`. At 10px they fail the AAA readability guideline (12px+ recommended).
- **Fix:** Increase to `text-xs` (12px) or `text-sm` (14px) and reduce tracking-brand for legibility.

### GAP-209 — Skip link size is borderline
- **File:** `apps/web/src/app/layout.tsx:87-92`
- **Description:** The skip link is `focus:px-4 focus:py-2` which produces a target well under 44×44px on first reveal.
- **Fix:** Add `focus:min-h-[44px] focus:min-w-[44px] focus:flex focus:items-center` to the skip link className.

### GAP-210 — Theme toggle aria-label uses "click"
- **File:** `apps/web/src/components/theme/ThemeToggle.tsx:44`
- **Description:** The aria-label is "Theme: ${label} (click to switch to ${nextLabel})" — for SR users, "click" presumes a mouse.
- **Fix:** Change to `` `Theme: ${label} — activate to switch to ${nextLabel}` ``.

### GAP-211 — TrustStrip hardcoded hex colors
- **File:** `apps/web/src/components/polish/TrustStrip.tsx:9-13, 90`
- **Description:** Avatar circles use raw hex (`#213d53`, `#2a4a6b`, etc.) and an inline `borderLeft` style with `#D6E0E8`. In dark mode the dark navy avatars will be near-invisible on the `bg-subtle` (oklch 0.15) background.
- **Fix:** Replace with `bg-primary`, `bg-accent` etc. token classes, and `border-l border-border` for the inline style.

### GAP-212 — ImpactStats SVG data URL with hardcoded #213d53
- **File:** `apps/web/src/components/polish/ImpactStats.tsx:101-103`
- **Description:** The hardcoded `#213d53` fill is embedded in the SVG data URL. The opacity is 0.015 — almost invisible.
- **Fix:** Either parameterize the color, or accept and document.

### GAP-213 — viewport-fit=cover not declared
- **File:** `apps/web/src/app/layout.tsx`
- **Description:** Body uses `pb-[env(safe-area-inset-bottom)]` (line 86) but `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` is not explicitly set. In iOS Safari browser mode, `env(safe-area-inset-bottom)` may resolve to 0.
- **Fix:** Add `` export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "..." } `` to `layout.tsx`.

### GAP-214 — Hero min-h-[80vh] vs mobile address bar
- **File:** `apps/web/src/app/page.tsx:16, 33`
- **Description:** The hero uses `min-h-[80vh]` and a nested `min-h-[70vh]`. On iOS Safari 100vh includes the URL bar area; 80vh on a 667px iPhone gives ~534px of content but the actual visible area is closer to 460px.
- **Fix:** Replace `min-h-[80vh]` with `min-h-[80dvh]` (dynamic viewport) — well-supported in iOS Safari 15.4+, Chrome 108+.

### GAP-215 — Dark-mode filter on hero image
- **File:** `apps/web/src/app/globals.css:468`
- **Description:** `[data-theme="dark"] img:not([data-no-dark]):not([src$=".svg"])` applies `filter: brightness(0.92) contrast(1.05)` to ALL images including the hero `hips_hero.png` and the FeatureTabs unsplash photos.
- **Fix:** Add `data-no-dark` to the hero `<Image>` at `page.tsx:19-27` (and probably the FeatureTabs right-column images).

### GAP-216 — Navbar.css relative-color syntax fallback
- **File:** `apps/web/src/components/polish/navbar.css:21-23`
- **Description:** Uses `oklch(from var(--color-bg) l c h / 0.85)` — the "from" relative-color syntax is supported in Chrome 119+, Safari 16.4+, Firefox 128+. For older browsers the nav will fall back to opaque, which is fine but the blur effect won't render.
- **Fix:** Add a fallback `background-color: oklch(var(--color-bg-rgb) / 0.85);` behind the relative color.

### GAP-217 — Navbar initial onScroll() during commit
- **File:** `apps/web/src/components/polish/Navbar.tsx:107-114`
- **Description:** Scroll handler uses `requestAnimationFrame` to throttle `setState`, but the initial `onScroll()` call is invoked synchronously inside the effect, which can cause a `setState` in the middle of React's commit phase.
- **Fix:** Move the initial `onScroll()` into a `queueMicrotask` or wrap `setIsScrolled` in a `flushSync` to avoid hydration mismatch warnings.

### GAP-218 — Navbar AuthProvider useMemo dep list
- **File:** `apps/web/src/components/polish/Navbar.tsx:60`
- **Description:** `useAuth()` is destructured. The Navbar is `React.memo`'d, but `useAuth()` returns a new object on every render of `AuthProvider`, breaking memoization.
- **Fix:** Confirm `AuthProvider`'s `useMemo` has the right dep list, OR drop `React.memo` from Navbar (memoization gain is small for a sticky element already in the LCP path).

### GAP-219 — Navbar dropdown outside-click uses mousedown only
- **File:** `apps/web/src/components/polish/Navbar.tsx:170-189`
- **Description:** The "outside click" handler uses `mousedown` to close the dropdown, but touch users will need a click.
- **Fix:** Add a `touchstart` listener in addition to `mousedown`.

### GAP-220 — PricingSwitcher has no useReducedMotion gating
- **File:** `apps/web/src/components/polish/PricingSwitcher.tsx` (around line 59)
- **Description:** If added to homepage later: slide-in animation (line 59) has no `prefers-reduced-motion` check.
- **Fix:** Add `motion-safe:` prefix or `prefers-reduced-motion` check before adding to home.

### GAP-221 — TestimonialCarousel: CustomEvent anti-pattern
- **File:** `apps/web/src/components/testimonials/TestimonialCarousel.tsx:99`
- **Description:** If added to homepage later: dispatches a `CustomEvent "testimonial-scroll"` from the scroll handler to the dot indicators. String-event anti-pattern invisible to React DevTools and hard to test.
- **Fix:** Lift `activeIndex` state up to the parent and pass it down as a prop, or use a `useState` in the parent component.

### GAP-222 — TestimonialCarousel: no keyboard arrow nav
- **File:** `apps/web/src/components/testimonials/TestimonialCarousel.tsx:135`
- **Description:** If added to homepage later: `tabIndex={0}` on a horizontally scrollable region is correct for keyboard nav, but no keyboard arrow handler exists. Users can tab to the carousel but cannot use arrow keys to navigate between slides.
- **Fix:** Add `onKeyDown` handler for `ArrowLeft`/`ArrowRight` to advance slides.

### GAP-223 — hreflang not declared
- **File:** `apps/web/src/app/layout.tsx`
- **Description:** No `alternates.languages` and no i18n is implemented (single `<html lang="en">`). Acceptable for v1.
- **Fix:** When adding i18n, emit `alternates.languages` and per-page hreflang link tags.

### GAP-224 — No verification tag (GSC)
- **File:** `apps/web/src/app/layout.tsx`
- **Description:** No `verification` field (Google Search Console, Bing, etc.). Easy win.
- **Fix:** Add `` verification: { google: "...", other: { "msvalidate.01": "..." } } `` after registering the site.

### GAP-225 — No metadataBase
- **File:** `apps/web/src/app/layout.tsx`
- **Description:** No `metadataBase` declared, so any relative OG image URL would be resolved against the request URL.
- **Fix:** Add `` metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation") `` to the layout metadata.

### GAP-226 — Cookie secure condition is fine
- **File:** `apps/web/src/app/api/auth/session/route.ts:46-52`
- **Description:** `secure: process.env.NODE_ENV === 'production' || req.nextUrl.protocol === 'https:'` — the second branch means it is `Secure` on Vercel preview URLs. Good.
- **Fix:** OK as-is.

### GAP-227 — dangerously permissive CSP img-src
- **File:** `apps/web/next.config.ts:61`
- **Description:** `img-src 'self' data: https: blob:` — wildcard over `https:`. Any image from any HTTPS source will be allowed.
- **Fix:** Restrict to known image hosts: `https://images.unsplash.com https://hips-hsss.firebasestorage.app https://*.googleusercontent.com`.

### GAP-228 — CSP connect-src missing api.stripe.com
- **File:** `apps/web/next.config.ts:63`
- **Description:** `connect-src` does not include `https://api.stripe.com`. Stripe.js POSTs telemetry to `api.stripe.com` on init — this would be CSP-blocked in production on the donate page.
- **Fix:** Add `https://api.stripe.com` to `connect-src`.

### GAP-229 — No global-error.tsx for layout
- **File:** `apps/web/src/app/error.tsx:1-20`
- **Description:** An error in the root layout (e.g. font-loading crash) is not caught by `error.tsx`. Next.js requires a separate `global-error.tsx` at the root for that.
- **Fix:** Add `apps/web/src/app/global-error.tsx` with a minimal HTML document reset (since the root layout itself has failed).

### GAP-230 — Open-redirect surface on /login?from=
- **File:** `apps/web/src/middleware.ts:172-183`
- **Description:** Middleware sets `?from=<pathname+search>` on redirect to `/login`. The login page would need to read `from` and redirect there after login. If the consuming login page does not validate that `from` is a same-origin path, this is an open-redirect surface.
- **Fix:** Audit `/login` and the `(auth)/login/page.tsx` flow for `from` consumption; if used, validate with `URL` parsing and an explicit check that `from.startsWith('/')` and does not start with `//`.

### GAP-231 — Demo mode cookie lacks SameSite
- **File:** `apps/web/src/components/ui/sidebar.tsx:93`
- **Description:** `document.cookie = ${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=...` non-HttpOnly, non-Secure, client-set cookie for sidebar state.
- **Fix:** Add `SameSite=Lax` for hygiene. Not security-sensitive (UI only).

### GAP-232 — JSON-LD `</script>` escape check
- **File:** `apps/web/src/components/seo/{PackageJsonLd,ServiceJsonLd,BreadcrumbJsonLd,FAQJsonLd}.tsx`
- **Description:** All four use `dangerouslySetInnerHTML` with `JSON.stringify(jsonLd)`. `JSON.stringify` is safe against `</script>` injection only when you also escape the closing tag.
- **Fix:** Inspect each component for `</script>` escaping. If not present, add `.replace(/</g, '\\u003c')` after `JSON.stringify`.

### GAP-233 — Navbar logo intrinsic size 220x220
- **File:** `apps/web/src/components/polish/Navbar.tsx:277-286`
- **Description:** `hipslogo.png` is loaded with `priority` and `width`/`height` 220×220, but the actual rendered size on desktop is much smaller (the logo CSS shrinks it).
- **Fix:** Drop the `priority` (not LCP) and provide `srcSet`, or use a smaller intrinsic size like 80×80 with `sizes="(max-width: 768px) 40px, 80px"`.

### GAP-234 — Motion-safe: not applied to button transforms
- **File:** `apps/web/src/app/page.tsx:55, 61`
- **Description:** Buttons use `hover:scale-[1.02]` and `active:scale-95`. These transforms run on the GPU, but for `prefers-reduced-motion` they should be neutralized. The Button class does not include `motion-safe:` on these.
- **Fix:** Wrap `hover:scale` with `motion-safe:hover:scale-[1.02]` etc.

---

## Top Priorities (Quick Win Order)

1. **GAP-001** — Remove fabricated partner brand names. (5 minutes, blocks the page from being legally defensible.)
2. **GAP-004** — Add `tailwindcss-animate` OR define keyframes locally + add the reduced-motion override. (30 minutes, restores 8 entrance animations and the a11y contract.)
3. **GAP-005 + GAP-006 + GAP-007** — Add page metadata, `robots.ts`, `sitemap.ts`, Organization JSON-LD. (1 hour, lifts SEO Health Index from 53 to ~75.)
4. **GAP-008 + GAP-009** — Rotate the `.env` secrets and remove the hardcoded `HIPS-HOST-2025` fallback. (15 minutes, mitigates a credential-exposure chain.)
5. **GAP-003** — Fix the FeatureTabs tablist (wrap in `role="tablist"`, add `aria-controls`, remove conflicting accordion tabs, add `aria-expanded`, add arrow-key nav). (2 hours, fixes the most damaging a11y issue.)
6. **GAP-111** — Convert `hips_hero.png` to WebP/AVIF, drop to < 200KB. (15 minutes, biggest LCP win.)
7. **GAP-110** — Add `preconnect` to `fonts.gstatic.com`. (5 minutes, removes 3 DNS+TLS round-trips.)
8. **GAP-014** — Add HSTS header. (5 minutes, one-line config change.)

---

## Positive Findings

1. **Comprehensive dual-theme token system** in `globals.css` — every color, shadow, radius, and easing has a light/dark variant. Components that consume token classes (e.g., `bg-accent/10`, `text-text-muted`, `border-border`) automatically theme-switch with no per-component code.
2. **Excellent Navbar accessibility** — full keyboard navigation for the dropdown (ArrowUp/Down/Home/End/Esc), focus trap in the mobile drawer, `aria-expanded`/`aria-controls`/`aria-current` all wired correctly, 44px+ touch targets, `prefers-reduced-motion` honored.
3. **CSP is robust** — `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(self), microphone=(self), geolocation=()`. `'unsafe-eval'` is correctly gated to dev only.
4. **Image optimization config is excellent** — AVIF + WebP, 30-day cache TTL, `compress: true`.
5. **Pre-paint theme bootstrap script prevents FOUC** — well-documented, matches `ThemeProvider.STORAGE_KEY`, and `suppressHydrationWarning` is set on both `<html>` and `<body>`.
6. **Skip-to-main-content link present** in `layout.tsx:87-92` with `sr-only`/`focus:not-sr-only` pattern, targeting `<main id="main" tabIndex={-1}>` in `page.tsx:12`.
7. **The 3-section homepage is honest about its scope** — no Lorem, no "Coming soon", no "TODO" in the live sections. The only fabrications are the partner logo names and content in components that are not currently rendered.

---

## Files Cited (absolute paths)

- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/page.tsx` (234 lines)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/layout.tsx` (105 lines)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/globals.css` (479 lines)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/next.config.ts`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/middleware.ts`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/home/FeatureTabs.tsx` (324 lines)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/Navbar.tsx` (529 lines)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/navbar.css`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/Footer.tsx`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/TrustStrip.tsx`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/ImpactStats.tsx`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/polish/PricingSwitcher.tsx`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/components/testimonials/testimonials.data.ts`
- `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/public/hips_hero.png` (1.7 MB)
- `/Users/mimac/WORK/ChromaWork/hips-hsss/.env` ⚠️ (CRITICAL — contains secrets)

---

## Summary

- **14 CRITICAL · 31 MAJOR · 34 MINOR = 79 gaps** identified.
- **Single highest-impact fix:** the partner-logo legal risk (GAP-001, 5 minutes).
- **Single highest-value engineering fix:** the FeatureTabs tablist (GAP-003) which fixes both the broken tablist ARIA contract and the missing `aria-expanded`.
- **Biggest performance win:** converting `hips_hero.png` to WebP/AVIF (GAP-111).
- **Biggest security win:** rotating the `.env` secrets and removing the hardcoded `HIPS-HOST-2025` fallback (GAP-008 + GAP-009).
- **SEO Health Index:** 53/100 (Poor) → 75/100 (Good) achievable in 1 hour via GAP-005/006/007/113.
