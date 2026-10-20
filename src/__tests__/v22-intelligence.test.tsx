import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CareerSignalRadar } from '@/components/ui/CareerSignalRadar';
import { parseResume } from '@/lib/parsing/resume-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { compareResumeVersions } from '@/lib/scoring/comparison';
import { analyzeBullet } from '@/lib/impact/impact-evaluator';

const source = `Alex Example
alex@example.com
EDUCATION
Bachelor of Science | Example University | 2025
PROJECTS
Community research
Analyzed inventory trends using Python and SQL.
SKILLS
Python, SQL`;

describe('V2.2 intelligence regressions', () => {
  it('preserves a zero skill score in the dashboard rather than substituting a default', () => {
    const score = calculateResumeScore(parseResume(source), parseJobDescription('Required: Kubernetes'), 'job_match');
    expect(score.skillMatchScore).toBe(0);
    const html = renderToStaticMarkup(<CareerSignalRadar score={score} />);
    expect(html).not.toContain('>78</span>');
    expect(html).toContain('>0</span>');
  });

  it('recognizes non-software project action lines as descriptions', () => {
    for (const action of ['Analyzed inventory trends.', 'Prepared financial reports.', 'Supported patient care.', 'Delivered community training.']) {
      const parsed = parseResume(source.replace('Analyzed inventory trends using Python and SQL.', action));
      expect(parsed.projects).toHaveLength(1);
      expect(parsed.projects[0].description).toContain(action);
    }
  });

  it('does not give transferable evidence credit to an unsupported taxonomy keyword', () => {
    const score = (text: string) => Object.values(buildSkillMatrix(parseResume(text).skills,
      parseResume(text).allSkills, text, ['Python'])).flat()[0];
    expect(score('SKILLS\nFastAPI').evidenceLevel).toBe('mentioned');
    expect(score('PROJECTS\nBuilt an inventory service using FastAPI.').evidenceLevel).toBe('transferable');
  });

  it('does not populate bonus-only job matches with unrelated candidate skills', () => {
    const parsed = parseResume(source);
    const matrix = buildSkillMatrix(parsed.skills, parsed.allSkills, source, [], [], ['Docker']);
    expect(Object.values(matrix).flat().map(item => item.skill)).toEqual(['Docker']);
  });

  it('recalculates identical versions consistently and explains genuine evidence changes', () => {
    const context = calculateResumeScore(parseResume(source), parseJobDescription('Required: Python, SQL'), 'job_match', 'student');
    const same = compareResumeVersions(source, source, context);
    expect(same.before).toBe(same.after);
    expect(same.dimensions.every(item => item.delta === 0)).toBe(true);
    const mention = source.replace('Analyzed inventory trends using Python and SQL.', 'Community research assignment.');
    const changed = compareResumeVersions(mention, source, context);
    expect(changed.dimensions.find(item => item.key === 'skill_match')!.delta).toBeGreaterThan(0);
    expect(changed.dimensions.every(item => item.explanation.length > 0)).toBe(true);
  });

  it('uses an early-career readability band and includes project achievements', () => {
    const text = source + '\n' + 'A concise account of relevant academic work. '.repeat(22);
    const student = calculateResumeScore(parseResume(text), undefined, 'general', 'student');
    const experienced = calculateResumeScore(parseResume(text), undefined, 'general', 'experienced');
    expect(student.readabilityScore).toBeGreaterThan(experienced.readabilityScore);
    expect(student.bulletAnalyses?.some(item => item.original.includes('Analyzed inventory'))).toBe(true);
    expect(student.dimensions.find(item => item.key === 'experience')!.evidence.missing).toEqual([]);
  });

  it('does not infer individual ownership or leadership from a technology verb', () => {
    expect(analyzeBullet('Architected an inventory service.', 0).ownershipLevel).toBe('unspecified');
    expect(analyzeBullet('Led a team preparing inventory reports.', 0).ownershipLevel).toBe('lead');
  });

  it('scores preferred-only requirements and does not invent coverage for unrecognized requirements', () => {
    const preferred = calculateResumeScore(parseResume(source), parseJobDescription('Preferred: Python'), 'job_match');
    expect(preferred.skillMatchScore).toBe(100);
    const unknown = calculateResumeScore(parseResume(source), parseJobDescription('Required: local eligibility for the role'), 'job_match');
    expect(Object.values(unknown.skillMatrix ?? {}).flat()).toEqual([]);
    expect(renderToStaticMarkup(<CareerSignalRadar score={unknown} />)).toContain('N/A');
    expect(unknown.generalQualityScore).toBe(preferred.generalQualityScore);
  });

  it('reports low confidence when extraction has failed', () => {
    const parsed = parseResume(source);
    parsed.metadata.extractionQuality = 'failed';
    expect(calculateResumeScore(parsed).dimensions.every(item => item.confidence === 'low')).toBe(true);
  });
});
