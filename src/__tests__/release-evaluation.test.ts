import { describe, expect, it } from 'vitest';
import sample from '../../evaluation/synthetic.json';
import { EvaluationDatasetSchema, evaluateReleaseDataset, measureLabels } from '@/lib/evaluation/release-evaluation';

describe('offline review evaluation', () => {
  it('reports errors and empty denominators without claiming perfect accuracy', () => {
    expect(measureLabels(['Python', 'SQL'], ['Python', 'Java', 'python'])).toEqual({ truePositive: 1, falsePositive: 1, falseNegative: 1, precision: 0.5, recall: 0.5, f1: 0.5 });
    expect(measureLabels([], []).f1).toBeNull();
    expect(measureLabels(['José Example'], ['Jose\u0301 Example']).recall).toBe(1);
  });
  it('retains synthetic provenance, all profiles, repeatability and no fabricated human calibration', () => {
    const report = evaluateReleaseDataset(sample);
    expect(report.sampleCount).toBe(6);
    expect(Object.values(report.profileCoverage).every(p => p.samples === 1 && p.reviewedHoldout === 0 && p.meanAbsoluteError === null)).toBe(true);
    expect(report.groundTruth).toBe('engineered-synthetic');
    expect(report.rows.every(row => row.scoreRepeatDelta === 0 && row.jobGeneralQualityDelta === 0)).toBe(true);
    expect(report.totals.skill).toMatchObject({ truePositive: 13, falsePositive: 0, falseNegative: 0 });
    const serialized = JSON.stringify(report);
    expect(serialized).not.toContain('alex@example.com');
    expect(serialized).not.toContain('Bachelor of Science');
    expect(serialized).not.toContain('Analyzed inventory');
  });
  it('rejects corrupt source spans, duplicate IDs, wrong document labels and unknown nested fields', () => {
    for (const mutate of [
      (d: typeof sample) => { d.records[0].labels[0].start++; },
      (d: typeof sample) => { d.records[1].id = d.records[0].id; },
      (d: typeof sample) => { d.records[0].labels[0].source = 'job'; },
    ]) {
      const changed = structuredClone(sample); mutate(changed);
      expect(EvaluationDatasetSchema.safeParse(changed).success).toBe(false);
    }
    expect(EvaluationDatasetSchema.safeParse({ ...sample, untrusted: {} }).success).toBe(false);
    const conflict = structuredClone(sample);
    const requirement = conflict.records[0].labels.find(label => label.field === 'requiredSkill')!;
    requirement.evidence = 'missing';
    expect(EvaluationDatasetSchema.safeParse(conflict).success).toBe(false);
  });
  it('requires distinct independent reviewer declarations for external records', () => {
    const row = { ...sample.records[0], source: { kind: 'licensed', reference: 'test-schema-only-not-a-real-license' } };
    const dataset = { ...sample, records: [row] };
    expect(EvaluationDatasetSchema.safeParse(dataset).success).toBe(false);
    const review = { reviewerId: 'reviewer-a', qualityScore: 50, labels: row.labels };
    expect(EvaluationDatasetSchema.safeParse({ ...dataset, reviewers: [{ id: 'reviewer-a', independentOfEngine: true }],
      records: [{ ...row, reviews: [review, review] }] }).success).toBe(false);
  });
  it('retains disagreement/adjudication and holdout errors without authenticating human declarations', () => {
    const row = sample.records[0];
    const reviewers = [{ id: 'reviewer-a', independentOfEngine: true }, { id: 'reviewer-b', independentOfEngine: true }];
    const reviews = [{ reviewerId: 'reviewer-a', qualityScore: 40, labels: row.labels }, { reviewerId: 'reviewer-b', qualityScore: 60, labels: row.labels.slice(1) }];
    const input = { ...sample, reviewers, records: [{ ...row, split: 'holdout', source: { kind: 'licensed', reference: 'schema-test-only' }, reviews }] };
    expect(EvaluationDatasetSchema.safeParse(input).success).toBe(false);
    const report = evaluateReleaseDataset({ ...input, records: [{ ...input.records[0], adjudication: { reviewerId: 'reviewer-a', reference: 'schema-test-only' } }] });
    expect(report.rows[0]).toMatchObject({ labelDisagreement: true, reviewerScoreSpread: 20, reviewerMean: 50 });
    expect(report.profileCoverage.student.reviewedHoldout).toBe(1);
    expect(report.independentValidation).toBe('pending-provenance-and-release-owner-review');
    expect(report.groundTruth).toBe('declared-human-labels-not-authenticated');
  });
});
