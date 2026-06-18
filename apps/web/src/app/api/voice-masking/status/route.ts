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
      configured: Boolean(config.baseUrl),
      runtime: config.runtime,
      liveReady: config.liveReady,
      readyForSessionUse: config.enabled && config.liveReady && health.reachable,
      publicEndpointConfigured: Boolean(config.publicBaseUrl),
      sharedSecretConfigured: config.sharedSecretConfigured,
      health,
    },
  });
}
