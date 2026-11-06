import { SKILL_ALIASES, getSkillRegex } from '@/lib/keywords';
import { RESUME_HEADINGS } from '@/lib/export/resume-document';

/** Lines that deny, defer or hedge a skill are never evidence for it. */
export const NEGATION = /\b(?:no|not|never|without|lack|lacking|unfamiliar|learning|plan to|want to|hope to)\b|limited exposure/i;
const SKILLS_HEADING = /^(?:technical\s+)?skills$/i;

export interface ResumeLine {
  text: string;
  index: number;
  section: string;
  isHeading: boolean;
  inSkills: boolean;
}

export function resumeLines(text: string): ResumeLine[] {
  let section = '';
  return text.replace(/\r\n/g, '\n').split('\n').map((raw, index) => {
    const heading = raw.trim().replace(/:$/, '');
    const isHeading = RESUME_HEADINGS.test(heading);
    if (isHeading) section = heading;
    return { text: raw, index, section, isHeading, inSkills: SKILLS_HEADING.test(section) && !isHeading };
  });
}

export const isSkillsHeading = (title: string) => SKILLS_HEADING.test(title.trim());

/** The keyword plus every alias the project's alias table maps to the same canonical skill. */
export function termsFor(keyword: string): string[] {
  const canonical = (SKILL_ALIASES[keyword.toLowerCase()] ?? keyword).toLowerCase();
  const terms = new Map<string, string>([[keyword.toLowerCase(), keyword]]);
  for (const [alias, target] of Object.entries(SKILL_ALIASES)) {
    if (target.toLowerCase() === canonical && !terms.has(alias)) terms.set(alias, alias);
  }
  if (!terms.has(canonical)) terms.set(canonical, SKILL_ALIASES[keyword.toLowerCase()] ?? keyword);
  return [...terms.values()].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

/** Locate a term on a line with the project's skill-boundary rules; returns the text as written. */
export function findTerm(line: string, term: string): { start: number; text: string } | null {
  const match = getSkillRegex(term).exec(line);
  if (!match) return null;
  const offset = match[0].toLowerCase().indexOf(term.toLowerCase());
  if (offset < 0) return null;
  const start = match.index + offset;
  return { start, text: line.slice(start, start + term.length) };
}

export const mentions = (line: string, terms: string[]) => terms.some(term => findTerm(line, term));

/** Negation test that ignores the skill's own words, so "Machine Learning" is not read as a hedge. */
export function isNegated(line: string, terms: string[]): boolean {
  let rest = line;
  for (const term of terms) {
    for (let hit = findTerm(rest, term); hit; hit = findTerm(rest, term)) {
      rest = rest.slice(0, hit.start) + ' ' + rest.slice(hit.start + hit.text.length);
    }
  }
  return NEGATION.test(rest);
}
