# Virtual Sanctuary — /session/[id]

## Goal
Upgrade the existing session room from a basic icosahedron canvas into an immersive, calming 3D sanctuary with floating anonymous silhouettes and a real pitch-shifting voice anonymizer.

## Current State
- `AvatarCanvas.tsx` — R3F canvas with Environment "city", spinning icosahedra, ring floor
- `AbstractAvatar.tsx` — Icosahedron mesh, rotation, speaking pulse, HTML label
- `voice-mask-processor.ts` — AudioWorklet with 18Hz ring modulation (basic, not true pitch shift)
- All Three.js/R3F/LiveKit deps already installed. `@react-three/postprocessing` is NOT.

## Tasks

- [ ] **T1: Install @react-three/postprocessing** — `cd apps/web && pnpm add @react-three/postprocessing`
  → Verify: `pnpm build` type-checks clean

- [ ] **T2: Create `SanctuaryParticles.tsx`** — `apps/web/src/components/session/SanctuaryParticles.tsx`
  - 300 `Points` with `bufferGeometry`, slow per-frame drift, wrap-at-boundaries
  - Separate color layers: indigo + amber points
  → Verify: renders without console errors in test-session

- [ ] **T3: Create `SanctuaryScene.tsx`** — `apps/web/src/components/session/SanctuaryScene.tsx`
  - Starfield (2 000 points, far field)
  - Gradient floor disc + two emissive mandala rings (indigo inner, soft outer)
  - No `Environment` preset — pure custom lighting is handled in AvatarCanvas
  → Verify: scene looks dark/calming without "city" HDRI

- [ ] **T4: Upgrade `AvatarCanvas.tsx`**
  - Replace `Environment preset="city"` with `SanctuaryScene` + `SanctuaryParticles`
  - Add `<fog attach="fog" args={['#030712', 14, 35]} />`
  - Add warm amber directional + cool indigo fill light
  - Add `<EffectComposer><Bloom luminanceThreshold={0.05} intensity={0.35} /><Vignette /></EffectComposer>`
  - Camera: `position={[0, 3.5, 8]} fov={46}`, gl toneMapping `ACESFilmic`
  - Remove label showing participant identity hash (anonymity)
  → Verify: sanctuary atmosphere visible in test-session

- [ ] **T5: Upgrade `AbstractAvatar.tsx`**
  - Replace icosahedron with head (sphere, r=0.38) + body (scaled sphere ellipsoid)
  - Remove Y/Z rotation — replace with slow Y-bob: `sin(t * 0.8 + x_offset) * 0.15`
  - Speaking: emissiveIntensity surge + expanding ring below feet
  - Keep raised-hand HTML badge
  - Material: `roughness=0.85, metalness=0.05, transparent opacity=0.88`
  → Verify: avatars float gently, pulse on speaking, look like soft silhouettes

- [ ] **T6: Upgrade `voice-mask-processor.ts`**
  - Replace 18Hz ring modulator worklet with two-head granular pitch shifter
  - Semitones randomised per session: pick from `[-5,-4,-3,3,4,5]`, stored in `sessionStorage('hips-semitones')`
  - Add programmatic reverb (ConvolverNode with white-noise IR, 0.8 s, decay=2.5)
  - Chain: source → highpass → pitchShift → lowpass → compressor → dry/wet reverb mix → destination
  - Expose `semitones` config option on `createVoiceMaskProcessor`
  → Verify: voice audibly shifted but speech intelligible; no crash on init

- [ ] **T7: Create `apps/web/src/app/session/[id]/loading.tsx`**
  - Full-screen dark background with pulsing breathing circle (CSS keyframes)
  - Text: "Entering your sanctuary…" + "Your voice will be anonymized"
  - Fade-in via Tailwind `animate-pulse` + custom CSS
  → Verify: Next.js loading skeleton shows before session connects

## Done When
- [ ] test-session shows a dark starfield space with floating silhouette avatars
- [ ] Mic activation produces a noticeably pitch-shifted voice
- [ ] No TypeScript errors, no console errors on load
- [ ] Bloom post-processing adds soft glow to emissive surfaces
