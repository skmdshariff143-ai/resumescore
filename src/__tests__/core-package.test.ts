import { describe, it, expect } from 'vitest';
import {
  parseResume,
  scoreResume,
  matchJob,
  parseJob,
  compareResumeVersions,
  ResumeParserError,
  ScoringError,
  JobMatchError,
  CAREER_LEVELS,
  RUBRIC_WEIGHTS,
} from 'resumescore-core';

describe('resumescore-core Public API', () => {
  const sampleResumeText = `
Alex Developer
alex@example.com | 555-123-4567 | Austin, TX
https://github.com/alexdev | https://linkedin.com/in/alexdev

EXPERIENCE
Acme Cloud | Senior Software Engineer | Remote
01/2021 - Present
- Architected microservices with TypeScript, Node.js, and Docker.
- Reduced API p99 latency by 35% across 10 million daily requests.
- Mentored 4 engineers and led quarterly sprint planning.

EDUCATION
Texas Tech University | B.S. in Computer Science | 2020

SKILLS
TypeScript, Node.js, Go, Docker, Kubernetes, AWS, PostgreSQL, Redis
  `;

  const sampleJobText = `
Senior Platform Engineer
Requirements:
- Proven experience with TypeScript, Node.js, and Docker
- Hands-on Kubernetes and AWS infrastructure experience
- Excellent mentoring and collaboration skills
  `;

  describe('parseResume', () => {
    it('successfully parses resume text into structured representation', () => {
      const parsed = parseResume(sampleResumeText, { fileName: 'alex.txt' });
      expect(parsed.personalInfo.name).toBe('Alex Developer');
      expect(parsed.personalInfo.email).toBe('alex@example.com');
      expect(parsed.allSkills).toContain('TypeScript');
      expect(parsed.allSkills).toContain('Docker');
      expect(parsed.experience.length).toBeGreaterThan(0);
      expect(parsed.experience[0].role).toBe('Senior Software Engineer');
      expect(parsed.education.length).toBeGreaterThan(0);
    });

    it('throws ResumeParserError when input is not a string', () => {
      // @ts-expect-error testing runtime validation
      expect(() => parseResume(null)).toThrow(ResumeParserError);
      // @ts-expect-error testing runtime validation
      expect(() => parseResume(12345)).toThrow(ResumeParserError);
    });
  });

  describe('scoreResume', () => {
    it('scores a parsed resume deterministically across general and job_match modes', () => {
      const parsed = parseResume(sampleResumeText);

      const generalScore = scoreResume(parsed, { careerLevel: 'experienced' });
      expect(generalScore.overall).toBeGreaterThan(0);
      expect(generalScore.overall).toBeLessThanOrEqual(100);
      expect(generalScore.dimensions.length).toBe(7);
      expect(generalScore.careerLevel).toBe('experienced');

      const matchScore = scoreResume(parsed, { job: sampleJobText, careerLevel: 'senior' });
      expect(matchScore.overall).toBeGreaterThan(0);
      expect(matchScore.skillMatchScore).toBeDefined();
      expect(matchScore.skillMatrix).toBeDefined();
    });

    it('throws ScoringError on invalid parsed object', () => {
      // @ts-expect-error testing runtime validation
      expect(() => scoreResume(null)).toThrow(ScoringError);
      // @ts-expect-error testing runtime validation
      expect(() => scoreResume('invalid')).toThrow(ScoringError);
    });
  });

  describe('matchJob', () => {
    it('matches parsed skills against job description', () => {
      const parsed = parseResume(sampleResumeText);
      const matrix = matchJob(parsed, sampleJobText);

      expect(matrix).toBeDefined();
      const allMatched = Object.values(matrix).flat();
      expect(allMatched.some(item => item.skill.toLowerCase() === 'typescript')).toBe(true);
      expect(allMatched.some(item => item.skill.toLowerCase() === 'docker')).toBe(true);
    });

    it('throws JobMatchError when parsed resume is missing skills', () => {
      // @ts-expect-error testing runtime validation
      expect(() => matchJob({}, sampleJobText)).toThrow(JobMatchError);
    });
  });

  describe('parseJob and compareResumeVersions', () => {
    it('extracts job requirements and metadata', () => {
      const job = parseJob(sampleJobText);
      expect(job.title).toContain('Platform');
      expect(job.requiredSkills.length).toBeGreaterThan(0);
    });

    it('computes before and after comparison deltas', () => {
      const parsed = parseResume(sampleResumeText);
      const score = scoreResume(parsed, { job: sampleJobText });
      const edited = sampleResumeText + '\n- Implemented Terraform IaC for Kubernetes on AWS.';

      const comparison = compareResumeVersions(sampleResumeText, edited, score);
      expect(comparison.before).toBeDefined();
      expect(comparison.after).toBeDefined();
      expect(comparison.dimensions.length).toBe(7);
    });
  });

  describe('Rubrics & Career Levels metadata', () => {
    it('exports all 6 career profiles with normalized weight distribution summing to 1.0', () => {
      expect(Object.keys(CAREER_LEVELS)).toHaveLength(6);
      for (const [, weights] of Object.entries(RUBRIC_WEIGHTS)) {
        const sum = weights.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 5);
      }
    });
  });
});
