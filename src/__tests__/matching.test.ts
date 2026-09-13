import { describe, it, expect } from 'vitest';
import { matchSingleSkill, buildSkillMatrix } from '../lib/matching/semantic-matcher';
import { extractCategorizedSkills } from '../lib/parsing/resume-parser';

describe('Layered 6-Level Semantic Matcher', () => {
  const resumeText = 'Built high-throughput backend services using FastAPI, Python, PostgreSQL, and Docker.';
  const { categorized, all } = extractCategorizedSkills(resumeText);

  it('Level 1 & 2: Identifies exact and normalized skill matches with high confidence', () => {
    const match = matchSingleSkill('Python', categorized, all, resumeText, 'required');
    expect(match.status).toBe('matched');
    expect(match.confidence).toBeGreaterThanOrEqual(0.95);
    expect(match.evidence).toBeDefined();
  });

  it('Level 3: Resolves industry aliases and canonical names', () => {
    const match = matchSingleSkill('Postgres', categorized, all, resumeText, 'required');
    expect(match.status).toBe('matched');
    expect(match.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('Level 4: Identifies taxonomy relationships and subsumptions without false exact claims', () => {
    const match = matchSingleSkill('Relational Databases (SQL)', categorized, all, resumeText, 'required');
    expect(match.status).toBe('partial');
    expect(match.matchLevel).toBe('level_4_taxonomy');
    expect(match.reasoning).toContain('PostgreSQL');
  });

  it('Correctly marks missing skills without claiming candidate does not possess them', () => {
    const match = matchSingleSkill('Kubernetes', categorized, all, resumeText, 'required');
    expect(match.status).toBe('missing');
    expect(match.reasoning).toContain('does not contain explicit evidence');
  });

  it('Builds comprehensive 11-category SkillMatrix with Required/Preferred classification', () => {
    const matrix = buildSkillMatrix(
      categorized,
      all,
      resumeText,
      ['Python', 'PostgreSQL'],
      ['Docker'],
      ['Kubernetes']
    );

    expect(matrix.languages.some((s) => s.skill === 'Python')).toBe(true);
    expect(matrix.databases.some((s) => s.skill === 'PostgreSQL')).toBe(true);
    expect(matrix.devops.some((s) => s.skill === 'Docker' && s.importance === 'preferred')).toBe(true);
  });
});
