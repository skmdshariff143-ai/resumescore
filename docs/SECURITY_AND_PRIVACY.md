> Historical V2 snapshot retained for provenance. Current V2.1 changes and release gates are recorded in [V2.1 release readiness](V2_1_RELEASE_READINESS.md).

# Security and privacy

## Implemented controls

- Arbitrary job URL retrieval fails closed with no outbound request, preventing redirects, private addresses and DNS rebinding from reaching a fetch operation. Pasted job descriptions remain supported.
- API JSON is capped at 256,000 bytes before parsing; strings at 60,000 characters; arrays at 300 items; objects at 80 fields; nesting at 12. Request reads time out after 10 seconds.
- JSON media type and same-origin browser requests are checked. Missing Origin is allowed for non-browser API clients; these checks are not authentication.
- Nested resume link data uses a concrete Zod schema, not `z.any()`. Rewrite inputs have narrower per-field limits.
- Process-local rate limits and a bounded 10,000-key store mitigate bursts on one instance. A distributed limiter and verified proxy trust configuration remain required before enabling public paid AI operations.
- Claude uses a 20-second SDK timeout, zero SDK retries and bounded output tokens. Gemini has a 20-second HTTP timeout and 2,000 output-token limit. Successful live provider calls were not made for validation.
- Server/provider error reporting excludes raw exceptions and request bodies. Application API responses are marked no-store.
- `nosniff`, frame denial, referrer and permissions headers are configured. A tested restrictive CSP is not yet implemented.
- PDF/TXT validation, a 5 MB file limit and 20-page PDF limit protect ingestion. DOCX archives are limited to 200 entries, 10 MB declared uncompressed size and 2 MB actual main-document XML. Encrypted/macro/entity-bearing documents are rejected; no paths are extracted and no relationships are followed. OCR is not supported.

## Data flows and retention

Browser-only analysis is the default; resume and job text remain on-device. Resources and code are still downloaded. Server analysis transmits text to the application server. Cover-letter generation uses the server and explains this in its dialog.

External AI requires a feature-specific explicit checkbox; without consent routes select the heuristic provider even when API keys exist. Consent is kept in component memory. Secrets remain in server provider modules and environment variables.

History is opt-in; saved entries include full text and persist until deletion or browser-storage eviction. History offers JSON export and deletion. No database or account system was introduced. Operational hosting/provider retention depends on external configuration; no zero-retention or no-training guarantee is made.

## Remaining risks

External AI schema validation does not prove semantic factuality. Prompt delimiters and prompts do not guarantee injection resistance. Review all generated drafts; production AI enablement requires factuality benchmarks and distributed budget controls.

Five development-only high advisories remain in the braces → micromatch → fast-glob → Next ESLint chain in the recorded audit. Production dependency audit reports zero advisories at audit time, not a guarantee against unknown vulnerabilities. Do not use `npm audit fix --force` to downgrade lint infrastructure without compatibility review.
