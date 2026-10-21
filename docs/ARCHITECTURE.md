> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Architecture

ResumeScore is a Next.js App Router application with React, TypeScript and Tailwind. It has no user accounts, database or cloud resume storage.

## Processing

1. `FileUpload` validates PDF magic bytes, DOCX archives or UTF-8 TXT, enforces 5 MB, and extracts PDF text with a same-origin bundled PDF.js worker. PDFs are limited to 20 pages. Scanned PDFs require pasted text; no OCR is implemented.
2. The user reviews and corrects extracted text. PDF extraction warnings and layout estimates accompany the analysis.
3. Browser-only mode dynamically imports the parser, job parser and deterministic scoring engine. It sends no resume or job payload to application APIs.
4. Server mode posts to `/api/analyze`. The same scoring implementation is used in both modes.
5. AI endpoints default to deterministic heuristics. `x-ai-consent: true` permits configured Claude/Gemini selection. The header is a privacy choice, not authentication.
6. History is written to browser localStorage only when enabled for an analysis. Existing history remains readable, exportable and deletable.
7. The editing workspace preserves source text in sections. Editing, undo, reorder, reset, comparison, TXT export and printable HTML run locally. Browser print supports PDF output; the docx library produces structured DOCX downloads. DOCX input uses bounded zip.js extraction of main document XML without following external relationships.

## Boundaries

`validation/request.ts` checks JSON content type, origin, bytes, depth, collection sizes and request read timeout before domain Zod validation. Error logs contain event names, not user input or provider payloads. `/api/extract-job` never performs a network fetch and returns an explicit unavailable response. Secure restricted egress is not configured.

Rate limiting is process-local and bounded. It is not a distributed cost-control solution. External AI generation remains optional and is not proven fact-preserving merely because it passes a JSON schema. Delimiters are not a security boundary.

## Verification

Vitest covers core logic and API boundaries. Playwright exercises local production builds on desktop and mobile Chromium with axe accessibility checks. Browser tests use synthetic resumes. They do not certify production infrastructure, every document layout, every browser, or all WCAG criteria.
