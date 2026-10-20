# Offline review package

`npm run evaluate:release` runs six **engineered synthetic** records in `synthetic.json`. It does not perform independent validation. No real candidate records or reviewer labels are included. Existing document benchmarks cover layouts and failures separately.

To evaluate authorized private data in PowerShell:

```powershell
$env:RESUMESCORE_EVALUATION_DATASET = 'E:\private-evaluation\dataset.json'
npm run evaluate:release
Remove-Item Env:RESUMESCORE_EVALUATION_DATASET
```

Use a private directory outside Git, or ignored `evaluation/private/`. The input must be JSON under 8 MB and conform to `EvaluationDatasetSchema` in `src/lib/evaluation/release-evaluation.ts`. There is no network request, external AI or candidate-text logging. The report is written to ignored `.vercel/release-evaluation.json`. Invalid external input produces a sanitized error. Review aggregated output before sharing; do not commit real candidate input, private consent evidence or identifying record IDs.

## Human review process

1. A responsible data owner must approve licensing/consent, de-identification, retention/deletion and the evaluation purpose. Reference this approval in each record's `source.reference`; retain the actual evidence privately. Only use `licensed`/`consented-anonymized` when true. Changing a synthetic record's provenance does not make it independent.
2. Recruit at least two reviewers independent of engine/rubric implementation. Verify their identities and independence outside this file; put pseudonymous IDs in `reviewers`. Software checks declarations, not their truth.
3. Freeze the engine SHA and rubric, declare the target sectors/profiles/styles/quality bands, split calibration and holdout documents before tuning, and have the release owner pre-register sample sizes and acceptable precision/recall/error/disparity bounds. No universal pass threshold is invented by this package. Include negative skill examples and mixed-quality documents, real employment pairs and projects.
4. Blind reviewers to engine outputs. Independently label every supported field, including explicit absence, and preserve exact source quotes with zero-based UTF-16 `[start,end)` offsets. `value` is the reviewer-selected canonical value, while `quote` must exactly match the source. `requiredSkill` spans come from `jobText`; other spans come from `resumeText`. Optional evidence states are mentioned/demonstrated/transferable/missing. Missing requirements can be labeled on job spans; they must not be invented in the resume.

   For section labels, use the canonical type (`summary`, `experience`, `education`, `skills`, `projects`, `certifications`, `awards`, `publications`, `other`) as `value`, and the actual heading as `quote`. Alias headings are therefore compared by section type rather than punctuation/title spelling.
5. Retain both independent `reviews[].labels` and quality ratings. `labels` contains the agreed/adjudicated set. Semantic label disagreements require an independent adjudicator ID and private decision reference. Exact field/value/evidence-set agreement and rating spread are reported; quote-boundary agreement is not currently measured. Adjudication does not erase disagreement.
6. Apply `quality-v1` consistently: rate source content quality 0–100 using the documented scoring dimensions/profile weights, while separately recording reviewer rationale for readability, relevance, evidence and recommendation grounding in the private review notes. This is an editorial quality judgment, never a hiring probability. The runner computes holdout mean absolute/signed score error against mean reviewer ratings by profile; it does not tune the engine or produce a calibration certificate.
7. Review errors, false matches, employment/education associations, unsupported recommendations, group coverage and reviewer agreement. Field metrics compare unique canonical values, **not entity relationships or repeated occurrences**. A correct company and role attached to the wrong job can escape set-based metrics; review such associations separately. Null denominators indicate no evaluated examples, not perfect accuracy. Profile counts/errors alone do not establish fairness.
8. The owner must authenticate provenance, reviewer independence, holdout integrity and acceptance thresholds before signing a release decision. The report deliberately remains `pending-provenance-and-release-owner-review`, including when human declarations pass schema validation. Final release readiness is a human responsibility.

## Output

Reports contain record IDs, group metadata, TP/FP/FN with denominators, evidence confusion pairs, score repeatability, job/general-quality isolation, recommendation counts and holdout score errors. They omit resume text, extracted values, quotes, source references and reviewer identities. Engine commit, source/dependency fingerprint and dataset hash make runs attributable. `engineRevisionMatches=false` requires checking/re-freezing the declared revision before using results as release evidence.

The six sample records contain no work-history labels. Their company/role denominators are null; historical engineered employment tests are not independent employment validation. The schema supports every career profile and declared style, but actual representativeness requires an authorized external corpus. Manual document/assistive-technology review and truthful AI-output evaluation remain separate gates.
