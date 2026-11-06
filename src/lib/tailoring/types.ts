import type { ClaimStatus } from '@/lib/ai/factuality';
import type { RequirementImportance, SkillMatchItem } from '@/types';

export type EvidenceLevel = NonNullable<SkillMatchItem['evidenceLevel']>;

export type TailoringAction =
  /** Evidenced in a bullet elsewhere in the resume but absent from Skills. */
  | 'surface-in-skills'
  /** An existing action line uses an alias; write the job's term in that same line. */
  | 'reword-to-job-term'
  /** Related, not identical, evidence. The user must write their own wording. */
  | 'review-transferable'
  /** No evidence. Never inserted unless the user types and confirms a line. */
  | 'user-evidence-needed';

export type TargetSection = 'skills' | 'experience' | 'projects' | 'other';

export interface SourceEvidence {
  line: string;
  /** Zero-based line number in the resume text. */
  lineIndex: number;
  /** Section heading as written in the resume, or '' for the opening block. */
  section: string;
}

export interface KeywordRow {
  keyword: string;
  importance: RequirementImportance;
  /** Level reported by the existing skill matrix. */
  matrixLevel: EvidenceLevel;
  /** Level after alias matching and negation filtering. */
  effectiveLevel: EvidenceLevel;
  sourceEvidence: SourceEvidence | null;
  inSkills: boolean;
  /** The keyword appears only in negated lines ("No experience with …"). */
  negatedOnly: boolean;
  /** Action line that names the keyword only through an alias, if any. */
  aliasEvidence: (SourceEvidence & { alias: string }) | null;
}

export interface TailoringVerification {
  status: ClaimStatus;
  newClaims: string[];
  reason: string;
}

export interface TailoringSuggestion {
  id: string;
  keyword: string;
  importance: RequirementImportance;
  evidenceLevel: EvidenceLevel;
  action: TailoringAction;
  targetSection: TargetSection;
  /** Resume heading the edit lands in; null means the Skills section (created if absent). */
  targetHeading: string | null;
  /** Exact resume line replaced; null when appending. */
  original: string | null;
  /** Null until the user supplies wording (transferable or missing keywords). */
  proposed: string | null;
  sourceEvidence: SourceEvidence | null;
  provenance: 'resume' | 'user-asserted';
  verified: TailoringVerification;
  /** Eligible for "Accept all supported". */
  supported: boolean;
  effect: 'visibility-only' | 'raises-evidence' | 'unknown';
  /** Extra context for the reviewer. */
  note?: string;
}
