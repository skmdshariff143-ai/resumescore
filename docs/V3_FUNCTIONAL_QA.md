# V3 functional QA

## Scope and method

Production-build Chromium/Edge desktop and mobile journeys, synthetic resumes only. All existing parsing/scoring/security/factuality/storage unit tests retained. Browser tests use observable assertions, no arbitrary waits or whole-test retries. The protected-Preview harness retains exact-origin, short-lived Vercel authentication in Node; protection is not weakened.

## Results recorded before publication

- `npm test`: 148 tests, 25 files passed; 41.33 seconds on this Windows host.
- `npm audit --omit=dev --json`: zero advisories.
- `npm audit --json`: five high development-only advisories in the existing Next ESLint/globbing chain. No dependency was added or changed for V3.
- First browser iteration: 41 passed / 3 failed of 44. Two failures exposed the same real results-focus timing defect; fixed by focusing after React commits results. The third used the old always-visible mobile preview assertion; updated to open Preview before checking that invented claims are absent. The factuality assertions remain intact.
- A second full local iteration passed 44/46; the two added populated-history cases exposed the same tablet flex/wrapping defect. Fixed without overflow clipping.
- After the fixes, `npm run build`, `npm run lint` and `npm run typecheck` passed. Focused final V3 regression suite: **10/10 passed**, 2.9 minutes; includes ten-width layout checks, real navigation transitions, advanced parsing review, populated history, axe and mobile editor continuity.
- The unchanged 36 pre-V3 browser cases all passed in the full local iteration. Hosted CI and full protected-Preview verification remain required for the published candidate; their observed results are appended after execution.
- `npm run evaluate:release`: 1/1 passed. Synthetic measurements retained separately in `v3-engine-regression.json`; historical V2.2 measurements preserved. Independent calibration remains pending.

Commands: `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`; `npm run evaluate:release`; `npm audit --omit=dev --json`; `npm audit --json`; `& .\tools\test-local-windows.ps1`; `& .\tools\test-local-windows.ps1 -TestFiles e2e/v3.spec.ts`. Browser runs used `PLAYWRIGHT_CHANNEL=msedge` and separate `E2E_ARTIFACT_DIR` directories.

Local evidence: `.vercel/v3-local` (41/44), `.vercel/v3-final-local` (44/46), `.vercel/v3-regression-local` (10/10). They are separate retained iterations, not retries reported as one pass.

## First hosted candidate

Implementation commit `b6db45904c84e5bc3a245ba539ccca5ea7560a82`: protected Preview passed **46/46**, 393.8 seconds, zero failed/skipped/flaky cases, one recovered bounded navigation GET transport retry. However, [hosted CI](https://github.com/skmdshariff143-ai/resumescore/actions/runs/39421317552) passed only **44/46 browser cases**: both journey audits detected transient low contrast while tab colors animated. Lint, types, 148 unit/integration tests and build passed; the subsequent production-audit step was skipped because browser validation failed. This candidate did not satisfy the hosted release gate.

The correction removes foreground/background fades from controls, preserving immediate selected-state colors and transform-only interaction motion. Assertions, contrast thresholds and retry policy are unchanged. A corrected build and accessibility journey run are required before publishing the correction; final hosted/Preview evidence follows below once observed.

Correction validation: `npm run build` and `npm run lint` passed. `PLAYWRIGHT_CHANNEL=msedge` with `& .\tools\test-local-windows.ps1 -TestFiles e2e/v21.spec.ts`: **14/14 passed**, 2.7 minutes; both 14-state axe/keyboard journeys reported zero violations. Evidence: `.vercel/v3-contrast-local`.

## Regression scope

Upload/extraction/correction for TXT/DOCX/PDF, image/corrupt-file failures, pasted Unicode, all six profiles, separate job matching, unsupported AI claims, approval, editing/reordering/undo/reset, comparison, local history save/delete/reopen, legacy deletion, exports and server failure recovery. New regressions check result invalidation for text/profile/mode/job changes, job-draft preservation, focus, mobile navigation, sample controls, mobile preview draft continuity, populated history and ten-width layout invariants.

The redesign does not change scoring weights, parsers, API routes, provider policy or storage defaults. `git diff` for those engine/security paths is empty. Compilation initially found an undefined clipboard status variable during implementation; it was corrected before the candidate build.

## Limits

Automated checks are not proof of universal ATS interoperability, factual correctness, human scoring calibration or WCAG certification. Screen-reader speech, Safari/Firefox and physical-device interactions require manual evaluation. OCR remains unsupported; print-to-PDF pagination is user-reviewed. Independent extraction/scoring calibration remains pending.
