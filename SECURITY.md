# Security Policy

## Supported Versions

We release patches and security advisories for the following versions:

| Version | Supported          | Security Maintenance Status |
| ------- | ------------------ | --------------------------- |
| `0.1.x` | :white_check_mark: | Current Active Stable       |
| `< 0.1` | :x:                | Legacy Pre-release          |

---

## Reporting a Vulnerability

The ResumeScore engineering team takes application and data security seriously. If you discover a security vulnerability, **please do not disclose it in a public GitHub issue.**

### Contact
Please send a detailed report via email to:
- **Email**: `security@resumescore.dev` (or open a private security advisory on GitHub under the **Security** tab).

### Response SLA (Service Level Agreement)
- **Initial Acknowledgment**: Within **48 hours** of receiving your report.
- **Triage & Reproduction**: Within **5 business days**.
- **Fix & Patch Target**: Within **14 business days** for high/critical vulnerabilities.
- **Coordinated Disclosure**: We request a **90-day embargo** before public disclosure to allow consumers and downstream users sufficient time to upgrade.

---

## Security Architecture & Guarantees

### 1. In-Memory Processing & Privacy Guarantee
ResumeScore operates under an offline-first, client-side privacy model:
- The core parsing and scoring engine (`resumescore-core`) runs entirely in memory without making external network requests.
- Candidate resume text is **never persisted to external databases** or transmitted to third-party telemetry aggregators during heuristic analysis.
- When optional LLM critique features are explicitly enabled by users, requests are transmitted only to user-configured API endpoints with strict sanitization.

### 2. Zero-Secret Architecture
- The frontend client bundles never contain or require server secrets.
- Environment configurations use strict isolation (`AI_PAID_ENABLED=false`).
- All server API routes enforce rate limiting, request size limits (max 5 MB for files, 1 MB for JSON payloads), and strict MIME-type validation.

### 3. Supply Chain Security
- All dependencies are monitored via GitHub Dependabot and CodeQL static application security testing (SAST).
- `npm audit --omit=dev` is enforced in continuous integration with an audit level of `high`.
