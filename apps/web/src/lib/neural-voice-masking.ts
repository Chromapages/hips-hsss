import 'server-only';

type NeuralVoiceMaskingConfig = {
  enabled: boolean;
  provider: 'w-okada';
  baseUrl: string | null;
  publicBaseUrl: string | null;
  runtime: string;
  liveReady: boolean;
  sharedSecretConfigured: boolean;
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
  const baseUrl = process.env.NEURAL_VOICE_CHANGER_URL?.trim() || null;
  const publicBaseUrl = process.env.NEURAL_VOICE_CHANGER_PUBLIC_URL?.trim() || null;

  return {
    enabled: process.env.NEURAL_VOICE_MASKING_ENABLED === 'true' && Boolean(baseUrl),
    provider: 'w-okada',
    baseUrl,
    publicBaseUrl,
    runtime: process.env.NEURAL_VOICE_CHANGER_RUNTIME?.trim() || 'unknown',
    liveReady: process.env.NEURAL_VOICE_CHANGER_LIVE_READY === 'true',
    sharedSecretConfigured: Boolean(process.env.NEURAL_VOICE_CHANGER_SHARED_SECRET),
    timeoutMs: parseTimeout(process.env.NEURAL_VOICE_CHANGER_TIMEOUT_MS),
  };
}

export async function checkNeuralVoiceMaskingHealth(): Promise<{
  configured: boolean;
  reachable: boolean;
  statusCode?: number;
  latencyMs?: number;
  error?: string;
}> {
  const config = getNeuralVoiceMaskingConfig();
  if (!config.enabled || !config.baseUrl) {
    return { configured: false, reachable: false };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(config.baseUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        ...(process.env.NEURAL_VOICE_CHANGER_SHARED_SECRET
          ? { Authorization: `Bearer ${process.env.NEURAL_VOICE_CHANGER_SHARED_SECRET}` }
          : {}),
      },
    });

    return {
      configured: true,
      reachable: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - startedAt,
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
