# Accessibility validation

Scope: public pages, upload/review, profiles, general/job results, editor, comparison, history/deletion, export and consent. Automated evidence and manual assistive-technology evidence are separate.

New regression: the main skip target lacked programmatic focus in Firefox. `main` now has `tabIndex=-1`; the skip anchor explicitly has `tabIndex=0` so WebKit includes it in ordinary Tab navigation. No positive tab indices, hidden overflow fixes or scoring changes were introduced. Cross-engine tests verify keyboard focus transfer, public-page reflow and reduced-motion mode at 320/390/768/1440 requested viewport widths. Windows WebKit DPI/emulation changes the effective CSS viewport; diagnostics preserve actual root dimensions.

Existing axe journeys cover the analyzer/results/editor/history/privacy and other major states in the Chromium suite. Cross-engine workflow checks also execute axe on the analyzer. Exact counts/results and failed iterations are in enterprise-validation-evidence.json and CROSS_BROWSER_VALIDATION.md. This is not WCAG certification; DOM accessible names do not prove speech output or comprehensibility.

**Genuine NVDA/VoiceOver testing: PENDING.** NVDA was not installed/running in the inspected supported paths, and this environment offers no native assistive-technology control. No speech or manual screen-reader pass is claimed. Native Safari/real touch devices, Windows high contrast and browser print pagination also require manual evidence.

Required manual session (record OS/browser/AT versions, candidate SHA, result and defect IDs):

1. Tab from the address bar to the visible skip link; Enter moves focus to main. Complete desktop/mobile navigation and Escape closure with visible focus.
2. Upload valid/invalid/scan files; confirm format, loading, error and correction announcements. Read all input labels/profile choices and validation instructions.
3. Complete general/job analysis without mouse; confirm score/result status announcements and separate quality/match meanings. Check expanded evidence and recommendation reading order.
4. Edit sections, reorder, compare, undo/reset; confirm focus is retained and edits are never silently accepted. Review heuristic suggestion approval and consent labels.
5. Opt in to history, reopen, delete one/all, and confirm deletion announcements plus absence after reload. Export TXT/DOCX/PDF and check names, link behavior and focus after dialogs.
6. Test 200%/400% browser zoom and narrow reflow, reduced motion, focus contrast, forced colors and all meaningful validation/error states. Record any native print clipping or missing text.

An accessibility reviewer must execute and sign these cases on actual assistive technology before this mandatory gate closes.
