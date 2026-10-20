/** Descriptive statistics only: no inference about hiring or population accuracy. */
export function pairedScoreMetrics(actual: number[], reference: number[]) {
  if (actual.length !== reference.length || [...actual, ...reference].some(x => !Number.isFinite(x))) {
    throw new Error('Score pairs must have equal lengths and finite values');
  }
  const differences = actual.map((x, i) => x - reference[i]);
  const n = differences.length;
  const average = (values: number[]) => values.reduce((sum, x) => sum + x, 0) / values.length;
  return { pairs: n, absoluteDifferences: differences.map(Math.abs),
    meanAbsoluteError: n ? average(differences.map(Math.abs)) : null,
    meanSignedError: n ? average(differences) : null,
    rootMeanSquaredError: n ? Math.sqrt(average(differences.map(x => x * x))) : null,
    spearmanRankCorrelation: spearman(actual, reference),
    confidenceInterval: null,
    inference: 'Descriptive only; no confidence interval without an independently sampled, pre-registered study design.' };
}

function ranks(values: number[]) {
  const sorted = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const result = Array<number>(values.length);
  for (let start = 0; start < sorted.length;) {
    let end = start + 1;
    while (end < sorted.length && sorted[end].value === sorted[start].value) end++;
    const rank = (start + 1 + end) / 2;
    for (let i = start; i < end; i++) result[sorted[i].index] = rank;
    start = end;
  }
  return result;
}
function spearman(a: number[], b: number[]) {
  if (a.length < 2) return null;
  const x = ranks(a), y = ranks(b), mean = (a.length + 1) / 2;
  const covariance = x.reduce((sum, value, i) => sum + (value - mean) * (y[i] - mean), 0);
  const denominator = Math.sqrt(x.reduce((sum, value) => sum + (value - mean) ** 2, 0) *
    y.reduce((sum, value) => sum + (value - mean) ** 2, 0));
  return denominator ? Math.max(-1, Math.min(1, covariance / denominator)) : null;
}

export function reviewerAgreement(records: { scores: number[]; labelSets: string[] }[]) {
  const absoluteDifferences: number[] = [];
  let agreeingLabelPairs = 0;
  for (const record of records) {
    if (record.scores.length !== record.labelSets.length || record.scores.some(x => !Number.isFinite(x))) {
      throw new Error('Invalid reviewer pairs');
    }
    for (let i = 0; i < record.scores.length; i++) for (let j = i + 1; j < record.scores.length; j++) {
      absoluteDifferences.push(Math.abs(record.scores[i] - record.scores[j]));
      if (record.labelSets[i] === record.labelSets[j]) agreeingLabelPairs++;
    }
  }
  return { records: records.length, pairs: absoluteDifferences.length,
    meanPairwiseAbsoluteScoreDifference: absoluteDifferences.length
      ? absoluteDifferences.reduce((sum, x) => sum + x, 0) / absoluteDifferences.length : null,
    exactLabelPairAgreement: absoluteDifferences.length ? agreeingLabelPairs / absoluteDifferences.length : null,
    limitation: 'Pairs within a resume are dependent. Exact field/value/span/evidence agreement is not chance-corrected reliability or authenticated reviewer independence.' };
}
