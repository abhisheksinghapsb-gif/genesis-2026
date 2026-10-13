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
    { name: 'phase5-3d-390', url: 'http://localhost:3000/?3d=on', selector: '#home', width: 390, height: 844 },
    { name: 'phase5-3d-768', url: 'http://localhost:3000/?3d=on', selector: '#home', width: 768, height: 1024 },
    { name: 'phase5-3d-1440', url: 'http://localhost:3000/?3d=on', selector: '#home', width: 1440, height: 1024 },
    { name: 'phase5-fallback-390', url: 'http://localhost:3000/?3d=off', selector: '#home', width: 390, height: 844 },
    { name: 'phase5-fallback-768', url: 'http://localhost:3000/?3d=off', selector: '#home', width: 768, height: 1024 },
    { name: 'phase5-fallback-1440', url: 'http://localhost:3000/?3d=off', selector: '#home', width: 1440, height: 1024 },
    { name: 'phase6-register-390', url: 'http://localhost:3000/#register', selector: '#register', width: 390, height: 844 },
    { name: 'phase6-register-768', url: 'http://localhost:3000/#register', selector: '#register', width: 768, height: 1024 },
    { name: 'phase6-register-1440', url: 'http://localhost:3000/#register', selector: '#register', width: 1440, height: 1024 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto(vp.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const el = page.locator(vp.selector);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

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
