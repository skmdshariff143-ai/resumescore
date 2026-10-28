import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseResume, scoreResume } from 'resumescore-core';

describe('Property-Based Parser & Scorer Robustness (fast-check)', () => {
  it('never throws unhandled errors on arbitrary unicode or chaotic strings (fuzzing)', () => {
    fc.assert(
      fc.property(fc.string(), (randomInput) => {
        expect(() => {
          const parsed = parseResume(randomInput, 'fuzz-test.txt');
          expect(parsed).toBeDefined();
          expect(typeof parsed.metadata.extractedCharCount).toBe('number');
          expect(Array.isArray(parsed.sections)).toBe(true);
        }).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });

  it('guarantees pure determinism: parseResume(s) produces identical parsed entities across multiple runs', () => {
    const resumeArbitrary = fc.record({
      name: fc.string({ minLength: 2, maxLength: 30 }),
      email: fc.emailAddress(),
      skillA: fc.constantFrom('TypeScript', 'React', 'Python', 'Go', 'Docker', 'AWS'),
      skillB: fc.constantFrom('PostgreSQL', 'GraphQL', 'Next.js', 'Kubernetes', 'Redis'),
      jobTitle: fc.constantFrom('Software Engineer', 'Frontend Developer', 'Data Analyst', 'Cloud Architect'),
      company: fc.constantFrom('Acme Corp', 'CloudScale Inc', 'Tech Solutions LLC'),
    }).map((r) => `${r.name}\n${r.email}\n\nEXPERIENCE\n${r.jobTitle} | ${r.company} | 2022 - Present\n- Built web services using ${r.skillA} and ${r.skillB}.\n\nSKILLS\n${r.skillA}, ${r.skillB}`);

    fc.assert(
      fc.property(resumeArbitrary, (text) => {
        const run1 = parseResume(text, 'test.txt');
        const run2 = parseResume(text, 'test.txt');

        expect(run1.personalInfo.name).toEqual(run2.personalInfo.name);
        expect(run1.personalInfo.email).toEqual(run2.personalInfo.email);
        expect(run1.allSkills).toEqual(run2.allSkills);
        expect(run1.sections.length).toEqual(run2.sections.length);
        expect(run1.experience.length).toEqual(run2.experience.length);
      }),
      { numRuns: 50 }
    );
  });

  it('maintains line-ending stability: identical entity extraction under CRLF vs LF', () => {
    const realisticResumeGen = fc.record({
      name: fc.constantFrom('Jane Developer', 'John Engineer', 'Alice Coder'),
      email: fc.constantFrom('jane@example.com', 'john@example.org', 'alice@example.net'),
      role: fc.constantFrom('Senior Developer', 'Platform Engineer', 'Full Stack Developer'),
      company: fc.constantFrom('Apex Systems', 'Innovatech Labs', 'Stripe'),
    }).map((r) => `${r.name}\n${r.email}\n\nEXPERIENCE\n${r.role} | ${r.company} | 2021 - Present\n- Led microservice development using Go and PostgreSQL.\n\nEDUCATION\nB.S. in Computer Science | 2020\n\nSKILLS\nGo, PostgreSQL, Docker, Git`);

    fc.assert(
      fc.property(realisticResumeGen, (text) => {
        const lfText = text.replace(/\r?\n/g, '\n');
        const crlfText = text.replace(/\r?\n/g, '\r\n');

        const parsedLf = parseResume(lfText, 'lf.txt');
        const parsedCrlf = parseResume(crlfText, 'crlf.txt');

        expect(parsedLf.personalInfo.name).toBe(parsedCrlf.personalInfo.name);
        expect(parsedLf.personalInfo.email).toBe(parsedCrlf.personalInfo.email);
        expect(parsedLf.sections.length).toBe(parsedCrlf.sections.length);
        expect(parsedLf.experience.length).toBe(parsedCrlf.experience.length);
        expect(parsedLf.allSkills).toEqual(parsedCrlf.allSkills);
      }),
      { numRuns: 40 }
    );
  });

  it('maintains whitespace stability: leading and trailing whitespace does not alter parsed entities', () => {
    const resumeText = `Alex Taylor\nalex.taylor@example.com | (555) 123-9876\n\nSUMMARY\nExperienced engineer.\n\nEXPERIENCE\nStaff Engineer | Global Corp | 2020 - Present\n- Automated deployments using Kubernetes and Docker.\n\nSKILLS\nKubernetes, Docker, Go, Python`;

    const whitespaceGen = fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 8 }).map((a) => a.join(''));

    fc.assert(
      fc.property(whitespaceGen, whitespaceGen, (leadingWs, trailingWs) => {
        const paddedText = `${leadingWs}${resumeText}${trailingWs}`;
        const baseline = parseResume(resumeText, 'clean.txt');
        const padded = parseResume(paddedText, 'padded.txt');

        expect(padded.personalInfo.name).toBe(baseline.personalInfo.name);
        expect(padded.personalInfo.email).toBe(baseline.personalInfo.email);
        expect(padded.allSkills).toEqual(baseline.allSkills);
        expect(padded.experience.length).toBe(baseline.experience.length);
      }),
      { numRuns: 40 }
    );
  });

  it('guarantees pure mathematical determinism of scoring without mutation side-effects', () => {
    const resumeText = `Marcus Vance\nmarcus@example.com\n\nEXPERIENCE\nSenior Developer | Acme | 2021 - Present\n- Built scalable APIs using Node.js and TypeScript for 50,000 users.\n- Reduced cloud spend by 25%.\n\nSKILLS\nTypeScript, Node.js, AWS, PostgreSQL`;
    const parsed = parseResume(resumeText, 'marcus.txt');

    const score1 = scoreResume(parsed);
    const score2 = scoreResume(parsed);

    expect(score1.overall).toBe(score2.overall);
    expect(score1.grade).toBe(score2.grade);
    expect(score1.dimensions.length).toBe(score2.dimensions.length);
    for (let i = 0; i < score1.dimensions.length; i++) {
      expect(score1.dimensions[i].score).toBe(score2.dimensions[i].score);
      expect(score1.dimensions[i].contribution).toBe(score2.dimensions[i].contribution);
    }
  });
});
