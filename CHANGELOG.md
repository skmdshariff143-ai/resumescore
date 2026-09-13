# Changelog

All notable changes to the ResumeScore platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2026-09-13

### Phase 4: Google Gemini Provider & Multi-Provider Architecture

#### Added
- **Google GenAI Provider (`@google/genai`)**: Added `GeminiAIProvider` in `src/lib/ai/gemini-provider.ts` supporting bullet rewriting, tailored cover letter generation, and qualitative resume critique.
- **Provider Resolution Hierarchy**: Updated `getAIProvider()` in `src/lib/ai/provider.ts` to automatically route requests:
  1. `ANTHROPIC_API_KEY` → `ClaudeAIProvider` (`claude-sonnet-5`)
  2. `GEMINI_API_KEY` or `GOOGLE_API_KEY` → `GeminiAIProvider` (`gemini-3.6-flash` default, configurable via `GEMINI_MODEL`)
  3. Neither → `HeuristicAIProvider` (100% offline deterministic fallback)
- **Prompt Injection Defense & Anti-Hallucination**: Enforced XML isolation tags (`<user_resume_untrusted>`, `<user_job_untrusted>`) and explicit candidate metric placeholders (`[Add genuine metric: e.g. % or $]`).
- **Strict Response Validation**: Implemented `GeminiCritiqueResponseSchema` with Zod to enforce runtime response schemas.
- **Unit Testing**: Added `src/__tests__/gemini-provider.test.ts` (13 test suites, 51 tests passing across the codebase).

---

## [0.3.0] - 2026-09-13

### Phase 3: Top-Priority Action Item, Client-Side PDF Extraction & E2E Tools

#### Added
- **Top Priority Derivation**: Added `topPriority` field to the resume analysis schema and scoring response, identifying the highest-impact action item across the 7 dimensions.
- **Client-Side PDF Extraction**: Implemented real text extraction in `src/lib/parsing/pdf-extractor.ts` using Mozilla's `pdfjs-dist` (v6), ensuring resumes are parsed in-browser with zero server file storage.
- **End-to-End Verification Tools**:
  - `tools/verify-e2e.js`: Exercises live Next.js API routes (`/api/analyze`, `/api/ai/critique`, `/api/ai/rewrite`) against realistic multi-page resume fixtures.
  - `tools/test-pdf-upload.js`: Synthesizes and verifies PDF parsing functionality.
  - Added `npm run verify:e2e` and `npm run test:pdf` to `package.json`.

---

## [0.2.0] - 2026-09-13

### Phase 2: Anthropic Claude Provider & Qualitative Analysis

#### Added
- **Claude AI Provider (`@anthropic-ai/sdk`)**: Added `ClaudeAIProvider` in `src/lib/ai/claude-provider.ts` using `claude-sonnet-5`.
- **Qualitative Critique Route**: Added `POST /api/ai/critique` delivering per-section qualitative feedback, ATS risk flags, and overall narrative evaluation.
- **Interactive Critique UI**: Added `CritiquePanel.tsx` component in the analysis workspace.
- **Transparent Error Handling**: Ensured LLM API failures surface actionable error messages rather than silently falling back and falsifying model output.

---

## [0.1.0] - 2026-09-13

### Phase 1: Core Infrastructure, Test Suites & CI

#### Added
- **Deterministic 7-Pillar Scoring Engine**:
  - ATS Compatibility (15%)
  - Job Skill Match (25%)
  - Experience Relevance (20%)
  - Impact & Metrics (15%)
  - Projects & Portfolio (10%)
  - Structure & Readability (10%)
  - Profile & Contact (5%)
- **Multi-Layer Semantic Matching**: 6-layer matcher (exact, normalized, alias, taxonomy, context, evidence).
- **Automated Vitest Test Suite**: Unit tests covering scoring dimensions, ATS checker, parser, and semantic matcher.
- **Continuous Integration**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) validating lint, tests, and production build on every push and pull request.
