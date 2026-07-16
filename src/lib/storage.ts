/**
 * localStorage helpers for persisting resume scan history.
 *
 * Every function is wrapped in try/catch so it is safe to call during
 * server-side rendering (where `localStorage` is not available).
 */

import type { ResumeScore, ScanHistory } from '@/types';

/** Key used in localStorage. */
const STORAGE_KEY = 'resumescore_history' as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a UUID v4 string.
 * Uses `crypto.randomUUID()` when available, otherwise falls back to a
 * simple RFC-4122-compliant generator.
 */
function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Read the raw history array from localStorage.
 * Returns an empty array when running on the server or if the stored value
 * cannot be parsed.
 */
function readStore(): ScanHistory[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ScanHistory[];
  } catch {
    return [];
  }
}

/**
 * Persist the history array to localStorage.
 * Silently no-ops during SSR.
 */
function writeStore(history: ScanHistory[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage full or unavailable — fail silently.
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Save a new scan result and return the created {@link ScanHistory} entry.
 *
 * @param score    - The analysis result to persist.
 * @param fileName - Original file name that was scanned.
 * @returns The newly created history entry (including its generated `id`).
 */
export function saveScan(score: ResumeScore, fileName: string): ScanHistory {
  const entry: ScanHistory = {
    id: uuid(),
    fileName,
    overallScore: score.overall,
    grade: score.grade,
    analyzedAt: score.analyzedAt,
    dimensions: score.dimensions,
  };

  const history = readStore();
  history.unshift(entry); // newest first
  writeStore(history);

  return entry;
}

/**
 * Retrieve all saved scans, sorted by date descending (newest first).
 */
export function getHistory(): ScanHistory[] {
  const history = readStore();

  // Ensure descending sort even if the stored data was modified externally.
  return history.sort(
    (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime(),
  );
}

/**
 * Delete a single scan by its `id`.
 *
 * @param id - The UUID of the scan to remove.
 */
export function deleteScan(id: string): void {
  const history = readStore();
  writeStore(history.filter((entry) => entry.id !== id));
}

/**
 * Remove **all** saved scans from storage.
 */
export function clearHistory(): void {
  writeStore([]);
}
