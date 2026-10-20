# V3 deployment readiness

## Scope

Publish the existing feature branch and update draft PR #1. Verify CI and a protected Vercel Preview built from the exact Git commit. No production merge, promotion, environment change, domain change, purchase or paid-AI activation is authorized by this work.

## Candidate protections

- `next.config.ts` continues to build-lock paid AI off.
- Deterministic analysis remains browser-only by default; optional history remains off by default.
- External processing disclosures and explicit rewrite approval are retained.
- API limits, sanitized errors, disabled arbitrary job-URL fetching and security headers are unchanged.
- No new dependency, remote font or animation package.
- Secret scan runs before commit; synthetic-only screenshot artifacts selected for publication.

## Production decision

**NO-GO for production.** Required independent scoring calibration and complex-document extraction labels remain pending. Five high development-only dependency advisories remain unresolved/unaccepted by the release owner. These gates are documented in the existing final release reports and are not waived by the UI redesign. Paid-provider live verification remains unavailable and unnecessary for the disabled paid path.

Preview readiness depends on final local/hosted/remote verification. Publication evidence is appended after it is observed. The existing production release must remain unchanged.

## Initial publication evidence

`b6db45904c84e5bc3a245ba539ccca5ea7560a82` was pushed to `feat/resumescore-v2` and deployed to [protected Preview](https://resumescore-82a2dudjr-shaik-mahammad-shariff-s-projects.vercel.app/), deployment `dpl_CU1vjb9CNm8CSTnzuEcbgKiknk8P`; Vercel metadata confirmed that SHA. Remote browser suite: 46/46 passed with zero skipped/flaky cases. One bounded navigation GET transport retry recovered.

That commit's Linux CI failed two contrast journey cases (44/46 browser cases passed), so it was not accepted as the final release gate. State-color animations were corrected without changing test thresholds. The corrected candidate must pass CI and protected Preview before the V3 Preview gate is considered satisfied.

The pre-publication scan found zero credential-pattern/local-secret matches across 291 unique tracked/historical blobs, retained all 116 original snapshot paths and all checked V2 ancestors, and found no deleted paths against main. This is a scoped scan, not proof that every possible secret/PII pattern is absent.
