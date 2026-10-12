import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sections = [
  { id: 'hero', name: 'hero' },
  { id: 'about', name: 'about' },
  { id: 'timeline', name: 'timeline' },
  { id: 'prize-pool', name: 'prize-pool' },
  { id: 'sponsors', name: 'sponsors' },
  { id: 'faqs', name: 'faqs' },
  { id: 'memories', name: 'memories' },
  { id: 'register', name: 'register' },
];

const port = process.env.PORT || 3000;

async function run() {
  console.log('🚀 Launching Chrome for V2 continuous page screenshots...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Load the page
  const baseUrl = `http://localhost:${port}/`;

  // 1. Desktop: 1440 x 900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((res) => setTimeout(res, 1200)); // allow loader to finish

  for (const s of sections) {
    console.log(`📸 Capturing Desktop ${s.name}...`);
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, s.id);
    await new Promise((res) => setTimeout(res, 600));

    const desktopFile = path.join(outputDir, `${s.name}-desktop.png`);
    await page.screenshot({ path: desktopFile, fullPage: false });
    console.log(`  ✓ Desktop: ${desktopFile}`);
  }

  // 2. Mobile: 390 x 844
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((res) => setTimeout(res, 1200));

  for (const s of sections) {
    console.log(`📸 Capturing Mobile ${s.name}...`);
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, s.id);
    await new Promise((res) => setTimeout(res, 600));

    const mobileFile = path.join(outputDir, `${s.name}-mobile.png`);
    await page.screenshot({ path: mobileFile, fullPage: false });
    console.log(`  ✓ Mobile: ${mobileFile}`);
  }

  await browser.close();
  console.log('🎉 All V2 screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
