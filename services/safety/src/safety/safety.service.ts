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
    // 1. Add to buffer
    let buffer = this.transcriptBuffers.get(sessionId) || [];
    buffer.push(`[${participantId}]: ${text}`);
    
    // 2. Keep buffer within limits
    if (buffer.length > this.MAX_BUFFER_SIZE * 2) {
      buffer = buffer.slice(-this.MAX_BUFFER_SIZE);
    }
    this.transcriptBuffers.set(sessionId, buffer);

    // 3. Trigger classification every few sentences
    if (buffer.length >= this.MAX_BUFFER_SIZE) {
      const fullText = buffer.join('\n');
      return this.classifyHarm(sessionId, fullText);
    }

    return { status: 'buffered' };
  }

  async classifyHarm(sessionId: string, text: string) {
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
        await this.handleUnsafeContent(sessionId, assessment, text);
      }

      // Clear part of the buffer after successful classification to prevent redundant checks
      this.transcriptBuffers.set(sessionId, []);

      return assessment;
    } catch (error) {
      console.error('Safety classification failed:', error);
      return { status: 'error', reason: 'classification_failed' };
    }
  }

  private async handleUnsafeContent(
    sessionId: string,
    assessment: HarmAssessment,
    transcriptChunk: string
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

    // 2. Trigger Mitigation (e.g., notify Commerce Service or Session Engine)
    // TODO: Implement Webhook or EventBridge call to Commerce Service
    
    return alert;
  }

  async getAlerts(sessionId: string) {
    return this.prisma.safetyAlert.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
