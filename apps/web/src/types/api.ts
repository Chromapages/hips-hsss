// Shared types for API responses and component props

// Admin Dashboard Types
export interface SafetyAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING';
  category: string;
  sessionId: string;
  createdAt: string;
}

export interface AdminStats {
  activeSessions: number;
  scholarships: number;
  inquiries: number;
  totalUsers: number;
  totalRevenue: string;
  recentAlerts: SafetyAlert[];
}

// Inquiry Types
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED';

export interface Inquiry {
  id: string;
  orgName: string;
  contactName: string;
  email: string;
  message?: string;
  status: InquiryStatus;
  createdAt: string;
}

// Scholarship Types
export type ScholarshipStatus = 'PENDING' | 'APPROVED' | 'DENIED';

export interface Scholarship {
  id: string;
  user: { email: string };
  requestedCents: number;
  status: ScholarshipStatus;
  personalStatement: string;
  serviceType: string | null;
  incomeRange: string | null;
  employmentStatus: string | null;
  referralSource: string | null;
  createdAt: string;
}

// User Types
export type UserRole = 'PARTICIPANT' | 'FACILITATOR' | 'ADMIN';

export interface PlatformUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

// Session Types
export type SessionStatus = 'SCHEDULED' | 'LOBBY' | 'ACTIVE' | 'ENDED' | 'INTERRUPTED';

export interface Session {
  id: string;
  status: SessionStatus;
  startsAt: string | Date;
  serviceId: string;
  facilitatorId?: string;
  participantId?: string;
}

// Package Types
export type PackageTier = 'SINGLE' | 'ESSENTIAL' | 'SANCTUARY';

export interface Package {
  id: PackageTier;
  name: string;
  price: number;
  sessions: number;
  description: string;
  features: string[];
}

// Time Slot Types
export interface TimeSlot {
  startsAt: string;
  endsAt: string;
  available: boolean;
}