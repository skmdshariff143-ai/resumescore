# Final validation baseline — 2026-10-20

Scope: preserve V2–V3, validate the current feature release, and prepare external gates. No production release is authorized.

Before edits, `git status --short` was empty; branch `feat/resumescore-v2`, HEAD `f97a0d166b0f0553b9639dc3e6b04b38b3aeccfe`. PR #1 was open, draft and mergeable, with that exact head and base/main `79a373c8acc3d234c04e21010598ef9f93764bcf`. No unrelated local changes were present.

[Baseline hosted CI](https://github.com/skmdshariff143-ai/resumescore/actions/runs/39435111164) succeeded. Protected Preview `https://resumescore-74jrgo5ft-shaik-mahammad-shariff-s-projects.vercel.app/`, deployment `dpl_DY3NvAKKR58WEYRQLkMGzDJvtDPX`, was READY on exact f97a0d1. Production alias `https://resumescore-phi.vercel.app/` resolved to deployment `dpl_5NimgXZ6W7XqK3Kypy5S1Eug1FS6`, exact main 79a373c. READY is metadata, not a functional test.

Read the named V2/V2.1/V2.2/V3 release, security, functional and visual reports, scoring methodology, current source/tests, and `evaluation/HUMAN_REVIEW_HANDOFF.md`. Existing reports remain historical evidence; this pass does not reinterpret them as newly performed checks.

Fresh Windows checks: `npm ci` exit 0 (486 packages); `npm test` exit 0 (159 tests, 28 files, including five new evaluation tests); `npm run lint`, `npm run typecheck`, `npm run build` exit 0. `npm audit --json` exit 1: five high development findings; `npm audit --omit=dev --json` exit 0: zero advisories. Private execution logs are under `.vercel/enterprise-*`; publication results are consolidated in FINAL_RELEASE_DECISION.md and enterprise-validation-evidence.json.

Open mandatory gates at entry: independent scoring labels, independent complex-document references, owner disposition of dependency risk, genuine assistive-technology/native browser verification. Paid AI remains compiled off in `next.config.ts`; no provider credentials activated, no billable requests, and no production configuration changes.

The new cross-engine tests initially exposed both harness problems (Windows DPI rounding and Firefox live viewport resizing) and a real skip-link focus defect. Failed attempts are retained and reported in CROSS_BROWSER_VALIDATION.md. They are not counted as passes.
