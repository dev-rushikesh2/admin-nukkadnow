import { test, expect } from '@playwright/test';

test.describe('Admin Operator Authentication & MFA', () => {
  test('should redirect unauthenticated operators to /auth/login', async ({ page }) => {
    await page.goto('/overview');
    await expect(page).toHaveURL(/.*\/auth\/login.*/);
  });

  test('should require MFA TOTP before granting admin console access', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'superadmin@nukkadnow.in');
    await page.fill('input[name="password"]', 'P@ssword12345!');
    await page.click('button[type="submit"]');

    // Verify redirected to MFA challenge
    await expect(page).toHaveURL(/.*\/auth\/mfa.*/);
    await expect(page.locator('h2')).toContainText('Multi-Factor Verification');

    // Fill valid 6-digit TOTP
    await page.fill('input[name="totpCode"]', '123456');
    await page.click('button[type="submit"]');

    // Successfully entered console
    await expect(page).toHaveURL(/.*\/overview.*/);
  });
});
