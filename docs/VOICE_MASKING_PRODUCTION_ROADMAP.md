# Voice Masking Production Roadmap

**Date:** July 5, 2026  
**Document Type:** Implementation plan artifact  
**Status:** Draft for engineering, product, legal, and security review  
**Scope:** H.I.P.S. voice masking from local DSP fallback to validated production-grade speaker anonymization

---

## Executive Summary

H.I.P.S. now has the right streaming shape for production voice anonymization:

`mic -> browser chunker -> voice worker -> returned processed audio -> rebuilt MediaStreamTrack -> LiveKit publish`

That transport architecture is the hard part to get aligned with the product's privacy boundary. The current masking model, however, is still CPU DSP. It should remain the low-latency fallback and validation control, not the production privacy target.

The next roadmap must therefore prioritize three things:

1. A VoicePrivacy-style evaluation harness before any stronger claims are made.
2. A real neural speaker de-identification backend behind the existing worker boundary.
3. Operational, consent, security, and fallback gates that prove raw audio cannot leak into sessions.

## Current Repo State

### Implemented

- Local browser DSP voice masking exists in `apps/web/src/lib/voice-mask-processor.ts`.
- A dedicated voice worker exists in `services/voice-worker/` with:
  - `GET /health`
  - WebSocket `/v1/stream`
  - JSON control messages
  - binary PCM16 frame streaming
  - RMS VAD
  - CPU DSP masking
  - worker metrics
- Browser returned-audio plumbing exists:
  - `apps/web/src/lib/streaming-voice-client.ts`
  - `apps/web/src/lib/voice-track-rebuilder.ts`
  - `apps/web/src/hooks/session/useNeuralVoiceMasking.ts`
- The primary session path in `apps/web/src/components/session/SessionRoom.tsx` blocks neural mode unless worker readiness passes, then publishes the rebuilt returned track rather than the source mic track.
- `/api/voice-masking/status` exposes readiness based on env configuration, worker health, public WebSocket URL, worker `liveReady`, and browser-token availability.
- The avatar creator now stores voice/avatar preferences locally and can broadcast non-identifying avatar/voice attributes through LiveKit participant attributes.

### Not Yet Production-Ready

- The worker is not a production neural anonymizer. Its own README states this directly.
- CPU DSP is vulnerable to reverse engineering and should not be sold as strong speaker de-identification.
- There is no automated EER/WER/UAR benchmark harness.
- There are no regression tests proving raw mic tracks cannot be published during DSP processor failures or neural worker failures.
- Older `useVoiceConnection.ts` still treats neural mode as unavailable; it should be retired, proven unused, or brought to parity.
- Some docs still use older `NEURAL_VOICE_CHANGER_*` env names while the implemented worker path uses `VOICE_WORKER_*`.

## Research Baseline

The roadmap should use VoicePrivacy-style metrics and current research as guide rails, not as marketing promises.

### Key Sources

- [DarkStream: real-time speech anonymization with low latency](https://arxiv.org/abs/2509.04667)
- [The Third VoicePrivacy Challenge](https://arxiv.org/abs/2601.11846)
- [The First VoicePrivacy Attacker Challenge](https://arxiv.org/abs/2504.14183)
- [VoicePrivacy 2026](https://www.voiceprivacychallenge.org/vp2026/)
- [DigitalPhonetics/speaker-anonymization](https://github.com/DigitalPhonetics/speaker-anonymization)

### Metrics We Should Adopt

| Metric | Meaning | Direction |
|---|---|---|
| EER | Equal Error Rate from speaker verification attacker | Higher is better |
| WER | Word Error Rate from ASR | Lower is better |
| UAR | Unweighted Average Recall for emotion preservation | Higher is better |
| RTF | Real-time factor for inference | Must be `< 1.0` |
| Added latency | Browser capture to published transformed audio | Lower is better |
| MOS | Human listening quality | Higher is better |

### Benchmark Snapshot

Use these numbers as orientation, not as H.I.P.S. claims. They come from current
research and challenge materials, while H.I.P.S. must measure its own stack.

| System / Source | Privacy Signal | Utility / Latency Signal | Roadmap Meaning |
|---|---|---|---|
| Current H.I.P.S. CPU DSP worker | not yet measured locally | real-time transport exists | fallback/control only |
| VoicePrivacy 2026 Track 1 DSP/McAdams baseline | low single-digit EER in challenge materials | materially higher WER than original speech | DSP is not production privacy |
| VoicePrivacy 2026 Track 1 neural baselines | roughly mid-teens to low-20s EER in available baseline materials | WER/UAR tradeoffs vary | first realistic target band |
| VoicePrivacy 2024 strong systems | some systems reported `> 40%` EER | best systems still trade privacy vs emotion/content | aspirational, must survive stronger attackers |
| VoicePrivacy Attacker Challenge | stronger attackers reduced EER substantially | privacy can be overestimated by weak ASV | release gate must use multiple attackers |
| DarkStream | near-chance lazy-informed EER with quantization; lower semi-informed EER | about `203 ms` GPU latency at `140 ms` lookahead, CPU RTF about `0.258` | best streaming architecture signal |
| DigitalPhonetics pipeline | useful offline anonymization reference | not designed as low-latency product path | prototype/reference, not final runtime |

### Benchmark Lessons

- Signal-processing baselines are weak privacy controls. VoicePrivacy 2026 reports a DSP/McAdams-style baseline around low single-digit EER in Track 1 evaluation, which is not acceptable for H.I.P.S. production privacy.
- DarkStream is the most relevant streaming reference: causal encoder, limited lookahead, contextual layers, pseudo-speaker embeddings, and direct waveform synthesis.
- DarkStream reports roughly 203 ms GPU end-to-end latency at 140 ms lookahead, CPU RTF around 0.258, lazy-informed EER near chance with quantization, and much lower semi-informed EER. This means the attack model matters.
- The VoicePrivacy Attacker Challenge showed that stronger attackers can materially reduce reported privacy. H.I.P.S. should treat the lowest EER across attackers as the release score.
- The DigitalPhonetics pipeline is useful as an offline reference/prototype path, but it is not the low-latency production architecture and has license/dependency implications that require review.

## Product Contract

The product should keep two clear tiers.

### Tier 1: Effects Mode

- Browser-side DSP.
- Lowest latency.
- Useful when the worker is down or when a participant does not opt into server-side audio processing.
- Must be described as a fallback/lightweight masking mode, not strong biometric anonymization.

### Tier 2: Enhanced Neural Masking

- Explicit opt-in.
- Raw mic audio streams to a H.I.P.S.-controlled worker only for live transformation.
- Raw audio is not recorded, logged, persisted, or used for training.
- Only returned transformed audio is published to LiveKit.
- If the worker is not ready or fails, the app must fail closed and require an explicit switch to Effects Mode.

Suggested consent copy:

> Enhanced Neural Masking sends your microphone audio to a H.I.P.S.-controlled voice worker for live conversion. We do not record this audio, use it for training, or publish your raw microphone track to the session. If Enhanced Neural Masking is unavailable, your microphone will stay off until you choose Effects Mode or try again.

## Target Production Architecture

```text
Browser
  mic capture
  source track kept local
  PCM chunker
  worker auth token
  returned-frame jitter buffer
  MediaStreamTrack rebuilder
  publish transformed track only

Next.js control plane
  readiness API
  short-lived worker token minting
  session authorization
  feature flags
  audit events without audio

Voice worker gateway
  WSS streaming endpoint
  per-session state
  VAD
  frame sequencing
  latency metrics
  no audio persistence
  model sidecar RPC

Neural inference sidecar
  content encoder
  speaker identity suppression
  pseudo-speaker embedding
  prosody/emotion preservation
  neural vocoder/decoder
  GPU-first runtime

Evaluation harness
  EER/WER/UAR/MOS/latency
  lazy-informed attackers
  semi-informed attackers
  attacker-adapted tests
```

## Implementation Plan

### Phase 0: Documentation And Naming Cleanup

**Goal:** Make the repo tell the truth about the current state.

Tasks:

- Update stale references in `docs/STREAMING_VOICE_ANON_IMPLEMENTATION_SPEC.md` that still list implemented files as "likely add next."
- Add `VOICE_WORKER_*` env naming to deployment docs and mark `NEURAL_VOICE_CHANGER_*` as legacy POC terminology.
- Add a short "do not claim production anonymization" note to user-facing copy until validation gates pass.
- Document which session path is canonical and decide whether `useVoiceConnection.ts` should be retired or brought to parity.

Exit criteria:

- Docs identify the current state as "transport + CPU DSP worker," not "neural anonymizer."
- Deployment docs use the implemented env names.
- Product copy avoids strong anonymity claims for DSP.

### Phase 1: Automated Safety Regression Tests

**Goal:** Prove we do not publish raw audio in known failure paths.

Tasks:

- Add voice-worker protocol tests for:
  - invalid control messages
  - auth rejection
  - start-before-binary requirement
  - metrics after frame batches
  - silence behavior for VAD-negative frames
- Add readiness matrix tests for `/api/voice-masking/status`:
  - disabled worker
  - missing health URL
  - unreachable worker
  - worker not live-ready
  - missing public WS URL
  - missing browser token when shared secret is configured
  - fully ready path
- Add browser/session tests proving:
  - DSP processor failure stops the raw track and does not publish it
  - neural readiness failure stops the source track and leaves mic disabled
  - neural worker startup failure does not publish the source track
  - successful neural mode publishes only the rebuilt returned track

Exit criteria:

- CI fails if raw-track protection regresses.
- No path silently downgrades from neural to raw audio.

### Phase 2: Benchmark Harness

**Goal:** Measure privacy, utility, and latency before integrating heavier models.

Tasks:

- Create an evaluation workspace, for example `tools/voice-eval/`, with a manifest format for datasets, models, and outputs.
- Implement batch processing against:
  - original audio
  - current local DSP
  - current voice-worker CPU DSP
  - future neural candidates
- Add ASV-based EER scoring with at least:
  - ECAPA-TDNN or comparable speaker verifier
  - WavLM/SSL-based speaker verifier
  - same-gender and cross-gender trials
  - lazy-informed and semi-informed conditions
- Add ASR WER scoring.
- Add emotion/prosody preservation scoring using UAR or an agreed proxy.
- Add latency measurement for:
  - browser chunk size
  - network transit
  - worker queue time
  - model inference time
  - returned-track jitter buffer
  - LiveKit publish path

Exit criteria:

- We can produce a benchmark report for every masking candidate.
- Current DSP has a recorded baseline score.
- Release gates are based on measured data, not perceived voice difference.

### Phase 3: Offline Neural Candidate Prototype

**Goal:** Learn the privacy/utility envelope before real-time pressure.

Tasks:

- Evaluate DigitalPhonetics-style ASR/TTS or related open pipelines offline.
- Review licenses, model weights, training data terms, and deployment constraints before using any model beyond internal research.
- Run benchmark harness on candidate outputs.
- Compare privacy/utility tradeoffs:
  - EER by attacker type
  - WER
  - UAR/emotion preservation
  - subjective listening quality
  - compute cost
- Decide whether to adapt, replace, or train a lighter streaming-specific model.

Exit criteria:

- At least one offline neural candidate beats DSP meaningfully on EER without unacceptable WER/UAR damage.
- Legal/security approves any model used beyond local research.
- A production inference direction is selected.

### Phase 4: Streaming Neural Sidecar

**Goal:** Replace CPU DSP inside the worker boundary with a real de-identification backend.

Tasks:

- Keep Node/TypeScript voice worker as the streaming gateway and control layer.
- Add a Python/PyTorch or equivalent inference sidecar for neural processing.
- Define a narrow sidecar protocol:
  - frame sequence number
  - sample rate
  - pseudo-speaker seed/id
  - persona/preset
  - anti-cadence flag
  - PCM input/output frames
  - per-stage latency
  - error/fallback code
- Implement pseudo-speaker policy:
  - stable within a session
  - regenerated across sessions
  - no raw speaker embedding persistence
  - similarity rejection against source embedding when available
- Add model paths for:
  - content encoder
  - identity-suppression bottleneck
  - pseudo-speaker generation
  - prosody/emotion preservation
  - neural decoder/vocoder
- Add GPU deployment profile and CPU smoke-test profile.

Exit criteria:

- RTF `< 1.0` under expected single-participant load.
- Median added latency `< 250 ms`; p95 `< 350 ms` for beta.
- Returned audio remains intelligible in manual tests.
- Benchmark harness confirms improvement over DSP.

### Phase 5: Attacker-Hardened Validation

**Goal:** Avoid shipping a model that only beats weak attackers.

Tasks:

- Add multiple ASV attackers:
  - ECAPA-TDNN
  - WavLM/SSL attacker
  - ResNet/WeSpeaker-style attacker
  - PLDA-style scoring where applicable
- Add adapted attackers trained/fine-tuned on anonymized outputs.
- Evaluate:
  - lazy-informed
  - semi-informed
  - cross-session linkability
  - same-session stability
  - accent/age/sex leakage proxies
  - noisy microphone conditions
  - low-bandwidth network conditions
- Run human listening tests for naturalness and perceived identity masking.

Exit criteria:

- The lowest attacker EER meets the chosen beta threshold.
- WER and UAR remain inside product thresholds.
- Human review finds no obvious source-speaker identity leakage for beta scenarios.

### Phase 6: Product Beta

**Goal:** Release Enhanced Neural Masking to a controlled internal or limited external beta.

Tasks:

- Add explicit opt-in UX.
- Add mode status that distinguishes:
  - Effects Mode
  - Enhanced Neural connecting
  - Enhanced Neural active
  - Enhanced Neural unavailable
  - fallback required
- Add a visible fail-closed warning when neural mode fails.
- Add telemetry for:
  - activation rate
  - worker connection success
  - fallback rate
  - p50/p95/p99 latency
  - dropped frames
  - reconnects
  - raw-publish-blocked events
  - user-reported quality issues
- Add operator runbook:
  - disable neural feature flag
  - rotate worker tokens
  - drain worker
  - restart sidecar
  - investigate latency spike
  - investigate privacy regression

Exit criteria:

- Legal approves consent and claims.
- Security approves worker auth, network boundaries, and logging.
- Product approves user-visible fallback behavior.
- Ops has dashboards and alerts.

### Phase 7: Production Launch

**Goal:** Make Enhanced Neural Masking generally available only after measurable privacy and reliability gates pass.

Hard launch gates:

- No raw microphone track is published in neural mode.
- No raw audio is written to disk.
- No raw audio payloads, transcripts, or secrets are logged.
- Worker auth uses short-lived scoped tokens, not static browser tokens.
- Model license and data processing terms are approved.
- p95 added latency stays under the launch threshold under expected load.
- Lowest attacker EER meets the launch threshold.
- WER and UAR remain inside accepted product thresholds.
- Feature flag rollback has been tested.
- Incident response runbook is reviewed.

## Release Thresholds

These should be refined after Phase 2 establishes our local baseline.

| Gate | Alpha | Beta | Production |
|---|---:|---:|---:|
| RTF | `< 1.0` | `< 0.75` | `< 0.5` preferred |
| Median added latency | `< 350 ms` | `< 250 ms` | `< 200-250 ms` |
| p95 added latency | `< 500 ms` | `< 350 ms` | `< 300-350 ms` |
| Semi-informed EER, lowest attacker | `> 15%` | `> 20%` | `> 30%`, stretch `> 40%` |
| Lazy-informed EER | `> 30%` | `> 40%` | near chance preferred |
| WER delta vs original | measured | acceptable in user tests | product-approved |
| UAR/emotion preservation | measured | no severe degradation | product-approved |
| Raw-publish regression tests | required | required | required |
| Legal/security signoff | required | required | required |

## Data, Privacy, And Security Rules

- Enhanced Neural Masking is opt-in.
- Source mic tracks stay local to the participant browser and worker stream; they are not published to LiveKit.
- Audio frames are in-memory only unless a separate explicit recording consent path is active.
- No request-body logging for worker traffic.
- No model training from live sessions.
- No persistent raw speaker embeddings.
- Pseudo-speaker identity is stable within a session and regenerated across sessions.
- Logs contain only session refs, anonymous participant identities, timings, status codes, and aggregate metrics.
- Browser worker access should move from static browser tokens to short-lived signed tokens before beta.
- TLS/WSS is mandatory outside local development.
- The voice worker and inference sidecar must be isolated from commerce and identity-vault systems.

## Observability Plan

Add metrics at every stage:

- browser capture started/stopped
- chunk size and sample rate
- worker connection open/close/error
- frames sent/received
- worker queue depth
- VAD speech/silence ratio
- per-stage latency
- RTF
- dropped frames
- jitter buffer underruns
- fallback reason
- raw-publish-blocked event count
- active neural sessions
- GPU memory and utilization
- model errors by code

Dashboards:

- Neural readiness overview
- Session audio health
- Privacy benchmark trend
- Latency and dropout trend
- Fallback reasons
- Worker fleet capacity

Alerts:

- worker liveReady mismatch
- p95 latency over threshold
- dropout spike
- fallback spike
- model error spike
- any raw-publish-blocked event after launch
- GPU saturation

## Avatar And Voice Creator Integration

The avatar creator should remain privacy-preserving and non-identifying.

Tasks:

- Keep voice persona names abstract. Avoid "sounds like" claims or real-person imitation.
- Lock voice/avatar settings at session start for stability.
- Allow explicit pre-session changes through the creator.
- Ensure active-speaker/avatar animation reflects the transformed track state in neural mode.
- Keep avatar state local or account-scoped without linking to sensitive session content.
- Do not infer or display protected traits from the chosen voice persona or avatar appearance.

## Open Decisions

| Decision | Options | Recommended Default |
|---|---|---|
| Neural runtime | adapt existing open pipeline, train custom streaming model, vendor model | prototype open/offline first, then streaming sidecar |
| Inference location | current VPS, GPU VM, managed GPU service | GPU-backed worker separate from web VPS |
| Worker auth | static token, short-lived signed token, session-bound token | short-lived session-bound token |
| Pseudo-speaker policy | per participant, per session, per utterance | per participant per session |
| Fallback behavior | automatic DSP, user-confirmed DSP, mic disabled | mic disabled, user-confirmed DSP |
| Launch claim | voice effects, voice masking, anonymization | "voice masking" until benchmarks support stronger language |

## Immediate Next Sprint

1. Done: add or update docs for current `VOICE_WORKER_*` architecture.
2. Done: add initial readiness/config tests for the voice-worker status model.
3. Done: create `tools/voice-eval/README.md` with metric definitions and dataset plan.
4. Done: add initial protocol and VAD tests for `services/voice-worker`.
5. Done: add raw-publish regression coverage around the session audio publishing guard.
6. Done: run current CPU DSP through the first synthetic smoke benchmark pass.
7. Done: remove unused `useVoiceConnection.ts` so the canonical `SessionRoom`
   path is the only voice publication path.
8. Done: draft Enhanced Neural consent copy for legal/security review.

## References

- [DarkStream: real-time speech anonymization with low latency](https://arxiv.org/abs/2509.04667)
- [The Third VoicePrivacy Challenge](https://arxiv.org/abs/2601.11846)
- [The First VoicePrivacy Attacker Challenge](https://arxiv.org/abs/2504.14183)
- [VoicePrivacy 2026](https://www.voiceprivacychallenge.org/vp2026/)
- [DigitalPhonetics/speaker-anonymization](https://github.com/DigitalPhonetics/speaker-anonymization)
- [Streaming Voice Anonymization Implementation Spec](./STREAMING_VOICE_ANON_IMPLEMENTATION_SPEC.md)
- [Neural Voice Masking VPS POC](./NEURAL_VOICE_MASKING_VPS_POC.md)
- [Enhanced Neural Voice Masking Consent Copy](./ENHANCED_NEURAL_VOICE_MASKING_CONSENT_COPY.md)
- [Voice Masking Evaluation And Auth Implementation Plan](./VOICE_MASKING_EVALUATION_AND_AUTH_IMPLEMENTATION_PLAN.md)
- [Security Policy](./SECURITY_POLICY.md)
- [Data Retention Policy](./DATA_RETENTION_POLICY.md)
