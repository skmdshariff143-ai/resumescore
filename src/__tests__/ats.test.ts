import { describe, it, expect } from 'vitest';
import { runATSChecks } from '../lib/ats/ats-checker';
import { parseResume } from '../lib/parsing/resume-parser';

describe('ATS Compliance Auditor', () => {
  it('passes all critical checks for a well-structured resume', () => {
    const goodResume = `John Smith
john@smith.com | (555) 999-1234 | linkedin.com/in/jsmith

WORK EXPERIENCE
Software Engineer | Google | 2020 - Present
• Engineered search ranking algorithms.

EDUCATION
BS in CS | Stanford University | 2016 - 2020

SKILLS
Java, Python, C++, Go

PROJECTS
Search Bot | github.com/jsmith/search
• Indexed 1M web pages.
`;
    const parsed = parseResume(goodResume, 'good.txt');
    const ats = runATSChecks(parsed);

    expect(ats.score).toBeGreaterThanOrEqual(80);
    expect(ats.criticalIssuesCount).toBe(0);
    expect(ats.checks.find((c) => c.id === 'ats-headings')?.passed).toBe(true);
    expect(ats.checks.find((c) => c.id === 'ats-email')?.passed).toBe(true);
  });

  it('flags missing contact details and non-standard sections with actionable fixes', () => {
    const poorResume = `Random Candidate
My Journey:
Did some coding here and there for a few years.
`;
    const parsed = parseResume(poorResume, 'poor.txt');
    const ats = runATSChecks(parsed);

    expect(ats.criticalIssuesCount).toBeGreaterThanOrEqual(1);
    expect(ats.checks.find((c) => c.id === 'ats-email')?.passed).toBe(false);
    expect(ats.checks.find((c) => c.id === 'ats-headings')?.passed).toBe(false);
  });
});
