> Publication release policy: `next.config.ts` forces `AI_PAID_ENABLED=false` in compiled builds regardless of remote environment values. Paid AI controls are disabled and labeled in the UI. Removing this lock requires a separately reviewed release.

# ResumeScore

ResumeScore helps candidates review resume text, understand heuristic quality and job-alignment scores, edit their documents, and export improved versions. It does not predict hiring outcomes, certify ATS compatibility, or independently verify qualifications.

**V2.1 status: release hardening in progress; paid AI defaults disabled.** See [V2.1 readiness](docs/V2_1_RELEASE_READINESS.md). See [implementation status](docs/IMPLEMENTATION_STATUS.md) and [deployment readiness](docs/DEPLOYMENT_READINESS.md). This branch has not been deployed.

## Features

- PDF, DOCX, UTF-8 TXT and pasted text, with extraction review before scoring.
- Browser-only deterministic analysis by default; optional server processing.
- Six career-level weight profiles, evidence explanations and separate general-quality/job-alignment scores.
- Required/preferred/optional job terminology, with reduced credit for unsupported mentions.
- ATS readability estimates with explicit limitations.
- Local section editing, reordering, undo/reset, original-text comparison and live preview.
- TXT and DOCX downloads; PDF through browser print. Review pagination before sharing.
- Optional Claude/Gemini critique and cover-letter drafts, with external-processing consent. Heuristic functionality works without provider keys.
- Opt-in local history, JSON export, deletion and reopening saved resume text.

![Resume workspace with synthetic example](docs/screenshots/workspace-desktop.png)

## Architecture and stack

Next.js 16.4.2, React 19, TypeScript, Tailwind 4, PDF.js, Zod, zip.js, docx, Vitest, Playwright and axe. Server AI providers use the Anthropic and Google GenAI SDKs. No database or account service is required.

Browser extraction → review → shared deterministic parser/scorer → evidence dashboard → local section editor/export. Optional server/AI paths are explained before use. See [architecture](docs/ARCHITECTURE.md) and [scoring methodology](docs/SCORING_METHODOLOGY.md).

## Local development

Use Node.js 22 or newer with npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No provider key is required for deterministic functionality.

Optional server-only configuration in `.env.local`:

```dotenv
ANTHROPIC_API_KEY=your-key
# Or:
GEMINI_API_KEY=your-key
# GOOGLE_API_KEY is accepted as a Gemini fallback.
# GEMINI_MODEL can select the configured Gemini model.
```

Never prefix provider keys with `NEXT_PUBLIC_`. Provider selection is Anthropic, then Gemini, then heuristic. Model availability and provider billing/retention must be verified for the deployment; this change did not perform successful live provider calls. Explicit consent is required before external processing even if keys are present.

## Security and privacy

Browser-only analysis sends no resume or job text to application APIs. Server analysis does transmit text to ResumeScore. Cover-letter generation is server-based and discloses this separately. External AI requires opt-in; provider retention depends on the configured account. XML prompt delimiters and JSON schemas do not guarantee injection resistance or factual accuracy.

History saving defaults off. Enabled history stores full text in this browser until deletion. Export/delete controls are on History. The application does not intentionally persist server request bodies or log raw provider errors. Hosting metadata retention requires operational review.

API requests have byte, string, collection, nesting, origin and read-time limits. General endpoint throttling remains process-local. Paid AI additionally requires a shared atomic Redis budget; missing configuration or storage failure disables paid calls. Arbitrary job URL import is disabled until restricted egress can be configured; paste the job description instead. See [security and privacy](docs/SECURITY_AND_PRIVACY.md).

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

Windows with Edge already installed:

```powershell
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:e2e
```

Vitest uses one thread to avoid the observed Windows sandbox temporary-file issue. The older `npm run verify:e2e` command is an API smoke script, not the browser E2E suite. See [test report](docs/TEST_REPORT.md) for measured results and exact limitations. CI includes type checks, lint, tests, build, browser/accessibility tests and production dependency audit.

## Deployment

Existing production: https://resumescore-phi.vercel.app/

No push, merge, deployment, environment change or domain change is included. Before deployment, address the release gates in [deployment readiness](docs/DEPLOYMENT_READINESS.md), especially distributed AI budget controls, factuality evaluation and operational retention. Deploy only after explicit approval.

## Limitations and roadmap

- Scoring remains an editorial, predominantly technical rubric; no independent calibration or hiring-outcome validation exists.
- DOCX extracts main document paragraphs; headers, footers, images, text boxes and table order need review. No OCR.
- PDF print pagination and DOCX layout need manual review across Word, LibreOffice and browsers.
- AI drafts require fact checking; semantic factuality is not guaranteed.
- The Redis budget adapter requires configured infrastructure and live multi-instance validation before paid AI activation. Heuristic fallback remains available.
- Accessibility automation is scoped and does not certify WCAG compliance or replace screen-reader testing.
- Broader domain taxonomies, independently reviewed extraction/matching benchmarks, calibrated candidate profiles and per-role evaluation remain future work.

## V2 changes

Security containment, consent and local analysis; bounded file/API processing; truthful heuristic outputs; career rubrics; evidence-aware matching; editing/export; history opt-in; privacy documentation; accessibility fixes; security dependency updates and browser tests. The [audit](docs/RESUMESCORE_V2_AUDIT.md) records original findings, and [implementation status](docs/IMPLEMENTATION_STATUS.md) distinguishes finished, partial and unverified work.

## V2.1 hardening

Source-provenance rewrite checks and explicit approval, shared fail-closed AI budgets, conservative provider fallback, evidence-based skill limits, negation handling, PDF worker cleanup, export links and broader journey tests. See [AI controls](docs/AI_COST_CONTROLS.md), [factuality evaluation](docs/AI_FACTUALITY_EVALUATION.md), and [baseline](docs/V2_1_BASELINE.md). Configure from `.env.example`; a provider key alone never enables paid calls.
