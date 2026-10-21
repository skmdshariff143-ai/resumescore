# Cross-browser validation — 2026-10-20

Scope: production-like Next.js build on Windows, Playwright 1.64.1, Chromium/Edge desktop/mobile, Firefox 157.0 (Playwright build 1555), and WebKit 27.2 (build 2370) desktop/mobile emulation. Local Node 24.21.0/npm 11.19.0; hosted CI uses Node 22. Playwright WebKit on Windows is not native Safari certification or a real iPhone test.

## Implementation and failure diagnosis

The added `playwright.cross.config.ts` runs the existing core workflows in Firefox desktop, WebKit desktop and WebKit mobile: review/analysis/edit/compare/TXT export/privacy, history/deletion/migration, malformed-file rejection, analyzer axe, DOCX round trip, recoverable server failure and job matching. Forty-eight isolated cases cover four public routes at four requested widths with reduced motion. The twelve homepage cases additionally check keyboard skip/focus and an injected-overflow positive control. Total cross-engine scope: 72. Existing Chromium scope remains 46. `page.pdf()` is a Chromium-only automation API; its existing selectable-PDF test remains in Chromium. Native Firefox/WebKit print-PDF is **PENDING manual validation**, not claimed as an automated pass.

Failures were investigated, not hidden or retried to green:

| Attempt | Actual result | Finding/action |
|---|---|---|
| First new probe | 0 passed / 3 failed | Firefox live viewport resizing stalled; WebKit integer innerWidth rounding at Windows 125% scaling caused a false overflow assertion. |
| Fresh contexts by width | 0 / 12 | Main skip target did not receive focus in Firefox; WebKit skipped the implicit anchor in normal Tab mode. Mobile emulation also reports layout/root dimensions differently. |
| First expanded suite | 27 / 36 passed, 9 failed | Main focus fix worked in Firefox. Explicit anchor Tab behavior and root-width measurement still required correction. |
| Overflow-control attempt | Interrupted after two control failures | Empty zero-height probe did not create measurable Firefox overflow. Give the probe a one-pixel height; retain interruption, no pass claimed. |
| Next expanded suite | 33 / 36 passed, 3 failed | WebKit emitted uncaught cancelled RSC prefetch errors during repeated full-page navigations. Local trace identifies the cancelled homepage RSC fetch; no blanket runtime-error exemption added. |
| Four-page isolated route attempt | 35 / 36 passed, one timeout | Holding four pages in one context caused wide WebKit mobile rendering to exhaust the unchanged 45-second budget. Split each route/width into its own test/context rather than increasing the deadline. |

Fix: `tabIndex=0` on the skip link and `tabIndex=-1` on main. New reflow cases use a separate test/context per route and requested width, avoiding synthetic rapid-navigation cancellation and simultaneous multi-page rendering overhead. Root used CSS width accounts for WebKit/Windows DPI emulation; the positive control confirms real descendant overflow is still detected. Existing workflow overflow checks use the same root basis. No CSS overflow hiding, testcase retries, sleeps or ignored runtime errors were added. Rapid full-navigation behavior on native Safari still belongs in manual review; this is not a claim to have repaired a browser networking implementation.

## Reproduction and evidence

Final local run: **72/72** Firefox/WebKit checks passed in **109.26 s**, and **46/46** Chromium checks passed in **389.55 s**; zero failed/skipped/flaky in either final run. Earlier failures remain in the table and evidence JSON. Successful isolated tests keep the original 45-second per-test timeout and runtime assertions. These timings describe this Windows host, not production latency.

Run `npm run build`, then `npm run test:e2e` for Chromium and `npm run test:cross-browser` for Firefox/WebKit. Windows wrapper: `tools/test-local-windows.ps1 -TestFiles @('--config','playwright.cross.config.ts')`; unset BASE_URL for local use and PLAYWRIGHT_CHANNEL for cross engines. Set a unique E2E_ARTIFACT_DIR to preserve prior reports. JSON result counts, durations, runtime categories and final statuses are recorded in enterprise-validation-evidence.json; raw failed traces stay ignored under `.vercel/enterprise-cross-*`.

Protected Preview: set exact BASE_URL, PREVIEW_REPETITIONS=1, PREVIEW_SUITE=core (then cross-browser). Invoke the existing `vercel env run ... -- pwsh -NoProfile -File tools/test-local-windows.ps1 -Preview` for the linked project/team. The runner only accepts those two suite names and isolates their output directories. Origin-scoped short-lived OIDC stays in Node; protection is not disabled. No API/POST/testcase retries. CI now installs all three engines and runs both suites without relaxing the production audit.

## Remaining evidence

Genuine NVDA/VoiceOver, native Safari/macOS/iOS, real mobile touch/zoom, Firefox/WebKit native PDF printing and Word/LibreOffice visual pagination are **PENDING**. Follow MANUAL_ACCESSIBILITY_QA.md. Emulation and axe do not close these mandatory manual gates.
