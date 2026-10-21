import { describe, expect, it } from 'vitest';
import sample from '../../evaluation/synthetic.json';
import { evaluationFields, evaluateReleaseDataset } from '@/lib/evaluation/release-evaluation';
import { assembleReviewedDataset, compareBlindedReviews, prepareBlindedReview, ReviewSourceSchema, ReviewSubmissionSchema } from '@/lib/evaluation/review-handoff';

function source() {
  return { ...sample, reviewers: [{ id: 'reviewer-a', independentOfEngine: false }, { id: 'reviewer-b', independentOfEngine: false }],
    records: sample.records.map(({ labels, reviews, ...row }) => { void labels; void reviews; return row; }) };
}
// Engineered test-only returns, never described as independent human reviews.
function returns() {
  const manifest = source();
  return manifest.reviewers.map(r => ({ ...prepareBlindedReview(manifest, r.id), records: sample.records.map(row => {
    const form = prepareBlindedReview(manifest, r.id).records.find(f => f.id === row.id)!;
    return { ...form, labels: row.labels, fieldsChecked: [...evaluationFields], qualityScore: 50, rationale: 'Synthetic schema test only; not a human rating.' };
  }) }));
}

describe('blinded independent-review handoff', () => {
  it('generates unfilled packets without ground truth, engine outputs, rights references or holdout membership', () => {
    const packet = prepareBlindedReview(source(), 'reviewer-a');
    expect(packet.records).toHaveLength(6);
    for (const row of packet.records) {
      expect(row).toMatchObject({ labels: [], fieldsChecked: [], qualityScore: null, rationale: '' });
      expect(row).not.toHaveProperty('source');
      expect(row).not.toHaveProperty('split');
      expect(row).not.toHaveProperty('generalQuality');
    }
    expect(ReviewSubmissionSchema.safeParse(packet).success).toBe(false);
    expect(() => prepareBlindedReview(source(), 'unknown')).toThrow('Unknown reviewer');
  });
  it('assembles complete synthetic returns but never certifies independent validation', () => {
    const combined = assembleReviewedDataset(source(), returns());
    const report = evaluateReleaseDataset(combined);
    expect(report.groundTruth).toBe('engineered-synthetic');
    expect(report.independentValidation).toBe('pending-provenance-and-release-owner-review');
    expect(report.rows.every(r => r.reviewerMean === null)).toBe(true);
    expect(compareBlindedReviews(source(), returns()).records.every(r => r.labelAgreement)).toBe(true);
  });
  it('retains disagreements for human adjudication instead of choosing the first reviewer', () => {
    const forms = returns(); forms[1].records[0].labels = forms[1].records[0].labels.slice(1);
    forms[1].records[0].qualityScore = 70;
    const report = compareBlindedReviews(source(), forms);
    expect(report.records[0]).toMatchObject({ labelAgreement: false, qualityScoreSpread: 20 });
    expect(JSON.stringify(report)).not.toContain('alex@example.com');
    expect(() => assembleReviewedDataset(source(), forms)).toThrow('independent adjudication');
  });
  it('rejects incomplete checks, changed text, wrong revision and invalid evidence', () => {
    for (const mutate of [
      (forms: ReturnType<typeof returns>) => { forms[0].records[0].fieldsChecked.pop(); },
      (forms: ReturnType<typeof returns>) => { forms[0].records[0].resumeText += ' altered'; },
      (forms: ReturnType<typeof returns>) => { forms[0].engineCommit = '0'.repeat(40); },
      (forms: ReturnType<typeof returns>) => { forms[0].records[0].labels[0] = { ...forms[0].records[0].labels[0], start: 999 }; },
    ]) {
      const forms = structuredClone(returns()); mutate(forms);
      expect(() => compareBlindedReviews(source(), forms)).toThrow();
    }
  });
  it('rejects duplicate/missing reviewers and records, unknown fields and invented independence', () => {
    const forms = returns();
    expect(() => compareBlindedReviews(source(), [forms[0], forms[0]])).toThrow();
    expect(() => compareBlindedReviews(source(), [forms[0]])).toThrow();
    forms[0].records[1] = forms[0].records[0];
    expect(() => compareBlindedReviews(source(), forms)).toThrow();
    expect(ReviewSourceSchema.safeParse({ ...source(), engineScore: 99 }).success).toBe(false);
    const external = source(); external.records[0].source = { kind: 'licensed', reference: 'schema test only' };
    expect(ReviewSourceSchema.safeParse(external).success).toBe(false);
  });
});
