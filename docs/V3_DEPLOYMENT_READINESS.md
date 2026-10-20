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
