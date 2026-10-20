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
