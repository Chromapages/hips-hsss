import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Homepage loads at /', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('/services page loads', async ({ page }) => {
    const response = await page.goto('/services');
    expect(response?.status()).toBe(200);
  });

  test('/donate page loads', async ({ page }) => {
    const response = await page.goto('/donate');
    expect(response?.status()).toBe(200);
  });

  test('/organizations page loads', async ({ page }) => {
    const response = await page.goto('/organizations');
    expect(response?.status()).toBe(200);
  });

  test('Homepage has no console errors at Error level', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });
});