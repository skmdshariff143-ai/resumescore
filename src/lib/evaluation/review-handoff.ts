import { z } from 'zod';
import { EvaluationDatasetSchema, evaluationFields } from './release-evaluation';

const shape = EvaluationDatasetSchema.shape;
const record = shape.records.element;
const sourceRecord = record.omit({ labels: true, reviews: true, adjudication: true });

/** Owner-only manifest: source rights and reviewer independence remain declarations. */
export const ReviewSourceSchema = z.object({
  version: shape.version, id: shape.id, engineCommit: shape.engineCommit,
  rubricVersion: shape.rubricVersion,
  reviewers: shape.reviewers.min(2).max(3),
  records: z.array(sourceRecord).min(1).max(200),
}).strict().superRefine((source, ctx) => {
  if (new Set(source.reviewers.map(r => r.id)).size !== source.reviewers.length ||
      new Set(source.records.map(r => r.id)).size !== source.records.length) {
    ctx.addIssue({ code: 'custom', message: 'Duplicate source or reviewer IDs' });
  }
  if (source.records.some(r => r.source.kind !== 'synthetic') && source.reviewers.some(r => !r.independentOfEngine)) {
    ctx.addIssue({ code: 'custom', message: 'External records require declared independent reviewers' });
  }
});
type Source = z.infer<typeof ReviewSourceSchema>;
const formRecord = sourceRecord.omit({ source: true, split: true }).extend({
  labels: record.shape.labels,
  fieldsChecked: z.array(z.enum(evaluationFields)).length(evaluationFields.length)
    .refine(fields => new Set(fields).size === evaluationFields.length, 'Check every field, including absent fields'),
  qualityScore: z.number().min(0).max(100),
  rationale: z.string().min(1).max(4000),
}).strict();
export const ReviewSubmissionSchema = z.object({
  version: shape.version, datasetId: shape.id, engineCommit: shape.engineCommit,
  rubricVersion: shape.rubricVersion, reviewerId: shape.reviewers.element.shape.id,
  records: z.array(formRecord).min(1).max(200),
}).strict();
type Submission = z.infer<typeof ReviewSubmissionSchema>;

/** No parser or scoring engine is invoked. No gold labels, scores or split are included. */
export function prepareBlindedReview(input: unknown, reviewerId: string) {
  const source = ReviewSourceSchema.parse(input);
  if (!source.reviewers.some(r => r.id === reviewerId)) throw new Error('Unknown reviewer');
  return {
    version: source.version, datasetId: source.id, engineCommit: source.engineCommit,
    rubricVersion: source.rubricVersion, reviewerId,
    records: source.records.map(row => {
      const { source: rights, split, ...text } = row;
      void rights; void split;
      return { ...text, labels: [], fieldsChecked: [], qualityScore: null, rationale: '' };
    }),
  };
}

function checkedReviews(source: Source, input: unknown): Submission[] {
  const reviews = z.array(ReviewSubmissionSchema).min(2).max(3).parse(input);
  if (reviews.length !== source.reviewers.length || new Set(reviews.map(r => r.reviewerId)).size !== reviews.length) {
    throw new Error('Return exactly one completed packet per registered reviewer');
  }
  for (const review of reviews) {
    if (review.datasetId !== source.id || review.engineCommit !== source.engineCommit ||
        !source.reviewers.some(r => r.id === review.reviewerId) ||
        review.records.length !== source.records.length || new Set(review.records.map(r => r.id)).size !== review.records.length) {
      throw new Error('Review does not match the frozen manifest');
    }
    for (const row of review.records) {
      const original = source.records.find(r => r.id === row.id);
      if (!original || ['resumeText', 'jobText', 'careerLevel', 'sector', 'style', 'annotationScope'].some(key =>
        row[key as keyof typeof row] !== original[key as keyof typeof original])) {
        throw new Error('Review changed the frozen source or metadata');
      }
      for (const label of row.labels) {
        const text = label.source === 'resume' ? original.resumeText : original.jobText;
        if (label.end <= label.start || text.slice(label.start, label.end) !== label.quote ||
            (label.field === 'requiredSkill') !== (label.source === 'job')) throw new Error('Invalid review evidence span');
      }
      if (new Set(row.labels.map(label => JSON.stringify(label))).size !== row.labels.length) throw new Error('Duplicate review labels');
    }
  }
  return reviews;
}
const canonical = (labels: Submission['records'][number]['labels']) => JSON.stringify(labels.map(l =>
  JSON.stringify([l.field, l.value.normalize('NFKC').toLowerCase().trim(), l.source, l.start, l.end, l.evidence ?? ''])
).sort());

/** Aggregate comparison only; does not select ground truth or run the scoring engine. */
export function compareBlindedReviews(input: unknown, returned: unknown) {
  const source = ReviewSourceSchema.parse(input), reviews = checkedReviews(source, returned);
  return {
    datasetId: source.id, engineCommit: source.engineCommit,
    status: 'pending-provenance-and-release-owner-review',
    records: source.records.map(row => {
      const forms = reviews.map(r => r.records.find(f => f.id === row.id)!);
      return { recordId: row.id, reviewerCount: forms.length,
        labelAgreement: forms.every(f => canonical(f.labels) === canonical(forms[0].labels)),
        qualityScoreSpread: Math.max(...forms.map(f => f.qualityScore)) - Math.min(...forms.map(f => f.qualityScore)) };
    }),
  };
}

export function assembleReviewedDataset(input: unknown, returned: unknown) {
  const source = ReviewSourceSchema.parse(input), reviews = checkedReviews(source, returned);
  if (compareBlindedReviews(source, reviews).records.some(r => !r.labelAgreement)) {
    throw new Error('Labels disagree; independent adjudication is required. No ground truth was selected.');
  }
  return EvaluationDatasetSchema.parse({ ...source, records: source.records.map(row => ({
    ...row, labels: reviews[0].records.find(r => r.id === row.id)!.labels,
    reviews: reviews.map(review => {
      const form = review.records.find(r => r.id === row.id)!;
      return { reviewerId: review.reviewerId, labels: form.labels, qualityScore: form.qualityScore };
    }),
  })) });
}
