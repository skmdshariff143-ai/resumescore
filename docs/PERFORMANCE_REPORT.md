# Performance report

## Scope and methodology

Repeatable local production-build measurements run in `e2e/v21.spec.ts` on Edge Chromium desktop and mobile emulation. No CPU/network throttling; one sample per project. The test records navigation DCL/load time, JavaScript resource transfer bytes, Chromium used-JS-heap snapshot, analysis-to-visible-result elapsed time, and DOCX-click-to-download elapsed time. Unit benchmark files record parsing/scoring and PDF/DOCX timings.

## Actual results

All emitted JavaScript chunk sizes (including lazy chunks) are separately recorded in `v21-bundle-measurements.json`; they are not initial download bytes. Raw measurements are in `v21-performance-desktop.json`, `v21-performance-mobile.json`, `v21-scoring-measurements.json` and `v21-document-measurements.json`. These are local measurements, not Lighthouse, Core Web Vitals or production p95 claims. Transfer size includes requested script resources for the tested journey, not total repository bundle size. UI elapsed times include Playwright waiting and rendering.

## Changes, limits and remaining work

PDF worker cleanup fixes retained parsing resources; lazy DOCX loading is preserved. No dependency was added for this iteration. Heap snapshots are approximate Chromium values, not peak memory during parsing. Cached imports affect warm/cold comparisons. Live AI latency is blocked by budget configuration. Establish repeated cold/warm runs, real low-end mobile devices, slow-network conditions, parsing peak-memory instrumentation and production operational measurements before setting service-level targets.

## Recorded local samples

| Project | DCL ms | Load ms | Analysis UI ms | DOCX download ms | JS transfer bytes | Heap snapshot bytes |
|---|---:|---:|---:|---:|---:|---:|
| desktop | 858.2 | 1148.0 | 570.8 | 568.9 | 219602 | 7740851 |
| mobile | 621.6 | 645.2 | 599.7 | 522.0 | 219602 | 7840965 |

Local Node v24.21.0/npm 11.19.0. Unit document timings may overlap other validation processes; they are not isolated performance experiments. No production service-level claim follows from these samples.
