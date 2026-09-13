# 📄 ResumeScore — Resume Intelligence & Job Match Platform

<p align="center">
  <strong>Analyze your resume across 7 evidence-based dimensions. Match against real job descriptions. Get actionable improvement recommendations.</strong>
</p>

---

## 🏆 Project Badges

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-35%20passing-brightgreen)](src/__tests__/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### Deterministic Analysis (always available, no API key needed)

- **📊 7-Dimension Scoring** — ATS Compatibility (15%), Skill Match (25%), Experience (20%), Impact & Metrics (15%), Projects (10%), Readability (10%), Profile (5%)
- **🎯 Job Description Matching** — Paste a job posting to see required/preferred/bonus skill alignment with 6-layer semantic matching (exact → alias → taxonomy → context → evidence)
- **🤖 ATS Compliance Audit** — 8-factor machine-readability checks with severity levels and specific fix steps
- **🔫 Bullet Impact Analysis** — Action verb detection, quantifiable metric presence, X-Y-Z formula assessment
- **📄 PDF & Text Support** — Client-side PDF text extraction via Mozilla PDF.js, or paste raw text
- **📈 Score History** — Track improvements over time, compare versions side-by-side, export JSON backups
- **🔒 Local-First Privacy** — All scoring and parsing runs on your deployment's server. No data is sent to third-party services in this mode

### AI-Enhanced Analysis (optional, supports Claude and Gemini)

- **✍️ LLM Bullet Rewrites** — AI-powered rewrite suggestions with qualitative feedback (Google X-Y-Z formula, metrics-driven, leadership) beyond template substitution
- **📝 AI Cover Letter Generation** — Contextual, fact-grounded cover letters tailored to your resume and target role
- **🔍 Resume Critique** — Per-section qualitative feedback on clarity, tone, specificity, and ATS risks

ResumeScore supports multi-provider LLM integration with automatic selection:
1. **Anthropic Claude** (via `ANTHROPIC_API_KEY`)
2. **Google Gemini** (via `GEMINI_API_KEY` or `GOOGLE_API_KEY`, using `@google/genai`)
3. **Deterministic Heuristic** (if no API keys configured — 100% offline fallback)

> **Privacy note:** When an external AI key (`ANTHROPIC_API_KEY` or `GEMINI_API_KEY`) is configured, untrusted resume/job text is isolated in strict XML tags and sent to the configured provider API solely for the requested generation. When keys are absent, all features operate offline via deterministic heuristic algorithms and zero data leaves your machine.

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router (Turbopack) |
| **TypeScript 5** | Type-safe development with strict mode |
| **Tailwind CSS 4** | Utility-first styling |
| **pdfjs-dist** | Client-side PDF text extraction |
| **Zod** | Runtime schema validation for API requests/responses |
| **Vitest** | Fast unit & integration testing |
| **Anthropic SDK** | Optional LLM integration (Claude) |
| **Google GenAI SDK** | Optional LLM integration (Gemini via `@google/genai`) |

---

## 📐 Scoring Dimensions

| Dimension | Weight | What It Checks |
|-----------|--------|----------------|
| 🤖 ATS Compatibility | 15% | Standard section headings, contact completeness, single-column layout, parseable formatting |
| ⚡ Skill Match | 25% | 6-layer semantic matching against job requirements (exact, normalized, alias, taxonomy, context, evidence) |
| 💼 Experience Relevance | 20% | Role seniority, title matching, career trajectory, tenure patterns |
| 🎯 Impact & Metrics | 15% | Quantified achievements, action verbs, X-Y-Z formula compliance |
| 📁 Projects & Portfolio | 10% | Technical complexity, live links, technology stack verification |
| 📐 Structure & Readability | 10% | Bullet density, section ordering, cognitive load |
| 👤 Profile & Contact | 5% | Professional email, LinkedIn, GitHub, phone presence |

The overall score is the **weighted sum** of dimension scores — mathematically deterministic and reproducible.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/skmdshariff143-ai/resumescore.git
cd resumescore
npm install
```

### Configuration

```bash
cp .env.example .env.local
```

**No environment variables are required** for the core deterministic analysis. To enable AI-enhanced features, add your Anthropic or Gemini API key:

```bash
# Option A: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Option B: Google Gemini
GEMINI_API_KEY=AIzaSy...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test           # Run all tests (unit & provider suites)
npm run lint       # ESLint
npm run build      # Production build
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── analyze/page.tsx          # Resume analyzer workspace
│   ├── history/page.tsx          # Score history & version comparison
│   └── api/                      # Server-side API routes
│       ├── analyze/route.ts      # Resume scoring endpoint
│       ├── extract-job/route.ts  # Job URL scraper
│       └── ai/
│           ├── rewrite/route.ts  # Bullet rewrite endpoint
│           ├── cover-letter/route.ts
│           └── critique/route.ts # LLM resume critique
├── components/                   # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FileUpload.tsx            # PDF/TXT drag-and-drop
│   ├── ScoreCard.tsx             # 7-dimension results
│   ├── analysis/                 # Analysis sub-views
│   │   ├── ATSScoreCard.tsx
│   │   ├── SkillMatrixView.tsx
│   │   ├── ResumeRewritePanel.tsx
│   │   ├── ResumeReviewEditor.tsx
│   │   ├── CoverLetterModal.tsx
│   │   ├── CritiquePanel.tsx
│   │   └── JobMatchInput.tsx
│   ├── dashboard/
│   │   ├── VersionComparison.tsx
│   │   └── JobMatchesTracker.tsx
│   └── ui/                       # Design system primitives
├── lib/                          # Core logic
│   ├── ai/
│   │   ├── provider.ts           # AIProvider interface & factory
│   │   ├── claude-provider.ts    # Anthropic Claude integration
│   │   └── gemini-provider.ts    # Google Gemini integration (@google/genai)
│   ├── ats/ats-checker.ts        # ATS compliance checks
│   ├── impact/impact-evaluator.ts
│   ├── jobs/job-parser.ts        # Job description parser
│   ├── matching/semantic-matcher.ts
│   ├── parsing/
│   │   ├── pdf-extractor.ts      # PDF.js text extraction
│   │   └── resume-parser.ts      # Structured resume parser
│   ├── scoring/scoring-engine.ts # 7-dimension scoring engine
│   ├── storage/history-store.ts  # localStorage with migration
│   └── keywords.ts              # Skill taxonomies (300+ terms)
├── types/index.ts                # TypeScript interfaces
└── __tests__/                    # Vitest test suites (10 files, 40+ tests)
```

---

## 🔒 Privacy Architecture

| Mode | Data flow | Third-party calls |
|------|-----------|-------------------|
| **Default (no API key)** | Browser → your server → browser | None |
| **AI-enhanced (with API key)** | Browser → your server → Anthropic API → your server → browser | Anthropic only, for rewrites/critique/cover letters |

PDF text extraction always runs client-side via PDF.js. The deterministic scoring engine always runs on your server. Only the optional LLM features (bullet rewrites, cover letters, resume critique) send data to Anthropic when an API key is configured.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Shaikh Mohammed Shariff**
GitHub: [@skmdshariff143-ai](https://github.com/skmdshariff143-ai)
