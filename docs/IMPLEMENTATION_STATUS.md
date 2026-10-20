> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Implementation status

The full V2 request is **partially completed**. A working security/privacy and workflow upgrade is implemented locally; it is not a certification of production readiness.

| Major feature | Status | Scope / limitation |
|---|---|---|
| Audit and baseline | Completed and tested | Initial findings and baseline failures recorded; production configuration not inspected |
| SSRF containment | Completed and tested | URL import explicitly unavailable; manual job input retained |
| Request validation/error privacy | Completed and tested | Bounded JSON/shape, concrete nested links, safe errors and origin checks |
| Distributed abuse/budget control | Blocked | Requires infrastructure/configuration approval; current limiter is process-local |
| Browser-only analysis | Completed and tested | Default mode; browser tests assert no API payload requests |
| Consent/history opt-in | Completed and tested | Server AI opt-in, saving off by default |
| PDF/TXT/paste extraction review | Completed and tested | Signature/size limits, text correction, image-only fallback |
| DOCX ingestion | Completed and tested | Bounded archive/XML parsing and desktop/mobile round-trip tests; main body paragraphs only |
| OCR | Not started | Image-only documents require pasted text |
| Career levels | Partially completed | Six weight profiles; student/intern academic substitution; not independently calibrated |
| Explainable scores | Partially completed | Evidence/confidence/weights and separate quality score; technical/domain biases remain |
| ATS readability | Partially completed | Extraction diagnostics propagated; not comprehensive layout/date/table validation |
| Job matching | Partially completed | Required/preferred/optional parsing fixed, mentions receive less credit; broad domain validation pending |
| Heuristic factuality | Completed and tested | Rewrites preserve original content; neutral source-derived cover letters |
| Claude/Gemini | Implemented but not fully verified | Consent, timeouts, bounds, safe errors; no successful live calls or semantic factuality benchmark |
| Section editor and comparison | Completed and tested | Edit/add/remove/reorder/undo/reset, live preview and original comparison |
| TXT export | Completed and tested | Browser download |
| PDF export | Completed and tested | Selectable print-PDF re-upload passes; manual pagination and other browsers remain unverified |
| DOCX export | Completed and tested | Structured paragraphs with Unicode; desktop/mobile round-trip tests; manual Word/LibreOffice fidelity remains unverified |
| History export/deletion | Completed and tested | Existing local controls preserved, opt-in saving tested |
| Reopen history | Implemented but not fully verified | Saved text loads for review; prior job context is not fully restored |
| UI/accessibility | Partially completed | Spacing reset fixed, labels/contrast/focus/reduced motion; automated checks scoped to tested pages |
| Independent benchmarks | Not started | Synthetic regressions are not independent accuracy measurements |
| SEO/security headers | Implemented but not fully verified | Correct canonical host, sitemap/robots/privacy, no-store and security headers; production not inspected |
| Deployment | Blocked | Explicit approval required; no push/merge/deploy performed |

Remaining P1: semantic AI factuality, distributed AI budget control, domain/scoring validity and representative extraction benchmarking. Remaining P2: broader document fidelity, full structured field editing, target-role taxonomy, comprehensive accessibility/performance verification and provider-aware retention configuration.
