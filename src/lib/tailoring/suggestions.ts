import { PRACTICAL_ACTION } from '@/lib/matching/semantic-matcher';
import type { JobParsed, RequirementImportance, SkillMatrix } from '@/types';
import { findTerm, isNegated, mentions, resumeLines, termsFor, type ResumeLine } from './evidence';
import { verifyResumeEdit } from './verify';
import type { KeywordRow, SourceEvidence, TailoringSuggestion, TargetSection } from './types';

/** Upper bound on keywords the flow adds to the Skills section, to prevent keyword stuffing. */
export const MAX_SKILLS_ADDED = 8;
/** Upper bound on suggestions rendered, so a long job description cannot flood the review. */
export const MAX_SUGGESTIONS = 30;

const IMPORTANCE_RANK: Record<RequirementImportance, number> = { required: 0, preferred: 1, bonus: 2 };
const ACTION_RANK: Record<TailoringSuggestion['action'], number> = {
  'reword-to-job-term': 0, 'surface-in-skills': 1, 'review-transferable': 2, 'user-evidence-needed': 3,
};

const toSource = (line: ResumeLine): SourceEvidence => ({ line: line.text.trim(), lineIndex: line.index, section: line.section });
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]+/g, '-').replace(/^-|-$/g, '');

export function sectionKind(heading: string): TargetSection {
  if (/skill/i.test(heading)) return 'skills';
  if (/experience|employment|internship/i.test(heading)) return 'experience';
  if (/project|portfolio/i.test(heading)) return 'projects';
  return 'other';
}

function evidenceFor(item: { skill: string; aliasMatched?: string; taxonomyRelationship?: string }, lines: ResumeLine[]) {
  const terms = termsFor(item.skill);
  const content = lines.filter(line => !line.isHeading && line.text.trim());
  const mentioning = content.filter(line => mentions(line.text, terms));
  const positive = mentioning.filter(line => !isNegated(line.text, terms));
  const outside = positive.filter(line => !line.inSkills);
  const usesKeyword = (line: ResumeLine) => Boolean(findTerm(line.text, item.skill));
  const practical = outside.filter(line => PRACTICAL_ACTION.test(line.text));
  const source = practical.find(usesKeyword) ?? practical[0] ?? outside.find(usesKeyword) ?? outside[0];
  const aliasLine = practical.some(usesKeyword) ? undefined : practical.find(line => !usesKeyword(line));
  const alias = aliasLine && terms.map(term => findTerm(aliasLine.text, term)).find(Boolean)?.text;
  const related = !positive.length && item.taxonomyRelationship && item.aliasMatched
    ? content.filter(line => !isNegated(line.text, [item.aliasMatched!]) && mentions(line.text, [item.aliasMatched!]))
      .sort((a, b) => Number(PRACTICAL_ACTION.test(b.text)) - Number(PRACTICAL_ACTION.test(a.text)))[0]
    : undefined;
  return {
    inSkills: positive.some(line => line.inSkills),
    negatedOnly: mentioning.length > 0 && positive.length === 0,
    source, practical: practical.length > 0, related,
    aliasEvidence: aliasLine && alias ? { ...toSource(aliasLine), alias } : null,
  };
}

/** Step 1: every recognised job keyword with the evidence the resume actually offers. */
export function analyzeKeywords(resumeText: string, _job: JobParsed, matrix: SkillMatrix): KeywordRow[] {
  const lines = resumeLines(resumeText);
  return Object.values(matrix).flat().map(item => {
    const found = evidenceFor(item, lines);
    const effectiveLevel: KeywordRow['effectiveLevel'] = found.practical ? 'demonstrated'
      : found.source || found.inSkills ? 'mentioned' : found.related ? 'transferable' : 'missing';
    const evidence = found.source ?? found.related ?? lines.find(line => line.inSkills && mentions(line.text, termsFor(item.skill)));
    return {
      keyword: item.skill, importance: item.importance, matrixLevel: item.evidenceLevel ?? 'missing', effectiveLevel,
      sourceEvidence: evidence ? toSource(evidence) : null, inSkills: found.inSkills,
      negatedOnly: found.negatedOnly, aliasEvidence: found.aliasEvidence,
    };
  }).sort((a, b) => IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance] || a.keyword.localeCompare(b.keyword, 'en'));
}

function appendSkill(line: string, keyword: string): string {
  const separator = line.includes('|') ? ' | ' : line.includes(';') ? '; ' : ', ';
  return line.replace(/[\s,;|]+$/, '') + separator + keyword;
}

function base(row: KeywordRow, action: TailoringSuggestion['action'], targetHeading: string | null) {
  return {
    id: `${action}:${slug(row.keyword)}`, keyword: row.keyword, importance: row.importance,
    evidenceLevel: row.effectiveLevel, action, targetHeading,
    targetSection: targetHeading === null ? 'skills' as const : sectionKind(targetHeading),
    provenance: 'resume' as const,
  };
}

const UNVERIFIED = { status: 'unverified' as const, newClaims: [], reason: 'No resume evidence. Add only if this is true for you.' };

/** Step 2: truthful, evidence-backed edits. Gaps are listed but never filled automatically. */
export function buildTailoringSuggestions(resumeText: string, job: JobParsed, matrix: SkillMatrix): TailoringSuggestion[] {
  const lines = resumeLines(resumeText);
  const skillsLine = [...lines].reverse().find(line => line.inSkills && line.text.trim()) ?? null;
  const firstSection = lines.find(line => line.isHeading && /experience|project/i.test(line.section))?.section ?? 'Experience';
  const suggestions: TailoringSuggestion[] = [];
  let surfaced = 0;

  for (const row of analyzeKeywords(resumeText, job, matrix)) {
    if (row.aliasEvidence) {
      const { line, alias } = row.aliasEvidence;
      const at = line.indexOf(alias);
      const proposed = `${line.slice(0, at)}${row.keyword} (${alias})${line.slice(at + alias.length)}`;
      const check = verifyResumeEdit({ original: line, proposed, source: line, keyword: row.keyword, aliasInSource: true });
      suggestions.push({
        ...base(row, 'reword-to-job-term', row.aliasEvidence.section), original: line, proposed,
        sourceEvidence: row.aliasEvidence, verified: check.verified, effect: 'raises-evidence',
        supported: check.verified.status !== 'contradicted' && !check.verified.newClaims.length && check.addsOnlyKeyword,
      });
    }
    const bulletEvidence = row.sourceEvidence && !lines[row.sourceEvidence.lineIndex].inSkills && row.effectiveLevel !== 'transferable';
    if (bulletEvidence && !row.inSkills && surfaced < MAX_SKILLS_ADDED) {
      surfaced += 1;
      const original = skillsLine ? skillsLine.text.trim() : null;
      const proposed = original ? appendSkill(original, row.keyword) : row.keyword;
      const aliasInSource = !findTerm(row.sourceEvidence!.line, row.keyword);
      const check = verifyResumeEdit({ original, proposed, source: row.sourceEvidence!.line, keyword: row.keyword, aliasInSource });
      suggestions.push({
        ...base(row, 'surface-in-skills', null), original, proposed, sourceEvidence: row.sourceEvidence,
        verified: check.verified, effect: 'visibility-only',
        supported: check.verified.status !== 'contradicted' && !check.verified.newClaims.length && check.addsOnlyKeyword,
      });
    }
    if (row.effectiveLevel === 'transferable') {
      suggestions.push({
        ...base(row, 'review-transferable', row.sourceEvidence?.section || firstSection), original: null, proposed: null,
        sourceEvidence: row.sourceEvidence, supported: false, effect: 'unknown',
        verified: { status: 'unverified', newClaims: [row.keyword.toLowerCase()],
          reason: 'Related evidence only. Transferable, review wording: write your own line only if it is accurate.' },
      });
    }
    const listedOnly = row.effectiveLevel === 'mentioned' && !bulletEvidence;
    if (row.effectiveLevel === 'missing' || listedOnly) {
      suggestions.push({
        ...base(row, 'user-evidence-needed', firstSection), original: null, proposed: null, sourceEvidence: null,
        supported: false, effect: 'unknown', verified: UNVERIFIED,
        note: listedOnly ? 'Listed in Skills, but no line shows how you used it.'
          : row.negatedOnly ? 'Your resume says you have not used this. It is not counted as evidence.' : undefined,
      });
    }
  }
  return suggestions
    .sort((a, b) => IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance] ||
      ACTION_RANK[a.action] - ACTION_RANK[b.action] || a.keyword.localeCompare(b.keyword, 'en'))
    .slice(0, MAX_SUGGESTIONS);
}
