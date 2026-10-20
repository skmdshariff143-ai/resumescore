import { describe, it, expect } from 'vitest';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import { CAREER_LEVELS, RUBRIC_WEIGHTS, type CareerLevel } from '@/lib/scoring/rubric';
import { printableResumeHTML, resumeBlocksToText, splitResumeBlocks } from '@/lib/export/resume-document';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';
import domainFixtures from './fixtures/domain-resumes.json';

const source = `Jane Doe
jane@example.com
EDUCATION
Bachelor of Science | Example University | 2025
PROJECTS
Inventory tool
Developed an inventory application using Python and SQL for a university project.
SKILLS
Python, SQL
VOLUNTEERING
Assisted with community events.`;

describe('V2 workflow regression fixtures (not independently reviewed benchmarks)', () => {
  it.each(domainFixtures)('detects explicitly stated terms in $domain', fixture => {
    const parsed = parseResume(`Jane Doe\njane@example.com\nEXPERIENCE\n${fixture.text}`);
    expect(parsed.allSkills).toEqual(expect.arrayContaining(fixture.skills));
    const matrix = buildSkillMatrix(parsed.skills, parsed.allSkills, parsed.rawText, fixture.skills);
    expect(Object.values(matrix).flat().every(item => item.evidenceLevel === 'demonstrated')).toBe(true);
  });
  it('retains inline required, preferred and optional requirements', () => {
    const job = parseJobDescription('Required: Python\nPreferred qualifications: Docker\nOptional: AWS');
    expect(job.requiredSkills).toContain('Python');
    expect(job.preferredSkills).toContain('Docker');
    expect(job.bonusSkills).toContain('AWS');
    expect(job.requiredSkills).not.toContain('Docker');
  });
  it.each(Object.keys(CAREER_LEVELS) as CareerLevel[])('uses a reproducible normalized rubric for %s', level => {
    expect(RUBRIC_WEIGHTS[level].reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1);
    const resume = parseResume(source, 'fixture.txt');
    const first = calculateResumeScore(resume, undefined, 'general', level);
    const second = calculateResumeScore(resume, undefined, 'general', level);
    expect(first.overall).toBe(second.overall);
    expect(first.overall).toBe(Math.round(first.dimensions.reduce((sum, dim) => sum + dim.contribution, 0)));
    expect(first.dimensions.every(dim => dim.evidence && dim.confidence)).toBe(true);
    expect(first.topActions.every(action => action.expectedScoreBoost === 0)).toBe(true);
  });
  it('keeps general quality unchanged when target job changes', () => {
    const resume = parseResume(source);
    const a = calculateResumeScore(resume, parseJobDescription('Engineer\nRequired: Python, SQL'), 'job_match', 'student');
    const b = calculateResumeScore(resume, parseJobDescription('Engineer\nRequired: Java, AWS'), 'job_match', 'student');
    expect(a.generalQualityScore).toBe(b.generalQualityScore);
  });
  it('gives a mention less credit than practical evidence', () => {
    const resume = parseResume(source);
    const mentioned = Object.values(buildSkillMatrix(resume.skills, ['Python'], 'SKILLS\nPython', ['Python'])).flat()[0];
    const demonstrated = Object.values(buildSkillMatrix(resume.skills, ['Python'], 'Developed inventory software using Python.', ['Python'])).flat()[0];
    expect(mentioned.evidenceLevel).toBe('mentioned');
    expect(mentioned.status).toBe('partial');
    expect(demonstrated.evidenceLevel).toBe('demonstrated');
  });
  it('preserves non-standard text through section editing and export', () => {
    const blocks = splitResumeBlocks(source);
    const text = resumeBlocksToText(blocks);
    for (const line of source.split('\n')) expect(text).toContain(line);
  });
  it('escapes untrusted markup in printable documents', () => {
    const html = printableResumeHTML([{ title: '<script>alert(1)</script>', content: '<img src=x onerror=alert(1)> José' }]);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).toContain('José');
  });
});
