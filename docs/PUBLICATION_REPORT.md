# V2/V2.1 publication checkpoint

## Reviewed source and privacy
Started on feat/resumescore-v2 at 79a373c8acc3d234c04e21010598ef9f93764bcf with 49 modified tracked files and 67 untracked files. All legitimate source, tests, fixtures, documentation and synthetic screenshots are retained. Actual environment files, credentials, build/dependency directories and test traces are ignored. See PUBLICATION_SECURITY_REVIEW.json for the credential/PII review. No local API key is included.

## Release policy
Paid AI is disabled at build level by next.config.ts, independently of Vercel environment settings. UI consent controls are disabled and clearly labeled. The budget/provider architecture remains available for a separately reviewed future activation. Deterministic browser analysis and heuristic server drafting remain functional. No remote production variables or project settings were changed.

## Local verification
- npm test: 128 tests passed in 20 files.
- npm run lint: passed; changed Playwright configuration was separately linted.
- npm run typecheck: passed.
- npm run build: passed (Next 16.4.2, Node 24.21.0).
- Local Playwright results: publication-local-browser-summary.json.
- git diff --check: passed.

## Publication scope and release gate
The user authorized committing, pushing the feature branch, creating a PR to main, and deploying a Vercel Preview. This checkpoint precedes those operations; actual commit/PR/deployment identifiers and remote verification results will be added to the PR and publication evidence after validation.

Production remains gated by the P1 issues documented in V2_1_RELEASE_READINESS.md: independent scoring calibration and broader extraction evaluation, plus five high development-only dependency advisories. Paid-AI operational/live validation is also pending and activation remains locked off. No merge or production deployment may proceed while these gates remain unresolved. A passing preview alone does not waive them.

## Initial publication
Application commit a44367e1ae950fb6e8b41e9274d73ec37d23f6f3 was pushed successfully to origin/feat/resumescore-v2. Draft PR: https://github.com/skmdshariff143-ai/resumescore/pull/1 . GitHub CI passed: https://github.com/skmdshariff143-ai/resumescore/actions/runs/39388429775 .

Vercel Git integration produced a READY Preview for that exact commit at https://resumescore-pleuc9219-shaik-mahammad-shariff-s-projects.vercel.app (dpl_MMaye3qQpK6zsQ1vGTqKAxGqemhL), with a 46-second build. Existing production was not changed.

The preview is protected. CLI project authentication successfully returned the application using a short-lived development OIDC token. The test harness forwards that token only in Node-side fetches to the exact preview origin, disables authenticated redirects and remote traces, and never stores credentials in Git. A local two-test smoke of the fixture passed; lint and TypeScript passed. Full remote workflow validation follows on the next harness commit.

## Remote verification and final release decision

Harness commit 829f81ff46f128a1c07e645f51cf365a81f1e06b produced READY Preview https://resumescore-4quonjthl-shaik-mahammad-shariff-s-projects.vercel.app (dpl_EN9iMzvc9sdmKwbDFvyfMAuWgoyP). Hosted CI passed: https://github.com/skmdshariff143-ai/resumescore/actions/runs/39389372530 .

Two complete authenticated browser runs each passed 28/30 tests, with different failures. First: mobile legacy-history request cancellation in the authentication harness and a five-second job-match assertion. Repeat: desktop heuristic response exceeded five seconds, and long-PDF re-upload timed out waiting for the input. These are unresolved remote reliability findings; no all-green preview result is claimed. Both runs exercised real homepage, uploads, local analysis, job matching, history deletion, TXT/DOCX/PDF export and heuristic API paths. Desktop/mobile consent=true requests confirmed paid AI remains disabled. Raw aggregate evidence is in publication-preview-summary.json; credentials/traces are excluded.

The final test-only changes tolerate already-cancelled authentication routes and allow fifteen-second remote assertions. ESLint, TypeScript and whitespace validation passed after these changes; a full passing remote run of this final harness is not claimed. Application source is unchanged from a44367e. The remote mobile accessibility journey completed 14 audited states with zero automated violations on the repeat; desktop repeat stopped before completion. This does not establish manual screen-reader conformance.

A point-in-time deployment runtime query returned zero error/fatal records over its preceding 30-minute window; this is not continuous monitoring. Production alias was rechecked: READY on unchanged commit 79a373c8acc3d234c04e21010598ef9f93764bcf, deployment dpl_5NimgXZ6W7XqK3Kypy5S1Eug1FS6.

**Decision: publish the feature branch and evidence, keep PR #1 draft and unmerged, and do not deploy/promote production.** Preview reliability findings and the existing P1 evaluation/dependency gates remain. No purchase, production configuration change, merge or production deployment was performed.
