import { test, expect } from '@playwright/test';

test.describe('Registration 3-Step Wizard E2E Flow', () => {
  test('progresses through Team Info (Step 1), Squad Members (Step 2), Review (Step 3), and unlocks victory badge with calendar download', async ({
    page,
  }) => {
    await page.goto('/#register');

    const registerSection = page.locator('#register');
    await expect(registerSection).toBeVisible();

    // Verify title banner
    await expect(registerSection.getByText(/REGISTER SQUAD/i)).toBeVisible();

    // ---------------- STEP 1: TEAM INFORMATION ----------------
    await expect(registerSection.getByText(/STEP 1: SQUAD & TOURNAMENT TRACK/i)).toBeVisible();

    // Select VR Immersion Track
    const vrTrackBtn = registerSection.getByText(/VR IMMERSION TRACK/i).locator('..');
    await vrTrackBtn.click();

    // Generate unique credentials to support parallel test runs
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const randomDigits = String(Math.floor(100000 + Math.random() * 900000));

    // Fill Step 1 details
    await registerSection.locator('#teamName').fill(`Cyber Titans ${uniqueId}`);
    await registerSection.locator('#college').fill('Army Institute of Technology');
    await registerSection.locator('#city').fill('Pune');

    // Click Next to Step 2
    const toStep2Btn = registerSection.getByRole('button', { name: /NEXT: SQUAD MEMBERS →/i });
    await toStep2Btn.click();

    // ---------------- STEP 2: SQUAD MEMBERS ----------------
    await expect(registerSection.getByText(/STEP 2: SQUAD ROSTER/i)).toBeVisible();

    // Select 2 Players
    const twoPlayersBtn = registerSection.getByRole('button', { name: /2 Players/i });
    await twoPlayersBtn.click();

    // Fill Leader (Player 1)
    await registerSection.locator('#leaderName').fill('Vikram E2E Leader');
    await registerSection.locator('#leaderEmail').fill(`vikram.${uniqueId}@example.com`);
    await registerSection.locator('#leaderPhone').fill(`98${randomDigits}10`);

    // Fill Member 2 details
    await registerSection.locator('input[placeholder="Full Name *"]').fill('Rohan E2E Member');
    await registerSection.locator('input[placeholder="Email Address *"]').fill(`rohan.${uniqueId}@example.com`);

    // Click Next to Step 3
    const toStep3Btn = registerSection.getByRole('button', { name: /NEXT: REVIEW SQUAD →/i });
    await toStep3Btn.click();

    // ---------------- STEP 3: REVIEW & SUBMIT ----------------
    await expect(registerSection.getByText(/STEP 3: REVIEW & ENTER ARENA/i)).toBeVisible();
    await expect(registerSection.getByText(`Cyber Titans ${uniqueId}`)).toBeVisible();
    await expect(registerSection.getByText(/Army Institute of Technology • Pune/i)).toBeVisible();

    // Check consent checkbox
    const consentBox = registerSection.locator('input[type="checkbox"]');
    await consentBox.check();

    // Submit form
    const submitBtn = registerSection.getByRole('button', { name: /ENTER ARENA • SUBMIT/i });
    await submitBtn.click();

    // ---------------- VICTORY STATE ----------------
    await expect(registerSection.getByText(/WELCOME TO THE ARENA!/i)).toBeVisible({ timeout: 10000 });
    await expect(registerSection.getByText(/GEN-2026-/i)).toBeVisible();
    await expect(registerSection.getByRole('button', { name: /COPY ID/i })).toBeVisible();
    await expect(registerSection.getByRole('button', { name: /ADD TO CALENDAR \(\.ICS\)/i })).toBeVisible();
  });
});
