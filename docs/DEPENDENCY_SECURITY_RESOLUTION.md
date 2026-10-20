# Dependency security resolution

## Scope and fresh evidence

`npm audit --json` still reports **five high development findings**, derived from one underlying vulnerability. `npm audit --omit=dev --json` reports **zero advisories**. No advisory was suppressed, dependency removed to weaken linting, forced downgrade applied, or risk acceptance claimed.

The upstream [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) identifies stack exhaustion from deeply nested brace patterns in braces <=3.0.3 and lists no patched version. Registry checks returned braces 3.0.3, micromatch 4.0.8, fast-glob 3.3.3, and Next ESLint packages 16.4.2. The installed Next plugin pins fast-glob 3.3.1. Updating fast-glob alone cannot remove the vulnerable braces chain. The audit suggests eslint-config-next 14.2.35, an incompatible major downgrade rather than a patched compatible release.

| Finding / installed version | Dependency path and cause | Exposure / decision |
|---|---|---|
| eslint-config-next 16.4.2 | Direct development dependency; imports Next plugin | Lint/CI tooling; retain working Next 16 configuration |
| @next/eslint-plugin-next 16.4.2 | eslint-config-next -> plugin -> fast-glob | Reads configured `settings.next.rootDir` patterns; no compatible published patched plugin |
| fast-glob 3.3.1 | plugin -> fast-glob -> micromatch | Propagated finding; latest 3.3.3 still cannot fix unpatched braces |
| micromatch 4.0.8 | fast-glob -> micromatch -> braces | Pattern matching; latest published version still uses affected braces |
| braces 3.0.3 | micromatch -> braces | Underlying recursive pattern-processing vulnerability, no published patch |

## Reachability and compensating controls

The installed `@next/eslint-plugin-next/dist/utils/get-root-dirs.js` calls fast-glob for configured Next root directory patterns; the current ESLint configuration provides no dynamic `rootDir` pattern. Resume/job upload strings are not passed to this lint dependency. The audited production dependency graph excludes this chain. Development dependencies may be installed in build environments, so the finding is not dismissed merely because it is development-only. A malicious repository/configuration change or untrusted tooling input could expose build/CI availability; running untrusted PR code is a separate broader trust risk.

CI now has explicit read-only contents permissions, checkout credential persistence disabled, and a 15-minute job deadline. Existing npm lockfile/`npm ci`, production audit, lint/type/build/tests remain. These changes bound CI privileges/execution; they **do not patch braces or constitute release-owner acceptance**. Do not pass user-provided glob patterns to lint tooling, expose production secrets to untrusted PRs, or use audit overrides to hide findings.

## Resolution status

**Remaining: five high development advisories, no compatible patched resolution found.** Production audit is clean at this checkpoint, not a guarantee against unknown vulnerabilities. The responsible release owner must explicitly accept the documented scope/controls or await/review a compatible upstream fix and regression results. No such acceptance was supplied. This remains a production blocker alongside independent validation. Re-run full and production audits before any later release.
