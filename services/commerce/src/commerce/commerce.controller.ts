import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { CommerceService } from './commerce.service.js';
import { FirebaseAuthService } from '../auth/firebase-auth.service.js';
import {
  createDonationSchema,
  createOrgInquirySchema,
  createSessionIntentSchema,
  createPackageIntentSchema,
  purchasePackageSchema,
} from '../dto/commerce.dto.js';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class CommerceController {
  constructor(
    private readonly commerceService: CommerceService,
    private readonly firebaseAuth: FirebaseAuthService,
  ) {}

  // ========== DONATIONS ==========

  @Post('donations')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async createDonation(@Req() req: Request, @Body() body: unknown) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    let userId: string | null = null;

    if (token) {
      try {
        // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
        // This properly validates the token signature and expiration
        userId = await this.firebaseAuth.getUidFromToken(token);
      } catch {
        // proceed as guest for donations - no verification required
      }
    }

    const result = createDonationSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException('Invalid input');
    }

    try {
      return await this.commerceService.createDonationIntent(userId, result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      throw new InternalServerErrorException(message);
    }
  }

  // ========== SESSION PAYMENT ==========

  @Post('checkout/session-intent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async createSessionIntent(@Req() req: Request, @Body() body: unknown) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    let firebaseUid: string | null = null;
    try {
      // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
      // This properly validates the token signature and expiration
      firebaseUid = await this.firebaseAuth.getUidFromToken(token);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!firebaseUid) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = createSessionIntentSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException('Invalid input');
    }

    try {
      return await this.commerceService.createSessionPaymentIntent(result.data, firebaseUid);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      throw new InternalServerErrorException(message);
    }
  }

  // ========== PACKAGE PURCHASE ==========

  @Post('checkout/package-intent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async createPackageIntent(@Req() req: Request, @Body() body: unknown) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    let firebaseUid: string | null = null;
    try {
      // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
      firebaseUid = await this.firebaseAuth.getUidFromToken(token);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!firebaseUid) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = createPackageIntentSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException('Invalid package selection');
    }

    try {
      return await this.commerceService.createPackageIntent(firebaseUid, result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      throw new InternalServerErrorException(message);
    }
  }

  @Post('packages/purchase')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async purchasePackage(@Req() req: Request, @Body() body: unknown) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    let firebaseUid: string | null = null;
    try {
      // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
      firebaseUid = await this.firebaseAuth.getUidFromToken(token);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!firebaseUid) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = purchasePackageSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({ message: 'Invalid input', details: result.error.format() });
    }

    try {
      return { success: true, package: await this.commerceService.purchasePackage(firebaseUid, result.data) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      throw new InternalServerErrorException(message);
    }
  }

  // ========== ORG INQUIRIES ==========

  @Post('org-inquiry')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async createOrgInquiry(@Body() body: unknown) {
    const result = createOrgInquirySchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({ message: 'Invalid input', details: result.error.format() });
    }

    try {
      return await this.commerceService.createOrgInquiry(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      throw new InternalServerErrorException(message);
    }
  }

  // ========== READ OPERATIONS ==========

  @Get('donations')
  async getDonations(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
      const userId = await this.firebaseAuth.getUidFromToken(token);

      if (!userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      return await this.commerceService.getDonationsByUser(userId);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Get('packages')
  async getPackages(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      // PRODUCTION READY: Verify Firebase ID token using Firebase Admin SDK
      const userId = await this.firebaseAuth.getUidFromToken(token);

      if (!userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      return await this.commerceService.getPackagesByUser(userId);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}