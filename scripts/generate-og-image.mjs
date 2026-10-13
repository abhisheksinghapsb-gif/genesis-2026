import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

async function generateOgImage() {
  console.log('▶ Generating 1200x630 OG/Twitter social preview image from hero art...');

  const badgePath = path.resolve('public/img/hero/winged-badge.webp');
  const planetPath = path.resolve('public/img/hero/ringed-planet.webp');

  const badgeB64 = fs.existsSync(badgePath)
    ? `data:image/webp;base64,${fs.readFileSync(badgePath).toString('base64')}`
    : '';
  const planetB64 = fs.existsSync(planetPath)
    ? `data:image/webp;base64,${fs.readFileSync(planetPath).toString('base64')}`
    : '';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 35%, #182C6D 0%, #0B163B 55%, #050B1E 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #FFFFFF;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Ambient stars */
    .star {
      position: absolute;
      background: #FFFFFF;
      border-radius: 50%;
      opacity: 0.6;
    }

    /* Outer golden game-UI frame */
    .frame-border {
      position: absolute;
      inset: 20px;
      border: 4px solid #F59E0B;
      border-radius: 24px;
      box-shadow: 0 0 30px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(245, 158, 11, 0.2);
      pointer-events: none;
    }

    .corner-bolt {
      position: absolute;
      width: 16px;
      height: 16px;
      background: #FBBF24;
      border: 2px solid #78350F;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .bolt-tl { top: 32px; left: 32px; }
    .bolt-tr { top: 32px; right: 32px; }
    .bolt-bl { bottom: 32px; left: 32px; }
    .bolt-br { bottom: 32px; right: 32px; }

    /* Planet */
    .planet {
      position: absolute;
      top: 50px;
      right: 70px;
      width: 170px;
      height: auto;
      filter: drop-shadow(0 0 35px rgba(56, 189, 248, 0.45));
      opacity: 0.85;
    }

    /* Header Pill */
    .badge-pill {
      background: #1E3A8A;
      border: 2px solid #60A5FA;
      color: #93C5FD;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 2.5px;
      padding: 6px 20px;
      border-radius: 9999px;
      text-transform: uppercase;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      margin-bottom: 12px;
    }

    /* Hero Crest */
    .crest {
      width: 155px;
      height: 155px;
      object-fit: contain;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.5));
      margin-bottom: 10px;
    }

    /* Title */
    .title {
      font-size: 78px;
      font-weight: 900;
      letter-spacing: 8px;
      text-transform: uppercase;
      color: #FBBF24;
      text-shadow:
        0 4px 0 #B45309,
        0 8px 0 #78350F,
        0 12px 20px rgba(0,0,0,0.8);
      line-height: 1;
      margin-bottom: 10px;
    }

    .title-edition {
      color: #FFFFFF;
      text-shadow:
        0 4px 0 #475569,
        0 8px 0 #1E293B,
        0 12px 20px rgba(0,0,0,0.8);
    }

    /* Subtitle banner */
    .subtitle {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #E2E8F0;
      margin-bottom: 24px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    }

    /* Tag bar */
    .stats-bar {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .stat-badge {
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid #334155;
      border-radius: 14px;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    }

    .stat-badge.gold {
      border-color: #F59E0B;
      background: linear-gradient(180deg, rgba(245, 158, 11, 0.2) 0%, rgba(180, 83, 9, 0.3) 100%);
    }

    .stat-label {
      font-size: 14px;
      font-weight: 700;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 900;
      color: #F8FAFC;
      letter-spacing: 0.5px;
    }

    .stat-badge.gold .stat-value {
      color: #FDE047;
    }
  </style>
</head>
<body>
  <!-- Ambient Stars -->
  <div class="star" style="top: 80px; left: 140px; width: 4px; height: 4px;"></div>
  <div class="star" style="top: 190px; left: 240px; width: 6px; height: 6px; opacity: 0.8;"></div>
  <div class="star" style="top: 420px; left: 160px; width: 5px; height: 5px;"></div>
  <div class="star" style="top: 510px; left: 320px; width: 4px; height: 4px;"></div>
  <div class="star" style="top: 120px; right: 380px; width: 5px; height: 5px;"></div>
  <div class="star" style="top: 380px; right: 180px; width: 6px; height: 6px; opacity: 0.9;"></div>
  <div class="star" style="top: 490px; right: 280px; width: 4px; height: 4px;"></div>

  <!-- Planet -->
  ${planetB64 ? `<img src="${planetB64}" class="planet" alt="Planet" />` : ''}

  <!-- Border Frame & Bolts -->
  <div class="frame-border"></div>
  <div class="corner-bolt bolt-tl"></div>
  <div class="corner-bolt bolt-tr"></div>
  <div class="corner-bolt bolt-bl"></div>
  <div class="corner-bolt bolt-br"></div>

  <!-- Content -->
  <div class="badge-pill">★ GDXR CLUB • AIT PUNE • 5TH EDITION ★</div>
  ${badgeB64 ? `<img src="${badgeB64}" class="crest" alt="Genesis Badge" />` : ''}
  <div class="title">GENESIS <span class="title-edition">2026</span></div>
  <div class="subtitle">THE 5TH EDITION AR/VR & COMPETITIVE GAMING ODYSSEY</div>

  <div class="stats-bar">
    <div class="stat-badge gold">
      <span class="stat-label">PRIZE POOL</span>
      <span class="stat-value">₹60,000 INR</span>
    </div>
    <div class="stat-badge">
      <span class="stat-label">TRACKS</span>
      <span class="stat-value">GAMING & VR ARENA</span>
    </div>
    <div class="stat-badge">
      <span class="stat-label">VENUE</span>
      <span class="stat-value">AIT PUNE</span>
    </div>
  </div>
</body>
</html>
  `;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.setContent(htmlContent, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const ogPath = path.resolve('public/og-image.png');
  const opengraphPath = path.resolve('public/opengraph-image.png');

  await page.screenshot({ path: ogPath, type: 'png' });
  fs.copyFileSync(ogPath, opengraphPath);

  await browser.close();

  const stat = fs.statSync(ogPath);
  console.log(`✅ OG image created: ${ogPath} (${Math.round(stat.size / 1024)} KB)`);
  console.log(`✅ Opengraph image copied: ${opengraphPath}`);
}

generateOgImage().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
