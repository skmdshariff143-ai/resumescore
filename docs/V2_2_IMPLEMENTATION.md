# V2.2 implementation

Baseline: clean `feat/resumescore-v2`, HEAD `ca8873540bfd753f64f7f2ebaf0be81966842a37`. All V2/V2.1 work retained. No production changes, new services, runtime dependencies or paid AI activation.

## Implemented

- Protected-preview harness: origin-scoped OIDC stays in Node; redirects are manual. Native cancellable transport replaces Playwright's buffered request transport. Teardown aborts outstanding prefetches. Browser compression/conditional headers are normalized. Failed immutable-asset and known page GET connections may retry once, within the same 30-second deadline; APIs and test cases never retry. Fault-injection tests cover recovery, bounds, origin isolation, manual redirects and forbidden replays. The release gate requires all requested runs to complete.
- PDF tests render in an isolated page instead of replacing a live Next.js document. Rewrite checks await the actual API response. Assertions wait for UI state; remote budgets cover the bounded transport. Diagnostics contain paths/status categories only.
- Fixed four reproduced regressions: zero job score displayed as 78; non-software project action lines split into titles; unsupported taxonomy mentions labeled transferable; bonus-only jobs polluted by candidate skills.
- Job alignment weights required/preferred/optional terms at 1/0.5/0.25 and evidence at demonstrated/transferable/mentioned = 1/0.6/0.3. Unrecognized requirements display unavailable, not invented coverage.
- Early-career readability band is 180–900 words; other profiles retain 350–900. Projects contribute achievement evidence. Portfolio and code-profile links receive equal link credit. No ownership/complexity is inferred from tool count or “architected.”
- Recommendations use actual rubric deficits and source evidence. Missing measurements no longer produce instructions to invent metrics. Failed extraction and absent evidence lower confidence.
- Builder: named section selection; local same-profile/job score comparison; per-dimension deltas and evidence; job-gap review; invalidation after edits/undo. Existing editing, reordering, reset, explicit rewrite approval and exports remain.
- Homepage examples preserve the supplied facts. Fictional dashboard data is explicitly labeled. No new numerical achievements or technologies are added by rewrite examples.
- Bounded server-analysis timeout and actionable chunk-loading error retain user text. Private Vercel/test artifacts are excluded from lint.

## Validation and limits

See V2_2_TEST_REPORT.md and V2_2_BENCHMARKS.md. UI changes were reviewed using the Vercel React checklist: stable hooks, event-driven calculations, no per-keystroke scoring, bounded undo, semantic forms/table/status, existing CSS and no added dependencies.

The benchmark foundation is synthetic, not independent recruitment validation. Theme switching, broader multilingual parsing, OCR, manual assistive-technology sessions and cross-reader visual export certification are not implemented by this iteration. Existing paid AI/distributed budget activation remains separately gated.
