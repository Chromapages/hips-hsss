import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as crypto from 'node:crypto';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SessionService implements OnModuleInit {
  private firebaseApp!: admin.app.App;
  // In-memory token store: Map<opaqueToken, { sessionId, role, expiresAt }>
  // TODO: Move to Redis for production
  private tokenStore = new Map<string, { sessionId: string; role: string; expiresAt: number }>();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials missing. Auth verification will fail.');
      return;
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    }, 'session-service');
  }

  async issueSessionToken(sessionId: string, firebaseToken: string) {
    try {
      // 1. Verify Firebase ID Token
      const decodedToken = await admin.auth(this.firebaseApp).verifyIdToken(firebaseToken);
      const role = decodedToken.role || 'PARTICIPANT';

      // 2. Rate Limit Check (Optional but recommended)
      // TODO: Implement simple rate limiting before token issuance

      // 3. Generate 32-byte Opaque Token
      const opaqueToken = crypto.randomBytes(32).toString('hex');

      // 4. Store Token Mapping (In-Memory Only)
      // Notice: We store 'role' but NOT the 'uid'. The Session Engine only knows the role.
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour expiry
      this.tokenStore.set(opaqueToken, { sessionId, role, expiresAt });

      // 5. Log activity without linking (Safety Engine requirement)
      console.log(`[SessionService] Issued opaque token for session ${sessionId}. Identity linkage discarded.`);

      return {
        sessionToken: opaqueToken,
        expiresIn: 3600,
      };
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      throw new UnauthorizedException('Invalid authentication');
    }
  }

  /**
   * Used by the Session Engine (WebRTC/Socket) to validate a connection
   */
  validateToken(token: string) {
    const sessionData = this.tokenStore.get(token);
    
    if (!sessionData) return null;
    if (Date.now() > sessionData.expiresAt) {
      this.tokenStore.delete(token);
      return null;
    }

    return sessionData;
  }
}
