import { parseResume } from '@/lib/parsing/resume-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import type { CareerLevel } from '@/lib/scoring/rubric';
import type { JobParsed } from '@/types';

/** Same job, career level and rubric on both texts. No predicted or AI-assigned point boosts. */
export function scoreTailoring(original: string, tailored: string, job: JobParsed, careerLevel: CareerLevel) {
  const score = (text: string) => calculateResumeScore(parseResume(text), job, 'job_match', careerLevel);
  const before = score(original);
  const after = score(tailored);
  return {
    jobAlignmentBefore: before.skillMatchScore,
    jobAlignmentAfter: after.skillMatchScore,
    generalBefore: before.generalQualityScore ?? before.overall,
    generalAfter: after.generalQualityScore ?? after.overall,
    skillsAfter: Object.values(after.skillMatrix ?? {}).flat(),
  };
}
