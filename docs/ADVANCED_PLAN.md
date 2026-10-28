# ResumeScore: Open-Source Evolution & Engineering Audit Plan

**Document:** `docs/ADVANCED_PLAN.md`  
**Date:** October 28, 2026  
**Auditor / Lead:** Senior Staff Engineer  
**Baseline Git Reference:** Branch `feat/open-source-evolution` (Head commit `492e2b7`)  
**Repository:** `https://github.com/skmdshariff143-ai/resumescore`  

---

## 1. Executive Summary & Objective

ResumeScore is currently a robust standalone Next.js 16 / React 19 web application providing 100% deterministic, evidence-based resume evaluation, ATS readability scoring, and semantic job matching without reliance on commercial AI APIs.

The objective of this engineering initiative is to transition ResumeScore from a solo application into a **credible, modular, open-source platform** that outside developers can integrate into their own systems and contribute to safely.

This plan details:
1. Current architectural inventory and boundaries.
2. Separation of framework-agnostic core logic from Next.js / DOM dependencies.
3. Status of open release gates from `docs/FINAL_RELEASE_GATE_MATRIX.md`.
4. Real-world test execution audit and dependency vulnerability analysis.
5. Five-phase roadmap for package extraction, automated quality gates, evaluation sets, and contributor experience.

---

## 2. Current Architecture & Codebase Inventory

### 2.1 Technology Stack
- **Framework:** Next.js 16.4.2 (Turbopack, App Router)
- **UI & State:** React 19.2.4, React DOM 19.2.4, Tailwind CSS 4
- **Language & Engine:** TypeScript 5 (Strict Mode), Node.js >= 22 (LTS)
- **Unit & Integration Testing:** Vitest 5.0.0 (threads pool, single worker)
- **E2E & Accessibility Testing:** Playwright 1.64.1, Axe Core 4.14.0
- **Parsing & Export Engines:** `pdfjs-dist` 6.3.289, `@zip.js/zip.js` 2.24.0, `docx` 9.13.0, `jspdf` 4.2.1
- **Optional Server AI Providers (Disabled):** `@anthropic-ai/sdk` 0.125.0, `@google/genai` 2.22.0

### 2.2 Directory Map
```
resumescore/
├── docs/                   # Release gates, audit reports, cost controls, benchmark docs
├── e2e/                    # Playwright test specs (v21, v22, v3, workflow, pre-launch)
├── evaluation/             # Blinded human evaluation handoff & review specifications
├── public/                 # Favicon, og-image.png, llms.txt, llms-full.txt, SVGs
├── src/
│   ├── __tests__/          # 29 Vitest test suites (165 passing tests)
│   ├── app/                # Next.js App Router: /, /analyze, /history, /privacy, /terms, /api/*
│   ├── components/         # React UI components (analysis, dashboard, ui, layout)
│   ├── lib/
│   │   ├── ai/             # Server-only provider implementations (compiled locked: AI_PAID_ENABLED=false)
│   │   ├── ats/            # ATS readability heuristic audit
│   │   ├── evaluation/     # Agreement metrics & synthetic evaluation harnesses
│   │   ├── export/         # PDF & DOCX generation engines
│   │   ├── impact/         # Bullet impact & metrics detection
│   │   ├── jobs/           # Job description parser & requirement extractor
│   │   ├── matching/       # 6-level layered semantic skill matcher
│   │   ├── parsing/        # Resume text parser, PDF extractor, DOCX extractor, file validator
│   │   ├── scoring/        # 7-pillar deterministic scoring engine & comparison logic
│   │   ├── storage/        # Browser localStorage history wrapper
│   │   ├── validation/     # Zod request validation schemas
│   │   └── keywords.ts     # Curated skill taxonomies, aliases, and section headers
│   └── types/              # Comprehensive TypeScript interfaces & domain models
└── tools/                  # Verification, burst testing, and release evaluation scripts
```

---

## 3. Scoring Engine Boundaries & Dependency Decoupling Analysis

### 3.1 Pure Framework-Agnostic Core Logic (Target: `packages/core`)
The core algorithms of ResumeScore have **zero dependency** on React, Next.js, Node.js built-ins (`fs`, `net`, `http`), or browser DOM objects (`window`, `document`, `HTMLElement`). They operate purely on in-memory strings and plain objects:

| Module Path | Core Functionality | External Dependencies |
| :--- | :--- | :--- |
| `src/lib/parsing/resume-parser.ts` | Multi-section parser, contact info, date normalization, structured links | `keywords.ts`, domain types |
| `src/lib/scoring/scoring-engine.ts` | 7-pillar deterministic scoring (`calculateResumeScore`), dimension weights | `ats`, `impact`, `matching`, `rubric` |
| `src/lib/scoring/rubric.ts` | Weight distributions for 6 career profiles (`student`, `entry`, etc.) | None |
| `src/lib/scoring/comparison.ts` | Before/after draft scoring deltas without hallucinations | `resume-parser`, `scoring-engine` |
| `src/lib/matching/semantic-matcher.ts`| 6-level semantic matching (exact, normalized, alias, taxonomy, context, section)| `keywords.ts`, domain types |
| `src/lib/ats/ats-checker.ts` | Heading checks, email, phone, length, bullet point density | Domain types |
| `src/lib/impact/impact-evaluator.ts` | Action verb analysis, quantifiable metric detection (X-Y-Z formula) | `keywords.ts`, domain types |
| `src/lib/jobs/job-parser.ts` | Job title, company, requirements classification (required/preferred/bonus) | `keywords.ts`, domain types |
| `src/lib/keywords.ts` | Standard taxonomies, skill aliases, action verbs, section headers | None |

### 3.2 Coupled / Web-Specific Modules (Retained in Web App Workspace)
The following modules have legitimate environment couplings and must remain in the web application layer or be wrapped behind abstract adapters:

| Module Path | Couplings & Reasons |
| :--- | :--- |
| `src/lib/parsing/pdf-extractor.ts` | Coupled to `pdfjs-dist` (requires browser canvas / ArrayBuffer worker environment). |
| `src/lib/parsing/docx-extractor.ts`| Coupled to `@zip.js/zip.js` (unzipping XML binary streams). |
| `src/lib/export/pdf-report.ts` | Coupled to `jspdf` (DOM / PDF graphics primitives). |
| `src/lib/export/docx-resume.ts` | Coupled to `docx` library. |
| `src/lib/storage/history-store.ts` | Coupled to `window.localStorage`. |
| `src/lib/ai/*` | Coupled to `@anthropic-ai/sdk`, `@google/genai`, and server environment variables (`AI_PAID_ENABLED`). |
| `src/app/api/*` | Coupled to Next.js `NextRequest`, `NextResponse`, and edge/serverless runtime. |

---

## 4. Open Release Gates Audit (`docs/FINAL_RELEASE_GATE_MATRIX.md`)

Reviewing the current gate matrix from candidate commit `e2e8ba8` against current head `492e2b7`:

| Gate | Stated Matrix Status | Current Factual Findings | Proposed Resolution |
| :--- | :--- | :--- | :--- |
| **Functional Correctness** | `PASS` (159 tests) | **165 tests passing across 29 files** in Vitest. All deterministic assertions pass. | Maintain gate as PASS. |
| **CI Reliability** | `PASS` (Run 39537081200) | PR #2 CI triggered and passed automated steps. | Keep PASS; expand CI to cover workspaces. |
| **Browser Reliability** | `PASS` for automated | 46/46 Playwright desktop/mobile tests pass without layout shifts or horizontal scroll. | Keep PASS; note native Safari/VoiceOver remain manual. |
| **Security & Dependencies**| `PENDING OWNER APPROVAL`| `npm audit --omit=dev` identified **1 high vulnerability in production dependency `zod <4.6.6`** (GHSA-mrhx-c7xc-m3w5). Dev advisories in `braces` and `vite` exist. | **Fix `zod` by upgrading to `zod@^4.6.7`**. Document dev advisories with exact blast radius. |
| **Privacy** | `PASS` | `AI_PAID_ENABLED: 'false'` locked in `next.config.ts`. Zero tracking cookies. | Maintain gate as PASS. |
| **Accessibility** | `BLOCKED` (Manual AT pending) | Automated Axe WCAG 2.2 AA passes with 0 violations across all 6 public routes. Genuine NVDA/VoiceOver screen reader verification is pending physical device testing. | Retain honest caveat: Automated PASS, Physical AT Pending. |
| **Scoring Validation** | `BLOCKED` (Holdouts pending) | Zero authenticated external candidate resumes scored by third-party recruiters. Benchmark tests verify 100% mathematical repeatability. | Provide self-contained synthetic evaluation set in `evaluation/`. Retain honest caveat for external recruiters. |
| **Extraction Validation**| `BLOCKED` | Multi-column, header/footer, and text box regression tests pass synthetic files. | Retain honest caveat for unverified third-party proprietary layouts. |
| **Deployment Readiness** | `PASS` for Preview / `BLOCKED` for Production | Production site at `https://resumescore-phi.vercel.app/` remains pinned at `79a373c`. | Maintain strict stop before production merge. |

---

## 5. Test Audit: Failing & Skipped Tests

- **Vitest Run Result:**
  - Files: 29 passed out of 29 (100%)
  - Tests: 165 passed out of 165 (100%)
  - Skipped: 0
  - Failed: 0
- **Playwright Run Result:**
  - Tests: 46 passed (Desktop & Mobile)
  - Reflow: 0 horizontal overflows across 10 viewports (320px–1920px)
- **Coverage Capability:**
  - Vitest failed to run `--coverage` due to missing devDependency `@vitest/coverage-v8`.
  - Resolution: Install `@vitest/coverage-v8` in Phase 1 to establish baseline coverage metrics and measure subsequent increases.

---

## 6. Execution Roadmap (Phases 1 - 5)

### Phase 1: Close Release Gates & Establish Baseline
1. Update `zod` to `>=4.6.7` to eliminate the production `npm audit --omit=dev` vulnerability.
2. Install `@vitest/coverage-v8` to record baseline coverage on `src/lib/scoring/` and `src/lib/parsing/`.
3. Add targeted unit tests to raise branch coverage on edge conditions in parser and scoring engine.
4. Update `docs/FINAL_RELEASE_GATE_MATRIX.md` with current SHA, closed technical gates, and explicit honest caveats.
5. Review and prepare PR description for review.

### Phase 2: Extract `resumescore-core` Workspace Package
1. Configure npm workspaces in root `package.json` (`"workspaces": ["packages/*"]`).
2. Scaffold `packages/core/`:
   - `package.json` (`resumescore-core`, type: module, exports for ESM & CJS, sideEffects: false).
   - Pure TypeScript source structure with zero external dependencies.
   - Public API: `parseResume(text: string)`, `scoreResume(parsed, options)`, `matchJob(parsed, jobText)`.
   - Comprehensive TypeScript definitions (`.d.ts`).
3. Wire build pipeline using `tsup` or `tsc` producing dual ESM (`dist/index.js`) and CJS (`dist/index.cjs`).
4. Update web application to consume `resumescore-core` via workspace link.
5. Verify `npm pack --dry-run` and bundle size metrics.

### Phase 3: Evaluation Suite & Property-Based Testing
1. Create `evaluation/` synthetic dataset with 5 realistic, cleanly licensed synthetic resumes across different career levels. Document provenance and limitations in `evaluation/README.md`.
2. Implement regression tests for extraction edge cases (multi-column flow, text box artifacts, header/footer collisions).
3. Install `fast-check` and add property-based fuzz tests:
   - Parser never throws on arbitrary UTF-8 / binary string inputs.
   - Output is strictly deterministic across repeated invocations.
   - Output stability under arbitrary trailing/leading whitespace and CRLF vs LF.

### Phase 4: Contributor Experience & CI Governance
1. Author `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.
2. Add GitHub issue templates (`bug_report.md`, `feature_request.md`, `good_first_issue.md`) and `.github/pull_request_template.md`.
3. Create `docs/ARCHITECTURE.md` with Mermaid diagram depicting the decoupled Core Package vs Web Application boundaries.
4. Draft 6 genuine good-first-issue specifications in `docs/good-first-issues.md`.
5. Enhance GitHub Actions CI: add workspace builds, package packing check, CodeQL analysis workflow, and Dependabot configuration.

### Phase 5: Honest Positioning & Final Reporting
1. Rewrite `README.md` with concise value proposition, honest status caveats, quickstart for both package and web app, and verified badges.
2. Produce `docs/ADVANCED_REPORT.md` detailing all completed deliverables, before/after metrics, and exact operator commands.
