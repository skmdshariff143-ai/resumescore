# Tailor to this job — implementation plan

Approved design: `docs/superpowers/specs/2026-11-07-tailor-to-job-design.md` (approved with git setup, `npm ci`, jsdom dev dependencies).
Baseline before changes: 28 test files, 159 tests passing.

1. **Tests first** `src/__tests__/tailoring.test.ts`, then `src/lib/tailoring/`:
   - `evidence.ts` — alias terms, negation, section-aware evidence lines.
   - `suggestions.ts` — `analyzeKeywords`, `buildTailoringSuggestions` (caps, ordering, ids).
   - `verify.ts` — scoped inventory + token-diff guard → `verified`, `supported`.
   - `apply.ts` — `applySuggestions`, `validateUserEvidence`, `withUserEvidence`.
   - `score.ts` — `scoreTailoring`.
   - `review-state.ts` — pure reducer (accept / reject / accept-all-supported / user evidence / undo / reset).
2. **Adversarial tests** `src/__tests__/tailoring-adversarial.test.ts` (injection text, 200+ keywords, 60 000 chars, markup).
3. **Shared download helper** `src/lib/export/download.ts`; switch `ResumeWorkspace` to it (behaviour-preserving).
4. **UI** `src/components/tailor/` — `TailorFlow`, `KeywordsStep`, `OptimizeStep`, `ApplyStep`; test first in `src/__tests__/tailor-flow.test.tsx` (jsdom).
5. **Wire** a "Tailor to this job" tab in `src/app/analyze/page.tsx` via `next/dynamic`.
6. **Playwright** `e2e/tailor.spec.ts` + `fixtures/tailor-sample-resume.txt`.
7. **Gates**: typecheck, lint, test, evaluate:release, build, test:e2e.
8. **Docs**: `docs/TAILOR_TO_JOB.md`, CHANGELOG, README, screenshots.
