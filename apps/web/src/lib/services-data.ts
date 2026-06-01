import { User, Users, Clock, Sparkles, HeartPulse, Shield, type LucideIcon } from "lucide-react"

// ============================================================================
// Types
// ============================================================================

export type ServiceCategory = "coaching" | "peer-support" | "workshop";

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceDisplay: string;
  duration: string;
  category: ServiceCategory;
  icon: LucideIcon;
  longDescription: string;
  features: string[];
  popular?: boolean;
  color: string;
}

export interface PackageTier {
  id: "SINGLE" | "ESSENTIAL" | "SANCTUARY";
  name: string;
  price: number;
  sessions: number;
  description: string;
  features: string[];
  icon: LucideIcon;
  color: string;
  popular?: boolean;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface EmergencyContact {
  region: string;
  phone: string;
  sms?: string;
  label: string;
}

// ============================================================================
// Emergency contacts by region (for crisis callout)
// ============================================================================

export const EMERGENCY_CONTACTS: Record<string, EmergencyContact> = {
  US: {
    region: "US",
    phone: "988",
    sms: "988",
    label: "Suicide & Crisis Lifeline (USA)",
  },
  CA: {
    region: "CA",
    phone: "988",
    sms: "988",
    label: "Suicide Crisis Helpline (Canada)",
  },
  GB: {
    region: "GB",
    phone: "116 123",
    label: "Samaritans (UK & ROI)",
  },
  IE: {
    region: "IE",
    phone: "116 123",
    label: "Samaritans (Ireland)",
  },
  AU: {
    region: "AU",
    phone: "13 11 14",
    label: "Lifeline (Australia)",
  },
  NZ: {
    region: "NZ",
    phone: "1737",
    sms: "1737",
    label: "Need to Talk? (New Zealand)",
  },
  DE: {
    region: "DE",
    phone: "0800 111 0 111",
    label: "Telefonseelsorge (Germany)",
  },
  FR: {
    region: "FR",
    phone: "3114",
    label: "National Suicide Prevention Helpline (France)",
  },
  NL: {
    region: "NL",
    phone: "0900 0113",
    label: "113 Zelfmoordpreventie (Netherlands)",
  },
  SE: {
    region: "SE",
    phone: "90101",
    label: "Mind Självmordslinjen (Sweden)",
  },
  JP: {
    region: "JP",
    phone: "03-5774-0992",
    label: "TELL Lifeline (Japan)",
  },
  IN: {
    region: "IN",
    phone: "9152987821",
    label: "iCall (India)",
  },
};

export const DEFAULT_EMERGENCY: EmergencyContact = {
  region: "INTL",
  phone: "112",
  label: "your local emergency services",
};

// ============================================================================
// Services Catalog (per-session offerings)
// ============================================================================

export const SERVICES_CATALOG: Service[] = [
  {
    id: "peer-support-1on1",
    slug: "peer-support-1on1",
    title: "1-on-1 Peer Support",
    description:
      "Confidential, one-on-one sessions with a trained peer support specialist. Ideal for discussing personal challenges in a private, camera-free environment.",
    longDescription:
      "This session provides a confidential space to discuss your challenges with a trained peer support specialist. Whether you are dealing with workplace stress, relationship issues, or daily stress, our specialists are here to listen and guide you. Sessions use our proprietary Hard Anonymity Protocol — your real identity is decoupled from your session presence.",
    price: 50,
    priceDisplay: "$50",
    duration: "45 min",
    category: "peer-support",
    icon: User,
    features: [
      "Mathematically decoupled PII",
      "No camera hardware allowed",
      "3D abstract representation",
      "Voice-only interactions",
      "Secure session tokens",
      "Human-in-the-loop safety",
    ],
    color: "from-primary/20 to-accent/20",
  },
  {
    id: "group-coaching-stress",
    slug: "group-coaching-stress",
    title: "Group Coaching: Stress & Worry Management",
    description:
      "Join an anonymous small group (max 8) to learn practical tools for navigating daily stress. Facilitated by a certified coach.",
    longDescription:
      "Our group sessions offer a collaborative environment where you can learn from others facing similar challenges. Facilitated by certified coaches, these sessions focus on evidence-based stress reduction techniques, breathwork, and shared reflection. All participants remain anonymous through avatar and voice masking.",
    price: 30,
    priceDisplay: "$30",
    duration: "60 min",
    category: "coaching",
    icon: Users,
    features: [
      "Mathematically decoupled PII",
      "No camera hardware allowed",
      "3D abstract representation",
      "Voice-only interactions",
      "Group of max 8 peers",
      "Certified coach facilitation",
    ],
    popular: true,
    color: "from-primary/20 to-accent/20",
  },
  {
    id: "career-transition-workshop",
    slug: "career-transition-workshop",
    title: "Career Transition Workshop",
    description:
      "A secure environment to discuss workplace burnout, transition strategies, and professional development without fear of employer discovery.",
    longDescription:
      "Navigating a career change can be isolating. This workshop provides professional guidance and peer support for those looking to transition roles or industries anonymously. Includes resume framing, salary navigation, and disclosure strategy — all without ever revealing your current employer or personal identity.",
    price: 75,
    priceDisplay: "$75",
    duration: "90 min",
    category: "workshop",
    icon: Clock,
    features: [
      "Mathematically decoupled PII",
      "No camera hardware allowed",
      "3D abstract representation",
      "Voice-only interactions",
      "Anonymous employer context",
      "Workshop materials included",
    ],
    color: "from-primary/20 to-accent/20",
  },
];

// ============================================================================
// Packages (multi-session bundles)
// ============================================================================

export const PACKAGE_TIERS: PackageTier[] = [
  {
    id: "SINGLE",
    name: "Single Session",
    price: 50,
    sessions: 1,
    description:
      "Perfect for a one-time crisis or a trial of the sanctuary experience.",
    features: [
      "1 Live Session",
      "Voice Masking included",
      "Standard Support",
    ],
    icon: Sparkles,
    color: "from-primary/20 to-accent/20",
  },
  {
    id: "ESSENTIAL",
    name: "Essential Pack",
    price: 225,
    sessions: 5,
    description:
      "Our most popular choice for ongoing peer-to-peer healing. Save $25 vs. buying sessions individually.",
    features: [
      "5 Live Sessions",
      "Voice Masking included",
      "Priority Matching",
      "10% Savings",
    ],
    popular: true,
    icon: Users,
    color: "from-primary/20 to-accent/20",
  },
  {
    id: "SANCTUARY",
    name: "Sanctuary Pack",
    price: 400,
    sessions: 10,
    description:
      "The complete commitment to your safety and long-term recovery. Save $100 vs. buying sessions individually.",
    features: [
      "10 Live Sessions",
      "Voice Masking included",
      "White-glove Support",
      "20% Savings",
    ],
    icon: Shield,
    color: "from-primary/20 to-accent/20",
  },
];

// ============================================================================
// Included features (shown on index)
// ============================================================================

export const INCLUDED_FEATURES: ServiceFeature[] = [
  {
    title: "Peer-to-Peer Sanctuary",
    description:
      "Connect with trained peers who understand your lived experience in a safe, anonymous environment.",
    icon: Users,
  },
  {
    title: "Crisis Escalation",
    description:
      "Immediate access to high-level support if your safety or the safety of others is at risk.",
    icon: HeartPulse,
  },
  {
    title: "Anonymous Mentorship",
    description:
      "Long-term guidance from those who have successfully navigated similar paths.",
    icon: Shield,
  },
];

// ============================================================================
// FAQ (shown on detail page)
// ============================================================================

export const SERVICES_FAQ: FAQ[] = [
  {
    question: "Is this therapy or counseling?",
    answer:
      "No. HSSS provides peer support, coaching, and support navigation. We do not provide psychiatric evaluation, clinical diagnosis, or medical advice. Our peer specialists are trained and supervised, but they are not licensed therapists.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Sessions can be cancelled or rescheduled up to 24 hours in advance for a full refund. Cancellations within 24 hours receive a 50% refund. No-shows are charged the full session fee. Scholarship sessions follow the same policy with no penalty for financial hardship.",
  },
  {
    question: "What if I miss a session?",
    answer:
      "For package holders, missed sessions are banked and can be rebooked within 90 days. For single sessions, the credit is applied to your account and remains valid for 12 months. Email us if you need an extension — we will always work with you.",
  },
  {
    question: "How anonymous is 'anonymous' really?",
    answer:
      "Mathematically anonymous. We use a token-based system where your real identity is never linked to your session presence. Audio is masked in real time. No cameras. No recording. No logs that can be subpoenaed. Your peers only see an abstract 3D avatar.",
  },
  {
    question: "Is this a medical service?",
    answer:
      "No. HSSS is a peer support service, not a medical provider. If you are experiencing a medical emergency or active crisis, please contact your local emergency number immediately — the most important call you can make is to a 24/7 crisis line.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes. Single sessions are refundable up to 24 hours before the appointment. Package purchases are refundable within 7 days, pro-rated for sessions used. Scholarship-funded sessions are always free — no payment required.",
  },
];

// ============================================================================
// Trust signals
// ============================================================================

export const TRUST_SIGNALS = [
  { label: "Money-back within 7 days", icon: "shield" },
  { label: "Stripe-secured payments", icon: "card" },
  { label: "Cancellable up to 24h", icon: "clock" },
  { label: "Scholarships always available", icon: "heart" },
] as const;
