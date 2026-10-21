> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Deployment readiness

**Status: not ready to declare the full V2 specification production-complete. No deployment performed.**

Existing target: https://resumescore-phi.vercel.app/

The local production build succeeds with Next 16.4.2. Production dependency audit reports zero known advisories in the recorded snapshot. See TEST_REPORT for the exact validation results and scope.

## Release gates

1. Review local changes, including pre-existing user API edits preserved on the feature branch.
2. Resolve or formally assess remaining development-only advisories.
3. Verify proxy-header trust and add distributed rate/budget enforcement before enabling public paid AI requests.
4. Validate external AI factuality, configured model availability, consent UX, account retention and operational logging. Local tests do not establish these production properties.
5. Verify DOCX interoperability and complete remaining multi-domain/scoring benchmark work, or explicitly agree to a smaller release scope.
6. Manually review print-to-PDF pagination and Unicode documents, keyboard/screen-reader behavior, zoom and other browsers.
7. Obtain explicit user approval before pushing, deploying, changing environment variables, promoting or modifying domains.

## Reproducible local checks

Use a supported Node 22+ runtime, then `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Install Playwright Chromium (`npx playwright install chromium`) and run `npm run test:e2e`. On this Windows host, tests used existing Edge with `PLAYWRIGHT_CHANNEL=msedge`.

Windows sandbox limitations affected the baseline Vitest process pool and Turbopack child processes. Vitest now uses one thread. The successful production build was run outside the sandbox through approved local execution; no cloud action was involved.

## Deployment procedure after approval

Use the existing Vercel project and reviewed commit. Keep API credentials server-side (never `NEXT_PUBLIC_*`). Start with deterministic functionality and no provider keys until AI gates are met. Build a preview, verify upload/review/analysis/edit/export/privacy and headers, then request explicit approval for production promotion. Keep the prior deployment available for rollback.

This work did not inspect or alter production environment values, retention settings, logs, domains or deployment state.
