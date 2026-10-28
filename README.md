# ResumeScore

> **Open-source, offline-first resume intelligence engine and web platform that provides deterministic, transparent heuristic scoring and ATS compatibility analysis without storing or leaking candidate data.**

[![CI](https://github.com/skmdshariff143-ai/resumescore/actions/workflows/ci.yml/badge.svg)](https://github.com/skmdshariff143-ai/resumescore/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](tsconfig.json)
[![Core Dependencies](https://img.shields.io/badge/core_dependencies-0-brightgreen)](packages/core/package.json)
[![Live Demo](https://img.shields.io/badge/demo-resumescore--phi.vercel.app-emerald)](https://resumescore-phi.vercel.app/)

---

## Honest Status & Scope

- **Core Heuristic Engine (`packages/core`)**: **Production-Ready**. Mathematically deterministic, offline-first resume parsing, ATS structure checks, and 7-pillar weighted scoring. Built as a zero-dependency, dual ESM/CJS package with 200+ unit, regression, and fast-check property tests.
- **Web Application (`src/`)**: Full-stack Next.js 16 (Turbopack) & React 19 application with accessible Tailwind CSS 4 UI, live section editing, local history in browser `localStorage`, and printable PDF/DOCX exports.
- **Experimental LLM Critique (Optional)**: Experimental assistance via Claude or Gemini requires explicit user consent and server API keys. Paid AI is locked off by default (`AI_PAID_ENABLED=false`). Heuristic functionality is 100% operational without any API keys.
- **Fairness & Limitations**: ResumeScore evaluates structural writing quality, action verb density, quantified outcomes, and keyword overlap. It **does not predict hiring outcomes** or certify candidate job fitness.

---

## Core Package Quickstart (`resumescore-core`)

The framework-agnostic scoring engine can be embedded in any Node.js, browser, or serverless environment with **zero runtime dependencies**:

### Installation

```bash
npm install resumescore-core
# or
pnpm add resumescore-core
```

### Usage

```typescript
import { parseResume, scoreResume, matchJob } from 'resumescore-core';

// 1. Parse raw resume text into a structured AST
const parsed = parseResume(`
Jane Doe
jane.doe@example.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE
Senior Software Engineer | Acme Corp | 2021 - Present
- Architected high-throughput Go microservices on AWS, reducing p99 latency by 32%.
- Led engineering squad of 6, establishing automated CI/CD testing pipelines.

SKILLS
Go, TypeScript, React, AWS, Docker, PostgreSQL, Kubernetes
`);

// 2. Score resume deterministically across 7 quality pillars
const score = scoreResume(parsed);

console.log(`Score: ${score.overall}/100 (Grade: ${score.grade})`);
console.log(`Top Priority: ${score.topPriority}`);
console.log(`Impact Score: ${score.dimensions.find(d => d.key === 'impact')?.score}`);

// 3. Optional: Match against a target job description
const jobMatch = matchJob(parsed, `
We are seeking a Senior Backend Engineer proficient in Go, AWS, and Kubernetes.
`);

console.log(`Job Skill Match: ${jobMatch.score}%`);
console.log(`Matched Skills:`, jobMatch.matchedSkills);
console.log(`Missing Skills:`, jobMatch.missingSkills);
```

---

## Web Application Quickstart

Experience the interactive web application locally or test the live production deployment at **[https://resumescore-phi.vercel.app/](https://resumescore-phi.vercel.app/)**.

### Prerequisites
- Node.js 22+ (LTS recommended)
- npm 10+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/skmdshariff143-ai/resumescore.git
cd resumescore

# 2. Install dependencies (workspace links packages/core automatically)
npm install

# 3. Build core engine & run Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Features

- **Multi-Format Ingestion**: PDF, DOCX, UTF-8 TXT, and direct paste with pre-scoring extraction review.
- **7-Pillar Heuristic Rubric**: ATS readability (15%), job skill match (25%), experience relevance (20%), impact & metrics (15%), projects (10%), structure (10%), and profile completeness (5%).
- **Interactive Local Editor**: Edit sections, reorder entries, compare against original text, and preview diffs in real-time.
- **Privacy First**: Analysis runs locally in browser memory or on server without cloud database storage. Full user control over local history export and deletion.
- **Offline Synthetic Benchmarks**: Includes 5 labeled benchmark archetypes (`student`, `entry-level`, `senior-architect`, `career-switcher`, `executive`) in `evaluation/resumes/`.

---

## Verification & Testing

ResumeScore enforces comprehensive automated testing across every release:

```bash
# Run unit, property, and edge-case tests (200 tests)
npm test

# Run TypeScript strict typecheck
npm run typecheck

# Run ESLint check
npm run lint

# Run Playwright E2E and accessibility checks
npm run test:e2e

# Run cross-browser tests (Firefox & WebKit)
npm run test:cross-browser

# Verify production dependency security (0 vulnerabilities)
npm audit --omit=dev --audit-level=high

# Verify core package distribution tarball
npm pack --dry-run ./packages/core
```

---

## Short Roadmap

- [x] Extract framework-agnostic `resumescore-core` with dual ESM/CJS builds.
- [x] Labeled synthetic evaluation set across 5 career stages.
- [x] Property-based fuzz testing via `fast-check`.
- [x] Contributor documentation, issue templates, and CodeQL security workflows.
- [ ] **CLI Tool**: Standalone `bin/resumescore` binary for CLI and pre-commit checks.
- [ ] **Expanded Taxonomies**: Non-technical industry vocabularies (Finance, Healthcare, Legal).
- [ ] **Bi-directional Visual Diff**: Interactive before/after split viewer for edited resumes.
- [ ] **Multi-Language Parsing**: Heuristic support for Spanish, German, and French resumes.

---

## Contributing & Governance

We welcome contributions! Please review our:
- [Contributing Guidelines](CONTRIBUTING.md)
- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Good First Issues](docs/good-first-issues.md)

---

## License

This project is licensed under the [MIT License](LICENSE).
