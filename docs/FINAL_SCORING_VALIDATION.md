# Final scoring validation

## Scope and method

Independent validation remains **pending**. The repository contains authored synthetic expectations, not independently labeled or consented candidate data. No new human labels, recruiter ratings or fairness claims were invented. The executable offline package is described in [evaluation/README.md](../evaluation/README.md).

`npm run evaluate:release` evaluates `evaluation/synthetic.json`; `RESUMESCORE_EVALUATION_DATASET` selects an authorized private corpus. The strict Zod manifest bounds records/text/labels, checks exact UTF-16 source spans and source documents, rejects duplicate IDs/reviewers and conflicting evidence labels, requires two declared independent reviewers for non-synthetic records, and retains disagreements/adjudication references. Declaration checks cannot authenticate licensing, consent or reviewer independence.

The runner measures canonical field/skill/requirement TP/FP/FN, evidence classifications, repeated scores, isolation of general quality from job alignment, recommendation counts and profile-level holdout score errors against mean reviewer ratings. Empty denominators remain null. It records dataset/source/dependency fingerprints and actual/declared engine revisions, flags modified engine inputs, and exports no candidate text, extracted field values, quotes or reviewer identities. Outputs default to ignored `.vercel/release-evaluation.json`; private inputs are never committed.

## Actual results

- Full unit/integration check: **148 tests / 25 files passed** at the implementation checkpoint. Six evaluation tests separately passed after evidence de-duplication; their abnormally long wall-clock interval is not a performance result.
- Six engineered records cover all six career profiles and engineering/data/business/finance/marketing/healthcare sectors.
- Name, email, degree, institution, project name and project description: 36 true positives, zero false positives/negatives. Sections: 18/18. Skills and required job skills: 13/13 each, zero false positives/negatives, **only in these small synthetic examples**.
- Company/role denominators in the new sample are zero and therefore reported null, not 100%. Existing engineered employment/parser tests remain separate.
- Identical-input score deltas and job/general-quality deltas were zero in all six. Evidence classifications are de-duplicated per canonical skill; these are engineered labels, not independent proficiency judgments.
- No reviewed holdout samples exist; per-profile mean absolute/signed calibration error remains null. Profile counts do not prove fairness.

## Limitations and human-review requirements

Public dataset-card screening on 2026-10-20 did not establish project-specific independent calibration: [BrainHR+](https://huggingface.co/datasets/mounimzad/brainhr-plus/blob/main/README.md) describes a synthetic demonstration set and CC-BY-NC license; [role-radar](https://huggingface.co/datasets/oksomu/role-radar-dataset) declares human-reviewed matching pairs but uses synthetic profiles and a different matching rubric; [ResumeExtractBench](https://huggingface.co/datasets/Careerflow/ResumeExtractBench) offers CC-BY extraction examples, including synthetic distractors, rather than ResumeScore quality ratings; the [combined resume-parser corpus](https://huggingface.co/datasets/md-zain/resume-parser-dataset) explicitly lacks a blanket source license and may contain personal information. Only cards were inspected; no candidate corpus, external labels or documents were ingested or reported as validated. These are possible future evaluation inputs after provenance, purpose and label mapping review, not evidence that independent data is universally unavailable.

Two verified independent reviewers must blindly annotate authorized/de-identified documents, including varied quality, actual employment/education associations, negative skill controls and diverse layouts. Freeze code/rubric and calibration/holdout split; pre-register sample sizes and acceptable error/disparity bounds with the release owner before tuning. Preserve both reviews and adjudication, private license/consent evidence and recommendation-grounding judgments. The owner must authenticate these artifacts and approve the results.

Field metrics use unique canonical values, not entity associations or repeated occurrences. Company/role pairing errors can escape these metrics. Same-line evidence and career heuristics remain limited; no numerical score is a hiring probability. Report status deliberately remains `pending-provenance-and-release-owner-review`, even for schema-valid declared human labels. This package enables review; it does not manufacture independent validation.
