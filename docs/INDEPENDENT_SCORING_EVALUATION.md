# Independent scoring evaluation

Status: **BLOCKED — no authenticated independent reviews or held-out human scores obtained.** The technical harness works; it does not establish calibration, fairness or hiring-outcome validity.

## Method and implemented safeguards

Use the existing executable [human-review handoff](../evaluation/HUMAN_REVIEW_HANDOFF.md), strict source-span schema and [rubric](SCORING_METHODOLOGY.md). Packets omit engine outputs, other reviews and holdout membership. This pass adds tie-aware Spearman correlation, absolute score differences, MAE, signed error, RMSE, per-profile errors and reviewer-pair descriptive disagreement. Exact label agreement includes field/value/source/span/evidence. A separate independent adjudicator must resolve disagreements; an original reviewer cannot adjudicate their own return. Evidence classifications are rejected on non-skill fields.

Metrics have explicit null denominators. FP/(TP+FP) is labeled false discovery rate, not false positive rate; a true FPR requires an exhaustively defined true-negative universe. Confidence is an editorial category, not a calibrated probability. Confidence intervals and chance-corrected reliability are not claimed without a defensible pre-registered sampling design. Reviewer declarations are not authentication.

## Actual evidence

`npm run evaluate:release` exit 0: six authored synthetic cases, one per career profile across six sectors. Canonical name/email/degree/institution/project-name/project-description labels: 36 TP, zero FP/FN; skills 13 TP, zero FP/FN; job requirements 13 TP, zero FP/FN; sections 18 TP, zero FP/FN. These are engineered fixture results, not population accuracy. Empty company/role denominators remain null. All six repeat-score deltas and job/general-quality isolation deltas were zero. Independent holdout pairs: **0**; MAE/rank correlation/reviewer agreement: **null**, not zero error. The illustrative manifest declares an older revision; the report explicitly records `engineRevisionMatches=false`, so it cannot qualify as a frozen external study. Engine source fingerprint and dataset hash are retained in the evidence JSON.

## Dataset screening

A bounded review screened three public candidates without downloading resumes or contacting maintainers:

- [ResumeBench](https://github.com/ApplyU-ai/ResumeBench/blob/main/README.md): synthetic document benchmark with requested access and CC BY-NC 4.0 restrictions. No access or SaaS-use permission established; it is not an independent quality-rating holdout.
- [C0ldSmi1e dataset card](https://huggingface.co/datasets/C0ldSmi1e/resume-dataset/blob/main/README.md): declares Apache 2.0 and text-classification data. This review did not establish authenticated independent resume-quality ratings, upstream consent or candidate-data provenance.
- [Resume Corpus](https://github.com/vrundag91/Resume-Corpus-Dataset): describes entity annotations and academic use. An explicit license permitting the intended use was not established from the inspected root/README. Rights, provenance and independent label quality remain unverified.

No candidate was admitted to the release holdout. This is not an exhaustive dataset search or a legal determination.

## Required external work

The data owner must authorize and anonymize documents; retain rights/consent privately. Freeze engine/rubric, stratify all six profiles, sectors, quality levels, styles and negative skill examples; pre-register thresholds and sample-size rationale based on desired precision and available strata. Do not claim that six fixtures are representative. Recruit two independent reviewers per record and a separate adjudicator for material disagreements, preserve raw returns, authenticate independence, run the private prepare/compare/assemble/evaluate commands, and sign the held-out results. Establish anchors and acceptance criteria before seeing holdout scores. No recommendation or statistical claim closes this gate without those real actions.
