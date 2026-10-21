# Security regression report

## Scope and methodology

Inspected all AI routes/provider selection, URL extraction, request reader, file parsers, local history deletion, exports and configuration. Ran adversarial route/unit tests plus browser deletion/failure/local-analysis workflows. Refreshed npm audit reports without installing or downgrading packages.

## Verified implementation and evidence

- Arbitrary URL fetching remains disabled: SSRF, redirect and DNS-rebinding tests assert no fetch at all. New protocol/credential rejection accepts only credential-free HTTP/HTTPS syntax; this is not a claim of safe arbitrary fetching.
- Requests retain streaming 256 KB limits, depth/array/object bounds, read timeout and cross-origin rejection. Added exact JSON media-type matching and fatal UTF-8 decoding.
- Paid provider selection now requires explicit consent and shared admission; incomplete settings, budget outages/limits and provider failures return labeled heuristics. No browser-reported usage is trusted.
- SDK errors are sanitized; tests deliberately inject secret-looking provider errors and assert neither responses nor logs contain them. Structured JSON output bounds were tightened. No resume analytics were added.
- Rewrite numeric/date contradictions are replaced; unverified changes require explicit human approval. Delimiters alone are not treated as injection protection.
- Export markup is escaped, links are restricted to HTTP/HTTPS, and DOCX XML entities are rejected. Legacy-history deletion regression remains covered.

Fresh evidence: `v21-dependency-audit.json` reports five high development-only advisories in the braces → micromatch → fast-glob → Next ESLint chain. `v21-production-audit.json` reports zero production advisories. `npm view braces version` returned 3.0.3 and `npm view eslint-config-next version` returned 16.4.2, the installed versions. The suggested fix is a major downgrade to Next ESLint 14.2.35; no forced downgrade was applied.

## Remaining risks

Development tooling denial-of-service advisory remains; do not lint untrusted attacker-controlled glob patterns. Live Redis atomicity/provider cancellation/model billing need operational validation before paid activation. General endpoint limiting remains process-local, and browser-supplied network headers are not an authenticated identity. No external penetration test, hosting-log retention audit, real provider injection evaluation or production configuration inspection occurred. No known new P0 was identified by this scoped review; that is not a security certification.

## Production-like smoke evidence

`node tools/v21-production-smoke.mjs` passed all 8 checks against the local Next production server. Raw outcomes are in `v21-smoke-measurements.json`. Initial sandbox execution could not connect to localhost (EACCES); approved local execution passed. No production URL or external AI provider was contacted by this script.
