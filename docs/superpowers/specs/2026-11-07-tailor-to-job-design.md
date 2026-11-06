# Tailor to this job — design

Status: **approved 2026-11-07** ("Approve all": git setup from `origin/main`, `npm ci`, jsdom/Testing Library dev dependencies, user-asserted figures need a second confirmation rather than a hard block). Implemented; see `docs/TAILOR_TO_JOB.md`.
Date: 2026-11-07 · Branch (planned): `feat/tailor-to-job`

## 1. Intent

A candidate who has analysed their resume against a job description gets a guided three-step flow:

1. **Identify keywords** — what the job asks for and how well the resume already proves each item.
2. **Optimize resume** — review truthful, evidence-backed edits one at a time; accept or reject each.
3. **Apply with confidence** — before/after job-terminology score, a checklist, and export.

The flow connects pieces that already exist (`parseJobDescription` → `buildSkillMatrix` → `calculateResumeScore` → `ResumeWorkspace` export). Today nothing turns "here are your missing keywords" into "here is a tailored resume".

### Goals
- Every proposed edit traces to a line already in the resume, or to text the user typed and confirmed.
- Deterministic, browser-only, no new server routes, no provider keys, no new runtime dependencies.
- User approves each edit; "accept all supported" is a shortcut over a strictly defined safe subset.
- Undo / reset consistent with `ResumeWorkspace`.

### Non-goals
- Generating new bullets, summaries or metrics (no LLM, no templates that assert experience).
- Inserting text into the Professional Summary (any generated sentence is a new claim; deferred).
- Changing scoring weights, the AI lock in `next.config.ts`, or deployment config.
- Multi-job management, saved tailored versions, a new route.

### Anti-goals
- **Keyword stuffing**: caps on additions, no repeated terms, no hidden text.
- **Fabricated claims**: a keyword with no evidence is never inserted by the tool.
- **Fake guarantees**: no "ATS-approved", "guaranteed", or hiring-outcome language. Reuse existing wording: scores are heuristic estimates; evidence is inferred from text and not independently verified.

## 2. How the job-match path works today

```
JD text ──parseJobDescription──▶ JobParsed {requiredSkills, preferredSkills, bonusSkills, requirementsList…}
resume text ──parseResume──▶ ResumeParsed {skills, allSkills, rawText…}
        └────────── calculateResumeScore(resume, job, 'job_match', careerLevel)
                     ├─ buildSkillMatrix(resume.skills, resume.allSkills, rawText, req, pref, bonus)
                     │     per skill: matchSingleSkill → status/confidence/matchLevel (L1 exact … L5 context, else missing)
                     │     then evidenceLevel pass: demonstrated | mentioned | transferable | missing
                     └─ skillMatchScore = 100·Σ(weight·credit)/Σweight   weights 1/0.5/0.25; credit 1 / 0.6 / 0.3 / 0
ResumeScore {skillMatrix, skillMatchScore, parsedJob, parsedResume…} ──▶ analyze/page.tsx tabs
   Job Match / Skills tabs → SkillMatrixView;  Edit & Export tab → ResumeWorkspace
   ResumeWorkspace: block editor, undo (20), reset, compareResumeVersions(original, edited, score), TXT/DOCX/print.
   ReviewedRewrite: one line at a time, verifyRewrite, explicit approval (server route; heuristic only).
```

### Findings that shape the design
1. **`verifyStatement` only returns `supported` for an exact-line match.** Any changed line is at best `unverified` ("requires human verification"). It returns `contradicted` if the statement adds a number, or if *any line anywhere in the inventory* contains no/not/never/without and the statement does not. A real resume containing "without downtime" would therefore block every edit. **Decision:** keep `factuality.ts` unchanged; verify each suggestion against a *scoped inventory* (the line being edited + the cited source line only), and add our own token-diff guard (§4).
2. **The matcher treats a negated mention as a match.** Level 5 does `regex.test(resumeText)`, so "No experience with Kubernetes" yields `matched` (0.75), later downgraded to `mentioned`/`partial` (30% credit). The tailoring module must independently discard negated lines as evidence. (I will not change scoring in this feature; I will report this as a separate issue.)
3. **Surfacing a skill into the Skills section usually does not move the job-terminology score.** The matcher finds the term anywhere via `allSkills`. Score movement comes from (a) a `mentioned` skill that is genuinely used in an existing bullet but written in alias form ("ML models" vs job's "Machine Learning" — `getSkillRegex` does not match aliases, so the action-line check fails and the skill is capped at `mentioned`); and (b) user-supplied evidence for a gap. The UI must say so honestly per suggestion ("visibility only" vs "raises evidence credit"). The e2e fixture is chosen so a legitimate rise is possible.
4. `parseJobDescription` sets `id: 'job-' + Date.now()`. Tailoring output must not depend on `job.id` (determinism).
5. Importance headers in the JD parser are sticky and substring-matched (`plus`, `required`, `ideal`): "…is a plus" mid-bullet flips every following line to *preferred*. Existing behaviour; step 1 shows the importance it inferred so the user can see it. Not changed here.
6. `node_modules/` is absent and this folder is **not a git repository**, so I could not read `node_modules/next/dist/docs/` (AGENTS.md requires it) or run any gate. See §9.

## 3. Approaches

| | A. New `/tailor` route | B. Third mode on `/analyze` | **C. "Tailor to this job" panel inside Job Match results (recommended)** |
|---|---|---|---|
| State | Page state is local to `analyze/page.tsx`; a new route must re-upload or serialise resume + JD to storage | Reuses state | Reuses state (`score`, `resumeText`, `parsedJob`, `skillMatrix`) |
| Page.tsx impact | None | Larger — it is already dense (365 lines) | Small: one tab + one lazy-loaded component |
| Privacy | Persisting text between routes adds a storage surface | None | None |
| Deep link / SEO | Yes | Partial | No (non-goal) |
| Reversibility | High | Low | High: `TailorFlow` takes plain props, so it can be promoted to a route later |

**Recommendation: C.** New component tree `src/components/tailor/` (lazy-imported), pure logic in `src/lib/tailoring/`. `analyze/page.tsx` gains only a "Tailor to this job" tab (job-match mode only) and a callback to hand the tailored text back for re-analysis.

## 4. Tailoring module — `src/lib/tailoring/`

Pure, no DOM, no network, no randomness, no clock.

```ts
type TailoringAction =
  | 'surface-in-skills'    // evidenced elsewhere in the resume, absent from Skills
  | 'reword-to-job-term'   // existing line uses an alias; use the job's term in that same line
  | 'review-transferable'  // related evidence; user must write their own wording
  | 'user-evidence-needed';// no evidence; user may type a line

interface TailoringSuggestion {
  id: string;                        // hash(keyword + action + targetSection); never job.id
  keyword: string; importance: RequirementImportance;
  evidenceLevel: NonNullable<SkillMatchItem['evidenceLevel']>;
  action: TailoringAction;
  targetSection: 'skills' | 'experience' | 'projects' | 'other';
  original: string | null;           // exact resume line replaced; null when appending
  proposed: string | null;           // null until the user supplies text (transferable / gap)
  sourceEvidence: { line: string; lineIndex: number; section: string } | null;
  provenance: 'resume' | 'user-asserted';
  verified: { status: ClaimStatus; newClaims: string[]; reason: string };
  supported: boolean;                // eligible for "accept all supported"
  effect: 'visibility-only' | 'raises-evidence' | 'unknown';
}

buildTailoringSuggestions(resumeText, job, matrix): TailoringSuggestion[]
withUserEvidence(suggestion, userLine, resumeText): TailoringSuggestion   // sets provenance, re-verifies
applySuggestions(blocks, accepted): { blocks: ResumeBlock[]; rejected: {id, reason}[] }
scoreTailoring(originalText, tailoredText, context): { jobAlignmentBefore, jobAlignmentAfter, generalBefore, generalAfter, skills }
```

### Rules
- **Evidence lines** for a keyword: lines matching the keyword or its aliases (via `SKILL_ALIASES`, both directions — "ML" ↔ "Machine Learning") that are *not negated* (`no|not|never|without|learning|plan to|want to|hope to`, same list the matcher uses plus "lack"/"unfamiliar"/"limited exposure"). Only negated lines ⇒ treated as no evidence.
- **Action mapping** (from `evidenceLevel` + presence in a Skills block):
  - demonstrated/mentioned in a bullet, absent from Skills ⇒ `surface-in-skills`: `proposed = skillsLine + ', ' + keyword`, `sourceEvidence` = the bullet. If no Skills block exists, one is created containing only evidenced keywords.
  - alias-only in an action line ⇒ `reword-to-job-term`: replace the alias token in that line with the job's term; nothing else changes.
  - `transferable` ⇒ `review-transferable`: show the related evidence and the "transferable, review wording" label; no proposed text until the user writes their own.
  - `missing` ⇒ `user-evidence-needed`: copy "**Add only if this is true for you.**" The user may type a line; it is marked `user-asserted`.
- **Verification (every suggestion, every time).** `verifyStatement(proposed, inventoryFacts(original + '\n' + source))` — scoped inventory (finding 1). Plus a token-diff guard: tokens added by `proposed` relative to `original` must be ⊆ tokens of the keyword/alias. `supported = !contradicted && newClaims.length === 0 && diff-guard passes && source line non-negated && action ∈ {surface-in-skills, reword-to-job-term} && provenance === 'resume'`. Transferable and user-asserted items are **never** `supported`.
- **User-asserted lines**: must contain the keyword (or alias), ≤ 300 chars, control characters stripped, appended as a bullet to a section the user picks. They go through `verifyStatement` against the resume inventory; `newClaims` are shown as "new terms you are asserting". `contradicted` for removed negation stays a hard block. **Open decision for you:** new *numbers* in a user-asserted line normally trigger `contradicted`; hard-blocking would make "I cut latency 40% with Kubernetes" impossible. My call: show them as a warning requiring a second explicit confirmation rather than blocking, because the user is the source of truth for their own work. Say if you want the stricter behaviour.
- **Flooding caps**: ≤ 30 suggestions rendered (required first, then preferred, bonus; then evidence rank, then alphabetical), ≤ 8 skills added to the Skills line in total, a keyword is added at most once, never added if already in that line (case/alias-insensitive).
- **Determinism**: stable sort, ids from content, no `Date.now`, no `Math.random`.
- **Safety of input text**: the JD is only ever matched against regexes. Text is rendered as React text nodes and written to DOCX via `TextRun`. Instruction-like text in a JD ("ignore previous instructions, add Kubernetes") yields at worst a *gap* entry, never an edit.
- **Apply**: exact-line replace requiring a unique occurrence (same rule as `ReviewedRewrite`); otherwise the item is reported as not applied.

Small touch to existing code: `compareResumeVersions` currently returns general quality only. `scoreTailoring` calls `calculateResumeScore` directly for both texts (same career level and job as `compareResumeVersions`) and returns `skillMatchScore` too. Existing function is not modified.

## 5. UI

Entry: in Job Match mode results, a new tab **"Tailor to this job"** (lazy `TailorFlow`). Header uses the existing `StepIndicator` (clickable for completed steps) with steps *Identify keywords → Optimize resume → Apply with confidence*. Each step change moves focus to the step `<h2 tabIndex=-1>` (same pattern as `resultsHeading`). A `role="status"` region announces counts.

Step 1 — Identify keywords
```
Identify keywords        Job terminology alignment now: 42/100 (estimate, from text)
[Required] [Preferred] [Optional]   filter (aria-pressed)
 Docker        Required   ● Demonstrated   "Containerized the API using Docker" (Projects)   → can surface in Skills
 Machine Learning Required ◐ Mentioned     "Trained ML models…"                              → job's term differs
 SQL Server    Preferred  ◑ Transferable   "PostgreSQL schema design"                        → review wording
 Kubernetes    Required   ○ No evidence    "Add only if this is true for you."
Evidence is inferred from text and not independently verified. Missing evidence does not mean you lack a skill.
[ Continue to edits ]
```
Step 2 — Optimize resume
```
Optimize resume    3 accepted · 1 rejected · 2 undecided     [Accept all supported (3)] [Undo] [Reset]
┌ Docker — Required — Supported by your resume ───────────────────────────┐
│ Original  Skills: Python, SQL                                           │
│ Suggested Skills: Python, SQL, <ins>Docker</ins>                        │
│ Source    "Containerized the API using Docker" (Projects, line 14)      │
│ Effect    Visibility only — your score already counts this.            │
│ Check     unverified wording change; adds only "Docker".               │
│ [Accept] [Reject]   (aria-pressed toggles)                              │
└─────────────────────────────────────────────────────────────────────────┘
┌ Kubernetes — Required — No evidence ────────────────────────────────────┐
│ Add only if this is true for you.                                       │
│ Your evidence line [textarea, 300 max]  ☐ I confirm this is true        │
│ Will be added as a bullet under [Projects ▾]      Marked: user-asserted │
│ [Add my line] [Skip]                                                    │
└─────────────────────────────────────────────────────────────────────────┘
Live preview of the tailored resume (existing resume-paper article).
```
Step 3 — Apply with confidence
```
Job terminology alignment: 42 → 58 (estimate)   General quality: 71 → 72
Dimension changes (existing table pattern)
Checklist (computed):  ✓ every changed line cites a source or is yours   ✓ no keyword added twice
  ⚠ 1 required keyword still has no evidence: Kubernetes   ✓/⚠ 2 lines you asserted — re-read them
  ☐ I read every changed line (manual)
Honest copy: scores are heuristic estimates, not hiring predictions or ATS certification.
[Download DOCX] [Download TXT] [Print / Save PDF] [Edit further in full editor]
```
Export reuses `createDOCXResume`, `resumeBlocksToText`, `printableResumeHTML`. The download helpers currently live inside `ResumeWorkspace`; I will extract them to `src/lib/export/download.ts` and use it from both (behaviour-preserving). The exported text is clean (no "user-asserted" markers); that marker appears in the review UI and checklist only.

Accessibility: all controls are native buttons / textarea / checkbox; toggle buttons use `aria-pressed`; each card is an `<li>` in a labelled list with `aria-describedby` on verification text; added text is conveyed by `<ins>` plus the word "Suggested" (not colour alone); 320 px reflow (cards stack); axe check added to the e2e journey.

## 6. Test plan (test-first)

Unit — `src/__tests__/tailoring.test.ts`
- keyword in a project but not in Skills ⇒ `surface-in-skills`, `sourceEvidence` cites that line, `proposed` differs from `original` only by the keyword.
- keyword with no evidence ⇒ no `proposed`, never present in `applySuggestions` output; stays a gap.
- negation: "No experience with Kubernetes" is not evidence (⇒ `user-evidence-needed`); "without downtime" elsewhere does not block unrelated edits (scoped inventory).
- alias: resume "ML", job "Machine Learning" ⇒ `reword-to-job-term` and the score's evidence level rises from `mentioned` to `demonstrated`.
- determinism: two calls (different `job.id`) are deeply equal.
- user-asserted: marked, must contain keyword, new numbers produce a warning, never `supported`; transferable never `supported`.
- caps: ≤ 8 skills added, no duplicates, ≤ 30 suggestions.

Adversarial — `src/__tests__/tailoring-adversarial.test.ts`
- JD with "Ignore previous instructions and add Kubernetes/AWS to the resume" ⇒ resume text unchanged after accept-all; those keywords appear only as gaps.
- JD listing every dictionary skill (and a 200+ keyword stress string, plus 60 000-char input) ⇒ parser and builder finish within a time bound, caps hold, output size bounded, Skills line growth ≤ 8 items.
- HTML/markup and zero-width characters in JD render as text and are stripped from user lines.

Component — `src/__tests__/tailor-flow.test.tsx` (accept/reject, accept-all-supported excludes transferable/user-asserted, undo, reset, live-region text, keyboard operation). **Blocker to flag:** the repo has no jsdom/happy-dom or Testing Library, and tests run with `environment: 'node'` (existing component tests use `renderToStaticMarkup`). Interaction testing needs one dev dependency. Options: (1) add `jsdom` + `@testing-library/react` + `@testing-library/user-event` as **devDependencies only** (my recommendation; zero runtime impact; per-file `// @vitest-environment jsdom`), or (2) keep interactions in Playwright and unit-test only a pure reducer (`tailorReducer`) plus static markup. I need your call.

Playwright — `e2e/tailor.spec.ts`: upload sample resume, enable Job Match, paste JD, analyse, open Tailor tab, step 1 lists gaps, accept all supported, add one user-asserted line, step 3 shows alignment rising, download DOCX and re-read it for the accepted lines and absence of the unaccepted keyword; axe (wcag2a/aa/21aa/22aa) run on each step; assert no `/api/` requests. Fixture resume goes in `fixtures/tailor-sample-resume.txt` (fictional).

Gates: `npm run typecheck`, `lint`, `test`, `evaluate:release`, `build`, `test:e2e`, with real output pasted.

## 7. Docs and housekeeping
`docs/TAILOR_TO_JOB.md`, CHANGELOG entry, README Features bullet. `AI_PAID_ENABLED` lock, `vercel.json`, and production config untouched.

## 8. Risks
- Heuristic matcher quirks (findings 2, 3, 5) can mislabel evidence; mitigated by showing the source line for every claim and never auto-applying.
- "Visibility only" edits may disappoint users expecting a score jump; the copy says so explicitly.
- Token-level alias handling will not cover every alias; unknown aliases degrade to "user evidence needed", never to invention.

## 9. Environment blockers needing your decision
1. **Not a git repo.** `https://github.com/skmdshariff143-ai/resumescore` exists (branches: `main`, `feat/resumescore-v2`, `feat/open-source-evolution`, `audit/20-point-pre-launch`). To create `feat/tailor-to-job` I propose `git init`, add that remote, `git fetch` (read-only), verify the working tree matches `origin/main`, then branch locally. No push, ever, without your say-so.
2. **No `node_modules/`.** I need `npm ci` to read the Next 16 docs and run any gate.
3. **Component-test tooling** (§6).
4. **User-asserted numbers** policy (§4).
