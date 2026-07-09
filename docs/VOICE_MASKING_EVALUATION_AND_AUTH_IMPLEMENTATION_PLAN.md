# Voice Masking Evaluation And Auth Implementation Plan

**Date:** July 5, 2026  
**Document Type:** Focused implementation plan artifact  
**Status:** Draft for engineering, security, product, and legal review  
**Scope:** Next execution sequence after the alpha voice masking architecture

---

## Purpose

The current H.I.P.S. voice masking system has the correct alpha architecture:

```text
mic -> browser chunker -> voice worker -> returned processed audio -> rebuilt track -> LiveKit publish
```

The next work should make that architecture measurable and reviewable before a
real neural model is swapped in. This plan prioritizes evaluation adapters,
worker authentication, and runtime assurance over model replacement.

## Current Baseline

Already implemented:

- Browser Effects Mode DSP.
- Voice worker streaming path with CPU DSP.
- Neural-mode publication guard that prevents raw mic publication on known
  readiness and startup failures.
- Synthetic DSP smoke benchmark under `tools/voice-eval/`.
- Consent copy artifact for Enhanced Neural Masking.
- CSP fix allowing generated AudioWorklet Blob modules.

Still missing:

- Real ASV/EER scoring.
- Real ASR/WER scoring.
- VoicePrivacy/VoicePAT-compatible evaluation exports.
- Short-lived worker WebSocket tokens.
- Production observability for fallback, dropped frames, latency, and
  raw-publish-block events.
- Validated neural anonymization model or sidecar.

## Source Assessment

| Tool / Source | Use | Assessment |
|---|---|---|
| [VoicePAT](https://github.com/DigitalPhonetics/VoicePAT) | Voice privacy evaluation and anonymization research toolkit | Strong fit for broader benchmark compatibility. Apache-2.0. Still marked under construction, so use as adapter/reference first. |
| [jiwer](https://github.com/jitsi/jiwer) | WER/MER/WIL/WIP/CER scoring | Best first utility adapter. Lightweight Python package, Apache-2.0, easy to wrap around Whisper or another ASR output. |
| [NVIDIA NeMo ECAPA-TDNN](https://catalog.ngc.nvidia.com/orgs/nvidia/nemo/models/ecapa_tdnn) | Speaker verification embeddings and ASV attacker baseline | Good first EER attacker. Accepts 16 kHz mono WAV, returns speaker embeddings, reports strong VoxCeleb EER. Requires model license review. |
| [DigitalPhonetics speaker-anonymization](https://github.com/DigitalPhonetics/speaker-anonymization) | Offline neural anonymization candidate/reference | Useful research candidate. GPL-3.0 and offline ASR/TTS-style architecture make it a benchmark candidate, not an immediate product runtime. |
| VoicePrivacy baselines | Standard challenge comparison | Useful for sanity-checking H.I.P.S. scores against known privacy/utility tradeoffs. |

Correction from the proposal: VoicePAT should not be described simply as
"Kaldi-based ECAPA." Its repo says evaluation moved toward SpeechBrain and
ESPnet models, while ASR evaluation still has ESPnet/Kaldi involvement.

## Execution Sequence

### Step 1: Wire Consent Copy Into UI

**Goal:** Make Enhanced Neural Masking opt-in behavior visible before any
participant can select it.

Tasks:

- Add the core consent copy from
  `docs/ENHANCED_NEURAL_VOICE_MASKING_CONSENT_COPY.md` to the pre-session voice
  setup flow.
- Ensure the Enhanced Neural checkbox is not preselected.
- Add mode labels for:
  - Effects Mode
  - Enhanced Neural connecting
  - Enhanced Neural active
  - Enhanced Neural unavailable
  - Enhanced Neural failed
- Use fail-closed warning copy when neural startup fails or worker readiness is
  false.
- Keep recording consent separate from masking consent.

Exit criteria:

- A participant cannot enable Enhanced Neural Masking without explicit consent.
- Failure states say the microphone is off before offering Effects Mode.
- Copy avoids stronger anonymity claims.

### Step 2: Add WER Adapter First

**Goal:** Measure whether masking preserves intelligible content.

Why first:

- It is the fastest real metric to add.
- It validates the evaluation runner shape before heavier ASV dependencies.
- It gives immediate feedback on the current DSP baseline.

Tasks:

- Add a Python adapter boundary under `tools/voice-eval/adapters/asr/`.
- Accept a manifest with:
  - original transcript
  - candidate audio path
  - language
  - sample rate
- Run ASR transcription through a configurable provider:
  - default local/offline placeholder
  - future Whisper adapter
  - future VoicePAT/ESPnet path
- Score transcript output with `jiwer`.
- Emit:
  - corpus WER
  - per-utterance WER
  - insertion/deletion/substitution counts where available
  - transcript artifacts in ignored run output

Exit criteria:

- `metrics.json` includes non-null `wer` for a licensed local manifest.
- Synthetic smoke runs still work without ASR dependencies.
- The adapter can be disabled when ASR tooling is not installed.

### Step 3: Add ECAPA-TDNN ASV/EER Adapter

**Goal:** Establish first real speaker leakage numbers for current DSP.

Tasks:

- Add `tools/voice-eval/adapters/asv/`.
- Normalize evaluation audio to 16 kHz mono WAV for ECAPA-compatible models.
- Extract speaker embeddings for:
  - clean enrollment audio
  - original trial audio
  - masked trial audio
- Compute cosine similarity scores.
- Compute EER from target and non-target trial scores.
- Support at least:
  - lazy-informed condition
  - semi-informed condition
  - same-gender and cross-gender trial grouping where manifest data supports it
- Start with NeMo ECAPA-TDNN or SpeechBrain ECAPA, subject to license and
  dependency review.

Exit criteria:

- `metrics.json` includes non-null `eer.lazyInformed` and
  `eer.semiInformed` for a licensed local manifest.
- Current CPU DSP has a recorded EER baseline.
- The release score uses the lowest EER across configured attackers.

### Step 4: Add VoicePAT Compatibility

**Goal:** Make H.I.P.S. evaluation runs comparable with voice privacy research
tooling without making VoicePAT a hard runtime dependency.

Tasks:

- Export H.I.P.S. manifests into the Kaldi-style or VoicePAT-compatible file
  structure needed by the selected evaluation configs.
- Import VoicePAT evaluation outputs into H.I.P.S. `metrics.json`.
- Document dataset preparation requirements and ignored local paths.
- Keep source audio and derived audio out of git.
- Add a `system.json` field that records:
  - candidate name
  - masking mode
  - model/checkpoint identifier
  - dependency versions
  - run timestamp

Exit criteria:

- A benchmark run can be reproduced from manifest plus local dataset path.
- VoicePAT can be run externally and its outputs mapped back into H.I.P.S.
  reports.
- H.I.P.S. runner remains usable without VoicePAT installed.

### Step 5: Implement Short-Lived Worker JWT Auth

**Goal:** Replace static browser worker tokens before beta.

Status: implemented for the worker stream path, with participant authorization
and token refresh hardening still tracked as follow-up work.

Target shape:

```text
browser -> Next.js token endpoint -> short-lived worker JWT
browser -> voice worker WebSocket upgrade with JWT
voice worker -> validate signature, audience, session, scope, expiry
```

Tasks:

- [x] Add a Next.js route that mints short-lived voice-worker tokens for a
  session and participant identity.
- [x] Use scoped JWT signing with a dedicated audience and
  scope such as `voice-worker:stream`.
- [x] Include claims:
  - `sub`: anonymous participant/session identity
  - `aud`: voice worker
  - `scope`: voice-worker stream scope
  - `sessionId`
  - `jti`
  - `iat`, `exp`
- [x] Validate JWTs during WebSocket connection setup before processing audio.
- [x] Stop requiring static browser tokens when JWT signing is configured.
- [ ] Add route-level session authorization before token minting.
- [ ] Add reconnect behavior with exponential backoff and jitter.
- [ ] Decide whether refresh happens by:
  - minting a new token before reconnect, or
  - exchanging a refresh control message over an already-authorized socket.

Exit criteria:

- Static browser worker token is no longer needed when JWT signing is configured.
- Malformed, wrong-session, and wrong-scope tokens are rejected.
- Worker logs never contain raw JWTs.
- Token tests cover success, wrong session, wrong scope, and legacy fallback.

### Step 6: Add Runtime Observability

**Goal:** Turn one-time safety tests into production assurance.

Status: first signal slice implemented. The web app now emits structured
voice-masking safety events to a server route, and the worker exposes auth
accept/reject counters on `/health`. External dashboards and alerts remain.

Metrics:

- [ ] per-stage latency:
  - browser chunking
  - WebSocket send/receive
  - worker queue
  - model/DSP processing
  - track rebuild
  - publish
- [x] fallback/raw-publish-block event route and structured logging
- [ ] fallback-trigger count and reason in dashboard metrics
- [ ] dropped-frame count
- [ ] jitter buffer underruns
- [ ] worker reconnect count
- [x] raw-publish-block event count at the app log boundary
- [x] worker auth accept/reject counters
- [ ] active neural sessions

Alerts:

- raw-publish-block event after beta launch
- p95 latency over threshold
- fallback spike
- dropped-frame spike
- worker liveReady mismatch
- token validation failure spike

Exit criteria:

- Dashboards distinguish Effects Mode and Enhanced Neural Masking.
- Security-critical events are counted without logging audio or secrets.
- Ops can disable Enhanced Neural Masking with a feature flag.

### Step 7: Evaluate Neural Candidates

**Goal:** Replace CPU DSP only after the evaluation harness can prove the
replacement improves privacy without unacceptable utility loss.

Candidate order:

1. VoicePrivacy/VoicePAT reference baselines for comparison.
2. DigitalPhonetics speaker-anonymization as an offline benchmark candidate.
3. Quantized or streaming neural candidate if CPU latency is plausible.
4. GPU sidecar only if CPU cannot meet RTF and latency targets.

Tasks:

- Run each candidate through the same manifest.
- Compare:
  - EER by attacker and condition
  - WER delta
  - RTF
  - added latency
  - subjective quality notes
  - license/deployment constraints
- Reject candidates that improve privacy by destroying intelligibility.

Exit criteria:

- At least one neural candidate beats DSP meaningfully on EER.
- WER remains within product-approved limits.
- Legal/security approve model license, runtime, and data processing terms.
- Sidecar architecture decision is evidence-based.

## Implementation Backlog

| Priority | Status | Work Item | Primary Files / Areas | Output |
|---:|---|---|---|---|
| 1 | Done | Consent UI wiring | `apps/web/src/components/session-ui`, `SessionRoom.tsx` | Explicit opt-in and fail-closed copy |
| 2 | Done | WER adapter scaffold | `tools/voice-eval/adapters/asr`, `tools/voice-eval/src` | `wer` populated in `metrics.json` |
| 3 | Done | ECAPA ASV adapter scaffold | `tools/voice-eval/adapters/asv`, manifest trials | EER populated by condition |
| 4 | Done | VoicePAT export/import | `tools/voice-eval/README.md`, new adapter scripts | VoicePAT-compatible run artifacts |
| 5 | Done | Worker JWT minting | Next.js API route, `services/voice-worker` auth | Short-lived stream tokens |
| 6 | In Progress | Observability metrics | browser client, worker metrics, dashboards | Runtime assurance signals |
| 7 | Planned | Neural candidate evaluation | eval runner, sidecar prototype docs | model selection report |

## Dependency And License Review

Before adding heavy dependencies to the repo, review:

- package license
- model license
- checkpoint source and terms
- dataset license and consent status
- GPU/CPU runtime requirements
- whether the dependency belongs in:
  - app runtime
  - voice worker runtime
  - separate evaluation environment
  - local-only research workspace

Default rule: evaluation dependencies should stay out of the production web app
and voice worker containers unless they are explicitly needed at runtime.

## Release Gates Updated By This Plan

Alpha may continue with:

- synthetic DSP smoke metrics
- raw-publish regression tests
- consent copy drafted

Beta requires:

- consent UI wired
- non-null WER for current DSP and candidate neural model
- non-null EER for current DSP and candidate neural model
- short-lived worker JWT auth
- fallback and raw-publish-block observability
- legal/security approval

Production requires:

- multiple attacker models
- lowest-attacker EER above launch threshold
- WER and latency inside product thresholds
- feature flag rollback tested
- model and data-processing terms approved
- no raw audio persistence
- no raw audio or secrets in logs

## Next Three Engineering Moves

1. Add dashboard/alert wiring for the new raw-publish-block and worker-auth metrics.
2. Prepare real, licensed local evaluation manifests outside git.
3. Run the first real DSP baseline through WER, EER, and VoicePAT import/export.
