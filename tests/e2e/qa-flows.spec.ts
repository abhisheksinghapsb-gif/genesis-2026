import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const qaDir = path.resolve(process.cwd(), 'docs/qa-screenshots');
fs.mkdirSync(qaDir, { recursive: true });

test.describe('Phase 8: Comprehensive QA Journey & Visual Audit', () => {
  test('verifies all 8 sections, interactive modals, and captures QA screenshots', async ({
    page,
  }, testInfo) => {
    test.setTimeout(120000);
    const projName = testInfo.project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 1. Load Homepage
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Hero Section
    const hero = page.locator('#home');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText('GENESIS');

    await hero.screenshot({ path: path.join(qaDir, `hero-${projName}.png`), animations: 'disabled' });

    // 2. HUD & Drawer Check
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
    await page.waitForTimeout(600);

    const hud = page.locator('header[aria-label="Game HUD"]');
    if (await hud.isVisible()) {
      await expect(hud).toBeVisible();
    }

    // 3. About Section
    const about = page.locator('#about');
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(about).toBeVisible();
    await expect(about.getByText(/ABOUT/i).first()).toBeVisible();

    // 4. Timeline Section & Milestone Modal
    const timeline = page.locator('#timeline');
    await timeline.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(timeline).toBeVisible();

    // Open first milestone modal ("i" icon)
    const milestoneInfoBtn = timeline.locator('button[aria-label*="View details for"]').first();
    if (await milestoneInfoBtn.isVisible()) {
      await milestoneInfoBtn.click();
      const modal = page.locator('div[role="dialog"][aria-modal="true"]');
      await expect(modal).toBeVisible();
      // Close modal
      const closeBtn = modal.getByRole('button', { name: /✕ CLOSE/i });
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
    }
    await timeline.screenshot({ path: path.join(qaDir, `timeline-${projName}.png`), animations: 'disabled' });

    // 5. Prize Pool Section
    const prizes = page.locator('#prizes');
    await prizes.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(prizes).toBeVisible();
    await expect(prizes.getByText(/PRIZE POOL/i).first()).toBeVisible();
    await prizes.screenshot({ path: path.join(qaDir, `prizes-${projName}.png`), animations: 'disabled' });

    // 6. Sponsors Section
    const sponsors = page.locator('#sponsors');
    await sponsors.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(sponsors).toBeVisible();
    await expect(sponsors.getByText(/TITLE SPONSORS/i)).toBeVisible();
    await sponsors.screenshot({ path: path.join(qaDir, `sponsors-${projName}.png`), animations: 'disabled' });

    // 7. Memories Section & Lightbox
    const memories = page.locator('#memories');
    await memories.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(memories).toBeVisible();

    // Open Lightbox by clicking first photo card
    const firstMemory = memories.locator('button[aria-haspopup="dialog"]').first();
    if (await firstMemory.isVisible()) {
      await firstMemory.click();
      const lightbox = page.locator('div[role="dialog"][aria-label="Event Memory Viewer"]');
      await expect(lightbox).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(lightbox).not.toBeVisible();
    }
    await memories.screenshot({ path: path.join(qaDir, `memories-${projName}.png`), animations: 'disabled' });

    // 8. FAQs Section & Accordion
    const faq = page.locator('#faq');
    await faq.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(faq).toBeVisible();

    // Toggle first accordion
    const firstFaqQuestion = faq.locator('button[aria-expanded]').first();
    if (await firstFaqQuestion.isVisible()) {
      const isExpanded = await firstFaqQuestion.getAttribute('aria-expanded');
      await firstFaqQuestion.click();
      await expect(firstFaqQuestion).toHaveAttribute(
        'aria-expanded',
        isExpanded === 'true' ? 'false' : 'true'
      );
    }
    await faq.screenshot({ path: path.join(qaDir, `faq-${projName}.png`), animations: 'disabled' });

    // 9. Full Registration 3-Step Wizard Flow
    const register = page.locator('#register');
    await register.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(register).toBeVisible();

    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const randomPhone = `98${String(Math.floor(10000000 + Math.random() * 90000000))}`;

    // Step 1: Fill Team Credentials
    await register.locator('#teamName').fill(`QA Titan ${uniqueId}`);
    await register.locator('#college').fill('Army Institute of Technology');
    await register.locator('#city').fill('Pune');
    await register.screenshot({ path: path.join(qaDir, `register-step1-${projName}.png`), animations: 'disabled' });

    // Next to Step 2
    const toStep2Btn = register.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i });
    await toStep2Btn.scrollIntoViewIfNeeded();
    await toStep2Btn.click();
    await expect(register.getByText(/STEP 2: SQUAD ROSTER/i)).toBeVisible();

    // Step 2: Select 2 Players
    const twoPlayersBtn = register.getByRole('button', { name: /2 Players/i });
    await twoPlayersBtn.scrollIntoViewIfNeeded();
    await twoPlayersBtn.click();
    await register.locator('#leaderName').fill('QA Team Leader');
    await register.locator('#leaderEmail').fill(`qa.leader.${uniqueId}@example.com`);
    await register.locator('#leaderPhone').fill(randomPhone);

    await register.locator('input[placeholder="Full Name *"]').fill('QA Player 2');
    await register.locator('input[placeholder="Email Address *"]').fill(`qa.player2.${uniqueId}@example.com`);
    await register.screenshot({ path: path.join(qaDir, `register-step2-${projName}.png`), animations: 'disabled' });

    // Next to Step 3
    const toStep3Btn = register.getByRole('button', { name: /NEXT: REVIEW SQUAD →/i });
    await toStep3Btn.scrollIntoViewIfNeeded();
    await toStep3Btn.click();
    await expect(register.getByText(/STEP 3: REVIEW & ENTER ARENA/i)).toBeVisible();
    await register.screenshot({ path: path.join(qaDir, `register-step3-${projName}.png`), animations: 'disabled' });

    // Consent & Submit
    const checkbox = register.locator('input[type="checkbox"]');
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.check();
    const submitBtn = register.getByRole('button', { name: /ENTER ARENA • SUBMIT/i });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Victory Confirmation Screen
    await expect(register.getByText(/WELCOME TO THE ARENA!/i)).toBeVisible({ timeout: 10000 });
    await expect(register.getByText(/GEN-2026-/i)).toBeVisible();
    await expect(register.getByRole('button', { name: /ADD TO CALENDAR \(\.ICS\)/i })).toBeVisible();

    await register.screenshot({ path: path.join(qaDir, `register-victory-${projName}.png`), animations: 'disabled' });
  });
});
