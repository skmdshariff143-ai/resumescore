import { parseResume } from '../parsing/resume-parser';
import { calculateResumeScore } from './scoring-engine';
import type { ResumeScore } from '@/types';

/** Same profile/job/rubric on both versions; no AI or predicted point boosts. */
export function compareResumeVersions(original: string, edited: string, context: ResumeScore) {
  const score = (text: string) => calculateResumeScore(parseResume(text), context.parsedJob,
    context.mode, context.careerLevel ?? 'experienced');
  const before = score(original);
  const after = score(edited);
  return {
    before: before.generalQualityScore ?? before.overall,
    after: after.generalQualityScore ?? after.overall,
    dimensions: after.dimensions.map(dimension => {
      const previous = before.dimensions.find(item => item.key === dimension.key)!;
      return { key: dimension.key, name: dimension.name, before: previous.score, after: dimension.score,
        delta: dimension.score - previous.score, explanation: dimension.reason,
        previousEvidence: previous.evidence.detected, currentEvidence: dimension.evidence.detected };
    }),
    skills: Object.values(after.skillMatrix ?? {}).flat(),
  };
}
