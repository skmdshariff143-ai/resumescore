# Contributing to ResumeScore

Thank you for your interest in contributing to ResumeScore! Whether you are fixing a typo, expanding the skill taxonomy, improving ATS edge-case extraction, or enhancing accessibility, we welcome your help.

---

## Architecture & Monorepo Structure

ResumeScore is structured as an npm workspaces monorepo:

- **`packages/core` (`resumescore-core`)**:
  - Pure, framework-agnostic TypeScript library.
  - Zero runtime dependencies (`dependencies: {}`).
  - Dual builds for Node.js (CommonJS) and modern bundlers/browsers (ESM) via `tsup`.
  - Exposes `parseResume`, `scoreResume`, `matchJob`, `parseJob`, `compareResumeVersions`, rubrics, taxonomies, and domain types.
- **Root (`/`)**:
  - Full-stack web application built on **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Turbopack**.
  - Consumes `resumescore-core` via standard npm workspace linking.

```
resumescore/
├── packages/
│   └── core/                 # Framework-agnostic scoring engine (zero runtime dependencies)
│       ├── src/
│       │   ├── parser/       # Deterministic text AST parser
│       │   ├── scoring/      # 7-pillar weighted rubric engine
│       │   ├── ats/          # ATS readability and structure checks
│       │   ├── matching/     # Semantic skill matcher & taxonomy graph
│       │   └── index.ts      # Public API exports
│       └── package.json
├── src/                      # Next.js 16 web application
│   ├── app/                  # App Router pages and API routes
│   ├── components/           # Accessible UI components (Tailwind CSS 4)
│   └── lib/                  # Web app utilities & file extraction adapters
└── evaluation/               # Labeled synthetic benchmarks & offline review packets
```

---

## Local Development Setup

### Prerequisites
- **Node.js**: `22.x` or `24.x` (LTS recommended)
- **npm**: `10.x` or newer

### Setup Steps

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/resumescore.git
   cd resumescore
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   *Note: This automatically links `packages/core` into the root `node_modules` workspace.*

3. **Build Core Package**
   ```bash
   npm run build:core
   ```

4. **Start Web Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Quality & Testing Guidelines

Every change must maintain our 100% test pass rate and strict type safety.

### 1. Unit & Property-Based Tests
```bash
# Run full Vitest suite (200+ unit and property tests)
npm test

# Run Vitest in watch mode during development
npx vitest

# Run property-based fuzz tests (fast-check)
npx vitest run src/__tests__/property-parser.test.ts
```

### 2. Code Coverage
```bash
npm run test:coverage
```
Coverage thresholds on parsing and scoring modules must remain above 90%.

### 3. End-to-End & Cross-Browser Tests
```bash
# Install Playwright browser binaries (first-time only)
npx playwright install --with-deps chromium firefox webkit

# Run Playwright E2E tests
npm run test:e2e

# Run cross-browser compatibility tests
npm run test:cross-browser
```

### 4. Type Checking & Linting
```bash
# TypeScript strict check
npm run typecheck

# ESLint flat config check
npm run lint
```

### 5. Package Packaging Dry-Run
When modifying `packages/core`, verify the npm tarball builds cleanly:
```bash
npm run build:core
npm pack --dry-run ./packages/core
```

---

## Development Standards & Principles

1. **Zero External AI in Core**:
   - `resumescore-core` must **never** depend on network APIs, OpenAI/Gemini SDKs, or remote endpoints. All parsing and scoring heuristics must remain pure, offline, and mathematically deterministic.
2. **Deterministic Heuristics**:
   - `scoreResume(parseResume(text))` must produce the exact same numerical scores and advice every time.
3. **No Secret Storage**:
   - Never commit API keys, personal credentials, or tokens. Never print secrets to console logs.
4. **No Real PII in Test Fixtures**:
   - All evaluation fixtures and edge-case resumes must use synthetic names (e.g., Jane Doe, Alex Morgan), `555` phone numbers, and `@example.com` emails.
5. **Commit Message Conventions**:
   - Use conventional, imperative commit messages:
     - `feat: add season-based date parser for academic internships`
     - `fix: resolve delimiter collision in multi-line contact headers`
     - `docs: update quickstart guide in README`
     - `test: add fast-check generator for unicode bullet symbols`

---

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature-name` or `fix/issue-description`.
2. Make your focused, atomic commits.
3. Verify all checks pass locally:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```
4. Push your branch to GitHub and open a Pull Request.
5. Fill out the Pull Request template completely, including testing evidence and screenshots if UI changes are made.
