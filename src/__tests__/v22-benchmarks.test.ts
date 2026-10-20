import { expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import fixtures from './fixtures/domain-resumes.json';
import { parseResume } from '@/lib/parsing/resume-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';
import { CAREER_LEVELS, type CareerLevel } from '@/lib/scoring/rubric';

it('measures explicit synthetic field labels across six sectors and career profiles', () => {
  const levels = Object.keys(CAREER_LEVELS) as CareerLevel[];
  const results = fixtures.map((fixture, index) => {
    const text = `Alex Example\nalex@example.com\nEDUCATION\nBachelor of Science | Example University | 2025\nPROJECTS\nCommunity research\n${fixture.text}\nSKILLS\n${fixture.skills.join(', ')}`;
    const parsed = parseResume(text);
    const fields = {
      name: parsed.personalInfo.name === 'Alex Example',
      email: parsed.personalInfo.email === 'alex@example.com',
      degree: parsed.education[0]?.degree === 'Bachelor of Science',
      institution: parsed.education[0]?.institution === 'Example University',
      projectName: parsed.projects.length === 1 && parsed.projects[0].name === 'Community research',
      projectDescription: parsed.projects[0]?.description === fixture.text,
    };
    const score = calculateResumeScore(parsed, undefined, 'general', levels[index]);
    const items = Object.values(score.skillMatrix ?? {}).flat();
    const expected = new Set(fixture.skills);
    const detected = new Set(parsed.allSkills);
    const truePositive = [...detected].filter(skill => expected.has(skill)).length;
    const falsePositive = [...detected].filter(skill => !expected.has(skill)).length;
    const falseNegative = [...expected].filter(skill => !detected.has(skill)).length;
    return { sector: fixture.domain, profile: levels[index], fields,
      truePositive, falsePositive, falseNegative,
      demonstrated: items.filter(item => item.evidenceLevel === 'demonstrated').length,
      score: score.overall };
  });
  const total = (key: 'truePositive' | 'falsePositive' | 'falseNegative') => results.reduce((sum, row) => sum + row[key], 0);
  writeFileSync('docs/v22-field-benchmark.json', JSON.stringify({
    provenance: 'Author-engineered synthetic expectations; not human-reviewed calibration',
    independentCalibration: 'pending', fixtureSource: 'src/__tests__/fixtures/domain-resumes.json',
    fieldMatches: results.reduce((sum, row) => sum + Object.values(row.fields).filter(Boolean).length, 0),
    fieldLabels: results.length * 6,
    skillPrecision: total('truePositive') / (total('truePositive') + total('falsePositive')),
    skillRecall: total('truePositive') / (total('truePositive') + total('falseNegative')),
    results,
  }, null, 2));
  expect(results.every(row => Object.values(row.fields).every(Boolean))).toBe(true);
  expect(total('falsePositive')).toBe(0);
  expect(total('falseNegative')).toBe(0);
});
