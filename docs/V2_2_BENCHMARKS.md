# V2.2 benchmark report

## Scope and reproducibility

Run `npm test`, or `npx vitest run src/__tests__/v21-benchmarks.test.ts src/__tests__/v22-benchmarks.test.ts src/__tests__/v22-intelligence.test.tsx`. Fixtures are author-created fictional resumes in `src/__tests__/fixtures/domain-resumes.json`. Expectations are engineered labels, not recruiter judgments. Current outputs use `docs/v22-*.json`; historical V2.1 measurements are preserved.

## Measured results

- Six sectors: mechanical engineering, data, business, finance, marketing and healthcare; six career profiles.
- Name/email/degree/institution/project name/project description: **36/36** expected fields matched.
- Recognized skills: **13 true positives, zero false positives and zero false negatives** in these six fixtures (precision/recall 1.0 for this small set only).
- Section precision/recall: 1.0 in all six existing regression fixtures. Equivalent section reordering changed overall scores by **0** in all six.
- Three employment fixtures retained their expected employer, role and date range; zero unexpected roles in the three project-only fixtures.
- Five engineered evidence controls include positive, mention-only, negation, learning intent and absent skill. New tests cover unsupported vs demonstrated taxonomy relationships and optional-only requirements.
- Six generated PDF layouts: single column, columns, table, multiple pages, empty and image-only. Four text-bearing layouts retain the expected name/email; empty/image-only report failed extraction. Password-protected and corrupt PDFs are rejected. No OCR is claimed.
- DOCX short/long exports preserve **1/1 and 100/100** repeated Unicode records and hyperlink XML. Browser PDF/DOCX round trips are separately part of E2E, including all 100 long-PDF records.

Evidence: `v22-field-benchmark.json`, `v22-scoring-measurements.json`, `v22-evidence-measurements.json`, `v22-document-measurements.json`.

## Independent evaluation protocol — pending

Recruit two reviewers who did not author the fixtures/rubric. Use only consented, de-identified or appropriately licensed documents. Freeze the engine commit and split calibration/holdout samples before tuning. Reviewers label source spans for fields/sections/skills and independently rate content quality, relevance, evidence strength and readability; disagreement is retained and then adjudicated. Record reviewer IDs, license/provenance, rubric version and adjudication separately from engine outputs.

Report field/skill precision and recall with denominators, negative controls, per-sector errors and inter-reviewer agreement. Evaluate score agreement on held-out examples only after labels exist. No human-reviewed dataset or agreement measurement exists here; **independent calibration remains pending**. These small synthetic measurements cannot establish real-world parsing accuracy or fairness.
