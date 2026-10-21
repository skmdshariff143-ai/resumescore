# AI factuality evaluation

## Scope and method

V2.1 adds `src/lib/ai/factuality.ts`: source-line inventories carry stable IDs, character offsets, source/confirmed-edit provenance, tokens, quantities and heuristic section/category tags. The rewrite route builds the inventory before generation. Both providers receive the original source as untrusted data and explicit constraints against new employers, roles, skills, dates, credentials, projects, metrics and leadership.

The post-generation gate approves only normalized exact source statements. Changed wording is **unverified**, even if it reuses all source words: word rearrangement can reverse relationships. New numbers or removed negation are conservatively classified **contradicted** and the API replaces that variant with the original. These categories describe source support, not independent truth.

## Actual evidence

`src/__tests__/v21-hardening.test.ts` exercises fabricated percentages, changed dates, employers, leadership, technologies, certifications, missing metrics, instruction-like text, reversed relationships, provenance and route-level rejection. Existing Claude/Gemini SDK mocks test JSON validation and failures. `ReviewedRewrite` displays original/suggestion, new terms, status and explicit confirmation; application requires a unique unchanged source line and remains undoable. Contradicted variants cannot be applied. Cover-letter copying now also requires confirmation.

All three AI routes share budget admission and transparent heuristic fallback. Unsupported external cover-letter prose is discarded in favor of a deterministic draft; verification metadata refers to the attempted draft. Heuristic letter facts are filtered against the supplied raw text.

## Limits and remaining work

This is a deliberately conservative lexical gate, not semantic entailment or an anti-injection guarantee. Category tagging is not a complete entity/relationship extractor. Exact copied source can itself be false or malicious. User confirmation is an assertion, not credential verification. Critique is advisory and labeled unverified; it never edits the resume. No persistent fact/provenance database was added.

A Gemini credential is present locally (value never printed), but the shared budget is absent. Live provider factuality/latency is **blocked by fail-closed cost controls**, not reported as passed. No external generation was attempted. Before enabling paid AI, validate the configured model on a larger independently reviewed adversarial corpus and test supported paraphrases and multilingual/negation cases. Current checks favor false rejections over silently accepted invented claims.
