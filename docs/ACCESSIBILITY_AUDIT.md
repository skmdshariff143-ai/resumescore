# Accessibility audit

## Scope and methodology

Playwright plus axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tags scans homepage, job input, extraction review, results, cover-letter dialog/result, skills, ATS, rewrites, critique, editing/export, history and privacy on desktop/mobile. Keyboard scripts exercise skip link, dialog focus/trap/Escape restoration and rewrite approval. Reflow checks use 320 px; reduced-motion preference is enabled. Existing tests cover errors, optional history and deletion.

## Findings and evidence

The first expanded run found real low-contrast secondary text on the homepage and dashboard, plus progress labels overflowing at 320 px. Secondary text was changed from slate-500/600 to slate-400 on affected dark surfaces; progress labels now wrap, and optional step navigation has keyboard semantics. A later desktop scan caught white text on the blue-500 button hover state; primary/signal hover backgrounds now use blue-700. Raw per-screen results are written to `v21-accessibility-desktop.json` and `v21-accessibility-mobile.json` on each scan. Final verification results are recorded in V2_1_RELEASE_READINESS.md.

## Limits and remaining work

Automated checks and scripted keyboard actions do not certify WCAG conformance. No human screen-reader/AT session, native print-dialog keyboard test, manual contrast survey of every state, browser 200/400% zoom or real iOS Safari testing was performed. Mobile Chromium emulation is not an iPhone interoperability test. Empty/default and tested generated-content states do not cover arbitrary resume content. Complete assistive-technology and cross-browser review before claiming accessibility compliance.

## Final run

28 browser tests passed overall. Axe reported zero violations across 14 named screens/states on desktop and the same 14 on mobile emulation. This includes the generated rewrite-review controls. Scripted keyboard/320px reflow checks passed. The local 320px layout screenshot was visually inspected; this does not replace native assistive-technology or exported-document review.
