import { z } from 'zod';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';

export const evaluationFields = ['name', 'email', 'degree', 'institution', 'company', 'role',
  'projectName', 'projectDescription', 'skill', 'section', 'requiredSkill'] as const;
type Field = typeof evaluationFields[number];
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
const annotation = z.object({
  field: z.enum(evaluationFields), value: z.string().min(1).max(2000),
  quote: z.string().min(1).max(2000), start: z.number().int().nonnegative(), end: z.number().int().positive(),
  source: z.enum(['resume', 'job']),
  evidence: z.enum(['mentioned', 'demonstrated', 'transferable', 'missing']).optional(),
}).strict();
const record = z.object({
  id, careerLevel: z.enum(['student', 'internship', 'entry', 'experienced', 'senior', 'switcher']),
  sector: id, style: z.enum(['single-column', 'columns', 'table', 'long', 'unusual']),
  split: z.enum(['regression', 'calibration', 'holdout']),
  source: z.object({ kind: z.enum(['synthetic', 'licensed', 'consented-anonymized']), reference: z.string().min(1).max(500) }).strict(),
  resumeText: z.string().min(20).max(60000), jobText: z.string().max(60000).default(''),
  annotationScope: z.literal('all-supported-fields'), labels: z.array(annotation).max(300),
  reviews: z.array(z.object({ reviewerId: id, labels: z.array(annotation).max(300), qualityScore: z.number().min(0).max(100) }).strict()).max(3),
  adjudication: z.object({ reviewerId: id, reference: z.string().min(1).max(500) }).strict().optional(),
}).strict();

export const EvaluationDatasetSchema = z.object({
  version: z.literal(1), id, engineCommit: z.string().regex(/^[a-f0-9]{40}$/), rubricVersion: z.literal('quality-v1'),
  reviewers: z.array(z.object({ id, independentOfEngine: z.boolean() }).strict()).max(20),
  records: z.array(record).min(1).max(200),
}).strict().superRefine((dataset, ctx) => {
  const reviewers = new Map(dataset.reviewers.map(r => [r.id, r.independentOfEngine]));
  if (reviewers.size !== dataset.reviewers.length) ctx.addIssue({ code: 'custom', message: 'Duplicate reviewer IDs' });
  if (new Set(dataset.records.map(r => r.id)).size !== dataset.records.length) ctx.addIssue({ code: 'custom', message: 'Duplicate record IDs' });
  dataset.records.forEach((row, index) => {
    const problem = (message: string) => ctx.addIssue({ code: 'custom', path: ['records', index], message });
    for (const label of [...row.labels, ...row.reviews.flatMap(r => r.labels)]) {
      const source = label.source === 'resume' ? row.resumeText : row.jobText;
      if (label.end <= label.start || source.slice(label.start, label.end) !== label.quote) problem('Label source span does not match its quote');
      if ((label.field === 'requiredSkill') !== (label.source === 'job')) problem('Label uses the wrong source document');
    }
    const evidenceBySkill = new Map<string, string>();
    for (const label of row.labels.filter(label => label.evidence)) {
      const key = normalize(label.value);
      if (evidenceBySkill.has(key) && evidenceBySkill.get(key) !== label.evidence) problem('Conflicting evidence labels for the same skill');
      evidenceBySkill.set(key, label.evidence!);
    }
    const reviewerIds = row.reviews.map(r => r.reviewerId);
    if (new Set(reviewerIds).size !== reviewerIds.length) problem('Reviews must have distinct reviewers');
    if (reviewerIds.some(reviewerId => !reviewers.has(reviewerId))) problem('Unknown reviewer');
    if (row.source.kind !== 'synthetic') {
      if (row.reviews.length < 2 || reviewerIds.some(reviewerId => reviewers.get(reviewerId) !== true)) problem('External records require two declared independent reviewers');
      const labels = canonicalLabels(row.labels);
      if (row.reviews.some(review => canonicalLabels(review.labels) !== labels) && !row.adjudication) problem('Label disagreements require an adjudication reference');
    }
    if (row.adjudication && reviewers.get(row.adjudication.reviewerId) !== true) problem('Adjudicator must be a declared independent reviewer');
  });
});
export type EvaluationDataset = z.infer<typeof EvaluationDatasetSchema>;
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/\s+/g, ' ').trim();
function canonicalLabels(labels: z.infer<typeof annotation>[]) {
  return JSON.stringify(labels.map(l => `${l.field}:${normalize(l.value)}:${l.evidence || ''}`).sort());
}

/** Set-based canonical field values; repeated occurrences are intentionally not counted. */
export function measureLabels(expected: string[], actual: string[]) {
  const gold = new Set(expected.map(normalize)), predicted = new Set(actual.filter(Boolean).map(normalize));
  const truePositive = [...predicted].filter(value => gold.has(value)).length;
  const falsePositive = predicted.size - truePositive, falseNegative = gold.size - truePositive;
  const denominator = 2 * truePositive + falsePositive + falseNegative;
  return { truePositive, falsePositive, falseNegative,
    precision: predicted.size ? truePositive / predicted.size : null,
    recall: gold.size ? truePositive / gold.size : null,
    f1: denominator ? 2 * truePositive / denominator : null };
}

/** Offline only. Reports omit resume text, quotes, extracted values and reviewer identities. */
export function evaluateReleaseDataset(input: unknown) {
  const dataset = EvaluationDatasetSchema.parse(input);
  const rows = dataset.records.map(row => {
    const parsed = parseResume(row.resumeText);
    const job = row.jobText ? parseJobDescription(row.jobText) : undefined;
    const score = calculateResumeScore(parsed, undefined, 'general', row.careerLevel);
    const repeated = calculateResumeScore(parsed, undefined, 'general', row.careerLevel);
    const matching = job ? calculateResumeScore(parsed, job, 'job_match', row.careerLevel) : undefined;
    const values: Record<Field, string[]> = {
      name: [parsed.personalInfo.name], email: parsed.personalInfo.email ? [parsed.personalInfo.email] : [],
      degree: parsed.education.map(e => e.degree), institution: parsed.education.map(e => e.institution),
      company: parsed.experience.map(e => e.company), role: parsed.experience.map(e => e.role),
      projectName: parsed.projects.map(p => p.name), projectDescription: parsed.projects.map(p => p.description),
      skill: parsed.allSkills, section: parsed.sections.filter(section => section.type !== 'header').map(section => section.type), requiredSkill: job?.requiredSkills || [],
    };
    const fields = Object.fromEntries(evaluationFields.map(field => [field, measureLabels(row.labels.filter(l => l.field === field).map(l => l.value), values[field])])) as Record<Field, ReturnType<typeof measureLabels>>;
    const evidenceLabels = [...new Map(row.labels.filter(l => l.evidence).map(label => [normalize(label.value), label])).values()];
    const matrix = Object.values(buildSkillMatrix(parsed.skills, parsed.allSkills, row.resumeText, evidenceLabels.map(l => l.value))).flat();
    const evidence = evidenceLabels.map(l => ({ expected: l.evidence!, actual: matrix.find(item => normalize(item.skill) === normalize(l.value))?.evidenceLevel || 'missing' }));
    const reviewerMean = row.source.kind !== 'synthetic' && row.split === 'holdout' && row.reviews.length >= 2
      ? row.reviews.reduce((sum, review) => sum + review.qualityScore, 0) / row.reviews.length : null;
    return { id: row.id, careerLevel: row.careerLevel, sector: row.sector, style: row.style, split: row.split,
      provenance: row.source.kind, reviewCount: row.reviews.length,
      labelDisagreement: row.reviews.some(review => canonicalLabels(review.labels) !== canonicalLabels(row.labels)),
      reviewerScoreSpread: row.reviews.length ? Math.max(...row.reviews.map(r => r.qualityScore)) - Math.min(...row.reviews.map(r => r.qualityScore)) : null,
      fields, evidence, generalQuality: score.overall, jobAlignment: matching?.skillMatchScore ?? null,
      scoreRepeatDelta: repeated.overall - score.overall,
      jobGeneralQualityDelta: matching ? (matching.generalQualityScore ?? score.overall) - score.overall : null,
      recommendationCount: score.topActions.length,
      reviewerMean, signedScoreError: reviewerMean === null ? null : score.overall - reviewerMean };
  });
  const totals = Object.fromEntries(evaluationFields.map(field => {
    const tp = rows.reduce((n, row) => n + row.fields[field].truePositive, 0);
    const fp = rows.reduce((n, row) => n + row.fields[field].falsePositive, 0);
    const fn = rows.reduce((n, row) => n + row.fields[field].falseNegative, 0);
    return [field, { truePositive: tp, falsePositive: fp, falseNegative: fn, precision: tp + fp ? tp / (tp + fp) : null, recall: tp + fn ? tp / (tp + fn) : null }];
  }));
  const profileCoverage = Object.fromEntries(['student', 'internship', 'entry', 'experienced', 'senior', 'switcher'].map(profile => {
    const group = rows.filter(row => row.careerLevel === profile);
    const errors = group.flatMap(row => row.signedScoreError === null ? [] : [row.signedScoreError]);
    return [profile, { samples: group.length, reviewedHoldout: errors.length,
      meanAbsoluteError: errors.length ? errors.reduce((n, error) => n + Math.abs(error), 0) / errors.length : null,
      meanSignedError: errors.length ? errors.reduce((n, error) => n + error, 0) / errors.length : null }];
  }));
  return { datasetId: dataset.id, declaredEngineCommit: dataset.engineCommit,
    independentValidation: 'pending-provenance-and-release-owner-review',
    groundTruth: rows.every(r => r.provenance === 'synthetic') ? 'engineered-synthetic' : 'declared-human-labels-not-authenticated',
    sampleCount: rows.length, totals, profileCoverage, rows,
    limitations: 'Source-span checks validate label integrity, not license/consent or reviewer independence. Metrics do not certify fairness, ATS compatibility, factuality or hiring outcomes. Empty denominators are null. Owner must verify provenance and pre-registered holdout acceptance thresholds.' };
}
