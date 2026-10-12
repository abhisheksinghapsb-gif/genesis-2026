import { test, expect } from '@playwright/test';

const innerRoutes = ['/about/', '/timeline/', '/prize-pool/', '/sponsors/', '/faqs/', '/memories/'];

test.describe('Phase U1: Navigation Verification (N-01 to N-06)', () => {
  // Test 1: bar-stays-pinned (N-01)
  // On every inner route, scroll to the very bottom; Back, Home and Menu in TopBar must remain in the viewport.
  test('1. bar-stays-pinned: TopBar controls remain in viewport after scrolling', async ({ page }) => {
    for (const route of innerRoutes) {
      await page.goto(route);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);

      const header = page.locator('header');
      const backBtn = header.getByRole('button', { name: /back/i });
      const homeBtn = header.getByRole('link', { name: /home/i });
      const menuBtn = header.getByRole('button', { name: /menu/i });

      await expect(backBtn, `Back button should be in viewport on ${route}`).toBeInViewport();
      await expect(homeBtn, `Home button should be in viewport on ${route}`).toBeInViewport();
      await expect(menuBtn, `Menu button should be in viewport on ${route}`).toBeInViewport();
    }
  });

  // Test 2: menu-from-everywhere (N-02)
  // On every inner route open the menu; each item reaches its route; current has aria-current="page".
  test('2. menu-from-everywhere: Menu drawer accessible and marks current route', async ({ page }) => {
    for (const route of innerRoutes) {
      await page.goto(route);
      const menuBtn = page.locator('header').getByRole('button', { name: /menu/i });
      await expect(menuBtn, `Menu button must exist in TopBar on ${route}`).toBeVisible();
      await menuBtn.click();

      // Drawer should open and mark current screen
      const currentItem = page.locator('[aria-current="page"]');
      await expect(currentItem, `Current screen should have aria-current="page" on ${route}`).toBeVisible();

      // Close drawer via Escape key
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: /navigation menu/i })).toHaveCount(0);
    }
  });

  // Test 3: back-after-deep-link (N-03)
  // Open /faqs/ directly; Back lands on /
  test('3. back-after-deep-link: Direct link to /faqs/ navigates back to /', async ({ page }) => {
    await page.goto('/faqs/');
    const backBtn = page.locator('header').getByRole('button', { name: /back/i });
    await backBtn.click();
    await expect(page).toHaveURL(/\/$/);
  });

  // Test 4: back-chain (N-03)
  // / -> About -> Timeline -> Back -> About -> Back -> /
  test('4. back-chain: Sequential navigation back chain reaches /', async ({ page }) => {
    await page.goto('/');
    // Landing page header has no Back button
    await expect(page.locator('header').getByRole('button', { name: /back/i })).toHaveCount(0);

    // Open About from menu
    await page.locator('header').getByRole('button', { name: /open menu|menu/i }).click();
    await page.locator('[role="dialog"]').getByRole('link', { name: 'ABOUT', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?/);

    // Navigate to Timeline via TopBar menu
    await page.locator('header').getByRole('button', { name: /menu/i }).click();
    await page.locator('[role="dialog"]').getByRole('link', { name: 'TIMELINE', exact: true }).click();
    await expect(page).toHaveURL(/\/timeline\/?/);

    // Press Back in TopBar -> lands on About
    await page.locator('header').getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL(/\/about\/?/);

    // Press Back in TopBar -> lands on Landing
    await page.locator('header').getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  // Test 5: back-after-reload (N-03)
  // Reload on /prize-pool/; Back lands on /
  test('5. back-after-reload: Reloading on an inner screen allows Back to /', async ({ page }) => {
    await page.goto('/prize-pool/');
    await page.reload();
    const backBtn = page.locator('header').getByRole('button', { name: /back/i });
    await backBtn.click();
    await expect(page).toHaveURL(/\/$/);
  });

  // Test 6: hardware-back-closes-overlay (N-06)
  // Overlays own a history entry so browser Back closes overlay and stays on page.
  test('6. hardware-back-closes-overlay: Back closes overlay; hash link opens modal', async ({ page }) => {
    // 6a: Navigate to timeline, open modal via info dot
    await page.goto('/timeline/');
    const firstInfoDot = page.getByRole('button', { name: /more info about stage 1/i }).first();
    await firstInfoDot.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page).toHaveURL(/#m=stage-1/);

    // 6b: Browser back closes modal and restores clean URL without page reload
    await page.goBack();
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page).toHaveURL(/\/timeline\/?$/);

    // 6c: Direct hash link opens modal on load
    await page.goto('/timeline/#m=stage-3');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toContainText(/stage 03/i);
  });

  // Test 7: rail-links (§10.7)
  // Each inner route shows the right previous and next tabs; About's previous is Home; FAQs' next is REGISTER.
  test('7. rail-links: Sequence navigation rail has correct links and CTAs', async ({ page }) => {
    // About: Prev is Home (/), Next is Timeline (/timeline/)
    await page.goto('/about/');
    const aboutRail = page.locator('nav[aria-label="Screen sequence navigation"]');
    await expect(aboutRail.getByRole('link', { name: /previous: home/i })).toBeVisible();
    await expect(aboutRail.getByRole('link', { name: /next: timeline/i })).toBeVisible();

    // FAQs: Prev is Sponsors (/sponsors/), Next is REGISTER
    await page.goto('/faqs/');
    const faqsRail = page.locator('nav[aria-label="Screen sequence navigation"]');
    await expect(faqsRail.getByRole('link', { name: /previous: sponsors/i })).toBeVisible();
    await expect(faqsRail.getByRole('button', { name: /register/i })).toBeVisible();
  });

  // Test 8: no-horizontal-scroll (§10.8)
  // document.documentElement.scrollWidth <= window.innerWidth on every route.
  test('8. no-horizontal-scroll: No unexpected horizontal scroll across routes', async ({ page }) => {
    for (const route of ['/', ...innerRoutes]) {
      await page.goto(route);
      const isHorizontalScrollFree = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth + 2;
      });
      expect(isHorizontalScrollFree, `Route ${route} should not have horizontal overflow`).toBe(true);
    }
  });

  // Test 9: focus-after-navigation (§10.9)
  // Screen reader live region announces title after route change
  test('9. focus-after-navigation: Screen reader live region exists and announces route changes', async ({ page }) => {
    await page.goto('/about/');
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toHaveCount(1);
    await expect(liveRegion).toContainText(/about|genesis/i);
  });

  // Test 10: reduced-motion (§10.10)
  // Under reduced-motion, no infinite animations are running
  test('10. reduced-motion: No infinite animations when prefers-reduced-motion is active', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const infiniteAnimationsCount = await page.evaluate(() => {
      return document
        .getAnimations()
        .filter((a) => (a.effect as any)?.getComputedTiming?.()?.iterations === Infinity).length;
    });
    expect(infiniteAnimationsCount).toBe(0);
  });

  // Test 11: register-without-url (§10.11)
  // When no registrationUrl is set, clicking Register triggers toast with action button
  test('11. register-without-url: Clicking Register triggers status toast with action link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^register$/i }).click({ force: true });
    const toast = page.locator('[role="status"]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/registrations opening soon/i);
    await expect(toast.getByRole('link', { name: /see faqs/i })).toBeVisible();
  });
});
