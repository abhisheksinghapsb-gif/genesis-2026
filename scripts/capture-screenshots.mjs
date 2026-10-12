import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

console.log('▶ Starting Next.js production server on port 3000...');
const server = spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'start', '--', '-p', '3000'], {
  stdio: 'pipe',
  detached: false,
});

server.stdout.on('data', (d) => process.stdout.write(d.toString()));
server.stderr.on('data', (d) => process.stderr.write(d.toString()));

// Wait for server to become ready
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

  console.log('▶ Server is ready. Launching headless browser to capture multi-breakpoint screenshots...');
  const browser = await chromium.launch();

  const viewports = [
    { name: 'phase1-390', width: 390, height: 844 },
    { name: 'phase1-768', width: 768, height: 1024 },
    { name: 'phase1-1440', width: 1440, height: 1024 },
  ];

  for (const vp of viewports) {
    console.log(`  📸 Capturing ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    // Wait for the light loader to dismiss
    await page.waitForTimeout(1500);

    // Scroll down a bit to show HUD in action
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.9));
    await page.waitForTimeout(500);

    const shotPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  ✓ Saved ${shotPath}`);
    await page.close();
  }

  await browser.close();
  console.log('▶ Stopping server...');
  server.kill();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  server.kill();
  process.exit(1);
});
