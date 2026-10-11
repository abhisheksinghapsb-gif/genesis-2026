import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const route = process.argv[2] || '/';
const phase = process.argv[3] || 'phase';
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}${route}`;

console.log(`📸 Taking screenshots for route: ${baseUrl} (phase: ${phase})...`);

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop: 1440 x 1024
    await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait an extra 500ms for animations and fonts to settle
    await new Promise((r) => setTimeout(r, 600));

    const desktopPath = path.join(outputDir, `${phase}-desktop.png`);
    await page.screenshot({ path: desktopPath, fullPage: false });
    console.log(`Saved desktop screenshot: ${desktopPath}`);

    // 2. Mobile: 390 x 844
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));

    const mobilePath = path.join(outputDir, `${phase}-mobile.png`);
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log(`Saved mobile screenshot: ${mobilePath}`);
  } catch (err) {
    console.error('Screenshot failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
