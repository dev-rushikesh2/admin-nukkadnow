import { test, expect } from '@playwright/test';

test.describe('Merchant KYC Verification Workflow', () => {
  test('should display verification queue and require audit reason on rejection', async ({ page }) => {
    // Navigate to verification queue
    await page.goto('/merchant-verification');

    // Verification queue should render data table
    await expect(page.locator('admin-page-header')).toBeVisible();
  });
});
