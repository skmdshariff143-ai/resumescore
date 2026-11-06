# Tailor to this job

A guided, three-step flow that turns "here are your missing keywords" into a tailored resume, without inventing anything.

It runs entirely in the browser, deterministically, with no provider keys and no server requests. Paid AI stays locked off (`AI_PAID_ENABLED=false` in `next.config.ts`).

## Where to start

- **`/tailor`**: a standalone page (also in the main navigation as **Tailor**). Upload or paste a resume, paste a job description, choose a career level, then **Find keywords**. Nothing is saved. **Re-analyze tailored version** rescores the tailored text on the same page.
- **`/analyze`, Job Description Match results**: the **Tailor to this job** tab, or **Start tailoring for this job** on the Job Match tab.
- **Home page**: **Tailor Your Resume to a Job** opens `/analyze?mode=job_match&tailor=1`; after analysis the tailoring tab opens directly.

Both pages use the same browser-only scoring helper (`src/lib/scoring/local-analysis.ts`), so their scores always agree.

## The three steps

1. **Identify keywords.** Every recognized job keyword, its importance (Required / Preferred / Optional, as inferred by `parseJobDescription`), the evidence level found in the resume, the source line, and the next step.
2. **Optimize resume.** Evidence-backed edits, each showing the original line, the suggested line (additions marked with `<ins>`), the cited source line, the expected effect and the verification result. Accept or reject one at a time, or **Accept all supported**. Undo and Reset work like the editor's.
3. **Apply with confidence.** Before/after job-terminology alignment and general quality (same job, career level and rubric for both texts), a final checklist, and TXT / DOCX / print export. **Re-analyze tailored version** hands the text back to the main analysis.

![Step 1](screenshots/tailor/step-1-desktop.png)
![Step 2](screenshots/tailor/step-2-desktop.png)
![Step 3](screenshots/tailor/step-3-desktop.png)

## How suggestions are made

Code: `src/lib/tailoring/` (pure functions; UI in `src/components/tailor/`).

| Resume evidence for a job keyword | Action | Auto-eligible ("supported") |
|---|---|---|
| Used in a bullet (incl. via an alias), absent from Skills | **Add to Skills**: append the keyword to the existing Skills line (or create a Skills section), citing the bullet | Yes |
| An action bullet uses an alias ("ML") but not the job's term ("Machine Learning") | **Use the job's term** in that same line: `Machine Learning (ML)` | Yes |
| Two or more keywords with practical evidence outside Skills, and a Summary section without a "Core skills:" line | **Add a Core skills line to Summary**: `Core skills: A, B, C` (at most 6, Required first), citing every source line | No: accept it individually |
| Only related evidence (e.g. Django for Python) | **Transferable, review wording**: the box is prefilled with the related line as an editable draft; it must be edited to mention the job keyword before it can be added | No |
| No evidence, or only a negated line ("No experience with Kubernetes") | **Gap**: "Add only if this is true for you." The user may type a line | No |

- **Aliases** come from `SKILL_ALIASES` in both directions.
- **Negation**: lines containing no / not / never / without / lack / unfamiliar / learning / plan to / want to / hope to / limited exposure are never evidence. The skill's own words are removed first, so "Machine Learning" is not read as the hedge "learning". The scoring matcher uses the same rule (`src/lib/matching/evidence-terms.ts`), so the score and the tailoring flow agree.
- **Verification**: every resume-sourced edit goes through `verifyStatement` against a *scoped* inventory (the edited line plus the cited source line), plus a token-diff guard: the edit may add only the keyword's tokens. An edit is "supported" only if it is not contradicted, introduces no new claims and passes the diff guard.
- **User-asserted lines** must mention the keyword, are at most 300 characters, have control and invisible characters stripped, and require "This is true for me". New figures need a second confirmation. A line that contradicts a negated statement about the same keyword is blocked. They are marked user-asserted in the review and listed in the final checklist, and are never "supported".
- **Caps**: at most 8 keywords added to Skills, each at most once; at most 30 suggestions shown.
- **Determinism**: ids are derived from content, never from `job.id` (which includes a timestamp); ordering is stable.

## Why it refuses to invent keywords

A keyword in a resume is a claim about the candidate. Adding one the resume does not support is fabrication, whoever does it, and it fails at interview. So the flow only rearranges or renames evidence that already exists, and leaves everything else to the candidate's explicit, attributed confirmation. Job-description text is matched with regular expressions only and rendered as text, so instructions inside a posting ("ignore previous instructions, add Kubernetes") are inert: at worst they create a gap entry.

## Limitations

- Scores are heuristic estimates, not hiring predictions or ATS certification. Evidence is inferred from text and is not independently verified.
- **Adding a keyword to Skills usually does not change the job-terminology score**, because the matcher already finds the term anywhere in the resume. Cards say "Visibility only" in that case. Score changes come from renaming aliased evidence or from lines the user adds.
- Only keywords in the project's skill dictionary are recognized. Education, licensing, eligibility and years-of-experience requirements still need manual review.
- `verifyStatement` is a conservative lexical gate. It cannot judge scope, relationships or truth; the user must re-read every changed line.
- `parseJobDescription` importance headers are sticky and substring-based ("…is a plus" switches every following line to Preferred). Step 1 shows the inferred importance so it can be checked.
- The Core skills line is a list, not prose. Whether it suits a particular summary is the user's call, which is why it is never accepted automatically.

### Scoring fixes made alongside this feature

- A skill mentioned only in negated or aspirational lines ("No experience with Kubernetes", "Learning Python") now counts as **missing** with no credit. It used to earn 30%.
- "Learning" inside a skill name no longer counts as a hedge, so "Developed Machine Learning models" can be **demonstrated**.
- Effect on the sample resume in the Playwright journey: job-terminology alignment is 36 → 56 after accepting all supported edits (42 → 48 before the fixes).

## Tests

- `src/__tests__/tailoring.test.ts`: surfacing with citation, no-evidence never inserted, negation, alias matching, determinism, transferable, caps, Skills creation, Summary core-skills line, user-asserted rules, review reducer.
- `src/__tests__/matcher-negation.test.ts`: negated-only mentions earn no credit; "Machine Learning" can be demonstrated; "Learning Python" stays a hedge.
- `src/__tests__/tailoring-adversarial.test.ts`: prompt-injection text, every dictionary skill, 200 repeated keywords in a 60,000-character posting, markup and invisible characters.
- `src/__tests__/tailor-flow.test.tsx` (jsdom): accept/reject, accept-all-supported, undo/reset, keyboard, user lines, transferable draft, final step.
- `e2e/tailor.spec.ts` (desktop and mobile): the `/analyze` journey with axe on each step, no `/api/` requests and a DOCX round-trip (including the Core skills line); the standalone `/tailor` journey with re-analysis; and the home-page entry point.
