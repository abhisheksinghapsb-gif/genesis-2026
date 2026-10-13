import { test, expect } from '@playwright/test';

test.describe('Registration E2E Flow', () => {
  test('navigates to register section, switches track, adds members, and completes squad registration', async ({
    page,
  }) => {
    await page.goto('/#register');

    const registerSection = page.locator('#register');
    await expect(registerSection).toBeVisible();

    // Verify title banner
    await expect(registerSection.getByText(/REGISTER SQUAD/i)).toBeVisible();

    // Select VR Immersion Track
    const vrTrackBtn = registerSection.getByText(/VR IMMERSION TRACK/i).locator('..');
    await vrTrackBtn.click();

    // Generate unique credentials to support parallel test runner projects
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const randomDigits = String(Math.floor(100000 + Math.random() * 900000));

    // Fill Team Name and Leader details
    await registerSection.locator('#teamName').fill(`Cyber Titans ${uniqueId}`);
    await registerSection.locator('#leaderName').fill('Vikram E2E Leader');
    await registerSection.locator('#leaderEmail').fill(`vikram.${uniqueId}@example.com`);
    await registerSection.locator('#leaderPhone').fill(`+9198${randomDigits}10`);

    // Add a squad member
    const addMemberBtn = registerSection.getByRole('button', { name: /\+ Add Member/i });
    await addMemberBtn.click();
    await expect(registerSection.getByText(/PLAYER 2/i)).toBeVisible();

    // Fill Member 2 details
    await registerSection.locator('input[placeholder="Full Name *"]').fill('Rohan E2E Member');
    await registerSection.locator('input[placeholder="Email Address *"]').fill('rohan.e2e@example.com');

    // Check consent checkbox
    const consentBox = registerSection.locator('input[type="checkbox"]');
    await consentBox.check();

    // Submit form
    const submitBtn = registerSection.getByRole('button', { name: /ENTER ARENA/i });
    await submitBtn.click();

    // Wait for success screen
    await expect(registerSection.getByText(/WELCOME TO THE ARENA!/i)).toBeVisible({ timeout: 10000 });
    await expect(registerSection.getByText(/GEN-2026-/i)).toBeVisible();
    await expect(registerSection.getByRole('button', { name: /COPY ID/i })).toBeVisible();
  });
});
