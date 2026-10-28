import { describe, it, expect } from 'vitest';
import { validateResumeFile, MAX_FILE_BYTES, MAX_TEXT_CHARACTERS } from '../lib/parsing/file-validation';
import { parseResume, extractCategorizedSkills } from '../lib/parsing/resume-parser';
import { calculateResumeScore } from '../lib/scoring/scoring-engine';
import { compareResumeVersions } from '../lib/scoring/comparison';
import { CAREER_LEVELS, type CareerLevel } from '../lib/scoring/rubric';
import type { JobParsed, ResumeParsed } from '@/types';

describe('Coverage Enhancement: File Validation', () => {
  it('throws on empty or oversized file', () => {
    expect(() => validateResumeFile('test.pdf', new Uint8Array(0))).toThrow(/5 MB/);
    expect(() => validateResumeFile('test.pdf', new Uint8Array(MAX_FILE_BYTES + 1))).toThrow(/5 MB/);
  });

  it('validates DOCX headers correctly', () => {
    const validDocx = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00]);
    expect(validateResumeFile('sample.docx', validDocx)).toBe('docx');

    const invalidDocx = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    expect(() => validateResumeFile('sample.docx', invalidDocx)).toThrow(/DOCX archive/);
  });

  it('validates PDF headers correctly', () => {
    const validPdf = new TextEncoder().encode('%PDF-1.7 sample content');
    expect(validateResumeFile('doc.pdf', validPdf)).toBe('pdf');

    const invalidPdf = new TextEncoder().encode('NOT_PDF_HEADER');
    expect(() => validateResumeFile('doc.pdf', invalidPdf)).toThrow(/valid PDF header/);
  });

  it('rejects unsupported extensions', () => {
    const bytes = new TextEncoder().encode('some text');
    expect(() => validateResumeFile('resume.exe', bytes)).toThrow(/Supported formats/);
    expect(() => validateResumeFile('image.png', bytes)).toThrow(/Supported formats/);
  });

  it('handles TXT files with binary characters or length bounds', () => {
    const validTxt = new TextEncoder().encode('Valid plain resume text');
    expect(validateResumeFile('notes.txt', validTxt)).toBe('txt');

    const binaryTxt = new Uint8Array([0x48, 0x65, 0x01, 0x6c]); // control character 0x01
    expect(() => validateResumeFile('corrupt.txt', binaryTxt)).toThrow(/binary data/);

    const longTxt = new TextEncoder().encode('A'.repeat(MAX_TEXT_CHARACTERS + 10));
    expect(() => validateResumeFile('long.txt', longTxt)).toThrow(/60,000 characters/);
  });
});

describe('Coverage Enhancement: Resume Parser Deep Branching', () => {
  it('parses diverse sections, contact details, and dates', () => {
    const text = `
Jane Doe
jane.doe@example.co.uk | +44 20 7946 0958 | San Francisco, CA
https://linkedin.com/in/janedoe | https://github.com/janedoe | https://janedoe.dev

SUMMARY
Seasoned Engineering Manager with 10+ years driving distributed platforms and cloud reliability.

EXPERIENCE
Acme Corp | Lead Software Engineer
03/2021 - Present | Remote
- Spearheaded Kubernetes migration reducing infrastructure costs by 28% across 40 microservices.
- Mentored 8 junior and mid-level engineers.
- Utilized TypeScript, Node.js, Go, Docker, AWS, and PostgreSQL.

Beta Inc | Senior Developer
June 2017 - February 2021 | Hybrid
- Designed high-throughput financial telemetry pipeline handling 1.2M daily transactions.
- Resolved database contention and improved query latency by 45%.

Delta Startup | Software Engineering Intern | Contract
06/2016 - 12/2016
- Built responsive customer portals using React, HTML5, and CSS3.

EDUCATION
University of Oxford
Master of Science in Computer Science | 2017
GPA: 3.9/4.0 | Honors: First Class Honours
Coursework: Distributed Systems, Advanced Algorithms, Cryptography

CERTIFICATIONS
- AWS Certified Solutions Architect Professional (2023)
- Certified Kubernetes Administrator (CKA)

PROJECTS
OpenSource Gateway (https://github.com/janedoe/gateway)
High-performance API gateway built in Rust and Go with zero-downtime routing.

AWARDS AND HONORS
- Acme Hackathon Winner 2022
- Dean's List 2016

PUBLICATIONS
- "Scaling Distributed Consensus in Heterogeneous Clusters", ACM 2018

SKILLS & EXPERTISE
Languages: TypeScript, Go, Python, Rust, SQL
Technologies: Kubernetes, Docker, Terraform, Kafka, React, Next.js, Redis
    `;

    const parsed = parseResume(text);
    expect(parsed.personalInfo.name).toBe('Jane Doe');
    expect(parsed.personalInfo.email).toBe('jane.doe@example.co.uk');
    expect(parsed.personalInfo.phone).toBeDefined();
    expect(parsed.personalInfo.linkedin).toContain('linkedin.com/in/janedoe');
    expect(parsed.personalInfo.github).toContain('github.com/janedoe');
    expect(parsed.personalInfo.portfolio || parsed.personalInfo.website).toBeDefined();

    expect(parsed.experience.length).toBeGreaterThanOrEqual(2);
    expect(parsed.experience.some(e => e.isRemote)).toBe(true);
    expect(parsed.experience.some(e => e.isHybrid)).toBe(true);
    expect(parsed.experience.some(e => e.isCurrent)).toBe(true);

    expect(parsed.education.length).toBeGreaterThan(0);
    expect(parsed.education[0].institution).toContain('Oxford');
    expect(parsed.education[0].degree).toBeDefined();

    expect(parsed.certifications.length).toBeGreaterThan(0);
    expect(parsed.projects.length).toBeGreaterThan(0);
    expect(parsed.projects[0].name).toBeDefined();

    expect(parsed.sections.some(s => s.type === 'awards')).toBe(true);
    expect(parsed.sections.some(s => s.type === 'publications')).toBe(true);
  });

  it('handles empty or single-line text gracefully without throwing', () => {
    const emptyParsed = parseResume('');
    expect(emptyParsed.rawText).toBe('');
    expect(emptyParsed.experience).toEqual([]);
    expect(emptyParsed.allSkills).toEqual([]);

    const singleLine = parseResume('Just a name without sections');
    expect(singleLine.personalInfo.name).toBeTruthy();
  });

  it('extractCategorizedSkills extracts and dedupes all skill types', () => {
    const skills = extractCategorizedSkills('Experience with TypeScript, React, Docker, Kubernetes, AWS, SQL, and Git.');
    expect(skills.categorized.languages.length).toBeGreaterThan(0);
    expect(skills.categorized.cloud.length).toBeGreaterThan(0);
    expect(skills.categorized.devops.length).toBeGreaterThan(0);
    expect(skills.all.length).toBeGreaterThan(3);
  });
});

describe('Coverage Enhancement: Scoring Engine Profiles & Comparison', () => {
  const sampleResume: ResumeParsed = parseResume(`
John Candidate
john@example.com | 555-0199 | San Francisco, CA
linkedin.com/in/johncand

EXPERIENCE
Tech Co | Full Stack Engineer | 2020 - Present
- Architected REST APIs in Node.js and TypeScript serving 500k monthly active users.
- Improved CI/CD build speeds by 35% using Docker caching and automated pipelines.
- Reduced database query times by 40% with PostgreSQL indexing.

EDUCATION
State University | Bachelor of Science in Information Technology | 2019

SKILLS
TypeScript, Node.js, React, Docker, PostgreSQL, Jest, Git, CI/CD
  `);

  const sampleJob: JobParsed = {
    id: 'sample-job-1',
    title: 'Senior TypeScript Engineer',
    company: 'Enterprise Cloud',
    location: 'Remote',
    workMode: 'remote',
    seniority: 'senior',
    minYearsExperience: 4,
    rawText: 'Looking for a Senior TypeScript Engineer with React, Node.js, and Docker.',
    requiredSkills: ['TypeScript', 'Node.js', 'React'],
    preferredSkills: ['Docker', 'PostgreSQL'],
    bonusSkills: ['Kubernetes', 'GraphQL'],
    educationRequirements: ['Bachelor of Science'],
    certifications: [],
    responsibilities: ['Build scalable APIs', 'Lead frontend features'],
    softSkills: ['Mentorship'],
    domainKnowledge: ['Cloud'],
    categorizedSkills: {
      languages: ['TypeScript'],
      frameworks: ['React', 'Node.js'],
      databases: ['PostgreSQL'],
      cloud: [],
      devops: ['Docker'],
      ai_ml: [],
      testing: [],
      security: [],
      tools: [],
      soft_skills: [],
      domain_knowledge: [],
    },
  };

  it('scores across all 6 career profiles in both general and job_match modes', () => {
    const levels = Object.keys(CAREER_LEVELS) as CareerLevel[];
    for (const level of levels) {
      const generalScore = calculateResumeScore(sampleResume, undefined, 'general', level);
      expect(generalScore.overall).toBeGreaterThan(0);
      expect(generalScore.overall).toBeLessThanOrEqual(100);
      expect(generalScore.careerLevel).toBe(level);
      expect(generalScore.dimensions.length).toBe(7);

      const jobScore = calculateResumeScore(sampleResume, sampleJob, 'job_match', level);
      expect(jobScore.overall).toBeGreaterThan(0);
      expect(jobScore.skillMatchScore).toBeDefined();
      expect(jobScore.skillMatrix).toBeDefined();
    }
  });

  it('compares two resume versions and returns delta evidence', () => {
    const baseScore = calculateResumeScore(sampleResume, sampleJob, 'job_match', 'experienced');
    const originalText = sampleResume.rawText;
    const editedText = originalText + '\n- Implemented Kubernetes clustering and GraphQL federated gateway.';

    const comparison = compareResumeVersions(originalText, editedText, baseScore);
    expect(comparison.before).toBeDefined();
    expect(comparison.after).toBeDefined();
    expect(comparison.dimensions.length).toBe(7);
  });
});
