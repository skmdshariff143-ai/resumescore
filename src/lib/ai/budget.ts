import { randomUUID } from 'node:crypto';

export interface BudgetLease { release(failed: boolean): Promise<void> }
export interface AIBudget { reserve(): Promise<BudgetLease | null> }

// Global atomic reservations across instances. Charges are retained on failures and
// unused output: this is a conservative ceiling, not a provider billing ledger.
export const RESERVE_SCRIPT = `
local t = redis.call('TIME')
local now = tonumber(t[1])
local day = math.floor(now / 86400)
local minute = math.floor(now / 60)
if tonumber(redis.call('GET', KEYS[4]) or '0') > now then return 0 end
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', now)
if redis.call('ZCARD', KEYS[3]) >= tonumber(ARGV[3]) then return 0 end
local spendKey = KEYS[1] .. ':' .. day
local rateKey = KEYS[2] .. ':' .. minute
local spend = tonumber(redis.call('GET', spendKey) or '0')
local rate = tonumber(redis.call('GET', rateKey) or '0')
if spend + tonumber(ARGV[1]) > tonumber(ARGV[2]) or rate >= tonumber(ARGV[4]) then return 0 end
redis.call('INCRBY', spendKey, ARGV[1])
redis.call('EXPIRE', spendKey, 172800)
redis.call('INCR', rateKey)
redis.call('EXPIRE', rateKey, 120)
redis.call('ZADD', KEYS[3], now + 120, ARGV[5])
return 1`;
const RELEASE_SCRIPT = `
redis.call('ZREM', KEYS[1], ARGV[1])
if ARGV[2] == '1' then
 local n = redis.call('INCR', KEYS[2])
 redis.call('EXPIRE', KEYS[2], 120)
 if n >= 3 then
  local t = redis.call('TIME')
  redis.call('SET', KEYS[3], tonumber(t[1]) + 120, 'EX', 120)
 end
end
return 1`;

/** Redis REST adapter; use dedicated credentials limited to this namespace. */
export class RedisAIBudget implements AIBudget {
  constructor(private url: string, private token: string, private daily: number,
    private reservation: number, private concurrency = 2, private requestsPerMinute = 10) {}
  private async command(command: (string | number)[]) {
    const response = await fetch(this.url, { method: 'POST', redirect: 'error',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), signal: AbortSignal.timeout(3000), cache: 'no-store' });
    if (!response.ok) throw new Error('Budget storage unavailable');
    const result = await response.json();
    if (result.error || typeof result.result !== 'number') throw new Error('Invalid budget response');
    return result.result as number;
  }
  async reserve(): Promise<BudgetLease | null> {
    const id = randomUUID();
    // Hash tag keeps all keys in one slot on Redis Cluster.
    const prefix = '{resumescore-ai}:v21';
    const admitted = await this.command(['EVAL', RESERVE_SCRIPT, 4,
      `${prefix}:spend`, `${prefix}:rate`, `${prefix}:leases`, `${prefix}:circuit`,
      this.reservation, this.daily, this.concurrency, this.requestsPerMinute, id]);
    if (admitted !== 1) return null;
    return { release: async failed => {
      await this.command(['EVAL', RELEASE_SCRIPT, 3, `${prefix}:leases`,
        `${prefix}:failures`, `${prefix}:circuit`, id, failed ? '1' : '0']);
    } };
  }
}

export function configuredBudget(): AIBudget | null {
  if (process.env.AI_PAID_ENABLED !== 'true') return null;
  const url = process.env.AI_BUDGET_REDIS_URL;
  const token = process.env.AI_BUDGET_REDIS_TOKEN;
  const model = process.env.ANTHROPIC_API_KEY?.trim() ? process.env.ANTHROPIC_MODEL : process.env.GEMINI_MODEL;
  const daily = Number(process.env.AI_DAILY_BUDGET_MICROUSD);
  const inputPrice = Number(process.env.AI_INPUT_MICROUSD_PER_MILLION_TOKENS);
  const outputPrice = Number(process.env.AI_OUTPUT_MICROUSD_PER_MILLION_TOKENS);
  // Worst-case input includes 12k UTF-8 bytes, prompt duplication and overhead.
  // Reserve output plus a conservative reasoning allowance; enable only after
  // checking the selected model's billing rules. No browser usage is trusted.
  const reservation = Math.ceil((32768 * inputPrice + 32768 * outputPrice) / 1_000_000);
  if (!url || !token || !model || process.env.AI_PRICED_MODEL !== model ||
      !Number.isSafeInteger(daily) || daily <= 0 ||
      !Number.isSafeInteger(inputPrice) || inputPrice <= 0 ||
      !Number.isSafeInteger(outputPrice) || outputPrice <= 0 ||
      !Number.isSafeInteger(reservation) || reservation <= 0 || reservation > daily ||
      process.env.AI_MODEL_COST_REVIEWED !== 'true') return null;
  try { if (new URL(url).protocol !== 'https:') return null; } catch { return null; }
  return new RedisAIBudget(url, token, daily, reservation);
}
