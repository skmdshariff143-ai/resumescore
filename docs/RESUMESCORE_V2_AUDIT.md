# ResumeScore V2 audit — 2026-10-20

Baseline: local `main`, with pre-existing uncommitted API, validation, rate-limit and test edits. Preserved on `feat/resumescore-v2`. No deployment authorized.

| Priority | Source | Root cause / impact | Solution / validation |
|---|---|---|---|
| P0 | `src/app/api/extract-job/route.ts` | Arbitrary fetch follows redirects without DNS restrictions or size bounds: SSRF. | Fail closed until restricted egress available; adversarial no-fetch tests. Preserve pasted jobs. |
| P0 | `src/app/analyze/page.tsx` | Automatically sends resume to configured AI and saves full text without consent. | Explicit processing and storage choices; review extracted text first. |
| P1 | API routes and `src/lib/validation/schemas.ts` | Unbounded JSON/nesting, z.any, raw provider logs. | Byte/shape bounds, safe errors, origin checks; adversarial tests. |
| P1 | `src/lib/ai/provider.ts` | Heuristic rewrites invent leadership, architecture and throughput. Cover letters invent background. | Preserve original facts and neutral source-derived letters; factuality tests. |
| P1 | External AI providers | Schema checks do not establish factual grounding. | Semantic factuality evaluation and provider failure tests required. |
| P1 | `src/lib/rate-limit.ts` | Process-local counters do not protect distributed Vercel costs. | Distributed enforcement is a deployment requirement. |
| P1 | `src/components/FileUpload.tsx` | No size/signature limits; all non-PDF files treated as text. | PDF/TXT validation, processing bounds. DOCX unsupported. |
| P1 | `src/lib/scoring/scoring-engine.ts` | Fixed technical rubric, score floors, skill-count reward; no candidate profiles. | Profile rubrics and independent reviewed benchmarks required. |
| P1 | PDF extractor | Heuristic reading order, CDN worker, no page cap; diagnostics not propagated to scores. | Bounds, review and representative document benchmarks. |
| P2 | Matcher and keywords | Software-focused taxonomy; textual matches do not verify proficiency. | Multi-domain fixtures and measured precision/recall needed. |
| P2 | ATS UI | Compliance language overstates text heuristics. | Readability-estimate terminology and documented limits. |
| P2 | Review editor and export | Existing report export is not a full resume builder/export. | Functional resume PDF/DOCX workflow and tests needed. |
| P2 | History/storage | Existing deletion/export requires browser verification and saving consent. | Default saving off; migration and deletion tests. |
| P2 | Next config / README | Missing security headers, misleading offline claims, stale test counts. | Headers, accurate documentation and build check. |
| P2 | CI / tools | API verification script is not browser E2E/accessibility coverage. | Browser workflow and accessibility testing required. |

Architecture: Next App Router; browser PDF extraction; server deterministic parsing/scoring; optional server Claude/Gemini; browser localStorage history. No account/database found. CI runs lint/tests/build. Existing production not changed or certified.

Baseline: `npx tsc --noEmit` passed. `npm test`: 3 suites passed, 11 failed to load with Windows sandbox temporary-file ENOENT; 10 tests passed. This is not a passing baseline. Other check results are recorded in TEST_REPORT.

## Resolution and additional findings

The initial P0 URL-fetch issue is contained by disabling arbitrary retrieval; adversarial routes never call fetch. The initial unconsented processing/persistence issue is addressed by browser-only default analysis, explicit AI consent and opt-in history saving. These changes are local and not deployed.

Additional findings fixed during implementation:

- P1: `src/lib/jobs/job-parser.ts` skipped inline header content, then fallback classification treated preferred skills as required. Inline required/preferred/optional parsing now retains each list; covered by regression and browser matching tests.
- P1: `src/lib/storage/history-store.ts` retained the legacy key after migration, allowing deletion of the final V2 entry to resurrect old data. Successful migration now removes the legacy key; desktop/mobile deletion regression added.
- P2: `src/app/globals.css` used an unlayered universal padding/margin reset that overrode Tailwind utilities, shrinking controls. Removed it in favor of Tailwind Preflight; axe checks validate the initial analyzer.
- P2: mobile navigation lacked an accessible button name. Added a label and expanded state.
- P1 dependencies: initial audit found 14 advisories (one critical). Next/ESLint configuration updated to 16.4.2 and compatible transitive fixes applied. Refreshed production audit has zero findings; five high development-only advisories remain.

Document format support now includes bounded DOCX ingestion and structured DOCX export. Browser-only scoring, editable sections and actual re-analysis were added. Scores and AI functionality still have the limitations documented in IMPLEMENTATION_STATUS; this does not close the full V2 specification.
