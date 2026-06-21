# Streaming Voice Anonymization Implementation Spec

This document turns the current voice anonymization research into a concrete
implementation path for the H.I.P.S. codebase.

## Current State

The product currently has two voice-masking concepts:

- `Effects Mode`: browser-side DSP masking implemented in
  [apps/web/src/lib/voice-mask-processor.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/lib/voice-mask-processor.ts)
- `Enhanced Neural Masking`: server-backed scaffolding exposed through
  [apps/web/src/lib/neural-voice-masking.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/lib/neural-voice-masking.ts),
  [apps/web/src/app/api/voice-masking/status/route.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/api/voice-masking/status/route.ts),
  and
  [apps/web/src/app/api/voice-masking/agent/dispatch/route.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/api/voice-masking/agent/dispatch/route.ts)

Today, only `Effects Mode` is meaningfully active. It is useful as a fallback,
but it is not sufficient for strong speaker de-identification.

## Product Positioning

The app should explicitly support two masking tiers:

- `Effects Mode`: low-latency browser DSP, privacy-light fallback
- `Enhanced Neural Masking`: stronger identity transformation, server-backed,
  used when the voice worker is healthy and ready

This split already exists in the UI copy and should remain the core product
model.

## Target Pipeline

The production neural path should be:

`mic capture -> chunker -> VAD -> content/prosody/identity separation -> pseudo-speaker replacement -> neural vocoder -> publish anonymized track to LiveKit`

Key rule:

- In `Enhanced Neural Masking`, the published participant track must be the
  transformed track only.
- Raw microphone audio must never be published to the room in that mode.

## Recommended Architecture For This Repo

The right first implementation for this codebase is:

1. Browser captures mic audio.
2. Browser streams chunked PCM to a dedicated voice worker over `wss://`.
3. Voice worker performs VAD + anonymization.
4. Voice worker returns anonymized PCM/audio frames.
5. Browser reconstructs a `MediaStreamTrack` from returned audio and publishes
   that track into LiveKit.

Why this architecture:

- It fits the current Next.js + LiveKit setup.
- It preserves the current `Effects Mode` fallback.
- It avoids trying to run heavy neural models in-browser.
- It lets us evolve the backend independently of the session UI.

## What We Should Not Do First

- Do not treat `w-okada/voice-changer` style effects as the final privacy
  target.
- Do not attempt codec-layer LiveKit integration first.
- Do not promise strong anonymity on CPU-only VPS hardware.
- Do not set `NEURAL_VOICE_CHANGER_LIVE_READY=true` until only transformed
  audio is being published and the latency budget is measured.

## Repo Mapping

### Existing Files We Keep

- Browser DSP fallback:
  [apps/web/src/lib/voice-mask-processor.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/lib/voice-mask-processor.ts)
- Neural backend config and health:
  [apps/web/src/lib/neural-voice-masking.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/lib/neural-voice-masking.ts)
- Agent dispatch:
  [apps/web/src/lib/voice-masking-agent.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/lib/voice-masking-agent.ts)
- Guarded dispatch API:
  [apps/web/src/app/api/voice-masking/agent/dispatch/route.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/api/voice-masking/agent/dispatch/route.ts)
- Neural status API:
  [apps/web/src/app/api/voice-masking/status/route.ts](/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/api/voice-masking/status/route.ts)
- VPS POC notes:
  [deploy/voice-changer/README.md](/Users/mimac/WORK/ChromaWork/hips-hsss/deploy/voice-changer/README.md)

### Files We Likely Add Next

- `apps/web/src/lib/streaming-voice-client.ts`
  Browser client for chunking mic audio and maintaining the `wss://` duplex
  session with the voice worker.
- `apps/web/src/lib/voice-track-rebuilder.ts`
  Rebuilds a publishable `MediaStreamTrack` from returned anonymized frames.
- `apps/web/src/hooks/session/useNeuralVoiceMasking.ts`
  Session-scoped lifecycle hook for starting/stopping the neural path and
  falling back safely.
- `services/voice-worker/`
  Dedicated worker service for VAD, chunk orchestration, and model inference.

## Backend Responsibilities

The dedicated voice worker should own:

- `wss://` streaming endpoint for per-session audio
- bearer/shared-secret auth
- per-session state
- VAD before inference
- pseudo-speaker assignment policy
- chunk processing and response streaming
- health endpoint
- metrics: latency, dropout rate, queue depth, RTF

The Next.js app should not become the audio transformer. It should act as the
control plane and session orchestrator.

## Pseudo-Speaker Policy

We need a stable policy instead of simple “preset effects”.

Recommended first policy:

- Generate a pseudo-speaker identity once per session join.
- Keep it stable within a session so the participant’s voice does not drift.
- Regenerate it for each new session so cross-session linkability is reduced.

Store only what we need:

- session ID
- participant identity
- pseudo-speaker ID or seed
- timestamps

Do not persist raw audio.

## VAD Requirements

VAD is required before the neural transform.

Why:

- avoids wasting compute on silence
- reduces artifacts
- helps keep latency inside budget

Implementation note:

- Start with a standard WebRTC VAD or equivalent CPU-cheap detector in the
  worker before any heavier model stage.

## Latency Targets

For live use, we should treat these as product gates:

- target added latency: `< 150 ms`
- acceptable upper bound for testing: `< 250 ms`
- reject as production-ready: `> 250 ms sustained`

Given the current VPS:

- CPU-only neural conversion is a proof-of-concept path
- it is not a credible production-quality target for real-time masking

## VPS Reality

The current VPS is suitable for:

- control-plane APIs
- health checks
- agent dispatch
- CPU smoke testing
- basic VAD and streaming pipeline bring-up

The current VPS is not suitable for:

- strong low-latency neural voice conversion at production quality

That means our real deployment strategy should be:

- keep the web app on the VPS
- move the neural worker to GPU-backed infrastructure when we are ready for
  actual quality testing

## Rollout Plan

### Phase 1: Honest Fallback

- Keep `Effects Mode` as the default fallback.
- Keep `Enhanced Neural Masking` guarded behind backend readiness.
- Make sure session UI clearly explains the difference.

### Phase 2: Streaming Worker Skeleton

- Add `services/voice-worker/` (initial scaffold added)
- Add `wss://` streaming endpoint (initial `ws://` local endpoint added at
  `/v1/stream`)
- Add chunk protocol (JSON control messages + binary PCM16 frames)
- Add VAD (initial RMS threshold gate added)
- Return looped or pass-through transformed frames first for transport testing
  (initial pass-through/silence behavior added)

Success criteria:

- browser can send mic chunks
- worker can return audio chunks
- browser can publish returned audio into LiveKit
- no raw track is published in enhanced mode

### Phase 3: Real Anonymization Model Integration

- replace pass-through/effect placeholder with real speaker
  de-identification/conversion backend
- enforce per-session pseudo-speaker assignment
- add latency and failure metrics

Success criteria:

- transformed audio is intelligible
- voice sounds materially different from source
- real-time factor is below `1.0`

### Phase 4: Validation Gates

- run speaker-verification resistance tests
- run intelligibility checks
- run repeated-listener identification tests
- measure latency under realistic network conditions

Do not mark the feature production-ready before this phase.

## Validation Metrics

We should track:

- `EER` against a speaker verification model
- `WER` or intelligibility proxy
- `RTF` real-time factor
- end-to-end added latency
- dropout/recovery rate
- user fallback rate from neural mode to effects mode

## Env Model

- `VOICE_WORKER_ENABLED`
- `VOICE_WORKER_LIVE_READY`
- `VOICE_WORKER_WS_URL`
- `VOICE_WORKER_HEALTH_URL`
- `VOICE_WORKER_PUBLIC_WS_URL`
- `VOICE_WORKER_SHARED_SECRET`
- `VOICE_WORKER_BROWSER_TOKEN`
- `VOICE_WORKER_TIMEOUT_MS`
- `VOICE_WORKER_CHUNK_MS`
- `VOICE_WORKER_VAD_ENABLED`
- `VOICE_WORKER_VAD_THRESHOLD`
- `VOICE_WORKER_PSEUDO_SPEAKER_POLICY`
- `VOICE_WORKER_DSP_ENABLED`
- `VOICE_WORKER_DSP_PRESET`
- `VOICE_WORKER_DSP_PITCH_RATIO`
- `VOICE_WORKER_DSP_RING_HZ`
- `VOICE_WORKER_DSP_RING_DEPTH`
- `VOICE_WORKER_DSP_NOISE_FLOOR`
- `VOICE_WORKER_DSP_DRIVE`
- `VOICE_WORKER_DSP_LOWPASS_HZ`
- `VOICE_WORKER_DSP_HIGHPASS_HZ`
- `VOICE_WORKER_DSP_FORMANT_WARP`
- `VOICE_WORKER_DSP_CADENCE_DEPTH`
- `VOICE_WORKER_DSP_DELAY_JITTER_MS`

## Immediate Next Step

The next build step should be a transport-first implementation:

1. Add a dedicated `voice-worker` service folder.
2. Define the browser-to-worker chunk protocol.
3. Wire a browser client that can publish returned audio instead of raw mic
   audio.
4. Keep the current DSP path as fallback until the neural worker proves
   healthier and stronger.

That is the shortest path from “research” to something this codebase can
actually validate.
