# V2.1 baseline

Branch: feat/resumescore-v2
HEAD: 79a373c8acc3d234c04e21010598ef9f93764bcf

All existing changes are uncommitted V2 work and are preserved. No commits, stashes, resets or production changes authorized.

## Verification

Executed before V2.1 code changes on 2026-10-20:
- npm test: 103 tests, 17 files passed (10.42 seconds).
- npm run typecheck: passed.
- npm run lint: passed.
- npm run build: passed, Next 16.4.2; local elevated build workers required.

Prior browser and audit results are historical, not reverified at this baseline.

## Inspected risks and deployment

Read every existing docs/*.md deliverable and inspected all three AI routes and both SDK providers. Paid calls lack distributed budgets; generated content has no post-generation fact verification. Matching action-word detection lacks negation handling. Independent scoring calibration, broad document compatibility, performance and full-journey accessibility remain unverified.
Vercel/Next App Router, server-only provider credentials, no database or authentication. Job URL retrieval is disabled. Browser deterministic analysis is default. Existing CI runs lint/typecheck/tests/build/browser checks. No deployed environment settings were inspected or altered.

## Working tree snapshot

~~~text
 M .github/workflows/ci.yml
 M .gitignore
 M README.md
 M next.config.ts
 M package-lock.json
 M package.json
 M src/__tests__/adversarial.test.ts
 M src/__tests__/claude-provider.test.ts
 M src/__tests__/gemini-provider.test.ts
 M src/__tests__/impact.test.ts
 M src/app/analyze/page.tsx
 M src/app/api/ai/cover-letter/route.ts
 M src/app/api/ai/critique/route.ts
 M src/app/api/ai/rewrite/route.ts
 M src/app/api/analyze/route.ts
 M src/app/api/extract-job/route.ts
 M src/app/globals.css
 M src/app/history/page.tsx
 M src/app/layout.tsx
 M src/app/page.tsx
 M src/components/FileUpload.tsx
 M src/components/Footer.tsx
 M src/components/Navbar.tsx
 M src/components/ScoreCard.tsx
 M src/components/analysis/CoverLetterModal.tsx
 M src/components/analysis/JobMatchInput.tsx
 M src/components/analysis/ResumeRewritePanel.tsx
 M src/components/ui/EvidenceRow.tsx
 M src/components/ui/StepIndicator.tsx
 M src/lib/ai/claude-provider.ts
 M src/lib/ai/gemini-provider.ts
 M src/lib/ai/provider.ts
 M src/lib/impact/impact-evaluator.ts
 M src/lib/jobs/job-parser.ts
 M src/lib/keywords.ts
 M src/lib/matching/semantic-matcher.ts
 M src/lib/parsing/pdf-extractor.ts
 M src/lib/parsing/resume-parser.ts
 M src/lib/scoring/scoring-engine.ts
 M src/lib/storage/history-store.ts
 M src/types/index.ts
 M vitest.config.mts
?? docs/
?? e2e/
?? playwright.config.ts
?? src/__tests__/api-security.test.ts
?? src/__tests__/docx.test.ts
?? src/__tests__/fixtures/
?? src/__tests__/v2-boundaries.test.ts
?? src/__tests__/v2-workflow.test.ts
?? src/app/privacy/
?? src/app/robots.ts
?? src/app/sitemap.ts
?? src/components/analysis/ResumeWorkspace.tsx
?? src/lib/export/docx-resume.ts
?? src/lib/export/resume-document.ts
?? src/lib/parsing/docx-extractor.ts
?? src/lib/parsing/file-validation.ts
?? src/lib/rate-limit.ts
?? src/lib/scoring/rubric.ts
?? src/lib/validation/
?? tools/test-burst-ratelimit.js

~~~

## Deployment configuration follow-up (read during hardening)

Origin matches github.com/skmdshariff143-ai/resumescore. Unchanged tracked vercel.json uses framework nextjs, build command npm run build, output .next and iad1 region. No local .vercel/project.json link exists; no cloud variables or production settings were read or changed. Local validation ran on Node v24.21.0 and npm 11.19.0, while CI targets Node 22.
