> Publication release policy: `next.config.ts` forces `AI_PAID_ENABLED=false` in compiled builds regardless of remote environment values. Paid AI controls are disabled and labeled in the UI. Removing this lock requires a separately reviewed release.

# AI cost controls

## Scope and architecture

All paid API paths use `controlledAI` and the provider-independent `AIBudget.reserve()` lease interface. `RedisAIBudget` sends an atomic Lua reservation through a server-only HTTPS Redis REST adapter. The shared namespace uses a Redis Cluster hash tag. Redis TIME controls minute/day boundaries, avoiding client/instance clock reliance.

A reservation atomically checks the UTC daily spending ceiling, global 10 requests/minute, two active leases, and a shared circuit. Leases expire after 120 seconds if an instance disappears. Reservations are never refunded, even on provider failure: the balance is an upper-bound admission ledger, not actual invoicing. Three provider failures within a rolling failure-key expiry open a 120-second circuit. Storage failure, rejection or incomplete configuration selects the deterministic provider without instantiating the paid provider. Release failures retain charges and rely on lease expiry.

## Bounds and configuration

Validated input above 12,000 UTF-8 bytes uses heuristic fallback. Provider calls use 20-second SDK timeouts, no retries (Claude maxRetries=0; Gemini attempts=1), and at most 2,000 output tokens. Gemini thinking is explicitly disabled; unsupported model options fail to heuristic fallback. Repeated prompt fields (candidate name, target company and role) are capped at 300 characters. No tools, search, cached billing or paid side effects are requested. Concurrency bounds admitted application operations; a timed-out remote inference may continue at the provider. Its charge remains reserved, and cancellation behavior needs live verification.

`.env.example` defaults `AI_PAID_ENABLED=false`. Before changing it, obtain approval for infrastructure/configuration and validate:
- `AI_BUDGET_REDIS_URL`, `AI_BUDGET_REDIS_TOKEN`: dedicated HTTPS Redis REST service with EVAL/TIME/GET/SET/INCR/INCRBY/EXPIRE/ZCARD/ZADD/ZREM/ZREMRANGEBYSCORE support; keep credentials server-only.
- `ANTHROPIC_MODEL` or `GEMINI_MODEL`: explicitly verified available model; Anthropic takes priority if its key is present.
- `AI_PRICED_MODEL`: must exactly match the selected model.
- `AI_INPUT_MICROUSD_PER_MILLION_TOKENS`, `AI_OUTPUT_MICROUSD_PER_MILLION_TOKENS`: reviewed integer upper-bound prices; one dollar is 1,000,000 microdollars. Include any model-specific billing beyond displayed tokens.
- `AI_DAILY_BUDGET_MICROUSD`: positive integer daily ceiling.
- `AI_MODEL_COST_REVIEWED=true` only after checking billing and limits; then `AI_PAID_ENABLED=true` may be considered.

Each reservation is ceil((32768 * input price + 32768 * output price)/1000000), conservatively exceeding normal bounded prompt/output usage. The daily ceiling must allow at least one reservation. Never reuse a cheaper-model price for a different model. Budget protections apply only to this app; keys should not be shared with unrelated spending.

## Evidence and current state

Unit tests verify fail-closed configuration, no reservation without consent, storage errors, provider failure fallback/release, and the REST command contract. Browser tests exercise the default heuristic path against a production build. No infrastructure was created, purchased or configured. Paid AI is **safely disabled by default**.

## Limits and remaining work

The Lua adapter has **not been executed against a live Redis service** or validated across Vercel instances. Test atomic races, daily boundaries, service outages, clock behavior, stale leases and the selected SDK/model's cancellation/billing before enabling paid AI. This is not a claim of operational distributed limits. No paid activation is recommended at this checkpoint. General non-AI endpoints retain process-local best-effort throttling; they are not a distributed abuse defense. Provider error events contain no resume data; no persistent per-user telemetry is introduced.
