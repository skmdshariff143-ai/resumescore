import { inventoryFacts, verifyStatement } from '@/lib/ai/factuality';
import type { TailoringVerification } from './types';

const NEUTRAL = new Set('a an the and or of to in on for with by as at'.split(' '));
export const claimTokens = (text: string) =>
  text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}+#]+/gu) ?? [];

/**
 * Verify a resume-sourced edit against a scoped inventory (the edited line plus the cited source line).
 * Scoping avoids unrelated negations elsewhere in the resume blocking every edit, and is stricter on
 * vocabulary than the whole resume. A token-diff guard then requires that the edit adds only the keyword.
 */
export function verifyResumeEdit(input: {
  original: string | null; proposed: string; source: string; keyword: string; aliasInSource: boolean;
}): { verified: TailoringVerification; addsOnlyKeyword: boolean } {
  const inventory = inventoryFacts([input.original, input.source].filter(Boolean).join('\n'));
  const result = verifyStatement(input.proposed, inventory);
  const keywordTokens = new Set(claimTokens(input.keyword));
  const before = new Set(claimTokens(input.original ?? ''));
  const added = claimTokens(input.proposed).filter(token => !before.has(token) && !NEUTRAL.has(token));
  const addsOnlyKeyword = added.every(token => keywordTokens.has(token));
  // The project's alias table is the only source for the job's spelling of an alias already in the line.
  const newClaims = result.newClaims.filter(claim => !(input.aliasInSource && keywordTokens.has(claim)));
  return {
    verified: { status: result.status, newClaims, reason: result.reason },
    addsOnlyKeyword,
  };
}
