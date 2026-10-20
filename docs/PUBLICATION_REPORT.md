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
