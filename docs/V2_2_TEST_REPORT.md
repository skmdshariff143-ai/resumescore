# V2.2 test report

Environment: Windows, Node 24.21.0, npm 11.19.0, Next.js 16.4.2; Edge Chromium desktop and iPhone-sized Chromium emulation. No live paid provider was used.

## Local checks

- Baseline `npm test`: 128 passed / 20 files.
- Updated `npm test`: **138 passed / 22 files**, including unit, route integration, security, factuality, scoring, parsing and export tests.
- Four new regression tests initially failed and then passed after the corresponding implementation fixes.
- `npm run lint`: passed; final verification recorded below.
- `npm run build`: passed after a clean build and transport TypeScript correction.
- Initial sandbox build failed in Turbopack/PostCSS child-process startup; retry with the existing cache also failed. The cache was preserved under ignored `.vercel/build-cache-before-v22`; rebuilding cleanly resolved compilation. A Buffer/BodyInit type error in the harness was fixed with an owned Uint8Array, without a type cast.
- `npm audit --omit=dev --json`: zero advisories.
- `npm audit --json`: five high development advisories through braces/micromatch/fast-glob/Next ESLint. `npm view braces version` returned 3.0.3; `npm view eslint-config-next version` returned 16.4.2. The audit proposes an incompatible downgrade, not a compatible patch. No forced dependency change was made.
- Release candidate diff/local-secret-value scan: no findings at the implementation checkpoint. Only synthetic example data is added; actual environment/auth/build files remain ignored.

## Protected-preview investigation

The prior application preview was tested with successive harness revisions. The recorded complete runs in `v22-preview-investigation.json` are **28/30, 28/30, 30/30**. Earlier diagnostic attempts also exposed teardown waits and failed chunk loads; those failures are not counted as successful runs.

Observed failures included replacing a hydrated document for print, pending speculative requests during teardown, transport failures fetching chunks/navigation and assertions shorter than actual remote loads. No failed assertion was skipped or changed to accept an incorrect result. The final harness normalizes transport headers, cancels teardown requests, bounds an immutable-asset connection retry and waits on observable completion.

Use authenticated `vercel.cmd --scope <existing-team> env run --project <existing-project> --environment development -- node tools/run-preview-tests.mjs` with BASE_URL and PREVIEW_REPETITIONS=3. This changes no access-control setting. Reports record each run, errors and recovered transport retries. Remote traces and credential-bearing state are never saved.

## Final local verification checkpoint

`npm run lint` and `npm run typecheck` passed. With `PLAYWRIGHT_CHANNEL=msedge` and an isolated `E2E_ARTIFACT_DIR`, `npm run test:e2e` passed **32/32**, zero failed/skipped/flaky, 253.7 seconds. The 14-state accessibility journey reported zero automated violations on desktop and mobile; the new comparison workspace also passed its scoped axe check. Keyboard approval/dialog focus, history deletion, default no-API analysis and export round trips passed.

`v22-local-verification.json` contains aggregates and single-sample local performance (including the authenticated transport caveat for remote measurements). These samples are not Lighthouse or real-device performance certification. One later copy-only homepage disclosure and screenshot capture were added after the full local browser run; the final production build and new Preview verify that final source.

## Navigation-transport follow-up

Application commit 49c578c9cb68b3da2d070ee4074a578beef2b0d0 built READY at https://resumescore-dutv24ojg-shaik-mahammad-shariff-s-projects.vercel.app (dpl_Aux2MYSG2udFj2uh3dAWx7qr4Rzk). Hosted CI passed: https://github.com/skmdshariff143-ai/resumescore/actions/runs/39394059816 .

The first full new-preview run passed 32/32 in 125.9 seconds, with seven recovered immutable-asset connection failures. The second run failed at a `/history` navigation with `net::ERR_FAILED` and was stopped before completion to fix the transport; no full passing second run is claimed. Evidence is retained in v22-preview-before-navigation-fix.json. This failure occurred in the authenticated Node/browser bridge rather than an application HTTP error response.

The follow-up permits one bounded connection retry for an explicit allowlist of page GETs and static assets. Fault-injection tests prove that POSTs/API requests, HTTP error responses, redirects and aborted operations are not replayed, another origin is rejected before sending credentials, and a repeated connection failure stops after two attempts. All requests retain manual redirects and the original timeout. No test-case retry or fixed sleep was added. The runner cannot mark its gate passed before all requested repetitions finish.

Final new-preview results follow after this harness-only correction. The application source remains identical to 49c578c.

Follow-up validation: `npm test` passed **142 tests / 23 files**, including four transport fault-injection tests; `npm run typecheck` and `npm run lint` passed.
