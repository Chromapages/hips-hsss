# H.I.P.S. Homepage Redesign Plan (Apple Aesthetic)

This plan outlines the complete restructuring of the H.I.P.S. homepage to align with the `DESIGN-apple.md` standard. The current SaaS-heavy styling (gradients, card borders, shadows) will be replaced with an edge-to-edge photography-first presentation featuring extremely clean UI chrome.

## 1. Visual Previews

Here are two initial lofi/high-fi mockups generated to demonstrate the target visual rhythm and dark tile aesthetics:

**Hero Section Lofi Wireframe:**
![Homepage Hero Wireframe](C:\Users\ericb\.gemini\antigravity\brain\c472efe7-cf73-4c55-b6ae-eeca751d9b61\homepage_hero_wireframe_1778040561194.png)

**Dark Tile Component Mockup:**
![Homepage Dark Tile Mockup](C:\Users\ericb\.gemini\antigravity\brain\c472efe7-cf73-4c55-b6ae-eeca751d9b61\homepage_dark_tile_mockup_1778040574595.png)

## 2. Structural Breakdown

### Section 1: Hero Product Tile (Light)
- **Background**: Parchment (`#f5f5f7`) to contrast gracefully from a pure white global nav.
- **Typography**: 
  - Headline (`56px` / `-0.28px` tracking): "Find Support. Stay 100% Anonymous."
  - Tagline (`28px` / `0.196px` tracking): "Healing Individuals through Peer Support."
- **Interactive**: 
  - Primary Action Pill (`#0066cc`): "Get Started"
  - Secondary Ghost Pill: "Explore Services"
- **Visual**: A large "product" rendering (e.g. an abstract UI representation of a session) sitting on the bottom of the section, adorned with the sole system drop-shadow (`rgba(0,0,0,0.22)`).

### Section 2: Hard Anonymity (Dark Tile 1)
- **Background**: Near-Black Tile 1 (`#272729`)
- **Typography**:
  - Headline (`40px`, White): "Hard Anonymity."
  - Tagline (`28px`, `#cccccc`): "Your identity is isolated in a secure vault."
- **Interactive**: Sky Link Blue (`#2997ff`) text link: "Learn more >"
- **Visual**: A subtle, centered representation of the Identity Vault.

### Section 3: Expert Peer Support (Pure White)
- **Background**: Pure White (`#ffffff`)
- **Typography**:
  - Headline (`40px`, `#1d1d1f`): "Expert Peer Support."
  - Tagline (`28px`, `#7a7a7a`): "Connect with trained, compassionate facilitators."
- **Interactive**: Action Blue (`#0066cc`) text link: "Explore services >"
- **Visual**: Soft minimal iconography or abstract avatar representation.

### Section 4: Compassionate Care (Dark Tile 2)
- **Background**: Near-Black Tile 2 (`#2a2a2c`) for a micro-step change from Tile 1.
- **Typography**:
  - Headline: "Compassionate Care."
  - Tagline: "Tailored pathways to restoration."
- **Interactive**: Action Blue Pill CTA to close out the page: "Create Anonymous Account".

## 3. Pseudocode Implementation Details

```tsx
// src/app/(public)/page.tsx
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <main className="flex flex-col w-full bg-[#f5f5f7]">
      
      {/* 1. Hero Tile - Light/Parchment */}
      <section className="w-full flex flex-col items-center pt-[80px] pb-0 overflow-hidden bg-[#f5f5f7]">
         <h1 className="text-[56px] font-semibold text-[#1d1d1f] tracking-[-0.28px] text-center leading-[1.07]">
           Find Support. <br /> Stay 100% Anonymous.
         </h1>
         <p className="mt-4 text-[28px] text-[#1d1d1f] text-center tracking-[0.196px]">
           Healing Individuals through Peer Support.
         </p>
         <div className="mt-8 flex gap-4">
           <Link href="/sign-up" className="rounded-full bg-[#0066cc] text-white px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform">
             Get Started
           </Link>
           <Link href="/services" className="rounded-full bg-transparent text-[#0066cc] border border-[#0066cc] px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform">
             Explore Services
           </Link>
         </div>
         {/* Visual Mockup Area */}
         <div className="mt-[80px] w-[80%] max-w-[1000px] h-[400px] bg-white rounded-t-[18px] shadow-[0_5px_30px_rgba(0,0,0,0.22)] border-t border-x border-[#e0e0e0]"></div>
      </section>

      {/* 2. Dark Tile 1 - Hard Anonymity */}
      <section className="w-full flex flex-col items-center py-[80px] bg-[#272729] text-white">
        <h2 className="text-[40px] font-semibold tracking-tight">Hard Anonymity.</h2>
        <p className="mt-4 text-[21px] text-[#cccccc] font-semibold text-center">
          Your identity is isolated in a secure vault.
        </p>
        <Link href="/anonymity" className="mt-6 text-[17px] text-[#2997ff] hover:underline">
          Learn more {'>'}
        </Link>
      </section>

      {/* 3. Light Tile - Peer Support */}
      <section className="w-full flex flex-col items-center py-[80px] bg-[#ffffff] text-[#1d1d1f]">
        <h2 className="text-[40px] font-semibold tracking-tight">Expert Peer Support.</h2>
        <p className="mt-4 text-[21px] text-[#7a7a7a] font-semibold text-center">
          Connect with trained facilitators who understand your journey.
        </p>
        <Link href="/services" className="mt-6 text-[17px] text-[#0066cc] hover:underline">
          Explore services {'>'}
        </Link>
      </section>
      
      {/* 4. Final Dark Tile - Compassionate Care */}
      <section className="w-full flex flex-col items-center py-[100px] bg-[#000000] text-white">
        <h2 className="text-[40px] font-semibold tracking-tight mb-8">Ready to begin?</h2>
        <Link href="/sign-up" className="rounded-full bg-[#0066cc] text-white px-[28px] py-[14px] text-[18px] font-light hover:scale-95 transition-transform">
          Create Anonymous Account
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
```

## 4. Execution Rules
- Use arbitrary inline classes (`text-[#1d1d1f]`, `bg-[#272729]`, `tracking-[-0.28px]`) initially to tightly couple to the `DESIGN-apple.md` standard.
- Use `const` declarations.
- Enforce the `-0.28px` tracking rule for display size fonts.
- Strictly adhere to `rounded-full` for all buttons.
