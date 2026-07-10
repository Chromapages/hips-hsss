import { NextResponse } from 'next/server';
import {
  checkNeuralVoiceMaskingHealth,
  getNeuralVoiceMaskingConfig,
} from '@/lib/neural-voice-masking';

export async function GET() {
  const config = getNeuralVoiceMaskingConfig();
  const health = await checkNeuralVoiceMaskingHealth();

  return NextResponse.json({
    neural: {
      enabled: config.enabled,
      provider: config.provider,
      configured: Boolean(config.healthUrl),
      runtime: config.runtime,
      liveReady: config.liveReady && Boolean(health.workerLiveReady),
      readyForSessionUse:
        config.enabled &&
        config.liveReady &&
        Boolean(health.workerLiveReady) &&
        health.reachable &&
        Boolean(config.publicWsUrl) &&
        (config.jwtConfigured || !config.sharedSecretConfigured || Boolean(config.browserToken)),
      publicEndpointConfigured: Boolean(config.publicWsUrl),
      publicWsUrl: config.publicWsUrl,
      browserToken: config.browserToken,
      jwtConfigured: config.jwtConfigured,
      sharedSecretConfigured: config.sharedSecretConfigured,
      health,
    },
  });
}
