import { expect, it } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sample from '../evaluation/synthetic.json';
import { ReviewSourceSchema, prepareBlindedReview, compareBlindedReviews, assembleReviewedDataset } from '../src/lib/evaluation/review-handoff';

const boundedBytes = (file: string) => {
  if (statSync(file).size > 8 * 1024 * 1024) throw new Error('Input exceeds 8 MB');
  const bytes = readFileSync(file);
  if (bytes.length > 8 * 1024 * 1024) throw new Error('Input exceeds 8 MB');
  return bytes;
};
const boundedJSON = (file: string): unknown => JSON.parse(boundedBytes(file).toString('utf8').replace(/^\uFEFF/, ''));

it('runs the private blinded-review handoff without exposing labels or overwriting work', () => {
  const action = process.env.RESUMESCORE_REVIEW_ACTION;
  if (!action) {
    const source = { ...sample, reviewers: [{ id: 'example-a', independentOfEngine: false }, { id: 'example-b', independentOfEngine: false }],
      records: sample.records.map(({ labels, reviews, ...row }) => { void labels; void reviews; return row; }) };
    expect(prepareBlindedReview(source, 'example-a').records.every(r => r.qualityScore === null)).toBe(true);
    return;
  }
  try {
    if (!['prepare', 'compare', 'assemble'].includes(action)) throw new Error('Invalid action');
    const input = process.env.RESUMESCORE_REVIEW_SOURCE;
    const destination = process.env.RESUMESCORE_REVIEW_OUTPUT;
    if (!input || !destination) throw new Error('Source and new private output directory required');
    const sourceBytes = boundedBytes(input);
    const source = ReviewSourceSchema.parse(JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/, '')));
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (source.engineCommit !== revision) throw new Error('Check out the frozen engine revision');
    const output = path.resolve(destination), root = process.cwd();
    const relative = path.relative(root, output);
    // Inside the repository, candidate text may only be written into the ignored
    // evaluation/private tree. Explicit external private directories are allowed.
    const inside = relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
    const privateRoot = path.resolve(root, 'evaluation/private');
    if ((inside && !output.startsWith(privateRoot + path.sep)) || existsSync(output)) throw new Error('Use a new private output directory');
    let result: unknown;
    if (action !== 'prepare') {
      const submissions = process.env.RESUMESCORE_REVIEW_SUBMISSIONS;
      if (!submissions) throw new Error('Returned review array required');
      const returned = boundedJSON(submissions);
      result = action === 'compare' ? compareBlindedReviews(source, returned) : assembleReviewedDataset(source, returned);
    }
    mkdirSync(output, { recursive: true, mode: 0o700 });
    const write = (file: string, value: unknown) => writeFileSync(path.join(output, file), JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    if (action === 'prepare') {
      source.reviewers.forEach((reviewer, index) => write(`reviewer-${index + 1}.json`, prepareBlindedReview(source, reviewer.id)));
    } else write(action === 'compare' ? 'comparison.json' : 'dataset.json', result);
    write('manifest.json', { action, datasetId: source.id, engineCommit: source.engineCommit,
      sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
      independentValidation: 'pending-provenance-and-release-owner-review' });
    expect(existsSync(path.join(output, 'manifest.json'))).toBe(true);
  } catch {
    throw new Error('Review handoff failed. Check action, bounded source/returns, frozen revision, complete reviews and a NEW private output folder locally. Sensitive values withheld.');
  }
});
