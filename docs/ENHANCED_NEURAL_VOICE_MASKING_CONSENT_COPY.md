# Enhanced Neural Voice Masking Consent Copy

**Date:** July 5, 2026  
**Document Type:** Product copy artifact  
**Status:** Draft for legal, security, and product review  
**Scope:** Participant-facing consent, status, and fallback copy for Enhanced Neural Masking

---

## Review Position

This copy is written for the current implementation plan, where Enhanced Neural
Masking is an opt-in voice masking mode that sends live microphone frames to a
H.I.P.S.-controlled voice worker and publishes only the returned transformed
track to the session.

Do not use stronger claims until benchmark gates are met. Approved launch
language should say "voice masking" or "Enhanced Neural Masking," not
"anonymous voice guaranteed," "untraceable," or "biometric protection."

## Core Consent

Use this copy anywhere a participant explicitly enables Enhanced Neural
Masking.

> Enhanced Neural Masking sends your microphone audio to a H.I.P.S.-controlled
> voice worker for live conversion. H.I.P.S. does not record this audio, use it
> for training, or publish your raw microphone track to the session. If Enhanced
> Neural Masking is unavailable or fails, your microphone stays off until you
> choose Effects Mode or try again.

## Checkbox Copy

The checkbox must be explicit opt-in and must not be preselected.

> I understand that Enhanced Neural Masking sends my microphone audio to a
> H.I.P.S.-controlled voice worker for live conversion.

Optional second checkbox if product/legal wants a separate fallback
acknowledgement:

> I understand that if Enhanced Neural Masking is unavailable, my microphone
> will stay off until I choose Effects Mode or try again.

## Short Modal Copy

Use this in a pre-session confirmation modal or voice setup panel.

**Title:** Enable Enhanced Neural Masking?

**Body:** Enhanced Neural Masking processes your live microphone audio through a
H.I.P.S.-controlled voice worker. We do not record this audio, use it for
training, or publish your raw microphone track to the session.

**Primary action:** Enable Enhanced Neural Masking

**Secondary action:** Use Effects Mode

## Expanded Detail Copy

Use this behind a "Learn more" disclosure, privacy detail panel, or review
screen.

Enhanced Neural Masking is designed to keep your source microphone track out of
the session. Your browser sends live audio frames to a H.I.P.S.-controlled voice
worker. The worker returns transformed audio, and the app publishes that
transformed track to the session.

H.I.P.S. does not record live masking audio, use it for model training, or store
raw speaker embeddings. Operational logs should contain only status, timing, and
aggregate health data.

If the voice worker is unavailable, loses connection, or fails during startup,
your microphone stays off. You can try Enhanced Neural Masking again or choose
Effects Mode, which applies lighter masking in your browser.

## Mode Labels

| State | Label | Helper Copy |
|---|---|---|
| Browser DSP selected | Effects Mode | Lower-latency browser voice effects. |
| Neural selected before connection | Enhanced Neural connecting | Checking the voice worker before your mic turns on. |
| Neural active | Enhanced Neural active | Your transformed voice is being published. |
| Neural unavailable | Enhanced Neural unavailable | Your microphone is off. Try again or choose Effects Mode. |
| Neural failed during startup | Enhanced Neural failed | Your microphone stayed off because the worker did not start. |

## Failure And Fallback Copy

Use failure copy only when the app has already stopped the source microphone
track or prevented publication.

**Worker not ready**

> Enhanced Neural Masking is not available right now. Your microphone is off.
> You can try again or choose Effects Mode.

**Worker startup failed**

> Enhanced Neural Masking could not start. Your microphone is off, and your raw
> microphone track was not published.

**Connection lost**

> Enhanced Neural Masking disconnected. Your microphone is off until you try
> again or choose Effects Mode.

**DSP fallback prompt**

> Effects Mode runs in your browser and does not use the voice worker. It is a
> fallback masking option while Enhanced Neural Masking is unavailable.

## Tooltip Copy

**Enhanced Neural Masking**

> Sends live microphone audio to a H.I.P.S.-controlled worker and publishes the
> transformed track only.

**Effects Mode**

> Applies lighter voice effects in your browser.

**Raw track protection**

> In Enhanced Neural Masking, the source microphone track should not be
> published to the session.

## Copy Guardrails

Approved phrasing:

- Enhanced Neural Masking
- voice masking
- transformed voice
- source microphone track
- H.I.P.S.-controlled voice worker
- not recorded
- not used for training
- microphone stays off

Do not use:

- "anonymous voice guaranteed"
- "untraceable"
- "biometric proof"
- "impossible to identify"
- "military-grade"
- "HIPAA-grade"
- "real-person voice clone"
- "sounds like [person]"
- any service wording that conflicts with `docs/COPY_POLICY.md`

## Legal And Security Review Checklist

- Consent is explicit opt-in and never preselected.
- Consent copy states that live audio is sent to a H.I.P.S.-controlled worker.
- Copy states that raw audio is not recorded or used for training.
- Copy states that the raw microphone track is not published to the session.
- Failure copy says the microphone is off before offering fallback choices.
- Effects Mode is described as a fallback, not as strong identity protection.
- No stronger anonymity claim ships before EER/WER/UAR/latency gates are met.
- Recording consent remains separate from masking consent.
- Logging language matches `docs/DATA_RETENTION_POLICY.md` and
  `docs/SECURITY_POLICY.md`.
- Beta approval includes product, legal, and security signoff.
