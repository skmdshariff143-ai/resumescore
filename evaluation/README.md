# ResumeScore Evaluation Framework & Synthetic Benchmarks

This directory contains evaluation datasets, schemas, and runners used to verify the parsing accuracy and scoring consistency of ResumeScore and `@REPLACE_ME/resumescore-core`.

---

## 1. Labeled Synthetic Evaluation Benchmark (`evaluation/resumes/`)

### Provenance & Licensing
- **Licensing**: Licensed under the **MIT License**.
- **Provenance**: 100% synthetically authored by the engineering team. All names (e.g., Maya Lin, Ethan Brooks, Dr. Aris Thorne, Samantha Vega, David Vance), phone numbers (`555-xxx-xxxx`), email addresses (`@example.com`), and company affiliations are fictional.
- **Zero Real PII**: Contains **no personal candidate records**, private resume databases, or scraped data. Safe for public open-source distribution and continuous integration.

### Benchmark Archetypes & Target Dimensions

The benchmark covers 5 distinct career stages to prevent model overfitting to mid-career software engineers:

| Profile ID | Career Archetype | Experience Level | Target Role | Key Validation Target | Expected Score Bands |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`eval-01-student`** | CS Undergraduate | Student (0 yrs formal) | SWE Intern | Education-first ordering, academic coursework, GPA extraction, zero work history grace. | Impact: 30–65<br>Brevity: 70–98<br>Style: 60–95 |
| **`eval-02-entry-level-engineer`** | Junior Frontend Dev | 1.5 years | Frontend Engineer | Quantified bullet points (22%, 38%), modern stack (React/Next/TS/Tailwind), single company history. | Impact: 55–85<br>Brevity: 75–95<br>Style: 70–95 |
| **`eval-03-senior-architect`** | Principal Cloud Architect | 13+ years | Staff/Principal Architect | High-impact scale metrics ($1.4M saved, 4.2B events, p99 latencies), multi-role progression, patents & Ph.D. | Impact: 80–100<br>Brevity: 70–95<br>Style: 75–95 |
| **`eval-04-career-switcher`** | Educator to Data Analyst | 6 yrs education + bootcamp | Junior Data Analyst | Detection of transferable quantitative skills (AP Stats), self-directed projects, professional certifications. | Impact: 50–80<br>Brevity: 70–95<br>Style: 70–95 |
| **`eval-05-executive`** | VP of Engineering | 17+ years | VP of Engineering | Organizational scaling (160+ headcount), operational budgeting ($22M), DORA metric improvements, M&A integration. | Impact: 85–100<br>Brevity: 65–95<br>Style: 75–98 |

---

## 2. Evaluation Limitations & Honest Caveats

1. **Synthetic vs. Real-World Variance**:
   - Synthetic documents follow clean ASCII/Unicode text formatting. Real-world resumes contain unpredictable quirks: two-column multi-page tables, text boxes rendered out-of-order by PDF extractors, decorative non-standard bullet symbols, and mixed character encodings.
   - For document layout stress testing, see `fixtures/` and `src/__tests__/extraction-edge-cases.test.ts`.

2. **Heuristic Engine vs. Human Hiring Intent**:
   - The ResumeScore engine evaluates structured writing quality, keyword alignment, quantified achievements, and ATS compliance.
   - It **does not predict hiring success** or applicant competency. High scores indicate compliance with standard resume guidelines, not job fitness.

3. **Absence of External Holdout Corpus**:
   - Scores on this synthetic set reflect calibration and regression stability. True independent evaluation requires authorized human review on an external holdout corpus as described in Section 3 below.

---

## 3. Offline Blinded Human Review Package (`evaluation/private/`)

For enterprise or formal calibration against human hiring managers:

See [the executable blinded-review handoff](HUMAN_REVIEW_HANDOFF.md) for unfilled reviewer packets, source/return schemas, comparison, consensus assembly, and owner acceptance procedures.

### Running Evaluation Commands
```bash
# Run synthetic self-check regression (6 engineered records)
npm run evaluate:release

# Run private evaluation with authorized dataset
RESUMESCORE_EVALUATION_DATASET="E:/private-evaluation/dataset.json" npm run evaluate:release
```

- When running against private datasets, candidate text is never transmitted over the network or logged.
- The output report is generated to `.vercel/release-evaluation.json` (ignored by Git).
