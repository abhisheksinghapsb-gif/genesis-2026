import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BUDGETS = {
  maxHeroImageKb: 150,
  max3DModelKb: 300,
  maxInitialJsGzipKb: 170,
  maxFirstLoadTotalMb: 1.5,
};

let hasErrors = false;

console.info('==============================================');
console.info('   GENESIS 2026 - ASSET & BUNDLE BUDGET CHECK ');
console.info('==============================================\n');

// 1. Check Image Assets
console.info('▶ [1/3] Checking Image Assets Budget (Max 150 KB per layer)...');
const imgDir = path.resolve(process.cwd(), 'public/img');
if (fs.existsSync(imgDir)) {
  const getFilesRecursively = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFilesRecursively(file));
      } else {
        results.push(file);
      }
    });
    return results;
  };

  const files = getFilesRecursively(imgDir);
  let checkedCount = 0;
  for (const fullPath of files) {
    const stats = fs.statSync(fullPath);
    const sizeKb = stats.size / 1024;
    const relPath = path.relative(imgDir, fullPath);
    checkedCount++;
    if (sizeKb > BUDGETS.maxHeroImageKb) {
      console.error(`  ❌ FAIL: ${relPath} is ${sizeKb.toFixed(2)} KB (exceeds ${BUDGETS.maxHeroImageKb} KB)`);
      hasErrors = true;
    } else {
      console.info(`  ✓ PASS: ${relPath} (${sizeKb.toFixed(2)} KB)`);
    }
  }
  if (checkedCount === 0) {
    console.info('  ℹ No static images found in public/img yet.');
  }
} else {
  console.info('  ℹ public/img directory initialized.');
}

// 2. Check 3D Models
console.info('\n▶ [2/3] Checking 3D Models Budget (Max 300 KB per GLB)...');
const modelsDir = path.resolve(process.cwd(), 'public/models');
if (fs.existsSync(modelsDir)) {
  const files = fs.readdirSync(modelsDir);
  let checkedCount = 0;
  for (const file of files) {
    const fullPath = path.join(modelsDir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.glb') || file.endsWith('.gltf'))) {
      const stats = fs.statSync(fullPath);
      const sizeKb = stats.size / 1024;
      checkedCount++;
      if (sizeKb > BUDGETS.max3DModelKb) {
        console.error(`  ❌ FAIL: ${file} is ${sizeKb.toFixed(2)} KB (exceeds ${BUDGETS.max3DModelKb} KB)`);
        hasErrors = true;
      } else {
        console.info(`  ✓ PASS: ${file} (${sizeKb.toFixed(2)} KB)`);
      }
    }
  }
  if (checkedCount === 0) {
    console.info('  ℹ Procedural 3D in use (0 KB download budget consumed).');
  }
}

// 3. Check Next.js Build Output (using app-build-manifest.json)
console.info('\n▶ [3/3] Checking Next.js Bundle Output...');
const appManifestPath = path.resolve(process.cwd(), '.next/app-build-manifest.json');
if (fs.existsSync(appManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(appManifestPath, 'utf8'));
  const pageChunks = manifest.pages['/page'] || [];

  let totalUncompressed = 0;
  let totalGzip = 0;

  for (const chunk of pageChunks) {
    const fullPath = path.resolve(process.cwd(), '.next', chunk);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      totalUncompressed += fileBuffer.length;
      totalGzip += zlib.gzipSync(fileBuffer).length;
    }
  }

  const uncompressedKb = totalUncompressed / 1024;
  const gzipKb = totalGzip / 1024;

  console.info(`  ℹ First Load JS (uncompressed): ${uncompressedKb.toFixed(2)} KB`);
  console.info(`  ℹ First Load JS (gzipped): ${gzipKb.toFixed(2)} KB (Budget: <= ${BUDGETS.maxInitialJsGzipKb} KB)`);

  if (gzipKb > BUDGETS.maxInitialJsGzipKb) {
    console.error(`  ❌ FAIL: First load JS gzipped (${gzipKb.toFixed(2)} KB) exceeds budget of ${BUDGETS.maxInitialJsGzipKb} KB`);
    hasErrors = true;
  } else {
    console.info(`  ✓ PASS: First load JS is well within strict budget.`);
  }
} else {
  console.info('  ℹ .next/app-build-manifest.json not found (run `npm run build` before checking bundle output).');
}

console.info('\n==============================================');
if (hasErrors) {
  console.error('❌ BUDGET CHECK FAILED! One or more assets exceeded strict performance limits.');
  process.exit(1);
} else {
  console.info('✅ ALL BUDGET CHECKS PASSED.');
  process.exit(0);
}
