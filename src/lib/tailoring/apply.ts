import { inventoryFacts, verifyStatement } from '@/lib/ai/factuality';
import type { ResumeBlock } from '@/lib/export/resume-document';
import { isNegated, isSkillsHeading, mentions, resumeLines, termsFor } from './evidence';
import { sectionKind } from './suggestions';
import type { TailoringSuggestion } from './types';

export const MAX_USER_LINE = 300;
const INVISIBLE = /[\p{Cc}\p{Cf}]/gu;
const BULLET = /^\s*([•*\-▪►◦‣⁃])\s+/;
const QUANTITY = /\d+(?:[.,]\d+)*(?:%|\b)/g;

export interface ApplyResult {
  blocks: ResumeBlock[];
  notApplied: { id: string; reason: string }[];
}

function appendToSkills(blocks: ResumeBlock[], keyword: string): string | null {
  const index = blocks.findIndex(block => isSkillsHeading(block.title));
  if (index < 0) { blocks.push({ title: 'Skills', content: keyword }); return null; }
  const lines = blocks[index].content.split('\n');
  if (lines.some(line => mentions(line, termsFor(keyword)))) return 'Already listed in Skills.';
  let last = lines.length - 1;
  while (last >= 0 && !lines[last].trim()) last -= 1;
  if (last < 0) lines.splice(0, lines.length, keyword);
  else {
    const separator = lines[last].includes('|') ? ' | ' : lines[last].includes(';') ? '; ' : ', ';
    lines[last] = lines[last].replace(/[\s,;|]+$/, '') + separator + keyword;
  }
  blocks[index] = { ...blocks[index], content: lines.join('\n') };
  return null;
}

function replaceUniqueLine(blocks: ResumeBlock[], original: string, proposed: string): string | null {
  const hits = blocks.flatMap((block, b) => block.content.split('\n').map((line, l) => ({ b, l, line })))
    .filter(hit => hit.line.trim() === original.trim());
  if (hits.length !== 1) return 'The original line changed or occurs more than once. Edit it in the full editor.';
  const lines = blocks[hits[0].b].content.split('\n');
  lines[hits[0].l] = proposed;
  blocks[hits[0].b] = { ...blocks[hits[0].b], content: lines.join('\n') };
  return null;
}

function appendLine(blocks: ResumeBlock[], heading: string, line: string) {
  const index = blocks.findIndex(block => block.title.toLowerCase() === heading.toLowerCase());
  if (index < 0) blocks.push({ title: heading, content: line });
  else blocks[index] = { ...blocks[index], content: [blocks[index].content, line].filter(Boolean).join('\n') };
}

/** Apply accepted suggestions in order. Nothing without a proposed text is ever inserted. */
export function applySuggestions(source: ResumeBlock[], accepted: TailoringSuggestion[]): ApplyResult {
  const blocks = source.map(block => ({ ...block }));
  const notApplied: ApplyResult['notApplied'] = [];
  for (const item of accepted) {
    if (item.proposed === null) { notApplied.push({ id: item.id, reason: 'No wording to apply.' }); continue; }
    let reason: string | null = null;
    if (item.action === 'surface-in-skills') reason = appendToSkills(blocks, item.keyword);
    else if (item.original !== null) reason = replaceUniqueLine(blocks, item.original, item.proposed);
    else appendLine(blocks, item.targetHeading ?? 'Experience', item.proposed);
    if (reason) notApplied.push({ id: item.id, reason });
  }
  return { blocks, notApplied };
}

export function cleanUserLine(raw: string): string {
  return raw.normalize('NFKC').replace(/\s+/g, ' ').replace(INVISIBLE, '').trim().replace(BULLET, '');
}

/**
 * Turn a line the user typed into a user-asserted suggestion. It is checked against the resume,
 * never marked "supported", and new figures need a second confirmation in the UI.
 */
export function withUserEvidence(suggestion: TailoringSuggestion, rawLine: string, heading: string, resumeText: string) {
  const line = cleanUserLine(rawLine);
  const terms = termsFor(suggestion.keyword);
  const lines = resumeLines(resumeText).filter(item => !item.isHeading && item.text.trim());
  const errors: string[] = [];
  const warnings: string[] = [];
  if (line.length > MAX_USER_LINE) errors.push(`Keep your line to ${MAX_USER_LINE} characters or fewer.`);
  else if (line.length < 10) errors.push('Write a short line describing what you did.');
  else if (!mentions(line, terms)) errors.push(`Mention ${suggestion.keyword} so the line is evidence for it.`);
  const denial = lines.find(item => mentions(item.text, terms) && isNegated(item.text, terms));
  if (!errors.length && denial && !isNegated(line, terms)) {
    errors.push(`Your resume says "${denial.text.trim().replace(BULLET, '')}". If that is no longer accurate, edit it in the full editor first.`);
  }
  const known = new Set(resumeText.match(QUANTITY) ?? []);
  const figures = [...new Set(line.match(QUANTITY) ?? [])].filter(figure => !known.has(figure));
  if (figures.length) warnings.push(`Includes new figures: ${figures.join(', ')}. Confirm they are accurate before adding.`);
  if (errors.length) return { suggestion: null, errors, warnings };

  const target = lines.filter(item => item.section.toLowerCase() === heading.toLowerCase());
  const bullet = target.map(item => BULLET.exec(item.text)?.[1]).find(Boolean);
  const check = verifyStatement(line, inventoryFacts(resumeText));
  return {
    errors, warnings,
    suggestion: {
      ...suggestion, provenance: 'user-asserted' as const, original: null,
      proposed: bullet ? `${bullet} ${line}` : line, targetHeading: heading, targetSection: sectionKind(heading),
      supported: false, effect: 'raises-evidence' as const,
      verified: { status: 'user-confirmed' as const, newClaims: check.newClaims,
        reason: 'You added this line. Automated checks cannot confirm it; re-read it before sending.' },
    },
  };
}
