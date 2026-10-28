# Good First Issues for New Contributors

Welcome! If you are looking to make your first contribution to ResumeScore, this document outlines 6 genuine, curated issues ready to be filed or tackled. Each issue includes context, affected files, step-by-step guidance, and acceptance criteria.

---

## Issue 1: [DOCS] Add JSDoc Comments to Internal Helper Functions in `packages/core`

- **Labels**: `documentation`, `good first issue`
- **Difficulty**: Beginner
- **Area**: `packages/core/src/parser/` and `packages/core/src/scoring/`

### Context
While the public exports in `packages/core/src/index.ts` have JSDoc comments, several internal utility functions in `packages/core/src/parser/resume-parser.ts` (such as `cleanLines`, `splitHeaderParts`, `extractStructuredLinks`) lack descriptive JSDoc docstrings explaining their parameters and return types.

### Relevant Files
- [`packages/core/src/parser/resume-parser.ts`](packages/core/src/parser/resume-parser.ts)
- [`packages/core/src/scoring/rubric.ts`](packages/core/src/scoring/rubric.ts)

### Step-by-Step Guidance
1. Locate un-documented internal functions in `packages/core/src/parser/resume-parser.ts`.
2. Add JSDoc comment blocks with `@param`, `@returns`, and a clear 1-2 sentence description.
3. Run `npm run build:core` to ensure TypeScript declaration generation passes cleanly.
4. Run `npm test` to verify no behavior changed.

### Acceptance Criteria
- [ ] JSDoc added to at least 5 internal helper functions.
- [ ] `npm run build:core` succeeds without errors.
- [ ] `npm run lint` passes with 0 warnings.

---

## Issue 2: [TESTS] Add Edge-Case Tests for Academic & Seasonal Date Ranges

- **Labels**: `testing`, `good first issue`
- **Difficulty**: Beginner
- **Area**: `packages/core/src/parser/` & `src/__tests__/`

### Context
Many student and intern resumes use seasonal terms rather than months in experience or education dates (e.g. `Summer 2023`, `Fall 2022 – Spring 2024`, `Winter 2024`). While our parser extracts standard numeric and abbreviated month dates (`05/2023`, `May 2023 – Aug 2023`), we need dedicated test cases to verify seasonal date formats are correctly captured in `ExperienceItem.startDate` and `endDate`.

### Relevant Files
- [`src/__tests__/extraction-edge-cases.test.ts`](src/__tests__/extraction-edge-cases.test.ts)
- [`packages/core/src/parser/resume-parser.ts`](packages/core/src/parser/resume-parser.ts)

### Step-by-Step Guidance
1. Open `src/__tests__/extraction-edge-cases.test.ts`.
2. Add a new `describe('Seasonal Date Range Parsing')` block with 2-3 test cases:
   - `Summer 2023 - Fall 2023`
   - `Winter 2022 - Present`
   - `Spring 2024`
3. If necessary, adjust `dateRangePattern` in `packages/core/src/parser/resume-parser.ts` to include `(?:summer|winter|spring|fall)`.
4. Run `npx vitest run src/__tests__/extraction-edge-cases.test.ts`.

### Acceptance Criteria
- [ ] New unit tests pass for seasonal date expressions.
- [ ] Existing date formats remain 100% backward compatible.
- [ ] Full test suite (`npm test`) passes.

---

## Issue 3: [FEATURE] Improve Detection of Online Certification Issuers (Coursera, edX, Udemy)

- **Labels**: `enhancement`, `good first issue`
- **Difficulty**: Intermediate
- **Area**: `packages/core/src/parser/resume-parser.ts`

### Context
When parsing certifications, candidates often list popular online learning platforms as issuers (e.g., `Google Data Analytics Certificate (Coursera - 2024)` or `AWS Certified Cloud Practitioner via Udemy`). Currently, `parseCertificationsSection` may include the platform name in the certificate title rather than parsing it cleanly into `CertificationItem.issuer`.

### Relevant Files
- [`packages/core/src/parser/resume-parser.ts`](packages/core/src/parser/resume-parser.ts)
- [`src/__tests__/parser.test.ts`](src/__tests__/parser.test.ts)

### Step-by-Step Guidance
1. Inspect `parseCertificationsSection` in `packages/core/src/parser/resume-parser.ts`.
2. Add issuer regex detection for common platforms: `Coursera`, `edX`, `Udemy`, `Pluralsight`, `LinkedIn Learning`, `freeCodeCamp`, `Google`, `AWS`, `Microsoft`.
3. If detected in parentheses or after `via` / `by` / `from`, populate `CertificationItem.issuer`.
4. Add unit test in `src/__tests__/parser.test.ts` verifying `issuer` extraction.

### Acceptance Criteria
- [ ] Certifications with platform mentions parse `issuer` correctly.
- [ ] Does not degrade standard professional certifications (e.g. `PMP`, `CPA`, `PE`).
- [ ] All unit tests pass.

---

## Issue 4: [A11Y] Add Live Region Announcements for Score Calculation Progress

- **Labels**: `accessibility`, `good first issue`
- **Difficulty**: Beginner
- **Area**: `src/app/analyze/page.tsx` or `src/components/`

### Context
When a user uploads a resume, the application parses and scores the document in the background. While visual spinners indicate progress, screen reader users (using NVDA, JAWS, or VoiceOver) do not receive an audible status update when the analysis starts or completes.

### Relevant Files
- [`src/app/analyze/page.tsx`](src/app/analyze/page.tsx)
- [`src/components/ScoreDisplay.tsx`](src/components/ScoreDisplay.tsx) (or relevant score container)

### Step-by-Step Guidance
1. Add an accessible `aria-live="polite"` element with `role="status"` and `className="sr-only"`.
2. Update its text dynamically:
   - When upload begins: `"Parsing resume text..."`
   - When scoring finishes: `"Analysis complete. Your resume scored ${overall} out of 100."`
3. Verify that visual styling is not affected and Playwright axe-core accessibility checks pass.

### Acceptance Criteria
- [ ] Live region announces parsing and completion states.
- [ ] `npm run test:e2e` passes accessibility audit.
- [ ] Zero visible layout shift.

---

## Issue 5: [PERF] Memoize Regular Expression Compilation in Keyword Matcher

- **Labels**: `performance`, `good first issue`
- **Difficulty**: Intermediate
- **Area**: `packages/core/src/keywords.ts`

### Context
`getSkillRegex(skill: string)` dynamically creates a new `RegExp` instance every time it is called. During a full analysis of a multi-page resume and a long job description, `getSkillRegex` is evaluated hundreds of times across 500+ taxonomy terms. Caching compiled regexes in a module-level `Map<string, RegExp>` will eliminate redundant compilation allocations.

### Relevant Files
- [`packages/core/src/keywords.ts`](packages/core/src/keywords.ts)
- [`src/__tests__/matching.test.ts`](src/__tests__/matching.test.ts)

### Step-by-Step Guidance
1. In `packages/core/src/keywords.ts`, instantiate a `const regexCache = new Map<string, RegExp>();`.
2. In `getSkillRegex(skill: string)`, check if `regexCache.has(skill)`. If so, return the cached instance.
3. Otherwise, compile the regex, store it in `regexCache`, and return it.
4. Run `npm test` to verify all keyword matching behavior remains identical.

### Acceptance Criteria
- [ ] Regex instances are cached and reused.
- [ ] All matching and property-based tests pass.
- [ ] Zero memory leaks.

---

## Issue 6: [CLI] Add Standalone CLI Entry Point to `@REPLACE_ME/resumescore-core`

- **Labels**: `feature`, `good first issue`
- **Difficulty**: Intermediate
- **Area**: `packages/core/`

### Context
Developers who want to use ResumeScore in CI/CD pipelines or automated git pre-commit hooks would benefit from a command-line interface (e.g. `npx resumescore-core <resume.txt>`).

### Relevant Files
- `packages/core/bin/resumescore.cjs` (new file)
- `packages/core/package.json` (add `"bin": { "resumescore": "./bin/resumescore.cjs" }`)

### Step-by-Step Guidance
1. Create `packages/core/bin/resumescore.cjs` with `#!/usr/bin/env node`.
2. Read the file path from `process.argv[2]`.
3. If `--help` or no file is passed, display helpful usage instructions.
4. Read the text file, call `scoreResume(parseResume(text))`, and print formatted JSON to stdout.
5. Add test verifying `node packages/core/bin/resumescore.cjs fixtures/sample.txt` outputs valid JSON.

### Acceptance Criteria
- [ ] CLI runs from terminal and outputs structured JSON score.
- [ ] Proper error handling if file does not exist.
- [ ] Verified via `npm pack --dry-run ./packages/core`.
