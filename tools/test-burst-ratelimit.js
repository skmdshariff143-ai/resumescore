/* eslint-disable */
const { spawn } = require('child_process');
const http = require('http');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkServerReady(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
          resolve(true);
        });
        req.on('error', reject);
        req.end();
      });
      return true;
    } catch {
      await wait(500);
    }
  }
  return false;
}

async function postJson(url, data, headers = {}) {
  const body = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let resBody = '';
        res.on('data', (chunk) => (resBody += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: resBody,
          });
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const PORT = 3006;
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const serverProc = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: 'E:/resumescore',
    stdio: 'ignore',
    shell: true,
  });

  try {
    const ready = await checkServerReady(PORT);
    if (!ready) {
      throw new Error('Next.js server failed to start in time');
    }
    console.log(`Next.js server is ready on port ${PORT}.\n`);

    const clientIp = '198.51.100.88';
    const samplePayload = {
      resumeText: 'Jane Doe\njane@example.com | 555-0100\n\nEXPERIENCE\nSenior Staff Architect at Nexus | 2019 - Present\n• Architected real-time streaming platform serving 20M users.\n\nSKILLS\nGo, Rust, Kafka, Kubernetes, AWS',
    };

    console.log('=== CONCURRENT BURST TEST: 12 rapid requests to POST /api/ai/critique (Limit: 10/min) ===');
    const burstPromises = Array.from({ length: 12 }, (_, i) =>
      postJson(`http://127.0.0.1:${PORT}/api/ai/critique`, samplePayload, {
        'x-forwarded-for': clientIp,
      }).then((res) => ({ index: i + 1, ...res }))
    );

    const burstResults = await Promise.all(burstPromises);
    for (const res of burstResults) {
      if (res.status === 200) {
        console.log(`Request #${res.index}: HTTP ${res.status} OK`);
      } else if (res.status === 429) {
        console.log(`Request #${res.index}: HTTP ${res.status} TOO MANY REQUESTS | Retry-After: ${res.headers['retry-after']}s | Body: ${res.body}`);
      } else {
        console.log(`Request #${res.index}: HTTP ${res.status} | Body: ${res.body}`);
      }
    }

    const rateLimitedCount = burstResults.filter((r) => r.status === 429).length;
    console.log(`\nRate limit burst summary: ${12 - rateLimitedCount} allowed, ${rateLimitedCount} blocked with HTTP 429.`);

    console.log('\n=== MALFORMED SCHEMA TEST: POST /api/ai/critique with invalid resume object ===');
    const malformedRes = await postJson(
      `http://127.0.0.1:${PORT}/api/ai/critique`,
      { resume: { notAValidResume: true, badData: 123 } },
      { 'x-forwarded-for': '198.51.100.99' }
    );
    console.log(`Malformed Resume Test: HTTP ${malformedRes.status}`);
    console.log(`Response Body: ${malformedRes.body}`);

    console.log('\n=== MALFORMED JOB SCHEMA TEST: POST /api/ai/critique with invalid job object ===');
    const malformedJobRes = await postJson(
      `http://127.0.0.1:${PORT}/api/ai/critique`,
      {
        resumeText: 'Jane Doe\njane@example.com\nSenior Engineer at Google\nSkills: Go, Python',
        job: { invalidJobField: true },
      },
      { 'x-forwarded-for': '198.51.100.99' }
    );
    console.log(`Malformed Job Test: HTTP ${malformedJobRes.status}`);
    console.log(`Response Body: ${malformedJobRes.body}`);

    console.log('\nBurst and schema tests completed successfully.');
  } finally {
    console.log('Shutting down server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(serverProc.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      serverProc.kill();
    }
    await wait(1000);
  }
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
