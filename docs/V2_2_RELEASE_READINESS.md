# V2.2 release readiness

## Decision

Verified protected-Preview release candidate. **Not approved for production.** PR #1 remains draft/unmerged. Paid AI is disabled by the existing build-level lock, irrespective of provider credentials. No production variables, domains, settings or deployments were changed.

## Gates

- P0: no known new security/data-loss issue identified in this scoped work; this is not a penetration-test certification.
- Resolved preview gate: three consecutive complete remote suites passed **32/32, 32/32, 32/32**, with zero failed/skipped/flaky test cases, on f384f10. Evidence: v22-preview-verification.json. Application source is identical to 49c578c. One recovered static-asset connection failure and two auxiliary favicon/JWE resets were recorded separately; this does not establish universal network reliability.
- P1: independent scoring calibration and broader complex-document extraction evaluation remain pending. Synthetic labels are explicitly identified.
- P1: five high development dependency advisories remain; no compatible published patch found. They affect lint tooling, not the audited production dependency set.
- Paid AI activation: Redis coordination/live-provider/billing/cancellation/factuality validation remains blocked and unnecessary for deterministic operation. The paid lock must remain in place.
- P2: manual screen reader, real devices/cross-browser zoom, Word/LibreOffice/Acrobat visual interoperability and repeatable performance percentiles.
- P3: theme switching, OCR and expanded multilingual/domain coverage.

## Security and data handling

URL extraction still performs no outbound fetch; manual job text is the fallback. Existing bounded JSON/schema/origin validation, no-store API responses, factuality review, optional local history/deletion and browser-only analysis remain. API rate limits are instance-local; no distributed abuse guarantee is claimed. The current production dependency audit reports zero advisories.

New score comparison runs locally and creates no storage or external request. Export text is escaped and existing safe hyperlink handling is preserved. Preview authentication remains short-lived, origin-scoped and private; HTTP redirects are not followed with credentials. No paid model request was authorized.

## Publication

Continue on feat/resumescore-v2 and update existing PR #1. Publish only after local checks pass; use the existing protected Preview project. Final commit/CI/deployment results belong in V2_2_TEST_REPORT.md and the PR. Do not merge or promote without a separate explicit instruction.

Verified Preview: https://resumescore-m1ghxn576-shaik-mahammad-shariff-s-projects.vercel.app (dpl_ELZcByiGwgrvpfxqUfvvSERskp4F), READY on f384f10bccc4ebaa9968a65f7f677863a586ab08. Hosted CI passed. The following publication update changes only documentation/evidence; application and test source are unchanged. Its deployment build/smoke status is recorded separately in PR #1 and the final execution report, retaining the exact tested commit above.
