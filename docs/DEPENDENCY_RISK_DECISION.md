# Dependency risk decision — 2026-10-20

**PENDING OWNER APPROVAL — risk not accepted by Codex.** Fresh full audit exits 1 with five high findings; production audit exits 0 with zero findings. No findings suppressed, no forced downgrade, no lockfile changes in this pass.

Audited lockfile SHA-256 (raw bytes): `48f2b09b34078bc06baa372a48a5ea852eea13f6b2043b4cd63b7b18ff18b7c1`. Bind any owner decision to this hash and the final reviewed commit; a later lockfile change requires reassessment.

`npm explain braces` confirms: `eslint-config-next@16.4.2 -> @next/eslint-plugin-next@16.4.2 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`. Five package findings propagate one underlying [stack-exhaustion denial of service advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting braces through 3.0.3. Registry checks still return braces 3.0.3 and eslint-config-next 16.4.2. Audit proposes eslint-config-next 14.2.35, an incompatible major downgrade; changing fast-glob alone does not remove vulnerable braces. No verified compatible patch or drop-in replacement was established.

Exposure: development, lint and build/CI availability when malicious nested glob patterns reach this path. Resume/job data is not supplied as lint glob configuration. The audited production dependency graph excludes this chain, but that does not secure build infrastructure by itself. Likelihood is reduced by trusted fixed configuration; impact remains potential process/build denial of service. No claim of universal unreachability is made.

Controls retained: locked installs; reviewed configuration; read-only CI contents permission; no persisted checkout credentials; SHA-pinned actions; 15-minute job deadline; no production credentials for untrusted code; enforced production audit. These limit exposure and **do not patch the parser**. Install also reports four packages with install scripts not covered by npm allowScripts; no new scripts were approved. Review lifecycle-script policy separately before increasing trust.

The existing [owner decision form](DEPENDENCY_RISK_ACCEPTANCE_REQUEST.md) is the authoritative handoff. Owner must bind an explicit accept/defer/reject decision to the proposed release SHA and lockfile hash, document business justification/confirmed controls, remediation owner, monitoring, expiry and reassessment triggers. No signature or acceptance has been supplied. Until a safe remediation passes validation or the responsible owner explicitly accepts the scoped risk, the dependency gate remains open.
