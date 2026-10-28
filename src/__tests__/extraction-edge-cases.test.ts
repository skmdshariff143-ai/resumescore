import { describe, it, expect } from 'vitest';
import { parseResume, scoreResume, type SectionType } from 'resumescore-core';
import studentRecord from '../../evaluation/resumes/01-student.json';
import entryRecord from '../../evaluation/resumes/02-entry-level-engineer.json';
import seniorRecord from '../../evaluation/resumes/03-senior-architect.json';
import switcherRecord from '../../evaluation/resumes/04-career-switcher.json';
import execRecord from '../../evaluation/resumes/05-executive.json';

describe('Extraction Edge Cases & Synthetic Benchmarks', () => {
  describe('1. Header & Footer Collisions and Delimiter Separation', () => {
    it('cleanly separates name, email, phone, and links concatenated with non-standard delimiters', () => {
      const headerText = [
        'Jane Doe',
        'jane.doe@example.org • +1 (555) 867-5309 • New York, NY • linkedin.com/in/janedoe • github.com/janedoe',
        '',
        'SUMMARY',
        'Passionate frontend developer with 3 years building React applications.',
      ].join('\n');

      const parsed = parseResume(headerText, 'header-test.txt');
      expect(parsed.personalInfo.name).toBe('Jane Doe');
      expect(parsed.personalInfo.email).toBe('jane.doe@example.org');
      expect(parsed.personalInfo.phone).toBe('+1 (555) 867-5309');
      expect(parsed.personalInfo.location).toBe('New York, NY');
      expect(parsed.personalInfo.linkedin).toContain('janedoe');
      expect(parsed.personalInfo.github).toContain('janedoe');
    });

    it('ignores page numbers, confidential footers, and page counters without polluting sections', () => {
      const pageWithFooter = [
        'Alex Morgan',
        'alex.morgan@example.com | (555) 999-0000',
        '',
        'EXPERIENCE',
        'Software Engineer | Acme Corp | 2022 - Present',
        '- Engineered microservices using Node.js and TypeScript.',
        '- Reduced server response latency by 35%.',
        '',
        'Page 1 of 2 - CONFIDENTIAL - All Rights Reserved',
        '------------------------------------------------',
        'EDUCATION',
        'B.S. in Computer Science, University of Washington, 2022',
        '',
        'Page 2 of 2 | alex.morgan@example.com',
      ].join('\n');

      const parsed = parseResume(pageWithFooter, 'footer-test.txt');
      expect(parsed.personalInfo.name).toBe('Alex Morgan');
      expect(parsed.personalInfo.email).toBe('alex.morgan@example.com');
      expect(parsed.sections.some((s) => s.type === 'experience')).toBe(true);
      expect(parsed.sections.some((s) => s.type === 'education')).toBe(true);
      // Footers should not be parsed as candidate names or section titles
      expect(parsed.personalInfo.name).not.toContain('Page');
      expect(parsed.personalInfo.name).not.toContain('CONFIDENTIAL');
    });

    it('handles international phone formats and dense contact bars without whitespace', () => {
      const denseContact = [
        'Carlos Gomez',
        'carlos@example.com | +44-20-7946-0912 | London, UK | https://github.com/cgomez',
        '',
        'SKILLS',
        'Python, Django, PostgreSQL, Docker',
      ].join('\n');

      const parsed = parseResume(denseContact, 'dense-contact.txt');
      expect(parsed.personalInfo.name).toBe('Carlos Gomez');
      expect(parsed.personalInfo.email).toBe('carlos@example.com');
      expect(parsed.personalInfo.github).toContain('cgomez');
    });
  });

  describe('2. Text Box Nested Formatting & Non-Standard Bullets', () => {
    it('normalizes bizarre unicode bullets (▪, ►, ❖, ◦, ✔) and indented text box fragments', () => {
      const bulletMadness = [
        'Taylor Smith',
        'taylor.eng@example.com',
        '',
        'EXPERIENCE',
        'Senior Developer | CloudTech Inc | 2021 - Present',
        '  ▪ Spearheaded migration of 12 monolithic apps to AWS microservices.',
        '  ► Optimized Redis cache layer saving $40,000 annually.',
        '  ❖ Mentored 5 junior engineers and established peer code review protocols.',
        '  ◦ Implemented end-to-end telemetry with Prometheus and Grafana.',
        '  ✔ Authored comprehensive developer documentation.',
      ].join('\n');

      const parsed = parseResume(bulletMadness, 'bullets.txt');
      expect(parsed.experience.length).toBeGreaterThan(0);
      const experience = parsed.experience[0];
      expect(experience.bullets.length).toBeGreaterThanOrEqual(4);
      // Ensure bullet markers are stripped clean from bullet beginnings
      for (const bullet of experience.bullets) {
        expect(bullet).not.toMatch(/^[▪►❖◦✔\s-]+/);
      }
    });

    it('recovers multi-line wrapped bullet points without fracturing into nonsense lines', () => {
      const wrappedText = [
        'Morgan Lee',
        'morgan.lee@example.com',
        '',
        'EXPERIENCE',
        'Data Engineer | BigData Corp | 2020 - Present',
        '- Architected real-time streaming data ingestion pipelines using Apache Spark',
        '  and Kafka, processing over 10 billion events per day with zero data loss',
        '  across four cloud availability zones.',
        '- Developed automated data quality validation suites using Great Expectations',
        '  and Python to catch schema violations prior to warehouse loading.',
      ].join('\n');

      const parsed = parseResume(wrappedText, 'wrapped.txt');
      const score = scoreResume(parsed);
      expect(parsed.experience.length).toBeGreaterThan(0);
      expect(score.overall).toBeGreaterThanOrEqual(45);
    });
  });

  describe('3. Multi-Column Layout Ordering & Interleaved Columns', () => {
    it('handles multi-column layout where skills sidebar precedes experience column', () => {
      const multiColumnText = [
        'Jordan Blake',
        'jordan.blake@example.com | (555) 123-4567 | Seattle, WA',
        '',
        'SKILLS & TOOLS',
        'Languages: TypeScript, JavaScript, Python, Go, SQL',
        'Frameworks: React, Next.js, Node.js, Express, Tailwind CSS',
        'DevOps: Docker, Kubernetes, AWS, GitHub Actions, CI/CD',
        '',
        'WORK EXPERIENCE',
        'Full Stack Engineer | Startup Labs | 2022 - Present',
        '- Developed customer portal using Next.js, React, and TypeScript for 20k DAU.',
        '- Integrated Stripe payment processing workflows with webhook idempotency.',
        '- Improved database query performance by 40% via composite indexing in PostgreSQL.',
        '',
        'EDUCATION',
        'B.S. in Computer Science | University of Washington | 2022',
      ].join('\n');

      const parsed = parseResume(multiColumnText, 'multicolumn.txt');
      expect(parsed.allSkills.length).toBeGreaterThanOrEqual(6);
      expect(parsed.allSkills).toContain('TypeScript');
      expect(parsed.allSkills).toContain('React');
      expect(parsed.allSkills).toContain('Docker');
      expect(parsed.experience.length).toBeGreaterThanOrEqual(1);
      expect(parsed.education.length).toBeGreaterThanOrEqual(1);

      const score = scoreResume(parsed);
      expect(score.overall).toBeGreaterThanOrEqual(60);
    });
  });

  describe('4. Synthetic Benchmark Profiles Regression Validation', () => {
    const benchmarks = [
      { record: studentRecord, label: '01-student' },
      { record: entryRecord, label: '02-entry-level-engineer' },
      { record: seniorRecord, label: '03-senior-architect' },
      { record: switcherRecord, label: '04-career-switcher' },
      { record: execRecord, label: '05-executive' },
    ];

    benchmarks.forEach(({ record, label }) => {
      it(`accurately parses and scores synthetic profile: ${label} (${record.persona})`, () => {
        const parsed = parseResume(record.resumeText, `${label}.txt`);
        expect(parsed.personalInfo.name).toBeTruthy();
        expect(parsed.personalInfo.email).toBeTruthy();

        // Verify detected sections
        const detectedSectionTypes = parsed.sections.map((s) => s.type);
        for (const expectedType of record.expectedMetrics.expectedSectionTypes) {
          expect(
            detectedSectionTypes.includes(expectedType as SectionType),
            `Expected ${expectedType} in ${label}`
          ).toBe(true);
        }

        // Verify key skills detected
        const resumeSkillsJoined = parsed.allSkills.join(' ').toLowerCase();
        for (const skill of record.expectedMetrics.expectedSkillSubstrings) {
          expect(
            resumeSkillsJoined.includes(skill.toLowerCase()),
            `Expected skill ${skill} in ${label}`
          ).toBe(true);
        }

        // Score the resume
        const score = scoreResume(parsed);
        expect(score.overall).toBeGreaterThanOrEqual(40);
        expect(score.overall).toBeLessThanOrEqual(100);

        // Verify score bands
        const bands = record.expectedMetrics.expectedScoreBands;
        const impactDim = score.dimensions.find((d) => d.key === 'impact');
        const readDim = score.dimensions.find((d) => d.key === 'readability' || d.key === 'structure');

        if (bands.impact && impactDim) {
          expect(impactDim.score).toBeGreaterThanOrEqual(bands.impact[0]);
          expect(impactDim.score).toBeLessThanOrEqual(bands.impact[1]);
        }
        if (bands.brevity && readDim) {
          expect(readDim.score).toBeGreaterThanOrEqual(bands.brevity[0]);
          expect(readDim.score).toBeLessThanOrEqual(bands.brevity[1]);
        }
      });
    });
  });
});
