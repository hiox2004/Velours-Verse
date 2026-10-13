import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop-wide', width: 1920, height: 1080 },
  { name: 'laptop-standard', width: 1440, height: 900 },
  { name: 'tablet-ipad', width: 768, height: 1024 },
  { name: 'mobile-iphone', width: 390, height: 844 }
];

test.describe('Visual & Responsive UI Audit', () => {
  for (const vp of VIEWPORTS) {
    test(`Landing Sanctuary & Header layout on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000/');

      // Verify hero heading is visible
      await expect(page.getByRole('heading', { name: 'Words that refuse to be' })).toBeVisible();

      // Check that guest does NOT see hardcoded Aura Dev profile
      const auraDevPill = page.locator('text=Aura Dev');
      await expect(auraDevPill).toHaveCount(0);

      // Check that guest header displays "Sign In" button
      const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
      await expect(signInBtn).toBeVisible();

      // Ensure no horizontal scroll blowout
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // Capture high-res screenshot
      await page.screenshot({
        path: `audit-screenshots/${vp.name}-landing.png`,
        fullPage: false
      });
    });

    test(`Guest route protection on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000/');

      // Click "Writing Log" or mobile "Logs" tab as guest
      const logNavBtn = page.locator('button:has-text("Writing Log"), button:has-text("Logs")').first();
      if (await logNavBtn.isVisible()) {
        await logNavBtn.click();
        // Should ask to sign in / redirect to auth page
        await expect(page.getByRole('heading', { name: 'Enter Velours & Verse' })).toBeVisible();
        await page.screenshot({
          path: `audit-screenshots/${vp.name}-auth-gated.png`
        });
      }
    });
  }
});
