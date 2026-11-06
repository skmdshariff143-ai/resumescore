import { RESUME_HEADINGS } from '@/lib/export/resume-document';

export { NEGATION, findTerm, isNegated, mentions, termsFor } from '@/lib/matching/evidence-terms';

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
