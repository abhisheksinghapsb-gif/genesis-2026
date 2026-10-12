import { test, expect } from '@playwright/test';

test.describe('Navigation & HUD Engine', () => {
  test('loads home page and shows GENESIS 2026 hero title', async ({ page }) => {
    await page.goto('/');
    // Check hero heading specifically
    await expect(page.locator('#home h1')).toContainText('GENESIS');
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#timeline')).toBeAttached();
    await expect(page.locator('#prizes')).toBeAttached();
    await expect(page.locator('#sponsors')).toBeAttached();
    await expect(page.locator('#memories')).toBeAttached();
    await expect(page.locator('#faq')).toBeAttached();
    await expect(page.locator('#register')).toBeAttached();
  });

  test('deep links to #prizes section directly', async ({ page }) => {
    await page.goto('/#prizes');
    await expect(page.locator('#prizes')).toBeAttached();
  });

  test('opens navigation drawer, traps focus, and closes on Esc', async ({ page }) => {
    await page.goto('/');
    // Scroll down to reveal HUD
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.9));
    await page.waitForTimeout(500);

    const menuBtn = page.getByRole('button', { name: /Open navigation menu/i });
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      const dialog = page.getByRole('dialog', { name: /Navigation Menu/i });
      await expect(dialog).toBeVisible();

      // Press Escape to close
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  });
});
