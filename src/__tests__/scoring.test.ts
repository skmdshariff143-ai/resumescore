import { describe, it, expect } from 'vitest';
import { calculateResumeScore } from '../lib/scoring/scoring-engine';
import { parseResume } from '../lib/parsing/resume-parser';
import { parseJobDescription } from '../lib/jobs/job-parser';

describe('7-Pillar Transparent Scoring Engine & Stability', () => {
  const baseResume = `Jane Doe
jane.doe@email.com | (555) 123-4567 | linkedin.com/in/janedoe

EXPERIENCE
Software Engineer | Acme Corp | 2021 - Present
• Designed microservices in TypeScript and Node.js.
• Reduced response time by 25% using Redis caching.

EDUCATION
BS in Computer Science | MIT | 2017 - 2021 | GPA: 3.9/4.0

SKILLS
TypeScript, JavaScript, Node.js, Redis, Docker, Git

PROJECTS
Cloud Storage API | github.com/janedoe/cloud-api
• Built REST API handling 10k daily requests.
`;

  it('calculates deterministic 7-pillar scores with exact mathematical contributions', () => {
    const parsed = parseResume(baseResume, 'jane.txt');
    const score = calculateResumeScore(parsed, undefined, 'general');

    expect(score.overall).toBeGreaterThanOrEqual(60);
    expect(score.dimensions.length).toBe(7);

    // Verify sum of contributions equals overall
    const sumContributions = Math.round(score.dimensions.reduce((sum, d) => sum + d.contribution, 0));
    expect(score.overall).toBe(sumContributions);
  });

  it('proves score stability: adding a single irrelevant keyword does not cause sudden huge score spikes', () => {
    const parsedBase = parseResume(baseResume, 'jane.txt');
    const scoreBase = calculateResumeScore(parsedBase, undefined, 'general');

    const modifiedResume = baseResume + '\nAdditional note: blockchain cryptocurrency';
    const parsedMod = parseResume(modifiedResume, 'jane-mod.txt');
    const scoreMod = calculateResumeScore(parsedMod, undefined, 'general');

    // Score difference should be strictly bounded
    expect(Math.abs(scoreMod.overall - scoreBase.overall)).toBeLessThanOrEqual(3);
  });

  it('mathematically increases score when matching genuine required job skills', () => {
    const jobText = `Required: TypeScript, Node.js, Redis
Preferred: Docker`;
    const parsedJob = parseJobDescription(jobText);
    const parsedResume = parseResume(baseResume, 'jane.txt');
    const score = calculateResumeScore(parsedResume, parsedJob, 'job_match');

    expect(score.skillMatchScore).toBeGreaterThanOrEqual(80);
    expect(score.mode).toBe('job_match');
  });
});
