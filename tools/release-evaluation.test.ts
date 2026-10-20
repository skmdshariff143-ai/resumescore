import { it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { evaluateReleaseDataset } from '../src/lib/evaluation/release-evaluation';

it('runs the offline release evaluation without exporting candidate data', () => {
  const file = process.env.RESUMESCORE_EVALUATION_DATASET || 'evaluation/synthetic.json';
  if (statSync(file).size > 8 * 1024 * 1024) throw new Error('Evaluation dataset exceeds 8 MB');
  const bytes = readFileSync(file);
  let report;
  try { report = evaluateReleaseDataset(JSON.parse(bytes.toString('utf8'))); }
  catch { throw new Error('Invalid evaluation dataset. Check schema, source spans and independent review/adjudication declarations locally; sensitive values withheld.'); }
  const actualEngineCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const paths = execFileSync('git', ['ls-files', 'src/lib/parsing', 'src/lib/scoring', 'src/lib/matching', 'src/lib/keywords.ts', 'src/types/index.ts', 'package-lock.json'], { encoding: 'utf8' }).trim().split('\n').sort();
  const hash = createHash('sha256');
  for (const path of paths) { hash.update(path + '\0'); hash.update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')); hash.update('\0'); }
  const trackedEngineInputsModified = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', ...paths], { encoding: 'utf8' }).trim().length > 0;
  mkdirSync('.vercel', { recursive: true });
  writeFileSync('.vercel/release-evaluation.json', JSON.stringify({ ...report,
    actualEngineCommit, trackedEngineInputsModified,
    engineRevisionMatches: report.declaredEngineCommit === actualEngineCommit && !trackedEngineInputsModified,
    engineSourceSha256: hash.digest('hex'), datasetSha256: createHash('sha256').update(bytes).digest('hex'),
  }, null, 2));
  expect(report.rows.every(row => row.scoreRepeatDelta === 0)).toBe(true);
  expect(report.rows.every(row => row.jobGeneralQualityDelta === null || row.jobGeneralQualityDelta === 0)).toBe(true);
  expect(report.independentValidation).toBe('pending-provenance-and-release-owner-review');
});
