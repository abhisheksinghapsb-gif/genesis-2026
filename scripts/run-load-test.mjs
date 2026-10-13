import autocannon from 'autocannon';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs');
fs.mkdirSync(outDir, { recursive: true });

async function runPageLoadTest() {
  console.log('\n============================================================');
  console.log('▶ [1/2] Running Page Load Test: 300 Virtual Users on http://localhost:3000');
  console.log('============================================================');

  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: 'http://localhost:3000/',
        connections: 300,
        duration: 15, // 15 seconds burst
        pipelining: 1,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function runApiLoadTest() {
  console.log('\n============================================================');
  console.log('▶ [2/2] Running API Load Test: ~50 req/s on /api/register');
  console.log('============================================================');

  let counter = 0;

  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: 'http://localhost:3000/api/register',
        method: 'POST',
        connections: 15,
        duration: 15,
        headers: {
          'Content-Type': 'application/json',
        },
        requests: [
          {
            setupRequest: (req) => {
              counter++;
              const unique = `${Date.now()}-${counter}-${Math.floor(Math.random() * 10000)}`;
              const phone = `+9198${String(Math.floor(10000000 + Math.random() * 90000000))}`;
              req.body = JSON.stringify({
                teamName: `Load Squad ${unique}`,
                track: counter % 2 === 0 ? 'gaming' : 'vr',
                college: 'Army Institute of Technology',
                city: 'Pune',
                leaderName: `Load Leader ${counter}`,
                leaderEmail: `load.${unique}@example.com`,
                leaderPhone: phone,
                members: [],
                consent: true,
                turnstileToken: 'test-turnstile-token',
              });
              // Unique IP per request to test backend capacity without hitting rate limit blocker
              req.headers['x-forwarded-for'] = `10.10.${Math.floor(counter / 255)}.${counter % 255}`;
              return req;
            },
          },
        ],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function main() {
  try {
    const pageResult = await runPageLoadTest();
    console.log(`\n✓ Page Load Complete: ${pageResult.requests.total} requests, average ${pageResult.requests.average} req/sec`);
    console.log(`  Latency: p50 = ${pageResult.latency.p50} ms, p99 = ${pageResult.latency.p99} ms`);

    const apiResult = await runApiLoadTest();
    console.log(`\n✓ API Load Complete: ${apiResult.requests.total} requests, average ${apiResult.requests.average} req/sec`);
    console.log(`  Latency: p50 = ${apiResult.latency.p50} ms, p99 = ${apiResult.latency.p99} ms`);

    const summary = {
      tool: 'autocannon (Node.js)',
      timestamp: new Date().toISOString(),
      pageTest: {
        target: 'http://localhost:3000/',
        virtualUsers: 300,
        durationSeconds: 15,
        totalRequests: pageResult.requests.total,
        reqPerSecAvg: pageResult.requests.average,
        throughputBytesSec: pageResult.throughput.average,
        latency: {
          p50: pageResult.latency.p50,
          p90: pageResult.latency.p90,
          p99: pageResult.latency.p99,
          max: pageResult.latency.max,
        },
        errors: pageResult.errors,
        timeouts: pageResult.timeouts,
      },
      apiTest: {
        target: 'http://localhost:3000/api/register',
        targetRate: '~50 req/s',
        connections: 15,
        durationSeconds: 15,
        totalRequests: apiResult.requests.total,
        reqPerSecAvg: apiResult.requests.average,
        throughputBytesSec: apiResult.throughput.average,
        latency: {
          p50: apiResult.latency.p50,
          p90: apiResult.latency.p90,
          p99: apiResult.latency.p99,
          max: apiResult.latency.max,
        },
        errors: apiResult.errors,
        timeouts: apiResult.timeouts,
      },
    };

    const outPath = path.join(outDir, 'load-test-report.json');
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
    console.log(`\n✅ Summary saved to ${outPath}`);
    process.exit(0);
  } catch (err) {
    console.error('Load test error:', err);
    process.exit(1);
  }
}

main();
