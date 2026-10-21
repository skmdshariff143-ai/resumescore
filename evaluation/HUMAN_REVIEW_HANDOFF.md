# Independent review handoff

Status: **external evidence pending**. The example is synthetic; it provides no independent labels, real reviewer identities or licensing evidence. The executable handoff adds no hiring-probability or ATS certification claims.

## Owner preparation

1. Assign a data owner. Privately retain licensing/consent, anonymization, retention/deletion and reviewer-independence evidence. Do not send candidate documents to external AI. Do not commit real resumes, completed review forms or rights references.
2. Freeze the engine commit and quality-v1 rubric. Pre-register sample size, sectors, profiles, styles, quality bands, calibration/holdout split, field/skill precision-recall thresholds, acceptable score errors and subgroup error bounds. None is silently chosen by this tool.
3. Recruit at least two reviewers independent of engine implementation. Use pseudonymous IDs and accurate `independentOfEngine` declarations. Keep their actual identity/independence records private. A form declaration is not authentication.
4. Build a private manifest matching `ReviewSourceSchema` in `src/lib/evaluation/review-handoff.ts`. Use all six profiles, technical/nontechnical sectors, mixed quality, negative skill examples and genuine employment/project associations. Include authorized single-column, columns, tables, long and unusual documents. Retain originals and independently label expected text/reading order separately; pasted text alone cannot validate PDF layout extraction.
5. Copy the synthetic example only for a rehearsal. It remains `source.kind=synthetic`, with independence false. For a real corpus, accurately declare licensed/consented-anonymized sources and references; do not relabel synthetic examples as external evidence.

## Executable commands

From the repository root, prepare an ignored synthetic rehearsal manifest frozen to the current checkout:

```powershell
node -e "const fs=require('fs'),cp=require('child_process');const d=require('./evaluation/review-source.example.json');d.engineCommit=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();fs.mkdirSync('evaluation/private',{recursive:true});fs.writeFileSync('evaluation/private/rehearsal-source.json',JSON.stringify(d,null,2),{flag:'wx'});"
$env:RESUMESCORE_REVIEW_SOURCE = 'evaluation/private/rehearsal-source.json'
$env:RESUMESCORE_REVIEW_ACTION = 'prepare'
$env:RESUMESCORE_REVIEW_OUTPUT = 'evaluation/private/rehearsal-packets'
npm run evaluate:review
```

Use a **new** output directory for each command. Existing output is never overwritten. Inputs are limited to 8 MB each. Inside the repository, outputs are restricted to ignored `evaluation/private/` descendants; an explicitly selected private directory outside the repository is also supported. Restrictive POSIX mode bits are requested; Windows users must manage folder ACLs. Software does not certify consent or filesystem confidentiality.

This handoff accepts two or three registered reviewers, each reviewing every record in that manifest. Larger studies can use separately frozen manifests; do not silently omit a registered review. Packet filenames use numeric indices for portable filesystem handling; the reviewer ID remains inside each form.

Give each reviewer only their own packet and the rubric below. Do not share the source manifest, holdout membership, existing gold labels, other reviewers' returns or engine results. Packets deliberately omit those values. The manifest's revision must match the checkout when running the tool.

After reviewers return completed packets, place them in a JSON **array** in a private `returned-reviews.json`. A raw unfilled packet is invalid: null scores, incomplete field checks and empty rationale are rejected.

```powershell
$env:RESUMESCORE_REVIEW_ACTION = 'compare'
$env:RESUMESCORE_REVIEW_SUBMISSIONS = 'evaluation/private/returned-reviews.json'
$env:RESUMESCORE_REVIEW_OUTPUT = 'evaluation/private/review-comparison'
npm run evaluate:review

$env:RESUMESCORE_REVIEW_ACTION = 'assemble'
$env:RESUMESCORE_REVIEW_OUTPUT = 'evaluation/private/review-assembled'
npm run evaluate:review

$env:RESUMESCORE_EVALUATION_DATASET = 'evaluation/private/review-assembled/dataset.json'
npm run evaluate:release
```

Remove these environment variables after use. Do not run private evaluation on shared CI with public failure artifacts. Output manifests record the source hash, frozen revision and pending validation status; preserve raw returns/rationales and all owner decisions privately.

## Reviewer form and rubric

Each JSON record is a form. Preserve `id`, source text, job text, profile and metadata exactly. Enter labels using `{field,value,quote,start,end,source,evidence?}`. Indices are zero-based UTF-16 `[start,end)`, and the exact source substring must equal `quote`. `requiredSkill` labels reference `job`; other fields reference `resume`. A missing skill uses job evidence and `evidence=missing`; never invent it in the resume.

Check all eleven `fieldsChecked` entries after review: `name`, `email`, `degree`, `institution`, `company`, `role`, `projectName`, `projectDescription`, `skill`, `section`, `requiredSkill`. Explicitly absent fields have no label but still require the check. Use canonical section types described in [README.md](README.md). Distinguish mentioned, demonstrated, transferable and missing evidence; a single keyword is not proof of proficiency.

Enter a quality-v1 `qualityScore` from 0–100, supported by a `rationale` covering:

- Parsing/reading order and missing fields, separately from content quality.
- Readability, structure and contact completeness.
- Relevant experience, projects, education and demonstrated skills, using the selected career profile. Projects/internships can substitute for employment for students.
- Achievement specificity and supported impact; do not invent numbers.
- Job relevance and requirement coverage, separately from general resume quality.
- Whether proposed recommendations would be grounded in the source facts.

Use the profile-specific dimensions/weights in [scoring methodology](../docs/SCORING_METHODOLOGY.md) as the declared editorial rubric. Reviewer ratings remain independent judgments; do not consult the engine's scores while labeling. Use consistent severity anchors: 0 means no usable evidence for the dimension; 50 means partial/unclear evidence; 100 means complete, clear evidence within the rubric, not a hiring guarantee. The owner must agree detailed anchors and thresholds before the holdout review.

## Comparison, adjudication and acceptance

Comparison reports record IDs, label agreement and score spread without candidate text. It includes span-boundary disagreement; it does not decide whose labels are correct. Assembly requires all returned reviewers, complete records, unchanged text/revision, valid spans and agreeing label sets. **Disagreements stop assembly.** Preserve both original reviews and obtain independent adjudication; construct the final dataset using `EvaluationDatasetSchema` and its `adjudication` reference as described in README.md. Never edit reviewers' original returns to hide disagreement.

An adjudicator must be separate from every original reviewer on that record. Register their independent ID in the final dataset's reviewer registry and retain an attributable private adjudication reference; do not add them as an original review on that record. The prepare/compare/assemble workflow does not automatically choose disputed ground truth. Preserve original returns and construct the adjudicated final dataset privately, then run the strict evaluator. A reviewer cannot resolve their own disagreement by signing an adjudication field. License/consent and reviewer declarations still require external authentication.

Run the evaluator on the frozen engine. Inspect TP/FP/FN and null denominators, evidence confusion, score repeatability, job/general-quality isolation, per-profile holdout errors and reviewer disagreement. Review relationships/reading order manually: set-based field accuracy does not prove that a role belongs to the correct employer. Synthetic six-sector metrics and generated layout tests are regression checks only.

The data/release owner must sign provenance, independence, holdout integrity, thresholds, actual results and disposition of each error. **Even assembled schema-valid human declarations remain pending until this external review is authenticated.** Independent extraction/scoring gates, security-risk disposition and final production approval remain separate requirements.
