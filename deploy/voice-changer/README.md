# H.I.P.S. Voice Changer VPS POC

This folder is the deployment scaffold for testing `w-okada/voice-changer` as
the Enhanced Neural Masking backend.

## VPS Readiness

The current checked VPS responded over SSH. Docker, Docker Compose v1, and
Docker Compose v2 were installed during the CPU smoke-test setup. No NVIDIA GPU
was visible from the read-only checks.

That means this VPS can be used only for CPU smoke testing unless GPU hardware
or a GPU-capable host is added.

Current smoke-test state:

- `hips-voice-changer` container starts successfully.
- The service is bound to `127.0.0.1:18888`, not publicly exposed.
- `curl -I http://127.0.0.1:18888/` returns `HTTP/1.1 200 OK`.
- Pretrained weights were downloaded into `pretrain/`.
- The running web app returns `/api/voice-masking/status` and can see the
  localhost-only backend.
- This is a legacy VCClient/RVC smoke test, not a confirmed Beatrice v2 runtime.
- The checked VPS is `x86_64` with 2 vCPUs. The packaged Linux Beatrice v2
  artifact currently found upstream is ARM64, so it does not run on this VPS.

## CPU Smoke Test

```bash
cd /home/deploy/hips-hsss/deploy/voice-changer
cp .env.example .env
docker compose --env-file .env up -d
docker compose --env-file .env logs -f voice-changer
```

## NVIDIA GPU Test

Requires NVIDIA drivers, Docker, and NVIDIA Container Toolkit.

```bash
cd /home/deploy/hips-hsss/deploy/voice-changer
cp .env.example .env
docker compose --env-file .env -f docker-compose.yml -f docker-compose.gpu.yml up -d
docker compose --env-file .env -f docker-compose.yml -f docker-compose.gpu.yml logs -f voice-changer
```

## Web App Settings

After the backend is reachable from the web process:

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

Then verify:

```bash
curl -s https://your-app.example/api/voice-masking/status
```

## Production Notes

- Keep port `18888` private whenever possible.
- Put TLS and auth in front of any public endpoint.
- Use only licensed, non-impersonation persona models.
- Do not log request bodies or persist audio.
- Treat browser DSP as the fallback, not the quality target.
- Do not set `NEURAL_VOICE_CHANGER_LIVE_READY=true` until the backend is a
  tested low-latency conversion path and the LiveKit bridge publishes only the
  converted track.
- Do not set `LIVEKIT_VOICE_MASKING_AGENT_ENABLED=true` until a registered
  LiveKit Agent with the configured name is running. The web app now has a
  guarded dispatch endpoint at `/api/voice-masking/agent/dispatch`, but it
  deliberately refuses to publish server-neural audio while the backend is not
  live-ready.
