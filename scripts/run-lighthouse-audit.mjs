import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs');
fs.mkdirSync(outDir, { recursive: true });

async function runLighthouse(url, preset = 'desktop') {
  return new Promise((resolve, reject) => {
    const reportPath = path.join(outDir, `lighthouse-${preset}.json`);
    const args = [
      'lighthouse',
      url,
      '--output=json',
      `--output-path=${reportPath}`,
      '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
      '--quiet',
      preset === 'desktop' ? '--preset=desktop' : '--form-factor=mobile',
    ];

    console.log(`▶ Running Lighthouse audit (${preset}) on ${url}...`);
    const proc = spawn('cmd.exe', ['/c', 'npx.cmd', ...args], { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(reportPath)) {
        const raw = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        resolve(raw);
      } else {
        reject(new Error(`Lighthouse exited with code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    const desktopData = await runLighthouse('http://localhost:3000/', 'desktop');
    const mobileData = await runLighthouse('http://localhost:3000/', 'mobile');

    const extractSummary = (data, factor) => {
      const cats = data.categories || {};
      const audits = data.audits || {};
      return {
        formFactor: factor,
        scores: {
          performance: Math.round((cats.performance?.score || 0) * 100),
          accessibility: Math.round((cats.accessibility?.score || 0) * 100),
          bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
          seo: Math.round((cats.seo?.score || 0) * 100),
        },
        metrics: {
          fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
          lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
          tbt: audits['total-blocking-time']?.displayValue || 'N/A',
          cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          speedIndex: audits['speed-index']?.displayValue || 'N/A',
        },
      };
    };

    const summary = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000/',
      desktop: extractSummary(desktopData, 'desktop'),
      mobile: extractSummary(mobileData, 'mobile (emulated)'),
    };

    const summaryPath = path.join(outDir, 'lighthouse-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n✅ Lighthouse summary saved to ${summaryPath}`);
    console.log('Desktop Scores:', summary.desktop.scores);
    console.log('Mobile Scores:', summary.mobile.scores);
    process.exit(0);
  } catch (err) {
    console.error('Lighthouse audit error:', err);
    process.exit(1);
  }
}

main();
