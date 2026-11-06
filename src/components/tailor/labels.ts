import type { RequirementImportance } from '@/types';
import type { EvidenceLevel, KeywordRow, TailoringSuggestion } from '@/lib/tailoring';

export const IMPORTANCE_LABEL: Record<RequirementImportance, string> = { required: 'Required', preferred: 'Preferred', bonus: 'Optional' };

export const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  demonstrated: 'Demonstrated', mentioned: 'Mentioned only', transferable: 'Transferable (related)', missing: 'No evidence',
};

export const ACTION_LABEL: Record<TailoringSuggestion['action'], string> = {
  'surface-in-skills': 'Add to Skills',
  'reword-to-job-term': 'Use the job’s term',
  'review-transferable': 'Write your own wording',
  'user-evidence-needed': 'Your evidence needed',
  'summary-core-skills': 'Add a Core skills line to Summary',
};

export const GAP_COPY = 'Add only if this is true for you.';
export const SCORE_LIMITATION = 'Scores are heuristic estimates, not hiring predictions or ATS certification. Evidence is inferred from text and is not independently verified.';
export const MANUAL_REVIEW = 'Education, licensing, eligibility and experience requirements still require manual review.';

export function statusLabel(item: TailoringSuggestion): string {
  if (item.provenance === 'user-asserted') return 'Your line (user-asserted)';
  if (item.supported) return 'Supported by your resume';
  if (item.action === 'review-transferable') return 'Transferable, review wording';
  if (item.action === 'user-evidence-needed') return 'No evidence in your resume';
  return 'Needs your review';
}

export function nextStep(row: KeywordRow): string {
  if (row.aliasEvidence) return 'Use the job’s term in this line';
  if (row.effectiveLevel === 'transferable') return 'Review wording';
  if (row.effectiveLevel === 'missing') return GAP_COPY;
  if (!row.inSkills && row.sourceEvidence) return 'Can surface in Skills';
  if (row.effectiveLevel === 'mentioned') return 'Listed only: add a line showing use, if true';
  return 'Already evidenced';
}
