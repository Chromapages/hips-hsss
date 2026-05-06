// Keyword detection module — counselor-initiated flagging only
// No surveillance by default — keywords only matched when counselor explicitly triggers

import { Injectable } from '@nestjs/common'
import {
  KEYWORD_CATEGORIES,
  KEYWORD_SEVERITY,
  AUTO_ESCALATION_SEVERITY_THRESHOLD,
  KeywordCategory,
  matchKeywords,
} from '@hips/copy-policy'

export interface KeywordMatch {
  category: KeywordCategory
  keyword: string
  severity: number
}

export interface KeywordMatchResult {
  hasMatches: boolean
  matches: KeywordMatch[]
  maxSeverity: number
  autoEscalate: boolean
}

@Injectable()
export class KeywordService {
  /**
   * Detect keywords in a transcript snippet or counselor notes.
   * Returns match results with severity score.
   *
   * IMPORTANT: This only runs when a counselor explicitly triggers a flag review —
   * never runs passively on all session content.
   */
  detect(text: string): KeywordMatchResult {
    const rawMatches = matchKeywords(text)

    if (rawMatches.length === 0) {
      return {
        hasMatches: false,
        matches: [],
        maxSeverity: 0,
        autoEscalate: false,
      }
    }

    const matches: KeywordMatch[] = rawMatches.map((m) => ({
      category: m.matched,
      keyword: m.keyword,
      severity: m.severity,
    }))

    const maxSeverity = Math.max(...matches.map((m) => m.severity))

    return {
      hasMatches: true,
      matches,
      maxSeverity,
      autoEscalate: maxSeverity >= AUTO_ESCALATION_SEVERITY_THRESHOLD,
    }
  }

  /**
   * Get severity for a specific category.
   */
  getSeverityForCategory(category: KeywordCategory): number {
    return KEYWORD_SEVERITY[category]
  }

  /**
   * Get all categories and their keywords (for admin display/config).
   */
  getKeywordConfig(): Record<KeywordCategory, { keywords: string[]; severity: number }> {
    const config: Record<string, { keywords: string[]; severity: number }> = {}
    for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORIES)) {
      config[cat] = {
        keywords: [...keywords],
        severity: KEYWORD_SEVERITY[cat as KeywordCategory],
      }
    }
    return config as Record<KeywordCategory, { keywords: string[]; severity: number }>
  }
}