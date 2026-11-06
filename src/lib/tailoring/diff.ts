import { claimTokens } from './verify';

export interface DiffSegment { text: string; added: boolean }

const isWord = (part: string) => /[\p{L}\p{N}]/u.test(part);

/** Word-level view of what a suggestion adds, so additions can be shown with <ins>, not colour alone. */
export function diffWords(original: string | null, proposed: string): DiffSegment[] {
  const known = new Set(claimTokens(original ?? ''));
  const parts = proposed.split(/([\p{L}\p{N}+#]+)/u).filter(Boolean);
  const added = parts.map(part => isWord(part) && !known.has(part.toLowerCase()));
  // Spaces between two added words belong to the same insertion ("Machine Learning").
  parts.forEach((part, index) => { if (/^\s+$/.test(part) && added[index - 1] && added[index + 1]) added[index] = true; });
  return parts.reduce<DiffSegment[]>((segments, text, index) => {
    const last = segments[segments.length - 1];
    if (last && last.added === added[index]) last.text += text;
    else segments.push({ text, added: added[index] });
    return segments;
  }, []);
}
