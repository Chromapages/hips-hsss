import { describe, it, expect } from 'vitest';
import { isSafeInternalRedirect, getSafeRedirect } from './redirect-utils';

describe('redirect-utils', () => {
  describe('isSafeInternalRedirect', () => {
    it('accepts safe internal paths', () => {
      expect(isSafeInternalRedirect('/dashboard')).toBe(true);
      expect(isSafeInternalRedirect('/dashboard?tab=sessions')).toBe(true);
      expect(isSafeInternalRedirect('/host/dashboard')).toBe(true);
    });

    it('rejects external URLs', () => {
      expect(isSafeInternalRedirect('http://evil.com')).toBe(false);
      expect(isSafeInternalRedirect('https://evil.com/dashboard')).toBe(false);
      expect(isSafeInternalRedirect('//evil.com')).toBe(false);
    });

    it('rejects malformed or unsafe values', () => {
      expect(isSafeInternalRedirect(null)).toBe(false);
      expect(isSafeInternalRedirect(undefined)).toBe(false);
      expect(isSafeInternalRedirect('')).toBe(false);
      expect(isSafeInternalRedirect('javascript:alert(1)')).toBe(false);
    });
  });

  describe('getSafeRedirect', () => {
    it('returns safe path when valid', () => {
      expect(getSafeRedirect('/dashboard', '/fallback')).toBe('/dashboard');
    });

    it('returns fallback path when invalid', () => {
      expect(getSafeRedirect('http://evil.com', '/fallback')).toBe('/fallback');
      expect(getSafeRedirect('', '/fallback')).toBe('/fallback');
      expect(getSafeRedirect(null, '/fallback')).toBe('/fallback');
    });
  });
});
