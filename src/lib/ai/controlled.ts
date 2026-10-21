import { configuredBudget } from './budget';
import { defaultAIProvider, getAIProvider, isAIConfigured, type AIProvider } from './provider';

/** Only server-side call path for paid generation. No request retries. */
export async function controlledAI<T>(consent: boolean, operation: (provider: AIProvider) => Promise<T>, input = '') {
  const fallback = async (reason: string) => ({
    data: await operation(defaultAIProvider), isLLMGenerated: false, providerStatus: reason,
  });
  if (!consent) return fallback('heuristic-no-external-consent');
  // Bound the entire validated request, not browser-reported token usage.
  // UTF-8 bytes conservatively bound ordinary text tokenization; prompt overhead
  // and provider-specific billing must also be included in the configured reserve.
  if (Buffer.byteLength(input, 'utf8') > 12000) return fallback('heuristic-input-limit');
  if (!isAIConfigured()) return fallback('heuristic-provider-unconfigured');
  const budget = configuredBudget();
  if (!budget) return fallback('heuristic-paid-ai-disabled');
  let lease;
  try { lease = await budget.reserve(); } catch { return fallback('heuristic-budget-unavailable'); }
  if (!lease) return fallback('heuristic-budget-limited');
  let failed = false;
  try {
    const data = await operation(getAIProvider());
    return { data, isLLMGenerated: true, providerStatus: 'external-ai' };
  } catch {
    failed = true;
    return fallback('heuristic-provider-unavailable');
  } finally {
    // Lost releases retain the reservation and expire the concurrency lease safely.
    try { await lease.release(failed); } catch { /* no sensitive logging */ }
  }
}
