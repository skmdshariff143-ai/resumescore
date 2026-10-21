# Release-owner dependency risk decision request

**Decision: PENDING — not accepted. Production remains NO-GO.** This form requests an informed decision; generating or committing it is not approval.

## Finding and scope

Fresh npm registry/audit checks on 2026-10-20 still identify [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack-exhaustion denial of service from deeply nested brace patterns (CVSS 7.5). Five high findings are one underlying unpatched chain:

| Package | Installed version | Path / exposure |
|---|---|---|
| eslint-config-next | 16.4.2 | Direct development lint configuration |
| @next/eslint-plugin-next | 16.4.2 | Config -> plugin; reads configured Next root globs |
| fast-glob | 3.3.1 | Plugin -> glob traversal |
| micromatch | 4.0.8 | Glob -> pattern matching |
| braces | 3.0.3 | Pattern parser; vulnerable recursive processing |

`npm explain braces` confirms this path. Current published braces remains 3.0.3; compatible Next ESLint packages remain 16.4.2. Updating fast-glob alone leaves the underlying vulnerable parser. The audit's proposed eslint-config-next 14.2.35 is an incompatible major downgrade. Replacing the Next configuration or parser with a non-drop-in library can lose lint rules or change glob semantics; no such unverified replacement is applied. No findings are suppressed and no forced downgrade is used.

Production dependency audit currently reports zero advisories, but development packages are present in build/CI environments. A malicious repository/config pattern or future untrusted glob input could interrupt development/build/CI availability. Resume/job text is not supplied to lint globs, and this path is not in the audited production runtime graph. This does not prove the risk is unreachable in every future configuration.

Controls: locked `npm ci`; trusted configuration patterns; read-only CI contents permission; checkout credentials not persisted; 15-minute job deadline; no production secrets exposed to untrusted PR code; production dependency audit remains enforced. SHA-pinned Node 24 CI actions reduce separate supply-chain/runtime drift. These controls **do not patch braces**.

## Required owner response

Complete privately or as an explicit, attributable repository decision. Do not include secrets or candidate data.

| Required field | Owner entry |
|---|---|
| Responsible owner / authority | PENDING |
| Reviewed candidate SHA and lockfile hash | PENDING; bind to the exact proposed release |
| Decision | PENDING: reject/defer, or explicitly accept the scoped residual risk |
| Business justification and exposure review | PENDING |
| Confirmed controls / any additional restrictions | PENDING |
| Acceptance expiry and remediation deadline | PENDING; no indefinite acceptance inferred |
| Remediation owner and upstream monitoring cadence | PENDING |
| Reassessment triggers | New advisory, untrusted glob input, changed lockfile/CI/configuration, control failure, expiry |
| Signature/reference and date | PENDING |

If rejected/deferred, retain the production gate until a compatible patch or verified replacement passes all checks. If explicitly accepted, retain the advisory and decision record, monitor upstream releases, rerun full/production audits, and review on expiry. Other mandatory scoring/extraction and final production-approval gates remain open. Never interpret approval of a Preview, a merge request, or this form's existence as security-risk acceptance.
