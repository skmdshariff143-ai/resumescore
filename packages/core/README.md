# @REPLACE_ME/resumescore-core

> Deterministic, framework-agnostic resume parsing, 7-pillar quality scoring, and semantic job matching engine.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success)](package.json)

`@REPLACE_ME/resumescore-core` provides pure TypeScript algorithms to extract structured sections from resume text, audit ATS readability, compute deterministic quality scores, and perform layered semantic job matching.

- **Zero Runtime Dependencies**: No React, no Next.js, no DOM, no Node built-ins. Runs in Node.js, Cloudflare Workers, Deno, Bun, and modern browsers.
- **100% Deterministic**: Mathematical scoring guarantees exact repeatability—identical inputs yield identical scores.
- **No Commercial AI APIs**: Eliminates hallucination risks and expensive token costs.

---

## Installation

```bash
# npm
npm install @REPLACE_ME/resumescore-core

# pnpm
pnpm add @REPLACE_ME/resumescore-core

# yarn
yarn add @REPLACE_ME/resumescore-core
```

---

## Quickstart

```typescript
import { parseResume, scoreResume, matchJob } from '@REPLACE_ME/resumescore-core';

// 1. Parse plain text into structured intermediate representation
const resumeText = `
Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA
https://linkedin.com/in/alexmorgan | https://github.com/alexmorgan

SUMMARY
Lead Cloud Architect with 8+ years scaling distributed systems.

EXPERIENCE
CloudScale Technologies | Principal Cloud Architect | Remote
01/2021 - Present
- Architected Kubernetes clusters across 3 regions serving 4M daily active users.
- Reduced multi-cloud egress spend by $420,000 annually.
- Spearheaded CI/CD migration using Docker, Terraform, and GitHub Actions.

EDUCATION
University of California, Berkeley
B.S. in Computer Science | 2016

SKILLS
Kubernetes, Docker, Go, Python, Terraform, AWS, PostgreSQL, Redis
`;

const parsed = parseResume(resumeText, { fileName: 'alex-morgan.txt' });

console.log('Candidate:', parsed.personalInfo.name);
console.log('Detected Skills:', parsed.allSkills);

// 2. Score the resume across 7 deterministic pillars
const score = scoreResume(parsed, { careerLevel: 'experienced' });

console.log(`Overall Score: ${score.overall} / 100 (Grade: ${score.grade})`);
console.log(`ATS Readability: ${score.atsScore} / 100`);

// 3. Match against a target job description
const jobDescription = `
Senior Platform Engineer
Requirements:
- Strong experience with Kubernetes, Go, and Terraform
- Familiarity with AWS and distributed SQL databases
`;

const match = matchJob(parsed, jobDescription);
console.log('Skill Match Results:', match);
```

---

## Scoring Architecture (7 Pillars)

Every overall score is mathematically calculated as the weighted sum of 7 transparent pillars:

| Pillar | Weight | Focus Areas |
| :--- | :---: | :--- |
| **1. ATS Readability Estimate** | 15% | Standard headings, email/phone detectability, formatting hygiene, character limits. |
| **2. Job Skill Match** | 25% | Layered semantic keyword alignment across required, preferred, and bonus skills. |
| **3. Experience Relevance** | 20% | Seniority alignment, tenure continuity, role recency, leadership signals. |
| **4. Impact & Metrics** | 15% | X-Y-Z formula (`Accomplished [X] as measured by [Y] by doing [Z]`), action verbs, metric counts. |
| **5. Projects & Portfolio** | 10% | Technical project depth, repository links, technology integration. |
| **6. Structure & Readability**| 10% | Section ordering, bullet density, line count balance, formatting consistency. |
| **7. Profile & Contact** | 5% | Name resolution, professional links (LinkedIn, GitHub, portfolio), location. |

### Supported Career Profiles
Rubric weights adapt deterministically across six career stages:
- `student`: Heavy focus on projects (25%), skills (20%), and education (15%).
- `internship`: Balanced emphasis on potential, coursework, and projects.
- `entry`: Early-career baseline weighting.
- `experienced`: Standard professional distribution.
- `senior`: Deep focus on leadership, scale, and experience relevance (25%).
- `switcher`: High weighting on transferable skills and demonstrated project outcomes.

---

## Public API Reference

### `parseResume(text: string, options?: ParseResumeOptions): ResumeParsed`
Parses plain resume text into an intermediate representation containing personal details, experience items, education records, categorized skills, and document diagnostics.

### `scoreResume(parsed: ResumeParsed, options?: ScoreResumeOptions): ResumeScore`
Calculates deterministic scores across all 7 dimensions with dimension evidence, actionable improvement suggestions, and top priorities.

### `matchJob(parsed: ResumeParsed, jobTextOrParsed: string | JobParsed): SkillMatrix`
Compares parsed resume skills against job requirements using 6-level semantic matching (exact match, normalized tokens, synonyms/aliases, taxonomy relationships, context co-occurrence, and section provenance).

### `compareResumeVersions(original: string, edited: string, context: ResumeScore)`
Computes deterministic before/after delta scores and evidence diffs without hallucinations.

---

## License

MIT © [ResumeScore Contributors](https://github.com/skmdshariff143-ai/resumescore)
