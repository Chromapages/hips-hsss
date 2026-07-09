# H.I.P.S. Voice Worker

Streaming worker for server-side voice masking.

This service is not a production neural anonymizer yet. It provides the shape
we need for streaming returned audio, plus a CPU-safe DSP masker:

- health endpoint at `GET /health`
- WebSocket stream endpoint at `/v1/stream`
- JSON control messages
- binary PCM16 audio frames
- simple RMS VAD gate
- stateful CPU DSP transform for speech frames
- silence for non-speech frames

## Local Development

```bash
corepack pnpm --filter @hips/voice-worker dev
```

Health check:

```bash
curl -s http://127.0.0.1:3010/health
```

## WebSocket Protocol

Connect to:

```text
ws://127.0.0.1:3010/v1/stream
```

In production, the browser should connect with a short-lived JWT minted by the
web app. The worker validates that token during the WebSocket upgrade before it
accepts audio frames.

```bash
VOICE_WORKER_JWT_SECRET=replace-with-strong-worker-jwt-secret
SERVICE_JWT_SECRET=optional-shared-service-jwt-secret
VOICE_WORKER_SHARED_SECRET=legacy-fallback-secret
VOICE_WORKER_BROWSER_TOKEN=legacy-static-browser-token
```

Pass the JWT as `?token=...` along with `sessionId` and
`participantIdentity`. `VOICE_WORKER_BROWSER_TOKEN` is only a legacy fallback
when JWT auth is not configured.

Send a start message before binary audio:

```json
{
  "type": "start",
  "sessionId": "session-id",
  "participantIdentity": "anon-participant",
  "sampleRate": 48000,
  "chunkMs": 43
}
```

Then send binary little-endian PCM16 mono frames. The worker returns binary
PCM16 frames. Every 50 frames it emits a metrics control message.

## CPU DSP Masker

Runtime `cpu-dsp-v1` applies a deterministic, stateful transform:

- modulated delay-line pitch/color shift
- high-pass and low-pass filtering
- formant-like nonlinear folding
- light ring modulation
- soft drive/compression
- low comfort-noise layer during speech
- persona presets from the browser start message
- optional anti-cadence gain and delay jitter
- VAD silence for non-speech frames

Useful env knobs:

```bash
VOICE_WORKER_DSP_ENABLED=true
VOICE_WORKER_DSP_PRESET=guardian
VOICE_WORKER_DSP_PITCH_RATIO=1.18
VOICE_WORKER_DSP_RING_HZ=37
VOICE_WORKER_DSP_RING_DEPTH=0.16
VOICE_WORKER_DSP_NOISE_FLOOR=0.0045
VOICE_WORKER_DSP_DRIVE=1.65
VOICE_WORKER_DSP_LOWPASS_HZ=4800
VOICE_WORKER_DSP_HIGHPASS_HZ=115
VOICE_WORKER_DSP_FORMANT_WARP=0.72
VOICE_WORKER_DSP_CADENCE_DEPTH=0.09
VOICE_WORKER_DSP_DELAY_JITTER_MS=2.5
```

Every 50 frames the worker emits `metrics` with `inputRmsAvg`,
`outputRmsAvg`, and `transformDeltaAvg`. Use those values while tuning:
the output should remain intelligible, while `transformDeltaAvg` should stay
well above zero during speech.

## Production Readiness

Do not set this worker as live-ready until:

- returned frames are meaningfully transformed and measured
- raw microphone tracks are not published in enhanced mode
- end-to-end added latency is measured
- speaker identity leakage is tested
