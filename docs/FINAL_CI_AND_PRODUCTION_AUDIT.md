# Final CI and production audit

Audit date: 2026-10-20. Decision: **NO-GO for production; retain draft PR #1**. No merge, production deployment, paid AI activation, environment change or risk acceptance is authorized by this report.

## Repository and forensic method

Started clean on `feat/resumescore-v2`, HEAD `bdbd8cbf5cfcf815f2ed2ce84b8ced98c9ea212d`. GitHub PR #1 matched that SHA, was open/draft/mergeable, and its latest [CI run 39423950239](https://github.com/skmdshariff143-ai/resumescore/actions/runs/39423950239) passed. Queried recent feature and main runs, downloaded complete logs for that passing run and both failures below, and fetched every check-run annotation with pagination. No screenshot was attached to this request: its identity cannot be conclusively determined from an implied screenshot alone.

All 116 original V2 snapshot paths and the recorded V2/V2.1/V2.2 ancestor commits remain present; no paths were deleted against main. The engine, parser, matching, paid-AI policy and API source remain unchanged from the prior verified candidate. Known-credential-pattern and local-secret-value checks across 317 unique current/feature-history blobs returned zero findings. This is a bounded scan, not certification that every possible secret or personal datum is absent. The new changes are CI configuration, offline provider tests and audit evidence.

### Historical V3 failure: fixed, not a current failure

[Run 39421317552](https://github.com/skmdshariff143-ai/resumescore/actions/runs/39421317552), job `118622680017`, commit `b6db45904c84e5bc3a245ba539ccca5ea7560a82`, ran 2026-10-20 12:19:00–12:22:26 UTC. Lint/types/unit/build passed; the browser step produced **44 passed, two failed**, desktop/mobile variants of `e2e/v21.spec.ts:75`, with the final journey contrast assertion failing. Production audit was skipped after that failure, not itself failed.

Its three annotations were:

| Level / annotated location | Exact message or substance | Classification |
|---|---|---|
| Warning, `.github:2` | `Node.js 20 is deprecated.` Checkout/setup-node v4 actions were forced to use Node 24. | Real maintenance warning, not the browser failure |
| Failure, `.github:244` | `Process completed with exit code 1.` | Browser test exit; inspect full log for root cause |
| Notice, `.github:1` | `The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026.` | Runner migration notice, not an application error |

The full log identifies `color-contrast`: intermediate foreground/background pairs `#6e7c90` / `#dce4f8` and `#e3e6ea` / `#4772dd` had ratios **3.33** and **3.55**, below 4.5:1 for 12px bold text. Simultaneous foreground/background fades in analyzer tabs and shared controls caused real transient low contrast. Faster Linux execution exposed it; earlier slower local/Preview passes did not disprove it.

Commit `02251d413974a2e647e548c0c2e2bbce5b0440b4` already corrected `src/app/analyze/page.tsx`, shared control components and `src/app/globals.css`: remove color interpolation and retain purposeful transform transitions. No assertion threshold, test retry, arbitrary wait or security check was weakened. Both that commit's CI and the subsequent `bdbd8cb` CI passed all 46 browser cases. The current audit independently repeats these checks.

### Historical main failure: Node/PDF.js incompatibility

[Run 34763474251](https://github.com/skmdshariff143-ai/resumescore/actions/runs/34763474251), job `103740226190`, main SHA `79a373c8acc3d234c04e21010598ef9f93764bcf`, started 2026-09-13 14:43:15 UTC. Two `src/__tests__/pdf.test.ts` tests failed at `src/lib/parsing/pdf-extractor.ts:204`: `Failed to parse PDF: Promise.withResolvers is not a function.` The workflow used Node 20, which lacks that API. Main's latest run remains failed; it has not been rerun or modified to imply otherwise.

This main run has **four**, not three, annotations: the same action-runtime deprecation warning; exit code 1 at `.github:92`; and the two individual PDF failures at `src/lib/parsing/pdf-extractor.ts:204` (test call sites 14 and 27). Provider invalid-key messages in that historical log are not the failing assertions. Current tests use controlled mocks/disabled paid paths and sanitized errors.

Feature commit `a44367e` already changed the test runtime to Node 22; current PDF ingestion tests exercise the actual binary fixture. The feature branch's modern runtime and paid-disabled provider safeguards are retained. Updating main requires a future approved merge, not a direct edit during this audit.

## Changes made in this audit

`.github/workflows/ci.yml` now pins official **checkout v5** (`fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09`) and **setup-node v5** (`a0853c24544627f65ddf259abe73b1d18a591444`). GitHub's official tag refs were verified as commit objects and both `action.yml` files declare Node 24 runtimes. This removes reliance on forced execution of deprecated Node 20 actions. The application's test runtime stays Node 22; read-only permissions, no persisted checkout credential, 15-minute deadline and every existing validation step remain intact. The Ubuntu migration notice is not hidden or misrepresented as a defect.

Code inspection additionally found that `src/__tests__/claude-provider.test.ts` and `src/__tests__/gemini-provider.test.ts` deliberately used invalid keys but still invoked real SDK requests. That is an external-availability dependency in unit tests, even though these tests passed at the starting checkpoint. Both now mock only the SDK boundary with controlled provider failures. They still execute the real adapter/error-handling code, assert the public sanitized error and exact privacy-safe log events, verify two attempted SDK operations, and fail if global HTTP fetch is called. No provider credential or live paid call is needed; this does not claim live-provider validation. Production provider implementations are unchanged.

## Fresh verification

Commands executed from `E:\resumescore` with locked dependencies; local Node `24.21.0`, npm `11.19.0`, Windows/Edge Chromium. Hosted CI uses Node 22/Linux. Full raw logs and authentication-sensitive harness files remain ignored under `.vercel/`; sanitized aggregate results are in [final-ci-verification.json](final-ci-verification.json).

| Command / scope | Actual result |
|---|---|
| `npm ci` | Passed; 486 installed packages, five high development findings retained |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | **148/148**, 25 files, **18.31 seconds** after offline-provider changes (baseline 25.08 seconds); includes security, factuality, parsing, scoring and export regressions; timings are observations, not a controlled performance claim |
| `npm run build` | Passed, Next 16.4.2; static pages and five API route handlers built |
| `npm run evaluate:release` | **1/1** runner test; six engineered synthetic records; independent validation still pending |
| `npm audit --omit=dev --json` | **Zero** advisories |
| `npm audit --json` | **Five high**, zero critical; exit status 1 accurately retained |
| Full browser suite, `PLAYWRIGHT_CHANNEL=msedge; tools/test-local-windows.ps1` | **46/46**, 328.75 seconds, zero failed/skipped/flaky; both 14-state accessibility journeys reported zero violations |
| `git diff --check`, known-credential/local-secret scans | Passed within stated scan scope |

The Windows wrapper requests temporary system wakefulness only during tests and releases it on exit; screen locking and saved power policy remain intact. No testcase retries are configured. Browser scope includes all six profiles, uploads/review, job match, input invalidation, editor/undo/reset/comparison, opt-in history/deletion, TXT/DOCX/selectable print-PDF round trips, keyboard flows, simulated API recovery and ten viewport widths (320–1920px). Chromium mobile emulation is not a physical iPhone or Safari test.

Fresh generated document tests retained name/email in four text-bearing PDF layouts; empty/image-only PDFs report failed extraction; protected/corrupt PDFs reject safely. DOCX retained 1/1 and 100/100 Unicode records. Six synthetic profiles retained deterministic scores and general-quality/job-alignment isolation. Their illustrative dataset declares older engine `ab51d10`, so the evaluator correctly records revision mismatch: these results are regression evidence, not an independently calibrated frozen holdout. Historical tracked benchmark measurements are preserved; fresh measurements are copied into this audit's evidence.

## Dependencies, privacy and release gates

Registry checks still return braces 3.0.3, micromatch 4.0.8, fast-glob 3.3.3 and Next ESLint packages 16.4.2. Five findings arise from one unpatched [braces stack-exhaustion advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`. The suggested ESLint config 14.2.35 is an incompatible major downgrade, not a safe fix for Next 16. No forced downgrade, suppression or implicit risk acceptance was applied. See [dependency analysis](DEPENDENCY_SECURITY_RESOLUTION.md) for reachability and compensating controls; lint/build/CI exposure remains even though production audit is clean.

Paid AI remains compile-locked off by `next.config.ts`; deterministic analysis and clearly labeled heuristic responses remain available. Local history stays opt-in, privacy deletion and external-processing consent are covered by tests, and arbitrary job-URL fetching remains contained with manual input fallback. These checks do not prove live paid-provider/shared-budget operation, which is outside this disabled release path.

Mandatory unresolved gates:

1. **P1:** Independent scoring calibration needs authorized real labels, independent reviewers, a frozen holdout and owner-approved acceptance thresholds. The executable review package exists; no new genuine labels were supplied.
2. **P1:** Independent complex-document extraction validation remains pending; generated layout tests are not an independently labeled licensed/consented corpus. OCR is unsupported and disclosed.
3. **P1:** Five high development dependency risks need a compatible patch or explicit responsible-release-owner disposition. None has been supplied.
4. **P2/manual verification:** Screen-reader speech, Safari/Firefox, physical-device and cross-reader visual export behavior remain unverified. Automated axe/keyboard and Chromium checks are bounded evidence, not full WCAG or Office interoperability certification.

No new P0 was identified in the tested scope. Passing CI does not close the independent-validation or dependency gates. PR remains draft; production decision remains **NO-GO**, with final owner approval still required after a future technical GO.

## Deployment and publication checkpoint

At audit start, protected Preview `https://resumescore-e19b3hv83-shaik-mahammad-shariff-s-projects.vercel.app/`, deployment `dpl_Bt9K6pVmtAn3erNKfby17ewkHRDR`, was READY at exact `bdbd8cbf5cfcf815f2ed2ce84b8ced98c9ea212d`.

Production metadata was independently queried: `https://resumescore-phi.vercel.app/`, deployment `dpl_5NimgXZ6W7XqK3Kypy5S1Eug1FS6`, READY, target production, exact SHA **`79a373c8acc3d234c04e21010598ef9f93764bcf`**. No production change is performed.

Publication results will be appended after the workflow change passes hosted CI and the new exact-SHA protected Preview passes browser/API checks. Authentication remains short-lived and scoped to the exact Preview origin; protection settings are preserved.
