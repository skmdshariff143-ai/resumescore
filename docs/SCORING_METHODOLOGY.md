> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Scoring methodology

Scores are deterministic editorial heuristics. They are not hiring probabilities, verified proficiency assessments, or commercial ATS certification. IDs and timestamps vary; numeric results for identical input and career level are reproducible.

The overall score is the rounded sum of each dimension's score multiplied by its weight (individual contributions rounded to one decimal). In job mode it blends resume quality and job terminology alignment. `generalQualityScore` separately runs the same engine without a job; the dashboard shows this alongside job alignment.

| Career level | Readability/ATS | Skills | Experience | Impact | Projects | Structure | Contact |
|---|---:|---:|---:|---:|---:|---:|---:|
| Student/Fresher | 15% | 20% | 10% | 10% | 25% | 15% | 5% |
| Internship | 15% | 20% | 10% | 10% | 25% | 15% | 5% |
| Entry | 15% | 25% | 15% | 15% | 15% | 10% | 5% |
| Experienced | 15% | 25% | 20% | 15% | 10% | 10% | 5% |
| Senior | 15% | 20% | 25% | 20% | 5% | 10% | 5% |
| Career switcher | 15% | 20% | 15% | 15% | 20% | 10% | 5% |

See `src/lib/scoring/rubric.ts` for configuration. Student/internship practical evidence can substitute project descriptions and education for work history: the experience score is the larger of the existing experience heuristic and 30 points per described project plus 20 per identified education entry, capped at 100. These choices are documented editorial judgments, not externally calibrated values.

Job matching uses exact tokens, normalization, aliases, taxonomy relationships and textual context. A skill mention without an action on the same line receives 0.3 credit; related partial evidence receives 0.6; matched practical evidence receives 1. The required-skill ratio becomes the job skill score. Inline required/preferred/optional lists retain their classification. Same-line action recognition is a heuristic and can miss valid evidence or misinterpret negation.

Major dimensions expose weights, detected/missing evidence, explanation, action and heuristic confidence. Confidence is medium by default and low for degraded extraction, not a calibrated probability.

Recommendations no longer promise arbitrary point gains. Re-analyzing edited text computes an actual new score. No score simulation or interview guarantee is offered.

Limitations: the taxonomy and several underlying dimensions remain software-oriented. Education and certifications are not separately calibrated dimensions. General-mode skill breadth still rewards keyword counts; career switcher/senior weighting alone does not establish relevance. Layout, dates, tables and reading order need broader document benchmarks. No independently reviewed scoring-agreement, extraction accuracy, or skill precision/recall benchmark has been completed.
