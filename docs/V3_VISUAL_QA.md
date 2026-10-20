# V3 visual QA

## Evidence and method

Baseline production screenshots were captured and opened before implementation under `.vercel/v3-baseline`. V3 screenshots use real application state populated with fictional resume text; no customer resumes or authenticated request headers are included. Baseline and redesigned home/analyzer/history/privacy were inspected visually; results/editor/skills/ATS states were inspected from browser artifacts.

Playwright tests reflow all public pages and six result/editor states at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 CSS pixels. They compare document scroll width with viewport width and assert visible headings, functional CTAs and mobile preview continuity. Screenshot capture disables motion and uses CSS pixel scale. Full-page captures reset scroll to avoid sticky-header capture artifacts.

## Findings

- Baseline blank white CTA replaced by a readable blue link with correct navigation semantics.
- Technical dashboard illustration replaced by a labeled, restrained fictional sample.
- Light semantic surfaces, readable text, wrapping controls and consistent navigation throughout.
- Overview emphasizes quality, separate job alignment, inferred confidence, strengths and next actions. Evidence details are expandable.
- Editor keeps fields and preview together on desktop; mobile switches views without losing edits.
- Empty history shows one useful state; populated history handles long filenames and named delete controls.
- No page overflow masking was added. Wide comparison tables retain a local scroll region.

Selected baseline/final screenshots are published in `docs/screenshots/v3/`; complete run artifacts remain in ignored `.vercel/` directories. These checks combine structural visual invariants and manual screenshot review, not a cross-platform pixel-golden suite.

## Accessibility and limits

The first full journey audit recorded zero axe violations at all 14 states in each project. Includes homepage, upload/job input, review, results, cover-letter dialog/draft, skills, ATS, improvements, critique, editor, rewrite approval, history and privacy. Skip-link keyboard focus, dialog containment/Escape/return focus, explicit rewrite approval, reduced motion and mobile-menu Escape are exercised.

Final focused local V3 suite: 10/10 passed. Public pages, six result/editor views and populated history fit all ten widths. Additional checks verify aligned logo/hero edges, real CTA navigation, mode changes and explicit mobile preview switching. Final editor/contact-review and homepage/history axe assertions reported zero violations.

Single light theme; optional dark mode deferred. Automated contrast/semantics checks and browser keyboard tests do not verify screen-reader speech, every zoom combination, physical touch devices or all browser engines. Hosted/Preview evidence is appended after execution.

## Final implementation evidence

Commit `02251d4`: **46/46 Linux hosted browser cases and 46/46 Windows/Edge protected-Preview cases passed** after the contrast correction. Remote run produced **204 screenshots**; both 14-state journey reports had **zero violations**. Additional strict axe checks cover homepage/sample controls, the expanded editor/contact review, and populated history. All ten requested widths passed public-page, result/editor and long-filename history checks.

Selected repository artifacts: `screenshots/v3/hero-desktop.png`, `home-desktop.png`, `home-mobile.png`, `analyze-mobile.png`, `results-desktop.png`, `editor-desktop.png`; baseline screenshots are prefixed `before-`. Full final remote artifacts: `.vercel/v22-runs/run-1/test-results`; first V3 remote run retained in `.vercel/v3-preview-b6db459`. The appearance is unchanged by the final motion-only correction.

Measured single samples through authenticated Node transport: desktop/mobile analysis UI elapsed **186.9/312.4ms**, DOCX download **360.6/349.5ms**. These are not Lighthouse scores, controlled mobile benchmarks, production-network latency or performance SLOs. Full resource/memory samples and their environment caveats are in the evidence JSON. No performance improvement percentage is claimed.
