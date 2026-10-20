// Run through `vercel env run -- node tools/run-preview-tests.mjs`.
// Authentication is supplied only to the child process; never written to disk.
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const suite = process.env.PREVIEW_SUITE || 'core';
if (!['core', 'cross-browser'].includes(suite)) throw new Error('Use core or cross-browser PREVIEW_SUITE');
const configuration = suite === 'core' ? 'playwright.config.ts' : 'playwright.cross.config.ts';
const resultsDirectory = suite === 'core' ? 'v22-runs' : 'cross-browser-runs';
const harnessCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const target = new URL(process.env.BASE_URL || '');
if (target.protocol !== 'https:' || !target.hostname.endsWith('.vercel.app') || target.username || target.password) {
  throw new Error('BASE_URL must be an HTTPS Vercel preview origin');
}
if (!process.env.VERCEL_OIDC_TOKEN) throw new Error('Run with authenticated Vercel env run');
const repetitions = Number(process.env.PREVIEW_REPETITIONS || 3);
if (!Number.isInteger(repetitions) || repetitions < 1 || repetitions > 5) throw new Error('Use 1–5 repetitions');
const records = [];
for (let run = 1; run <= repetitions; run++) {
  const folder = path.join(root, '.vercel', resultsDirectory, `run-${run}`);
  await mkdir(path.join(folder, 'docs', 'screenshots'), { recursive: true });
  const env = { ...process.env, BASE_URL: target.origin, E2E_ARTIFACT_DIR: folder };
  delete env.DEBUG;
  delete env.PLAYWRIGHT_STORAGE_STATE;
  const code = await new Promise(resolve => {
    const child = spawn(process.execPath, [
      path.join(root, 'node_modules', '@playwright', 'test', 'cli.js'), 'test',
      '--config', path.join(root, configuration),
    ], { cwd: folder, env, stdio: 'inherit' });
    child.on('error', () => resolve(1));
    child.on('exit', code => resolve(code ?? 1));
  });
  const report = JSON.parse(await readFile(path.join(folder, 'browser-results.json'), 'utf8'));
  const networkEvents = [];
  function collect(suite) {
    for (const spec of suite.specs || []) for (const test of spec.tests || []) for (const result of test.results || []) {
      for (const attachment of result.attachments || []) if (attachment.name === 'preview-network-diagnostics' && attachment.body) {
        networkEvents.push(...JSON.parse(Buffer.from(attachment.body, 'base64').toString()));
      }
    }
    for (const child of suite.suites || []) collect(child);
  }
  report.suites.forEach(collect);
  records.push({ run, code, stats: report.stats, networkEvents });
  await writeFile(path.join(root, '.vercel', resultsDirectory, 'summary.json'), JSON.stringify({
    preview: target.origin, harnessCommit, suite, configuration,
    environment: 'Protected Preview; origin-scoped short-lived OIDC; zero test retries; at most one bounded asset/navigation GET transport retry; no API retries',
    requestedRuns: repetitions, completedRuns: records.length,
    runs: records, passed: records.length === repetitions && records.every(record => record.code === 0 && record.stats.unexpected === 0 &&
      record.stats.skipped === 0 && record.stats.flaky === 0),
  }, null, 2));
  if (code !== 0) process.exitCode = 1;
}
