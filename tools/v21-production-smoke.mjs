import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://localhost:3100';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'This smoke script is restricted to local servers.');
const results = [];
const homepage = await fetch(base);
assert.equal(homepage.status, 200);
assert.equal(homepage.headers.get('x-content-type-options'), 'nosniff');
assert.equal(homepage.headers.get('x-frame-options'), 'DENY');
results.push({ check: 'homepage and security headers', status: homepage.status, passed: true });
for (const [check, path, body, headers, expected] of [
  ['invalid JSON', '/api/analyze', '{', {}, 400],
  ['oversized JSON', '/api/analyze', JSON.stringify({ resumeText: 'x'.repeat(260000) }), {}, 413],
  ['cross-origin', '/api/analyze', '{}', { Origin: 'https://untrusted.example' }, 403],
  ['invalid media type', '/api/analyze', '{}', { 'Content-Type': 'application/jsonp' }, 415],
  ['unsafe URL protocol', '/api/extract-job', JSON.stringify({ url: 'file:///etc/passwd' }), {}, 400],
  ['URL import disabled', '/api/extract-job', JSON.stringify({ url: 'http://169.254.169.254/' }), {}, 503],
  ['heuristic rewrite', '/api/ai/rewrite', JSON.stringify({ bullet: 'Assisted with inventory records.' }), {}, 200],
]) {
  const response = await fetch(new URL(path, base), { method: 'POST', body,
    headers: { 'Content-Type': 'application/json', ...headers } });
  assert.equal(response.status, expected, check);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
  const result = await response.json();
  if (check === 'heuristic rewrite') {
    assert.equal(result.isLLMGenerated, false);
    assert.equal(result.data.xyzFormula, 'Assisted with inventory records.');
    assert.equal(result.verification.requiresApproval, true);
  }
  results.push({ check, status: response.status, passed: true });
}
await writeFile('docs/v21-smoke-measurements.json', JSON.stringify({
  environment: 'Local Next production server; no external AI consent or provider call',
  results,
}, null, 2));
console.log(`${results.length} local production smoke checks passed.`);
