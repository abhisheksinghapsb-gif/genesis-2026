import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const routes = [
  { path: '/', name: 'landing' },
  { path: '/about', name: 'about' },
  { path: '/timeline', name: 'timeline' },
  { path: '/prize-pool', name: 'prize-pool' },
  { path: '/sponsors', name: 'sponsors' },
  { path: '/faqs', name: 'faqs' },
  { path: '/memories', name: 'memories' },
  { path: '/privacy', name: 'privacy' },
];

const port = process.env.PORT || 3000;

async function run() {
  console.log('🚀 Launching Chrome for screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  for (const r of routes) {
    const url = `http://localhost:${port}${r.path}`;
    console.log(`📸 Capturing ${r.name} (${url})...`);

    // 1. Desktop: 1440 x 1024
    await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((res) => setTimeout(res, 600));
    const desktopFile = path.join(outputDir, `${r.name}-desktop.png`);
    await page.screenshot({ path: desktopFile, fullPage: false });
    console.log(`  ✓ Desktop: ${desktopFile}`);

    // 2. Short Laptop Window: 1280 x 600
    await page.setViewport({ width: 1280, height: 600, deviceScaleFactor: 1 });
    await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((res) => setTimeout(res, 600));
    const shortFile = path.join(outputDir, `${r.name}-short.png`);
    await page.screenshot({ path: shortFile, fullPage: false });
    console.log(`  ✓ Short laptop: ${shortFile}`);

    // 3. Mobile: 390 x 844
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((res) => setTimeout(res, 600));
    const mobileFile = path.join(outputDir, `${r.name}-mobile.png`);
    await page.screenshot({ path: mobileFile, fullPage: false });
    console.log(`  ✓ Mobile: ${mobileFile}`);
  }

  await browser.close();
  console.log('🎉 All screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
