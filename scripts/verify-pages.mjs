import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait 2 seconds for videos and animations to initialize
  await page.waitForTimeout(2000);

  const outDir = path.resolve('public/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Hero Screenshot
  await page.screenshot({ path: path.join(outDir, 'hero.png'), fullPage: false });
  console.log('Saved hero screenshot.');

  // Check video elements
  const videoCount = await page.locator('video').count();
  console.log(`Found ${videoCount} video elements on the page.`);

  // Check sections presence
  const sections = ['#about', '#timeline', '#prizes', '#sponsors', '#memories', '#faq'];
  for (const sel of sections) {
    const el = page.locator(sel);
    const visible = await el.isVisible();
    console.log(`Section ${sel} visible:`, visible);
    if (visible) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const name = sel.replace('#', '');
      await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: false });
      console.log(`Saved ${name} screenshot.`);
    }
  }

  await browser.close();

  console.log('Console errors encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }
}

main().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
