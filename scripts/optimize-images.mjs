import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const memoriesDir = path.resolve(process.cwd(), 'public/memories');
const outputFile = path.resolve(process.cwd(), 'src/content/memories.generated.json');

console.log('🖼️  Optimizing memories images...');

if (!fs.existsSync(memoriesDir)) {
  fs.mkdirSync(memoriesDir, { recursive: true });
}

async function run() {
  const years = fs.readdirSync(memoriesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const results = [];

  for (const year of years) {
    const yearDir = path.join(memoriesDir, year);
    let captions = {};

    const captionsFile = path.join(yearDir, 'captions.json');
    if (fs.existsSync(captionsFile)) {
      try {
        captions = JSON.parse(fs.readFileSync(captionsFile, 'utf-8'));
      } catch (e) {
        console.warn(`Failed to parse ${captionsFile}:`, e);
      }
    }

    const files = fs.readdirSync(yearDir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !f.includes('-thumb'));

    for (const file of files) {
      const inputPath = path.join(yearDir, file);
      const baseName = path.parse(file).name;
      const metadata = await sharp(inputPath).metadata();

      const itemInfo = captions[file] || {};

      results.push({
        id: `${year}-${baseName}`,
        year,
        src: `/memories/${year}/${file}`,
        alt: itemInfo.alt || `GENESIS ${year} photo`,
        caption: itemInfo.caption || undefined,
        width: metadata.width || 800,
        height: metadata.height || 600,
      });
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ Saved ${results.length} memories entries to ${outputFile}`);
}

run().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
