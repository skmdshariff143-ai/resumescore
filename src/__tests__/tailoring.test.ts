import { describe, expect, it } from 'vitest';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';
import { splitResumeBlocks, resumeBlocksToText } from '@/lib/export/resume-document';
import {
  analyzeKeywords, applySuggestions, buildTailoringSuggestions, MAX_SKILLS_ADDED, MAX_SUGGESTIONS,
  reviewReducer, initialReviewState, scoreTailoring, withUserEvidence, type TailoringSuggestion,
} from '@/lib/tailoring';

const RESUME = `Sam Rivera
sam@example.com
SUMMARY
Backend developer focused on reliable data services.
EXPERIENCE
Software Engineer | Example Logistics | 2022 - Present
- Built REST APIs in Python serving 2 million requests per day.
- Containerized the billing service using Docker.
- Developed ML models to forecast shipment delays.
- No experience with Kubernetes yet; deployments use managed VMs.
- Migrated reporting databases without downtime.
PROJECTS
Inventory tracker
- Developed an inventory dashboard using Django and PostgreSQL.
SKILLS
Python, SQL`;

const JOB = `Backend Engineer
Required: Python, Docker, Kubernetes, Machine Learning
Preferred: PostgreSQL, GraphQL`;

function setup(resume = RESUME, jobText = JOB) {
  const job = parseJobDescription(jobText);
  const parsed = parseResume(resume);
  const matrix = buildSkillMatrix(parsed.skills, parsed.allSkills, parsed.rawText,
    job.requiredSkills, job.preferredSkills, job.bonusSkills);
  return { job, matrix, suggestions: buildTailoringSuggestions(resume, job, matrix) };
}
const find = (list: TailoringSuggestion[], keyword: string, action?: TailoringSuggestion['action']) =>
  list.find(item => item.keyword === keyword && (!action || item.action === action));
const tailored = (accepted: TailoringSuggestion[], resume = RESUME) =>
  resumeBlocksToText(applySuggestions(splitResumeBlocks(resume), accepted).blocks);

describe('tailoring suggestions', () => {
  it('surfaces a keyword used in a project but absent from Skills, citing the source line', () => {
    const { suggestions } = setup();
    const item = find(suggestions, 'PostgreSQL', 'surface-in-skills')!;
    expect(item).toBeDefined();
    expect(item.original).toBe('Python, SQL');
    expect(item.proposed).toBe('Python, SQL, PostgreSQL');
    expect(item.sourceEvidence).toMatchObject({ line: '- Developed an inventory dashboard using Django and PostgreSQL.', section: 'PROJECTS' });
    expect(item.provenance).toBe('resume');
    expect(item.supported).toBe(true);
    expect(item.effect).toBe('visibility-only');
    expect(tailored([item])).toContain('SKILLS\nPython, SQL, PostgreSQL');
  });

  it('never proposes or inserts a keyword that has no evidence', () => {
    const { suggestions } = setup();
    const gap = find(suggestions, 'GraphQL')!;
    expect(gap.action).toBe('user-evidence-needed');
    expect(gap.proposed).toBeNull();
    expect(gap.supported).toBe(false);
    expect(gap.sourceEvidence).toBeNull();
    const all = suggestions.filter(item => item.supported);
    const text = tailored(all);
    expect(text).not.toMatch(/GraphQL/);
    expect(text).not.toMatch(/Kubernetes(?! yet)/);
  });

  it('respects negation: "No experience with Kubernetes" is not evidence', () => {
    const { suggestions, job, matrix } = setup();
    const row = analyzeKeywords(RESUME, job, matrix).find(item => item.keyword === 'Kubernetes')!;
    expect(row.effectiveLevel).toBe('missing');
    expect(row.negatedOnly).toBe(true);
    const k8s = suggestions.filter(item => item.keyword === 'Kubernetes');
    expect(k8s.map(item => item.action)).toEqual(['user-evidence-needed']);
  });

  it('does not mistake the word "learning" inside a skill name for a hedge', () => {
    const resume = RESUME.replace('Developed ML models', 'Developed Machine Learning models');
    const { job, matrix } = setup(resume);
    const row = analyzeKeywords(resume, job, matrix).find(item => item.keyword === 'Machine Learning')!;
    expect(row.effectiveLevel).toBe('demonstrated');
    expect(row.negatedOnly).toBe(false);
  });

  it('does not let an unrelated negated line ("without downtime") block supported edits', () => {
    const { suggestions } = setup();
    expect(find(suggestions, 'PostgreSQL', 'surface-in-skills')!.verified.status).not.toBe('contradicted');
  });

  it('matches aliases: "ML" is evidence for "Machine Learning" and is reworded in place', () => {
    const { suggestions, job, matrix } = setup();
    const row = analyzeKeywords(RESUME, job, matrix).find(item => item.keyword === 'Machine Learning')!;
    expect(row.effectiveLevel).not.toBe('missing');
    const reword = find(suggestions, 'Machine Learning', 'reword-to-job-term')!;
    expect(reword.original).toBe('- Developed ML models to forecast shipment delays.');
    expect(reword.proposed).toBe('- Developed Machine Learning (ML) models to forecast shipment delays.');
    expect(reword.supported).toBe(true);
    expect(reword.effect).toBe('raises-evidence');
  });

  it('raises the job-terminology score only through supported, evidence-backed edits', () => {
    const { suggestions, job } = setup();
    const result = scoreTailoring(RESUME, tailored(suggestions.filter(item => item.supported)), job, 'experienced');
    expect(result.jobAlignmentAfter).toBeGreaterThan(result.jobAlignmentBefore);
  });

  it('is deterministic for the same input, regardless of the parsed job id', () => {
    const first = setup().suggestions;
    const second = setup().suggestions;
    expect(second).toEqual(first);
    expect(new Set(first.map(item => item.id)).size).toBe(first.length);
  });

  it('keeps transferable evidence as a review item, never supported', () => {
    const { suggestions } = setup(RESUME.replace('Python, SQL', 'SQL').replace('in Python ', ''),
      'Data Engineer\nRequired: Python');
    const item = find(suggestions, 'Python')!;
    expect(item.action).toBe('review-transferable');
    expect(item.sourceEvidence?.line).toMatch(/Django/);
    expect(item.proposed).toBeNull();
    expect(item.supported).toBe(false);
  });

  it('caps skills additions and total suggestions', () => {
    const many = ['Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'Ruby', 'Scala', 'TypeScript', 'Redis', 'MongoDB', 'Terraform'];
    const resume = `${RESUME}\nPROJECTS\n${many.map(skill => `- Developed a service using ${skill}.`).join('\n')}`;
    const { suggestions } = setup(resume, `Engineer\nRequired: ${many.join(', ')}`);
    expect(suggestions.filter(item => item.action === 'surface-in-skills').length).toBeLessThanOrEqual(MAX_SKILLS_ADDED);
    expect(suggestions.length).toBeLessThanOrEqual(MAX_SUGGESTIONS);
    const text = tailored(suggestions.filter(item => item.supported), resume);
    const skillsLine = text.split('\n')[text.split('\n').indexOf('SKILLS') + 1];
    expect(skillsLine.split(', ').length).toBeLessThanOrEqual(2 + MAX_SKILLS_ADDED);
  });

  it('creates a Skills section containing only evidenced keywords when none exists', () => {
    const resume = RESUME.replace(/\nSKILLS\nPython, SQL$/, '');
    const { suggestions } = setup(resume);
    const surfaced = suggestions.filter(item => item.action === 'surface-in-skills');
    expect(surfaced[0].original).toBeNull();
    const blocks = applySuggestions(splitResumeBlocks(resume), surfaced).blocks;
    const skills = blocks.find(block => block.title === 'Skills')!;
    expect(skills.content.split(', ').sort()).toEqual(surfaced.map(item => item.keyword).sort());
  });
});

describe('Summary core-skills line', () => {
  it('lists only demonstrated keywords, cites every source and is never auto-accepted', () => {
    const { suggestions } = setup();
    const item = find(suggestions, 'Core skills', 'summary-core-skills')!;
    expect(item.proposed).toBe('Core skills: Machine Learning, Python, PostgreSQL');
    expect(item.original).toBeNull();
    expect(item.targetHeading).toBe('SUMMARY');
    expect(item.targetSection).toBe('summary');
    expect(item.sources!.map(source => source.line)).toEqual([
      '- Developed ML models to forecast shipment delays.',
      '- Built REST APIs in Python serving 2 million requests per day.',
      '- Developed an inventory dashboard using Django and PostgreSQL.',
    ]);
    expect(item.supported).toBe(false);
    expect(item.proposed).not.toMatch(/Docker|Kubernetes|GraphQL/);
    let state = reviewReducer(initialReviewState(), { type: 'accept-all-supported', suggestions });
    expect(state.decisions[item.id]).toBeUndefined();
    state = reviewReducer(state, { type: 'accept', id: item.id });
    expect(tailored([item])).toContain('SUMMARY\nBackend developer focused on reliable data services.\nCore skills: Machine Learning, Python, PostgreSQL');
  });

  it('is not offered without a Summary section, with fewer than two evidenced keywords, or when one exists', () => {
    expect(find(setup(RESUME.replace(/SUMMARY\nBackend developer[^\n]*\n/, '')).suggestions, 'Core skills')).toBeUndefined();
    expect(find(setup(RESUME, 'Engineer\nRequired: Python, GraphQL').suggestions, 'Core skills')).toBeUndefined();
    const existing = RESUME.replace('data services.', 'data services.\nCore skills: Python');
    expect(find(setup(existing).suggestions, 'Core skills')).toBeUndefined();
  });
});

describe('user-asserted evidence', () => {
  const gap = () => find(setup().suggestions, 'GraphQL')!;

  it('marks the line user-asserted, verifies it and never makes it "supported"', () => {
    const result = withUserEvidence(gap(), 'Designed a GraphQL schema for the internal parts catalog.', 'EXPERIENCE', RESUME);
    expect(result.errors).toEqual([]);
    expect(result.suggestion!.provenance).toBe('user-asserted');
    expect(result.suggestion!.supported).toBe(false);
    expect(result.suggestion!.verified.newClaims).toContain('graphql');
    expect(tailored([result.suggestion!])).toMatch(/EXPERIENCE[\s\S]*- Designed a GraphQL schema/);
  });

  it('requires the keyword, a length limit and confirmation for new figures', () => {
    expect(withUserEvidence(gap(), 'Designed a schema.', 'EXPERIENCE', RESUME).errors[0]).toMatch(/GraphQL/);
    expect(withUserEvidence(gap(), `GraphQL ${'x'.repeat(400)}`, 'EXPERIENCE', RESUME).errors[0]).toMatch(/300/);
    const numbers = withUserEvidence(gap(), 'Cut GraphQL response time by 40%.', 'EXPERIENCE', RESUME);
    expect(numbers.errors).toEqual([]);
    expect(numbers.warnings[0]).toMatch(/40%/);
  });

  it('blocks a line that contradicts a negated statement about the same keyword', () => {
    const k8s = find(setup().suggestions, 'Kubernetes')!;
    const result = withUserEvidence(k8s, 'Operated Kubernetes clusters in production.', 'EXPERIENCE', RESUME);
    expect(result.errors[0]).toMatch(/No experience with Kubernetes/);
    expect(result.suggestion).toBeNull();
  });

  it('strips control and zero-width characters', () => {
    const result = withUserEvidence(gap(), 'Built​ a GraphQL\u0007 gateway.', 'EXPERIENCE', RESUME);
    expect(result.suggestion!.proposed).toBe('- Built a GraphQL gateway.');
  });
});

describe('review state', () => {
  it('accepts, rejects, accepts all supported, undoes and resets', () => {
    const { suggestions } = setup();
    let state = initialReviewState();
    const pg = find(suggestions, 'PostgreSQL', 'surface-in-skills')!;
    state = reviewReducer(state, { type: 'reject', id: pg.id });
    expect(state.decisions[pg.id]).toBe('rejected');
    state = reviewReducer(state, { type: 'accept-all-supported', suggestions });
    const supported = suggestions.filter(item => item.supported && item.id !== pg.id);
    expect(supported.length).toBeGreaterThan(0);
    expect(supported.every(item => state.decisions[item.id] === 'accepted')).toBe(true);
    expect(state.decisions[pg.id]).toBe('rejected');
    expect(suggestions.filter(item => !item.supported).some(item => state.decisions[item.id])).toBe(false);
    state = reviewReducer(state, { type: 'undo' });
    expect(supported.some(item => state.decisions[item.id])).toBe(false);
    state = reviewReducer(state, { type: 'accept', id: pg.id });
    expect(state.decisions[pg.id]).toBe('accepted');
    state = reviewReducer(state, { type: 'reset' });
    expect(state.decisions).toEqual({});
    expect(state.history).toEqual([]);
  });
});
