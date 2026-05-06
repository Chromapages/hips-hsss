import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  dtlsRole: 'client' | 'server';
  maxParticipants: number;
}

@Injectable()
export class WebrtcConfigService {
  constructor(private configService: ConfigService) {}

  getConfig(): WebRTCConfig {
    return {
      iceServers: this.getIceServers(),
      dtlsRole: 'client',
      maxParticipants: this.configService.get<number>('LIVEKIT_MAX_PARTICIPANTS', 12),
    };
  }

  private getIceServers(): RTCIceServer[] {
    const liveKitUrl = this.configService.get<string>('LIVEKIT_URL');
    const liveKitApiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const liveKitApiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');

    const servers: RTCIceServer[] = [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ];

    // Add LiveKit TURN if configured (self-hosted in HIPAA VPC)
    if (liveKitUrl && liveKitApiKey && liveKitApiSecret) {
      servers.push({
        urls: `${liveKitUrl}/turn`,
        username: liveKitApiKey,
        credential: liveKitApiSecret,
      });
    }

    return servers;
  }

  getStunServers(): string[] {
    return [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
    ];
  }

  getTurnConfig(): { url: string; username: string; credential: string } | null {
    const liveKitUrl = this.configService.get<string>('LIVEKIT_URL');
    const liveKitApiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const liveKitApiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');

    if (!liveKitUrl || !liveKitApiKey || !liveKitApiSecret) {
      return null;
    }

    return {
      url: `${liveKitUrl}/turn`,
      username: liveKitApiKey,
      credential: liveKitApiSecret,
    };
  }
}