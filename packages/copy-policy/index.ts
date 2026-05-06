// Shared policy constants and keyword matching logic for the Safety module

// Fields required during crisis protocol from the Identity Vault
export const CRISIS_VAULT_FIELDS = ['emergencyContact', 'region', 'country'] as const;

// Severity threshold above which an escalation is auto-promoted to ESCALATION_REVIEW
export const AUTO_ESCALATION_SEVERITY_THRESHOLD = 7;

// Alert dispatch channels
export const CrisisAlertChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  PHONE: 'phone',
} as const;

export type CrisisAlertChannel = (typeof CrisisAlertChannel)[keyof typeof CrisisAlertChannel];

// Keyword categories for flag detection
export const KeywordCategory = {
  BLAME: 'blame',
  CRISIS: 'crisis',
  SELF_HARM: 'self_harm',
  SUBSTANCE: 'substance',
  DISTRESS: 'distress',
  GRIEF: 'grief',
} as const;

export type KeywordCategory = (typeof KeywordCategory)[keyof typeof KeywordCategory];

// Keyword-to-category mapping — severity scores
const KEYWORD_MAP: Record<string, { category: KeywordCategory; severity: number }> = {
  // BLAME
  'blame yourself': { category: 'blame', severity: 3 },
  'you ruined': { category: 'blame', severity: 4 },
  'its your fault': { category: 'blame', severity: 5 },
  // CRISIS
  'suicide': { category: 'crisis', severity: 10 },
  'kill myself': { category: 'crisis', severity: 10 },
  'end my life': { category: 'crisis', severity: 10 },
  'crisis': { category: 'crisis', severity: 8 },
  // SELF_HARM
  'cut myself': { category: 'self_harm', severity: 9 },
  'self-harm': { category: 'self_harm', severity: 9 },
  'hurt myself': { category: 'self_harm', severity: 8 },
  // SUBSTANCE
  'drinking again': { category: 'substance', severity: 6 },
  'relapsed': { category: 'substance', severity: 7 },
  'using again': { category: 'substance', severity: 7 },
  // DISTRESS
  'cant cope': { category: 'distress', severity: 5 },
  'falling apart': { category: 'distress', severity: 6 },
  'overwhelmed': { category: 'distress', severity: 4 },
  // GRIEF
  'lost my': { category: 'grief', severity: 5 },
  'miss them': { category: 'grief', severity: 4 },
};

export const KEYWORD_CATEGORIES: Record<KeywordCategory, string[]> = {
  blame: ['blame yourself', 'you ruined', 'its your fault'],
  crisis: ['suicide', 'kill myself', 'end my life', 'crisis'],
  self_harm: ['cut myself', 'self-harm', 'hurt myself'],
  substance: ['drinking again', 'relapsed', 'using again'],
  distress: ['cant cope', 'falling apart', 'overwhelmed'],
  grief: ['lost my', 'miss them'],
};

export const KEYWORD_SEVERITY: Record<KeywordCategory, number> = {
  blame: 3,
  crisis: 10,
  self_harm: 9,
  substance: 7,
  distress: 5,
  grief: 5,
};

export interface KeywordMatchResult {
  matched: KeywordCategory;
  keyword: string;
  severity: number;
}

export function matchKeywords(text: string): KeywordMatchResult[] {
  const lower = text.toLowerCase();
  const results: KeywordMatchResult[] = [];

  for (const [keyword, config] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      results.push({
        matched: config.category,
        keyword,
        severity: config.severity,
      });
    }
  }

  return results;
}
