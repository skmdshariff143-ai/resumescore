# Final enterprise release decision

**NO-GO — EXTERNAL EVIDENCE REQUIRED. NO-GO — OWNER RISK DECISION REQUIRED.** Production remains unchanged; PR #1 remains draft. Final production authorization is also required after the mandatory gates close.

## Work completed

Preserved the V3 design/scoring/parsing/privacy architecture. Fixed cross-engine keyboard skip navigation; added Firefox/WebKit workflow, reflow/reduced-motion and strict runtime checks, including a deliberate-overflow control. Extended CI to execute the cross-engine suite. Extended the protected Preview runner with a whitelisted core/cross-browser selector and separate reports. Strengthened the offline evaluation: separate adjudication, full source-span disagreements, descriptive score/rank/reviewer metrics and honest null calibration/false-positive denominators. No scoring weights, candidate facts, provider activation or production settings changed.

The current evidence files contain commands, counts, failures, environment and source fingerprints. Failed cross-browser iterations are documented rather than erased. Local checks and post-publication GitHub/Preview evidence are distinct; exact commit/deployment/CI results obtained after committing are recorded in PR #1 and the final execution response. No future remote pass is assumed here.

## Evidence and limitations

Fresh install, unit/integration (159 tests/28 files), lint, TypeScript and production build passed. Full audit still reports five high development findings; production audit zero. Synthetic six-profile field/skill regressions repeat deterministically; independent reviewed holdout size remains zero, so external MAE/rank/agreement are null. The illustrative dataset revision mismatch is disclosed and cannot qualify as independent evidence. No licensed/consented corpus with authenticated independent labels was obtained from the three screened public candidates.

Final local browser runs: Chromium **46/46** in 389.55 s; Firefox/WebKit **72/72** in 109.26 s, with zero failed/skipped/flaky in those runs. Failed/interrupted development attempts remain disclosed in CROSS_BROWSER_VALIDATION.md. Zero uncaught exceptions were recorded in the final runs; this does not certify all browser or assistive-technology behavior.

No paid AI calls are authorized or made. The compiled lock remains false; deterministic analysis and labeled heuristic tools remain available. URL import remains unavailable with paste fallback and no arbitrary URL fetch, rather than claiming a connection-pinned SSRF-safe fetcher. Instance-local throttles are not claimed to be distributed protection. Live paid-provider/shared-budget activation remains outside this release.

## Required human actions

1. Appoint a data/review owner; authorize a de-identified document corpus and recruit two independent reviewers plus a separate adjudicator. Freeze rubric/engine/holdout/thresholds and execute the exact [handoff](../evaluation/HUMAN_REVIEW_HANDOFF.md). Authenticate and sign scoring and complex-extraction results, including relationships/reading order and supplemental unsupported fields.
2. Complete and sign actual NVDA/VoiceOver/native Safari/real-device and native PDF/Office export checks in [manual QA](MANUAL_ACCESSIBILITY_QA.md).
3. Resolve the braces chain with a tested compatible patch, or explicitly sign/defer/reject the scoped, expiring [dependency decision](DEPENDENCY_RISK_ACCEPTANCE_REQUEST.md). Codex has not accepted the risk.
4. After all gates pass, provide explicit production authorization bound to the reviewed candidate. Follow [the runbook](PRODUCTION_DEPLOYMENT_RUNBOOK.md); do not infer authorization from Preview publishing.

No additional cosmetic or unrelated product features are proposed. The [gate matrix](FINAL_RELEASE_GATE_MATRIX.md) identifies exactly why CI success alone cannot authorize production.
