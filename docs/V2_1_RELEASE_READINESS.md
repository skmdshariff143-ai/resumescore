> Publication release policy: `next.config.ts` forces `AI_PAID_ENABLED=false` in compiled builds regardless of remote environment values. Paid AI controls are disabled and labeled in the UI. Removing this lock requires a separately reviewed release.

# ResumeScore V2.1 release readiness

## Decision and scope

**Partially complete release candidate. Production readiness is not declared.** Local implementation is prepared for controlled staging review with paid AI disabled, with all local checks below passing and explicit deployment approval still required. No cloud action, commit, push, merge, purchase or production configuration change was performed.

V2 work was preserved on `feat/resumescore-v2`; HEAD remains `79a373c8acc3d234c04e21010598ef9f93764bcf`. The full uncommitted tree contains both pre-existing V2 and V2.1 edits. See `V2_1_BASELINE.md` for the starting snapshot and `v21-working-tree.txt` for the final file inventory.

## P1 issue resolution

| Risk | Status | Evidence / remaining work |
|---|---|---|
| Bounded API inputs, safe errors, consent | Completed and tested locally | Existing protections retained; strict JSON MIME/UTF-8, provider fallback and no-leak regression tests added |
| Invented heuristic qualifications | Completed and tested for available fixtures | Source-preserving rewrites, source-filtered letters, explicit approval; no claim of independent truth |
| External AI factuality | Partially completed; live evaluation blocked | Conservative provenance/check pipeline and UI approval implemented; model/semantic evaluation requires a reviewed shared budget |
| Distributed paid AI spending | Contained by default disablement | Provider-independent atomic Redis adapter implemented; no paid call without shared admission; live multi-instance validation remains blocked |
| Scoring validity and keyword stuffing | Partially completed | Mention cap, negation filtering, honest rubric language, six-profile synthetic metrics; independent calibration pending |
| Upload and extraction robustness | Tested within documented scope | PDF/DOCX/TXT/paste limits and failure cases; columns remain row-ordered and require review; no OCR |
| Non-software parsing | Concrete regressions fixed | Care Assistant/employer swap, accented names and skills-as-location false positives fixed; broad occupation coverage still incomplete |
| Inline job classification and history resurrection | Prior V2 fixes retained | Existing unit/browser regressions remain in full suite |
| Dependencies | Production audit clear; development risk unresolved | Five high findings in one braces/Next ESLint chain; no compatible patched latest version found, no forced major downgrade |

## Engineering changes

New `src/lib/ai/{factuality,budget,controlled}.ts` separate source support, shared admission and provider fallback. All three AI routes integrate the controller. SDKs have bounded response schemas, timeouts/no retries and stronger source constraints. `ReviewedRewrite.tsx` integrates explicit comparison/approval into the existing undoable workspace; cover-letter copying also requires review.

Parser/scorer fixes preserve browser-only analysis: evidence-only skill credit, negation handling, Unicode names, broader role detection and header-only location extraction. PDF workers are destroyed after processing and columns receive degraded diagnostics. DOCX preserves tabs/breaks; printable/DOCX exports add safe professional hyperlinks. Contrast and narrow-screen progress labels were fixed based on observed browser failures.

Tests and measurements are in `v21-hardening.test.ts`, `v21-benchmarks.test.ts`, `e2e/v21.spec.ts` and the retained V2 suites. README/environment example and all requested V2.1 reports were added or updated. No new runtime dependency was introduced.

## Verification commands and actual outcomes

| Command | Outcome |
|---|---|
| `npm test` | 127 tests passed in 19 files; unit and route integration tests share this suite (no inflated separate integration count) |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed; new smoke script also passed `npx eslint tools/v21-production-smoke.mjs` |
| `npm run build` | Passed, Next 16.4.2 |
| `$env:PLAYWRIGHT_CHANNEL='msedge'; npx playwright test` | 28 passed, zero failed/skipped/flaky; 6.3 minutes |
| `node tools/v21-production-smoke.mjs` | 8 local production-server checks passed (headers, invalid JSON/media type, size, origin, URL containment, heuristic rewrite) |
| `npm audit --json` | Five high development advisories; raw `v21-dependency-audit.json` |
| `npm audit --omit=dev --json` | Zero advisories; raw `v21-production-audit.json` |
| `npm view braces version`; `npm view eslint-config-next version` | 3.0.3 and 16.4.2 (installed latest versions) |

Local runtime: Node v24.21.0, npm 11.19.0, Windows PowerShell. CI still targets Node 22; hosted CI was not triggered. Local build/browser execution required sandbox escalation for child processes; no deployment was involved. The audit commands were piped to JSON report files with PowerShell `Set-Content`. `npx vitest run src/__tests__/v21-benchmarks.test.ts src/__tests__/scoring.test.ts src/__tests__/ats.test.ts src/__tests__/v21-hardening.test.ts` also passed its then-current 27 tests during iteration.

Failures were not hidden: initial provider-error tests expected HTTP 500 and were updated to verify the new sanitized heuristic fallback; an arbitrary senior-score assertion was replaced with evidence sensitivity; one synthetic PNG had a bad CRC and was replaced with a valid RGBA fixture; broad browser scans found reflow, secondary-text contrast and hover contrast defects, subsequently fixed. A diagnostic script's CommonJS lint error was corrected to an ES module. Final results supersede these intermediate runs.

## Benchmarks and practical limits

See raw `v21-*-measurements.json` files. The six fictional profiles cover 12 name/email fields, 13 explicitly labeled skills and expected sections. These are engineered positives/negative controls, not real-world accuracy estimates. Employment fields and score-order deltas are recorded, including discovered regressions. PDF generator/extractor separation and DOCX XML/browser round trips verify tested content retention. Both desktop and mobile axe runs checked 14 screens/states each and recorded zero violations for the selected WCAG tags. Final browser stats are in `v21-browser-summary.json`; no skips or retries were needed. No independent human-review scoring agreement, Word/LibreOffice/Acrobat visual interoperability, real device performance, manual screen-reader session or live AI factuality result is claimed.

## Deployment gates and remaining severity

- **P0:** none newly identified in this scoped local audit; not a penetration-test certification. Existing production has not received these changes.
- **P1:** before paid AI activation, configure approved Redis infrastructure, validate Lua atomicity/circuits/leases across instances, confirm model availability/pricing/cancellation and run live adversarial factuality tests. Paid AI must remain disabled meanwhile.
- **P1:** independent scoring calibration and broader complex-document/entity extraction evaluation remain pending. Development dependency denial-of-service advisories remain unresolved with no compatible published patch found.
- **P2:** manual assistive-technology/zoom/cross-browser testing; visual long-PDF and Word/LibreOffice interoperability; peak-memory and repeatable percentile performance measurements; operational hosting/provider retention review; explicit rubric versioning for older saved scores (re-analyze before comparison).
- **P3:** broader multilingual taxonomies, OCR if justified, richer fact/relationship inventories and per-role calibration.

After approval, use the existing Vercel project for a staging preview with `AI_PAID_ENABLED=false`. Run the documented browser flows, verify response headers, confirm no external provider requests, and review export files in target readers. Production promotion remains a separate explicit approval. This report neither requests nor performs a deployment.

## Deployment configuration inspected

Git origin matches github.com/skmdshariff143-ai/resumescore. Tracked `vercel.json` specifies Next.js, `npm run build`, `.next`, region `iad1`, and no environment values or per-function limits. No local `.vercel/project.json` link exists. Next headers were checked on the local production server. Actual Vercel project variables, function limits, account retention and deployment state remain uninspected and unchanged.

Final combined V2/V2.1 working tree: 49 modified tracked files and 67 untracked files. These totals include preserved pre-existing V2 work, not just this iteration. No commit was created. `git diff --check` passed.
