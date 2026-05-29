import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma.service.js';

type GenerativeModel = ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

type HarmAssessment = {
  isSafe: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'NONE' | 'HARM' | 'SELF_HARM' | 'HARASSMENT' | 'DISCLOSURE';
  reason: string;
};

function parseAssessment(value: string): HarmAssessment {
  const parsed = JSON.parse(value.replace(/```json|```/g, '')) as Partial<HarmAssessment>;

  if (
    typeof parsed.isSafe !== 'boolean' ||
    !parsed.severity ||
    !parsed.category ||
    typeof parsed.reason !== 'string'
  ) {
    throw new Error('Invalid safety assessment payload');
  }

  return parsed as HarmAssessment;
}

@Injectable()
export class SafetyService implements OnModuleInit {
  private genAI!: GoogleGenerativeAI;
  private model?: GenerativeModel;
  
  // In-memory transcript buffers: Map<sessionId, string[]>
  private transcriptBuffers = new Map<string, string[]>();
  private readonly MAX_BUFFER_SIZE = 10; // Sentences to buffer before classification

  // TTL-based buffer expiry to prevent unbounded memory growth
  private readonly BUFFER_TTL_MS = 30 * 60 * 1000; // 30 minutes
  private bufferTimestamps = new Map<string, number>();

  private touchBuffer(sessionId: string) {
    const now = Date.now();
    this.bufferTimestamps.set(sessionId, now);
    // Drain stale entries
    for (const [sid, ts] of this.bufferTimestamps) {
      if (now - ts > this.BUFFER_TTL_MS) {
        this.transcriptBuffers.delete(sid);
        this.bufferTimestamps.delete(sid);
      }
    }
  }

  // High-severity keyword blocklist for instant detection
  private readonly KEYWORD_BLOCKLIST = [
    'kill myself', 'suicide', 'end my life', 'hurt others', 
    'bomb', 'attack', 'kill you', 'die today'
  ];

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing. Safety classification will be disabled.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async processTranscript(sessionId: string, participantId: string, text: string) {
    // 1. Immediate Keyword Check (Fast Path)
    const lowerText = text.toLowerCase();
    const matchedKeyword = this.KEYWORD_BLOCKLIST.find(k => lowerText.includes(k));

    if (matchedKeyword) {
      const assessment: HarmAssessment = {
        isSafe: false,
        severity: 'CRITICAL',
        category: 'SELF_HARM', // Default to SELF_HARM for common blocklist terms
        reason: `Keyword detected: "${matchedKeyword}"`
      };
      await this.handleUnsafeContent(sessionId, assessment, text, participantId);
      return assessment;
    }

    // 2. Add to buffer
    this.touchBuffer(sessionId);
    let buffer = this.transcriptBuffers.get(sessionId) || [];
    buffer.push(`[${participantId}]: ${text}`);
    
    // 3. Keep buffer within limits
    if (buffer.length > this.MAX_BUFFER_SIZE * 2) {
      buffer = buffer.slice(-this.MAX_BUFFER_SIZE);
    }
    this.transcriptBuffers.set(sessionId, buffer);

    // 4. Trigger classification every few sentences
    if (buffer.length >= this.MAX_BUFFER_SIZE) {
      const fullText = buffer.join('\n');
      return this.classifyHarm(sessionId, fullText, participantId);
    }

    return { status: 'buffered' };
  }

  async classifyHarm(sessionId: string, text: string, participantId: string) {
    if (!this.model) return { status: 'error', reason: 'model_not_ready' };

    try {
      const prompt = `
        Analyze the following transcript from a peer support session for immediate safety risks.
        Categories: HARM (physical violence), SELF_HARM, HARASSMENT, DISCLOSURE (sharing PII).
        
        Transcript:
        "${text}"
        
        Response format (JSON only):
        {
          "isSafe": boolean,
          "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          "category": "NONE" | "HARM" | "SELF_HARM" | "HARASSMENT" | "DISCLOSURE",
          "reason": "short explanation"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const assessment = parseAssessment(responseText);

      if (!assessment.isSafe) {
        await this.handleUnsafeContent(sessionId, assessment, text, participantId);
      }

      // Clear part of the buffer after successful classification to prevent redundant checks
      this.transcriptBuffers.set(sessionId, []);

      return assessment;
    } catch (error) {
      // Classification failed - return error status without throwing
      console.error('Safety classification failed:', error);
      return { status: 'error', reason: 'classification_failed' };
    }
  }

  async handleManualFlag(sessionId: string, reporterId: string, level: 'HIGH' | 'CRITICAL', reason: string) {
    const assessment: HarmAssessment = {
      isSafe: false,
      severity: level,
      category: 'HARM', // Default to HARM for manual flags unless specified
      reason: `Manual flag by ${reporterId}: ${reason}`
    };

    return this.handleUnsafeContent(sessionId, assessment, 'MANUAL_FLAG_NO_TRANSCRIPT', reporterId);
  }

  private async handleUnsafeContent(
    sessionId: string,
    assessment: HarmAssessment,
    transcriptChunk: string,
    offendingParticipantId: string
  ) {
    console.error(`[SafetyEngine] ALERT: Unsafe content detected in session ${sessionId}! Category: ${assessment.category}`);

    // 1. Create Safety Alert in DB
    const alert = await this.prisma.safetyAlert.create({
      data: {
        sessionId,
        severity: assessment.severity,
        category: assessment.category,
        anonymizedReason: assessment.reason,
        transcriptChunk: transcriptChunk,
      },
    });

    // 2. Determine Mitigation Action based on Strikes
    const mitigationAction = await this.determineMitigation(
      sessionId,
      offendingParticipantId,
      assessment.severity
    );

    // 3. Persist durable audit log for mitigation (Phase 5 requirement)
    await this.prisma.safetyMitigation.create({
      data: {
        alertId: alert.id,
        action: mitigationAction,
        success: true,
        metadata: {
          assessment: {
            severity: assessment.severity,
            category: assessment.category,
            reason: assessment.reason,
          },
          offenderId: offendingParticipantId,
          transcriptChunk: transcriptChunk.slice(0, 500), // Truncate for storage
        },
      },
    });

    // 4. Trigger Mitigation (Webhook to Web App)
    const webhookUrl = this.configService.get<string>('WEB_APP_URL');
    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');

    if (webhookUrl) {
      try {
        await fetch(`${webhookUrl}/api/safety/mitigate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${webhookSecret}`
          },
          body: JSON.stringify({
            sessionId,
            offenderId: offendingParticipantId,
            assessment,
            alertId: alert.id,
            mitigationAction
          })
        });
      } catch {
        console.error('Failed to send safety webhook');
      }
    }

    return alert;
  }

  private async determineMitigation(
    sessionId: string,
    participantId: string,
    severity: string
  ): Promise<string> {
    // 1. Upsert strike count
    const strike = await this.prisma.safetyStrike.upsert({
      where: { 
        sessionId_participantId: { 
          sessionId, 
          participantId 
        } 
      },
      update: { 
        count: { increment: 1 }, 
        lastStrikeAt: new Date() 
      },
      create: { 
        sessionId, 
        participantId, 
        count: 1 
      }
    });

    // 2. Determine action based on severity and strike count
    // Critical violations always lead to an immediate kick
    if (severity === 'CRITICAL') return 'KICK';
    
    // Strike 3: Removal
    if (strike.count >= 3) return 'KICK';
    
    // Strike 2: Suspension of messaging privileges
    if (strike.count === 2) return 'MUTE';
    
    // Strike 1: Just a warning
    return 'WARNING';
  }

  async triggerCrisisProtocol(alertId: string, actorId: string, reason: string) {
    const alert = await this.prisma.safetyAlert.findUnique({
      where: { id: alertId }
    });

    if (!alert || alert.severity !== 'CRITICAL') {
      throw new Error('Crisis protocol can only be triggered for CRITICAL alerts.');
    }

    // 1. Request PII from Vault
    const vaultUrl = this.configService.get<string>('VAULT_SERVICE_URL');
    if (!vaultUrl) {
      throw new Error('VAULT_SERVICE_URL is not configured');
    }
    const vaultSecret = this.configService.get<string>('VAULT_API_SECRET');

    // We assume the participantId is stored in the alert or can be derived
    // For this demo, we'll use a placeholder subjectRef
    const subjectRef = `participant:${alert.sessionId}`; 

    try {
      const response = await fetch(`${vaultUrl}/records/${subjectRef}?actor=${actorId}&purpose=${encodeURIComponent(reason)}`, {
        headers: {
          'x-vault-secret': vaultSecret || ''
        }
      });

      if (!response.ok) {
        throw new Error('Vault access denied');
      }

      const piiData = await response.json();

      // 2. Create durable audit log for PII access (Phase 5 requirement)
      await this.prisma.vaultAccessLog.create({
        data: {
          subjectRef,
          actorId,
          purpose: reason,
          outcome: 'SUCCESS',
          ipAddress: null, // Actor IP not available in this context
        },
      });

      // 3. Mark alert as escalated
      await this.prisma.safetyAlert.update({
        where: { id: alertId },
        data: {
          anonymizedReason: `${alert.anonymizedReason} [ESCALATED: PII Accessed by ${actorId}]`
        }
      });

      return {
        success: true,
        pii: piiData,
        message: 'Crisis protocol activated. PII retrieved for emergency response.'
      };
    } catch {
      console.error('Crisis Protocol Error');
      throw new Error('Crisis protocol failed');
    }
  }

  async getAlerts(sessionId: string, take = 50, skip = 0) {
    return this.prisma.safetyAlert.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  async findAllAlerts(take = 50, skip = 0) {
    return this.prisma.safetyAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }
}
