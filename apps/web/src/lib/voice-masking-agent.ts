import 'server-only';

import { AgentDispatchClient } from 'livekit-server-sdk';
import { checkNeuralVoiceMaskingHealth, getNeuralVoiceMaskingConfig } from './neural-voice-masking';

export type VoiceMaskingAgentRequest = {
  sessionId: string;
  roomName: string;
  participantIdentity: string;
  persona?: 'clara' | 'arthur';
  antiCadence?: boolean;
};

export type VoiceMaskingAgentDispatchResult = {
  requested: boolean;
  dispatched: boolean;
  reason?: string;
  agentName?: string;
  dispatchId?: string;
};

export function getVoiceMaskingAgentConfig() {
  return {
    enabled: process.env.LIVEKIT_VOICE_MASKING_AGENT_ENABLED === 'true',
    agentName: process.env.LIVEKIT_VOICE_MASKING_AGENT_NAME?.trim() || 'hips-voice-masker',
    livekitUrl:
      process.env.LIVEKIT_URL?.trim() ||
      process.env.NEXT_PUBLIC_LIVEKIT_URL?.trim() ||
      process.env.NEXT_PUBLIC_LIVEKIT_WS_URL?.trim() ||
      null,
    apiKey: process.env.LIVEKIT_API_KEY?.trim() || null,
    apiSecret: process.env.LIVEKIT_API_SECRET?.trim() || null,
  };
}

export async function dispatchVoiceMaskingAgent(
  request: VoiceMaskingAgentRequest,
): Promise<VoiceMaskingAgentDispatchResult> {
  const agent = getVoiceMaskingAgentConfig();
  if (!agent.enabled) {
    return { requested: true, dispatched: false, reason: 'agent_disabled', agentName: agent.agentName };
  }

  const neural = getNeuralVoiceMaskingConfig();
  if (!neural.liveReady) {
    return { requested: true, dispatched: false, reason: 'neural_backend_not_live_ready', agentName: agent.agentName };
  }

  const health = await checkNeuralVoiceMaskingHealth();
  if (!health.reachable) {
    return { requested: true, dispatched: false, reason: 'neural_backend_unreachable', agentName: agent.agentName };
  }

  if (!agent.livekitUrl || !agent.apiKey || !agent.apiSecret) {
    return { requested: true, dispatched: false, reason: 'livekit_not_configured', agentName: agent.agentName };
  }

  const livekitHttpUrl = agent.livekitUrl.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
  const client = new AgentDispatchClient(livekitHttpUrl, agent.apiKey, agent.apiSecret);
  const dispatch = await client.createDispatch(request.roomName, agent.agentName, {
    metadata: JSON.stringify({
      kind: 'voice-masking',
      sessionId: request.sessionId,
      sourceParticipantIdentity: request.participantIdentity,
      persona: request.persona ?? 'clara',
      antiCadence: Boolean(request.antiCadence),
      requestedAt: new Date().toISOString(),
    }),
  });

  return {
    requested: true,
    dispatched: true,
    agentName: agent.agentName,
    dispatchId: dispatch.id,
  };
}
