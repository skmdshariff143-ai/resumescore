import { describe, expect, it } from 'vitest';
import { pairedScoreMetrics, reviewerAgreement } from '@/lib/evaluation/agreement';
import { EvaluationDatasetSchema, evaluateReleaseDataset } from '@/lib/evaluation/release-evaluation';
import sample from '../../evaluation/synthetic.json';

describe('descriptive external evaluation statistics', () => {
  it('calculates absolute/signed errors and tie-aware rank correlation', () => {
    const result = pairedScoreMetrics([10, 20, 20, 40], [40, 20, 20, 10]);
    expect(result.absoluteDifferences).toEqual([30, 0, 0, 30]);
    expect(result.meanAbsoluteError).toBe(15);
    expect(result.meanSignedError).toBe(0);
    expect(result.spearmanRankCorrelation).toBe(-1);
    expect(pairedScoreMetrics([1, 2, 2, 4], [1, 2, 2, 3]).spearmanRankCorrelation).toBe(1);
    expect(result.confidenceInterval).toBeNull();
  });
  it('keeps empty/constant populations undefined and rejects invalid pairing', () => {
    expect(pairedScoreMetrics([], []).meanAbsoluteError).toBeNull();
    expect(pairedScoreMetrics([1], [2]).spearmanRankCorrelation).toBeNull();
    expect(pairedScoreMetrics([1, 1], [2, 3]).spearmanRankCorrelation).toBeNull();
    expect(() => pairedScoreMetrics([1], [])).toThrow();
    expect(() => pairedScoreMetrics([NaN], [2])).toThrow();
  });
  it('reports paired reviewer disagreement without pretending it authenticates humans', () => {
    const report = reviewerAgreement([{ scores: [40, 60], labelSets: ['a', 'b'] }, { scores: [50, 50], labelSets: ['a', 'a'] }]);
    expect(report).toMatchObject({ records: 2, pairs: 2, meanPairwiseAbsoluteScoreDifference: 10, exactLabelPairAgreement: 0.5 });
    expect(reviewerAgreement([]).exactLabelPairAgreement).toBeNull();
  });
  it('does not manufacture calibration or true-negative rates from synthetic data', () => {
    const report = evaluateReleaseDataset(sample);
    expect(report.reviewedHoldoutMetrics.pairs).toBe(0);
    expect(report.reviewerAgreement.pairs).toBe(0);
    expect(report.totals.skill).toMatchObject({ falseDiscoveryRate: 0, falseNegativeRate: 0, falsePositiveRate: null });
    expect(report.confidenceCalibration.status).toBe('not-applicable');
  });
  it('rejects non-skill evidence and treats different source boundaries as disagreement', () => {
    const changed = structuredClone(sample);
    Object.assign(changed.records[0].labels[0], { evidence: 'demonstrated' });
    expect(EvaluationDatasetSchema.safeParse(changed).success).toBe(false);
    const row = sample.records[0], labels = structuredClone(row.labels);
    const skillIndex = labels.findIndex(label => label.field === 'skill');
    const label = labels[skillIndex];
    const second = row.resumeText.lastIndexOf(label.quote);
    expect(second).not.toBe(label.start);
    labels[skillIndex] = { ...label, start: second, end: second + label.quote.length };
    const reviewers = [{ id: 'a', independentOfEngine: true }, { id: 'b', independentOfEngine: true }];
    const input = { ...sample, reviewers, records: [{ ...row, source: { kind: 'licensed', reference: 'schema-test-only' },
      reviews: [{ reviewerId: 'a', labels: row.labels, qualityScore: 50 }, { reviewerId: 'b', labels, qualityScore: 50 }] }] };
    expect(EvaluationDatasetSchema.safeParse(input).success).toBe(false);
  });
});
