# V3 UI/UX audit

Baseline: clean `feat/resumescore-v2`, `2bef33d5a430d85bf7250eda2b2e11945a01c9a3`. Existing unit/integration baseline: 148 tests across 25 files; production build passed. No user changes existed before this work.

## Evidence and diagnosis

Fresh production-mode screenshots: `.vercel/v3-baseline/{home,analyze,history,privacy}-desktop.png`, plus home/analyze mobile at 375px. Screenshots were opened and inspected before UI changes. Initial development captures showed a local Turbopack process failure and were replaced with actual production-mode captures; they were not accepted as UI evidence.

| Priority | Finding / source | Root cause and impact | Resolution / validation |
|---|---|---|---|
| P1 | Blank primary homepage CTA; `page.tsx`, `ui/Button.tsx` | Contradictory background/text utilities from caller and variant; white text on a white button. Invalid nested interactive link/button markup compounded semantics. | Link CTAs use shared action styles directly; readable CTA navigation and contrast tested. |
| P1 | Stale assessments; `analyze/page.tsx` | Editing extracted text, career profile, job mode or a job draft did not consistently invalidate old results. Late critique responses could attach to a newer assessment. | Invalidate input-dependent results, revision-check asynchronous work, submission guard, bounded critique timeout; browser regressions. |
| P2 | Dense, technical homepage and results | 9–11px labels, oversized hero, technical badges, repeated architecture sections, multiple derived score summaries. | New two-column hero, compact labeled sample, three-step workflow, evidence-focused overview and expandable dimension details. Scoring algorithms unchanged. |
| P2 | Inconsistent theme; globals, tokens and components | Hardcoded dark hex values and opaque utilities duplicated token values. External font CSS adds another request and fallback dependency. | Semantic light tokens, local system fonts, consistent component surfaces and status colors. |
| P2 | Mobile editor requires excessive scrolling | All fields and the preview always stacked. Section controls lacked consistent touch targets. | Mobile editor/preview controls, persistent draft, wrapped section actions; desktop split preview. |
| P2 | Crowded navigation and result tabs | Small type, long labels, technical branding; horizontal tab strip. | Responsive navigation with Escape dismissal; wrapped result controls with selected state. |
| P2 | Silent clipboard/export failures | Clipboard promise ignored; report failure only logged. | Actionable status/error feedback; async DOCX loading state. |
| P1 | Populated-history tablet overflow; `dashboard/VersionComparison.tsx` | Stress coverage reproduced 1859px document width at a 768px viewport. A comparison header retained automatic flex minimum width; conflicting wrap utilities prevented long filenames from shrinking. | Explicit minimum width zero and a single anywhere-wrap rule; all ten widths and saved-job deletion pass after correction. |

No page overflow was reproduced in the initial 375px home/analyzer baseline. The earlier universal reset problem was already fixed in V2; it was not reintroduced. V3 retains Tailwind Preflight layering and fixes actual flex wrapping/minimum sizing rather than clipping page overflow.

## Scope boundaries

All four public pages and analysis/editor/dialog/history components were inspected. No scoring weights, parsing rules, API security policy, external-AI consent or storage defaults were relaxed. Dark mode is deliberately deferred to keep one coherent, verified appearance. OCR and independently reviewed scoring/extraction calibration remain unavailable/pending as previously disclosed.
