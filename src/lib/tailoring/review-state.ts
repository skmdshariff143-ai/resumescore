import type { TailoringSuggestion } from './types';

export type Decision = 'accepted' | 'rejected';
interface Snapshot {
  decisions: Record<string, Decision>;
  userEvidence: Record<string, TailoringSuggestion>;
}
export interface ReviewState extends Snapshot {
  history: Snapshot[];
}
export type ReviewAction =
  | { type: 'accept' | 'reject' | 'clear' | 'remove-user-evidence'; id: string }
  | { type: 'accept-all-supported'; suggestions: TailoringSuggestion[] }
  | { type: 'add-user-evidence'; suggestion: TailoringSuggestion }
  | { type: 'undo' | 'reset' };

const HISTORY_LIMIT = 20;
function without<T>(record: Record<string, T>, key: string): Record<string, T> {
  return Object.fromEntries(Object.entries(record).filter(([id]) => id !== key));
}

export const initialReviewState = (): ReviewState => ({ decisions: {}, userEvidence: {}, history: [] });

function record(state: ReviewState, next: Snapshot): ReviewState {
  const snapshot = { decisions: state.decisions, userEvidence: state.userEvidence };
  return { ...next, history: [...state.history.slice(-(HISTORY_LIMIT - 1)), snapshot] };
}

export function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  const { decisions, userEvidence } = state;
  switch (action.type) {
    case 'accept': case 'reject':
      return record(state, { userEvidence, decisions: { ...decisions, [action.id]: action.type === 'accept' ? 'accepted' : 'rejected' } });
    case 'clear':
      return record(state, { userEvidence, decisions: without(decisions, action.id) });
    case 'accept-all-supported': {
      // Only undecided, supported items: an explicit rejection is never overridden.
      const ids = action.suggestions.filter(item => item.supported && !decisions[item.id]).map(item => item.id);
      if (!ids.length) return state;
      return record(state, { userEvidence, decisions: { ...decisions, ...Object.fromEntries(ids.map(id => [id, 'accepted' as const])) } });
    }
    case 'add-user-evidence':
      return record(state, {
        userEvidence: { ...userEvidence, [action.suggestion.id]: action.suggestion },
        decisions: { ...decisions, [action.suggestion.id]: 'accepted' },
      });
    case 'remove-user-evidence':
      return record(state, { userEvidence: without(userEvidence, action.id), decisions: without(decisions, action.id) });
    case 'undo': {
      const previous = state.history[state.history.length - 1];
      return previous ? { ...previous, history: state.history.slice(0, -1) } : state;
    }
    case 'reset':
      return initialReviewState();
  }
}

/** Accepted suggestions in display order, with user-supplied wording substituted in. */
export function acceptedSuggestions(state: ReviewState, suggestions: TailoringSuggestion[]): TailoringSuggestion[] {
  return suggestions
    .map(item => state.userEvidence[item.id] ?? item)
    .filter(item => state.decisions[item.id] === 'accepted' && item.proposed !== null);
}
