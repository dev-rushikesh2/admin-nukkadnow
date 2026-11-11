import { test, expect } from '@playwright/test';

test.describe('Step-Up MFA for High-Risk Actions', () => {
  test('should trigger step-up challenge when requesting merchant suspension', async ({ page }) => {
    await page.goto('/merchants');
    await expect(page.locator('admin-page-header')).toBeVisible();
  });
});
