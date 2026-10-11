import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = path.resolve(process.cwd(), 'public/og');
const outputPath = path.join(outputDir, 'genesis-2026.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating 1200x630 OpenGraph social image...');

async function makeOG() {
  const width = 1200;
  const height = 630;

  // Create cosmic observatory background SVG
  const svgBg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#291588" />
          <stop offset="50%" stop-color="#351694" />
          <stop offset="100%" stop-color="#9146EA" />
        </linearGradient>
        <radialGradient id="moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ACE7FD" />
          <stop offset="60%" stop-color="#97DDFD" />
          <stop offset="100%" stop-color="#70B5F0" />
        </radialGradient>
      </defs>
      
      <!-- Sky Background -->
      <rect width="${width}" height="${height}" fill="url(#sky)" />

      <!-- Glowing Giant Moon -->
      <circle cx="600" cy="520" r="320" fill="url(#moon)" opacity="0.95" />

      <!-- Platform Rim -->
      <path d="M 0 540 Q 600 480 1200 540 L 1200 630 L 0 630 Z" fill="#141870" />
      <path d="M 0 540 Q 600 480 1200 540" fill="none" stroke="#2DE4FC" stroke-width="8" />

      <!-- Text "GENESIS 2026" -->
      <text x="600" y="160" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="110" font-weight="900" fill="#D9D9D9" stroke="#000000" stroke-width="8" paint-order="stroke fill">
        GENESIS
      </text>

      <text x="600" y="230" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="34" font-weight="bold" fill="#FDD944" stroke="#000000" stroke-width="4" paint-order="stroke fill">
        FIFTH EDITION · 2026
      </text>

      <text x="600" y="590" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">
        GDXR Club · AIT Pune
      </text>
    </svg>
  `;

  const bgBuffer = Buffer.from(svgBg);

  // Composite the badge in the center
  const badgePath = path.resolve(process.cwd(), 'public/art/badge.png');
  const badgeBuffer = await sharp(badgePath)
    .resize(170, 155)
    .toBuffer();

  await sharp(bgBuffer)
    .composite([
      {
        input: badgeBuffer,
        top: 250,
        left: 515,
      },
    ])
    .png()
    .toFile(outputPath);

  console.log(`✅ Generated social card: ${outputPath}`);
}

makeOG().catch((e) => {
  console.error('Failed to make OG image:', e);
});
