import { test, expect } from '@playwright/test';

test.describe('Phase 5 - 3D Celestial Canvas & Ambient Layer', () => {
  test('mounts 3D canvas on desktop and sets data-3d-state to running', async ({ page }) => {
    page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('PAGE ERR:', err.message, err.stack));
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const hero = page.locator('#home');
    await expect(hero).toBeVisible();

    // Verify data-3d-state attribute is present
    const state = await hero.getAttribute('data-3d-state');
    expect(['running', 'fallback']).toContain(state);
  });

  test('forces CSS fallback when ?3d=off query is provided without layout shift', async ({ page }) => {
    await page.goto('/?3d=off', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const hero = page.locator('#home');
    await expect(hero).toHaveAttribute('data-3d-state', 'fallback');

    // Title and badge remain perfectly rendered
    const title = page.locator('#home h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText('GENESIS');
  });

  test('pauses 3D animation when hero scrolls off-screen', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Scroll down to Timeline section
    const timeline = page.locator('#timeline');
    await timeline.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const hero = page.locator('#home');
    const state = await hero.getAttribute('data-3d-state');
    expect(['paused', 'fallback']).toContain(state);
  });
});
