> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Test report — 2026-10-20

All results refer to this local Windows checkout and synthetic test inputs. No production deployment or successful live provider test was performed.

## Baseline

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm test`: 3 suites passed; 11 failed to load due to Windows sandbox temporary-file ENOENT. Ten tests executed successfully. This was not a passing baseline.
- `npx vitest run --pool=threads --maxWorkers=1`: avoided the environment failure and exposed actual assertions. This pool configuration is now in Vitest config.
- Initial `npm run build` in the sandbox failed because Turbopack could not connect to its compiler child process. Approved local execution outside the sandbox succeeded.

## Final checks

| Command | Result |
|---|---|
| `npm test` | 103 passing tests in 17 suites (final run: 39.60 s) |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed without warnings |
| `npm run build` | Passed on Next.js 16.4.2; 14 pages generated |
| `$env:PLAYWRIGHT_CHANNEL='msedge'; npx playwright test` | 18 passed (1.4 minutes): 9 desktop + 9 mobile scenarios |
| `npm audit --omit=dev --json` | 0 advisories |
| `npm audit --json` | 5 high advisories in development-only braces/micromatch/fast-glob/Next ESLint chain |
| `git diff --check` | Clean after trailing-blank-line cleanup |

Unit and route-integration tests are combined in Vitest's 103-test count. They include parser/scoring/storage, real PDF fixtures, domain matching, provider selection/failure behavior, safe errors, JSON/origin/body limits, no-fetch SSRF containment, consent, factual heuristic output, DOCX bounds and escaped printable HTML.

Playwright covers desktop and mobile Chromium (installed Edge): extraction review; no API requests during browser-only analysis; editing, undo, comparison and TXT download; opt-in history; malformed PDF rejection; axe checks; selectable PDF export/re-upload; DOCX export/re-upload; legacy history deletion; recoverable server errors; and separate job-alignment results. The production build is served locally on port 3100.

Initial accessibility checks exposed contrast, control-size and mobile-button-name defects. These were repaired. A subsequent failure-state test matched Next's route-announcer in addition to the intended alert; its locator was scoped to main content. These failures were not hidden or counted as passing runs.

## Scope and evidence

- Axe checks use WCAG 2 A/AA, 2.1 AA and 2.2 AA tags on the initial analyzer page, asserting no serious/critical findings. They do not certify the entire application or replace screen-reader, zoom, keyboard and manual contrast review.
- PDF and DOCX tests generate synthetic documents and verify extracted text on re-upload. They do not establish interoperability across all Word/LibreOffice versions or complex document layouts.
- Six synthetic domain fixtures cover engineering, data, business, finance, marketing and healthcare. These are authored regressions, not independent benchmarks. No extraction accuracy, precision/recall, human scoring agreement or LLM factuality percentage is claimed.
- Live provider success, paid inference, production Vercel behavior, distributed rate limits, Lighthouse/Core Web Vitals and comprehensive bundle-performance measurements were not verified.
- Production client chunks were searched for provider environment-variable identifiers; no matches were found. This is a narrow verification, not a general secret-scanning certification.

Audit evidence: `dependency-audit-before.json`, `dependency-audit-after.json`, `dependency-audit-production.json`. Browser summary is in `docs/browser-test-summary.json`; full JSON results are in ignored `test-results/browser-results.json`; synthetic screenshots are in `docs/screenshots/`.
