# Independent document extraction evaluation

Status: **BLOCKED — independently verified document references unavailable.** Synthetic extraction and export regressions are executable; commercial ATS/Office interoperability and independent layout accuracy are not verified.

## Actual scope and results

The fresh unit suite runs generated single-column, two-column, table, multi-page, empty, image-only, password-protected and corrupt PDF cases; DOCX export/reimport, ZIP/XML limits, Unicode and long-content cases; TXT/paste and misleading-format validation. In the measured PDF set, name/email were detected in all four text-bearing layouts. Column/table layouts were flagged as degraded, not guaranteed correct reading order. Empty/image-only documents produced zero text and failed quality; protected/corrupt inputs were rejected. DOCX round trips retained 1/1 and 100/100 repeated synthetic content occurrences. See enterprise-document-measurements.json for actual timings and fields. No OCR is implemented; use text-based originals or paste corrected text.

The six-sector text benchmark matched 36 authored scalar field labels, 13 skills and 18 sections with zero FP/FN on those fixtures. Company/role counts in that specific corpus are zero, so their precision/recall are null. These text results do not measure geometric PDF reading order, employment associations or all international date/phone variants. No real candidate information was imported.

## Independent reference protocol

Use the private handoff in `evaluation/HUMAN_REVIEW_HANDOFF.md`. Retain authorized source bytes, SHA-256, layout class, file type, expected support/rejection, reference transcription and stable page/block ordering. Include single/multiple columns, tables, headers/footers, long/Unicode documents, international contacts, date variants, certifications, unusual DOCX structures and expected scan/corrupt failures. Two independent reviewers must transcribe fields and associations before seeing extraction; preserve disagreements for a third adjudicator.

The current evaluator covers eleven canonical text fields, field TP/FP/FN, evidence confusion and per-profile summaries. It does **not** automatically quantify phone/date/certification accuracy, employer-role association correctness, geometric reading order or corpus-level document-failure rates. For the external study, keep a private supplemental table per source: field/reference/prediction/TP-FP-FN; parent entity ID for role/company/date/education/project relationships; reference and predicted block sequence; expected and observed support/failure. Report missing-field frequency as documents missing an expected field divided by documents containing that field, reading-order inversions only on matched blocks with omissions separately reported, and unexpected failure rates separately from correct unsupported-document rejection. Do not combine those denominators or infer them from set accuracy.

Run actual app extraction on the frozen candidate, reconcile each wrong assignment, add regression fixtures only with permission, and obtain a signed reference/result review. The supplemental corpus and genuine labels remain external work; neither the synthetic suite nor dataset declarations satisfy this mandatory gate.
