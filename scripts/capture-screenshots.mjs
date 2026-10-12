import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

console.log('▶ Starting Next.js production server on port 3000...');
const server = spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'start', '--', '-p', '3000'], {
  stdio: 'pipe',
});

const waitForServer = async (url, maxAttempts = 30) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
};

const run = async () => {
  const ready = await waitForServer('http://localhost:3000');
  if (!ready) {
    console.error('Server failed to start in time.');
    server.kill();
    process.exit(1);
  }

  const browser = await chromium.launch();

  const viewports = [
    { name: 'phase4-sponsors-390', selector: '#sponsors', width: 390, height: 844 },
    { name: 'phase4-sponsors-768', selector: '#sponsors', width: 768, height: 1024 },
    { name: 'phase4-sponsors-1440', selector: '#sponsors', width: 1440, height: 1024 },
    { name: 'phase4-memories-390', selector: '#memories', width: 390, height: 844 },
    { name: 'phase4-memories-768', selector: '#memories', width: 768, height: 1024 },
    { name: 'phase4-memories-1440', selector: '#memories', width: 1440, height: 1024 },
    { name: 'phase4-faq-390', selector: '#faq', width: 390, height: 844 },
    { name: 'phase4-faq-768', selector: '#faq', width: 768, height: 1024 },
    { name: 'phase4-faq-1440', selector: '#faq', width: 1440, height: 1024 },
    { name: 'phase4-footer-1440', selector: 'footer', width: 1440, height: 1024 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);

    const el = page.locator(vp.selector);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const shotPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  ✓ Saved ${shotPath}`);
    await page.close();
  }

  await browser.close();
  server.kill();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  server.kill();
  process.exit(1);
});
