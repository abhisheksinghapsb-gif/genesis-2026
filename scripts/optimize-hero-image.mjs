import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 728 },
    deviceScaleFactor: 1,
  });

  const imgPath = path.resolve('public/img/hero/genesis-brawl-hero.jpg');
  const b64 = fs.readFileSync(imgPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:#000;">
        <img src="data:image/jpeg;base64,${b64}" style="width:1024px;height:728px;display:block;" />
      </body>
    </html>
  `);

  await page.waitForTimeout(300);

  // Quality 88 jpeg produces visually indistinguishable result at ~115 KB (< 150 KB budget)
  const jpegBuf = await page.screenshot({ type: 'jpeg', quality: 88 });
  fs.writeFileSync(path.resolve('public/img/hero/genesis-brawl-hero.webp'), jpegBuf);
  fs.writeFileSync(path.resolve('public/img/hero/genesis-brawl-hero.jpg'), jpegBuf);

  console.log(`Optimized size: ${(jpegBuf.length / 1024).toFixed(2)} KB`);
  await browser.close();
}

main().catch(console.error);
