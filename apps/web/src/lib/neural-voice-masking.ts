import 'server-only';

type NeuralVoiceMaskingConfig = {
  enabled: boolean;
  provider: 'voice-worker';
  healthUrl: string | null;
  publicWsUrl: string | null;
  runtime: string;
  liveReady: boolean;
  sharedSecretConfigured: boolean;
  jwtConfigured: boolean;
  browserToken: string | null;
  timeoutMs: number;
};

function parseTimeout(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 500 || parsed > 30_000) {
    return 2_500;
  }
  return parsed;
}

export function getNeuralVoiceMaskingConfig(): NeuralVoiceMaskingConfig {
  const privateWsUrl = process.env.VOICE_WORKER_WS_URL?.trim() || null;
  const healthUrl =
    process.env.VOICE_WORKER_HEALTH_URL?.trim() ||
    deriveHealthUrl(privateWsUrl) ||
    null;
  const publicWsUrl = process.env.VOICE_WORKER_PUBLIC_WS_URL?.trim() || null;
  const browserToken = process.env.VOICE_WORKER_BROWSER_TOKEN?.trim() || null;
  const jwtConfigured = Boolean(
    process.env.VOICE_WORKER_JWT_SECRET?.trim() ||
    process.env.SERVICE_JWT_SECRET?.trim() ||
    process.env.VOICE_WORKER_SHARED_SECRET?.trim()
  );

  return {
    enabled: process.env.VOICE_WORKER_ENABLED === 'true' && Boolean(healthUrl),
    provider: 'voice-worker',
    healthUrl,
    publicWsUrl,
    runtime: process.env.VOICE_WORKER_RUNTIME?.trim() || 'transport-passthrough-vad',
    liveReady: process.env.VOICE_WORKER_LIVE_READY === 'true',
    sharedSecretConfigured: Boolean(process.env.VOICE_WORKER_SHARED_SECRET),
    jwtConfigured,
    browserToken: jwtConfigured ? null : browserToken,
    timeoutMs: parseTimeout(process.env.VOICE_WORKER_TIMEOUT_MS),
  };
}

export async function checkNeuralVoiceMaskingHealth(): Promise<{
  configured: boolean;
  reachable: boolean;
  statusCode?: number;
  latencyMs?: number;
  workerLiveReady?: boolean;
  error?: string;
}> {
  const config = getNeuralVoiceMaskingConfig();
  if (!config.enabled || !config.healthUrl) {
    return { configured: false, reachable: false };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(config.healthUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null) as { liveReady?: unknown } | null;

    return {
      configured: true,
      reachable: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - startedAt,
      workerLiveReady: Boolean(data?.liveReady),
    };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function deriveHealthUrl(wsUrl: string | null): string | null {
  if (!wsUrl) return null;

  try {
    const parsed = new URL(wsUrl);
    parsed.protocol = parsed.protocol === 'wss:' ? 'https:' : 'http:';
    parsed.pathname = '/health';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}
