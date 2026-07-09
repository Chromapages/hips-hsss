# Neural Voice Masking VPS POC

## Decision

The browser DSP voice mask is not strong enough to be the product-grade privacy
voice. It changes pitch, echo, and space, but the speaker can still sound like
themselves. Browser DSP should stay as the low-latency fallback. The stronger
path is an opt-in neural voice conversion backend.

## Target

Use `w-okada/voice-changer` as the first proof-of-concept backend for
Enhanced Neural Masking.

It supports a networked server/client mode, Docker, Linux, browser access, REST
control APIs, and real-time voice conversion models such as RVC and Beatrice.
Model and voice-data licenses must be reviewed separately before production use.

## Privacy Boundary

Local DSP:

- Raw microphone audio remains in the browser before LiveKit publishing.
- Lowest privacy risk.
- Lower masking strength.

Enhanced Neural Masking:

- Raw microphone audio is sent to a H.I.P.S.-controlled voice conversion server.
- Stronger masking potential.
- Must be opt-in and disclosed.
- Must use TLS, short-lived auth, no recording, no model training from sessions,
  no request body logging, and no persistent audio buffers.

## VPS Shape

Recommended POC server:

- Ubuntu 22.04 or 24.04
- NVIDIA GPU preferred
- Docker + NVIDIA Container Toolkit
- `deploy/voice-changer/docker-compose.yml`
- Port `18888` bound only to localhost or a private network when possible
- Reverse proxy terminates TLS and enforces auth before traffic reaches the
  voice changer service

CPU-only mode can be tested with the base compose file, but it should be
considered a smoke test, not a production capacity target. For NVIDIA GPU
testing, add the `docker-compose.gpu.yml` override.

Current VPS finding:

- The VPS is Linux `x86_64` with 2 vCPUs and no visible GPU.
- The old `dannadori/vcclient:20230826_211406` container reaches HTTP 200 on
  `127.0.0.1:18888`.
- The current upstream VCClient v2 GitHub branch is documentation-only for this
  deployment purpose.
- The packaged Beatrice v2 Linux artifact found upstream is ARM64
  (`vcclient_std_lin_aarch64_2.2.2-beta_only_beatrice.zip`), not x86_64.
- Therefore this VPS can host the status/control smoke test, but it is not yet
  a working Beatrice v2 live masking server.

## Environment

The implemented H.I.P.S. worker path uses the `VOICE_WORKER_*` environment
model. The older `NEURAL_VOICE_CHANGER_*` names below are legacy POC
terminology for the raw `w-okada/voice-changer` experiment and should not be
used for the current browser-to-worker returned-audio path.

Current voice worker path:

```bash
VOICE_WORKER_ENABLED=true
VOICE_WORKER_WS_URL=ws://127.0.0.1:3010/v1/stream
VOICE_WORKER_HEALTH_URL=http://127.0.0.1:3010/health
VOICE_WORKER_PUBLIC_WS_URL=wss://voice-worker.example.com/v1/stream
VOICE_WORKER_RUNTIME=cpu-dsp-v1
VOICE_WORKER_LIVE_READY=false
VOICE_WORKER_JWT_SECRET=replace-with-strong-worker-jwt-secret
VOICE_WORKER_SHARED_SECRET=legacy-fallback-secret
VOICE_WORKER_BROWSER_TOKEN=legacy-static-browser-token
VOICE_WORKER_TIMEOUT_MS=2500
```

Use `VOICE_WORKER_JWT_SECRET` for the production path. The web app mints a
short-lived stream token and the worker validates it during WebSocket upgrade.
`VOICE_WORKER_BROWSER_TOKEN` is retained only as a local or legacy fallback.

Legacy voice-changer POC:

Web app:

```bash
NEURAL_VOICE_MASKING_ENABLED=true
NEURAL_VOICE_CHANGER_URL=http://127.0.0.1:18888
NEURAL_VOICE_CHANGER_PUBLIC_URL=https://voice-mask.example.com
NEURAL_VOICE_CHANGER_RUNTIME=legacy-vcclient-v1
NEURAL_VOICE_CHANGER_LIVE_READY=false
NEURAL_VOICE_CHANGER_SHARED_SECRET=replace-with-strong-shared-secret
NEURAL_VOICE_CHANGER_TIMEOUT_MS=2500
LIVEKIT_VOICE_MASKING_AGENT_ENABLED=false
LIVEKIT_VOICE_MASKING_AGENT_NAME=hips-voice-masker
```

Voice changer VPS:

```bash
VOICE_CHANGER_PORT=18888
VOICE_CHANGER_EXTERNAL_IP=127.0.0.1
VOICE_CHANGER_ALLOWED_ORIGIN=https://your-app-domain.example
```

## POC Stages

1. Bring up `w-okada/voice-changer` on the VPS with one approved test model.
2. Confirm `/api/voice-masking/status` reports the service as configured and
   reachable.
3. Replace the legacy container with a licensed x86_64 CPU-compatible neural
   masking runtime, or move this service to a host matching the available
   Beatrice v2 runtime.
4. Measure one-user latency and quality outside LiveKit.
5. Build a dedicated LiveKit audio bridge/agent that receives raw mic audio from
   an opted-in participant and republishes only converted audio.
6. Run a two-person LiveKit test room and measure end-to-end delay.
7. Add product copy and consent language for server-side voice processing.
8. Security review before opening to real users.

## Implemented Guardrails

- `/api/voice-masking/status` reports `runtime`, `liveReady`, and
  `readyForSessionUse`.
- `/api/voice-masking/agent/dispatch` creates a LiveKit Agent dispatch only
  when `LIVEKIT_VOICE_MASKING_AGENT_ENABLED=true` and the neural backend is
  marked live-ready.
- Browser session code now refuses to publish in server-neural fallback mode
  while `readyForSessionUse=false`, preventing an accidental raw-audio leak into
  the room.

## Go / No-Go Metrics

- Median added latency under 250 ms for one user.
- No raw track is published to other participants during neural mode.
- No audio files are written to disk by default.
- Service restart does not leave a participant publishing raw audio.
- Model license allows this use.
- User can fall back to local DSP if the neural backend is unavailable.

## Notes

This POC deliberately avoids wiring direct browser access to the raw
`w-okada/voice-changer` UI as the final product path. The production path should
be a narrow H.I.P.S. voice-masking service or agent that controls auth,
observability, lifecycle, and privacy guarantees.
