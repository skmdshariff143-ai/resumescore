/** Conservative lexical gate. Source support is not independent factual verification. */
export type ClaimStatus = 'supported' | 'user-confirmed' | 'unverified' | 'contradicted';
export interface SourceFact {
  id: string;
  text: string;
  origin: 'resume' | 'confirmed-edit';
  start: number;
  end: number;
  tokens: string[];
  quantities: string[];
  categories: string[];
}
const normalize = (text: string) => text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
const tokens = (text: string) => normalize(text).match(/[\p{L}\p{N}+#]+/gu) || [];
const quantities = (text: string) => text.match(/\d+(?:[.,]\d+)*(?:%|\b)/g) || [];
const neutral = new Set('a an the and or of to in on for with by as at my our i was were is are has have had using'.split(' '));

export function inventoryFacts(source: string, origin: SourceFact['origin'] = 'resume'): SourceFact[] {
  const facts: SourceFact[] = [];
  const pattern = /[^\r\n]+/g;
  let section = 'statement';
  for (const match of source.matchAll(pattern)) {
    const line = match[0];
    if (/^(education|skills|experience|work experience|projects|certifications|achievements)\s*:?\s*$/i.test(line.trim())) section = line.trim().toLowerCase().replace(/:$/, '');
    const categories = [section];
    if (/\d/.test(line)) categories.push('quantity-or-date');
    if (/\b(degree|bachelor|master|phd|diploma)\b/i.test(line)) categories.push('qualification');
    if (/\b(certified|certification|certificate|license)\b/i.test(line)) categories.push('certification');
    if (/\b(at|engineer|analyst|manager|intern|developer)\b/i.test(line)) categories.push('possible-employer-or-role');
    facts.push({ id: `${origin}:${match.index}`, text: match[0], origin,
      start: match.index, end: match.index + match[0].length,
      tokens: tokens(match[0]), quantities: quantities(match[0]), categories });
  }
  return facts;
}

export function verifyStatement(statement: string, inventory: SourceFact[]) {
  const exact = inventory.find(f => normalize(f.text).replace(/^[•*\-]\s*/, '') === normalize(statement).replace(/^[•*\-]\s*/, ''));
  if (exact) return { status: exact.origin === 'confirmed-edit' ? 'user-confirmed' as const : 'supported' as const,
    evidenceIds: [exact.id], newClaims: [] as string[], reason: 'Matches a supplied source statement; not independently verified.' };
  const vocabulary = new Set(inventory.flatMap(f => f.tokens));
  const numbers = new Set(inventory.flatMap(f => f.quantities));
  const addedNumbers = quantities(statement).filter(n => !numbers.has(n));
  const newClaims = [...new Set(tokens(statement).filter(t => !vocabulary.has(t) && !neutral.has(t)))];
  // Never infer semantic equivalence from a shared bag of words or cross-line facts.
  const changedNegation = inventory.some(f => /\b(no|not|never|without)\b/i.test(f.text)) &&
    !/\b(no|not|never|without)\b/i.test(statement);
  return {
    status: addedNumbers.length || changedNegation ? 'contradicted' as const : 'unverified' as const,
    evidenceIds: [] as string[],
    newClaims: [...new Set([...newClaims, ...addedNumbers])],
    reason: addedNumbers.length ? 'New or changed quantities/dates are blocked.' : changedNegation ?
      'A source negation may have been removed; blocked for review.' :
      'Changed wording requires human verification, including relationships, scope and omitted facts.',
  };
}

export function verifyRewrite(original: string, variants: Record<string, string>) {
  const inventory = inventoryFacts(original);
  return { inventory, statements: Object.fromEntries(Object.entries(variants).map(([key, value]) =>
    [key, verifyStatement(value, inventory)])), requiresApproval: true };
}
