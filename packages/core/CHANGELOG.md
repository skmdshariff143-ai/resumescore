# Changelog — resumescore-core

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-28

### Added
- Extracted framework-agnostic resume parsing and scoring algorithms into a standalone, zero-dependency package.
- Public API: `parseResume()`, `scoreResume()`, `matchJob()`, `parseJob()`, and `compareResumeVersions()`.
- 7-pillar deterministic mathematical scoring rubric with support for 6 career profiles.
- Layered 6-level semantic matching architecture (exact, token-normalized, canonical aliases, taxonomy relationships, context co-occurrence, and section verification).
- Comprehensive TypeScript type definitions and structured error classes (`ResumeScoreError`, `ResumeParserError`, `ScoringError`, `JobMatchError`).
- Dual ESM and CommonJS bundle distributions with generated declaration files (`.d.ts`, `.d.cts`).
