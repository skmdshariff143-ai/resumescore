/**
 * Resilient storage manager with versioning (v2), corruption recovery,
 * in-memory fallback for test/SSR environments, quota handling, and GDPR export/wipe.
 */

import type { DimensionScore, SavedJobMatch, ScanHistory } from '@/types';

const STORAGE_KEYS = {
  HISTORY_V2: 'resumescore_scans_v2',
  SAVED_JOBS_V2: 'resumescore_saved_jobs_v2',
  RESUME_VERSIONS_V2: 'resumescore_resume_versions_v2',
  LEGACY_HISTORY: 'resume_scan_history',
};

// In-memory store for Node / SSR / Test environments
const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    if (isLocalStorageAvailable()) {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } else {
      const raw = memoryStore[key];
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`Failed to parse storage key "${key}", returning fallback.`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, serialized);
      return true;
    } else {
      memoryStore[key] = serialized;
      return true;
    }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && (('name' in err && (err as { name: unknown }).name === 'QuotaExceededError') || ('code' in err && (err as { code: unknown }).code === 22))) {
      try {
        const scans = safeGetItem<ScanHistory[]>(key, []);
        if (Array.isArray(scans) && scans.length > 5) {
          const trimmed = scans.slice(0, 5);
          if (isLocalStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(trimmed));
          } else {
            memoryStore[key] = JSON.stringify(trimmed);
          }
          return true;
        }
      } catch (innerErr) {
        console.error('Failed recovery from quota exhaustion', innerErr);
      }
    }
    return false;
  }
}

export function getScanHistory(): ScanHistory[] {
  const current = safeGetItem<ScanHistory[]>(STORAGE_KEYS.HISTORY_V2, []);
  if (current.length > 0) return current;

  const legacy = safeGetItem<Record<string, unknown>[]>(STORAGE_KEYS.LEGACY_HISTORY, []);
  if (legacy.length > 0) {
    const migrated: ScanHistory[] = legacy.map((item, idx) => ({
      id: (item.id as string) || `migrated-${idx}`,
      fileName: (item.fileName as string) || 'Legacy Resume',
      overallScore: (item.overall as number) || (item.overallScore as number) || 70,
      grade: (item.grade as string) || 'B',
      atsScore: (item.atsScore as number) || (item.overall as number) || 70,
      mode: 'general',
      analyzedAt: (item.analyzedAt as string) || new Date().toISOString(),
      dimensions: (item.dimensions as DimensionScore[]) || [],
      topActions: [],
      skillGapsCount: 0,
      resumePreview: (item.resumePreview as string) || '',
      resumeText: (item.resumeText as string) || '',
      versionNumber: idx + 1,
    }));
    safeSetItem(STORAGE_KEYS.HISTORY_V2, migrated);
    return migrated;
  }

  return [];
}

export function saveScanHistory(entry: ScanHistory): boolean {
  const history = getScanHistory();
  const filtered = history.filter((h) => h.id !== entry.id);
  const updated = [entry, ...filtered].slice(0, 20);
  return safeSetItem(STORAGE_KEYS.HISTORY_V2, updated);
}

export function deleteScanHistory(id: string): boolean {
  const history = getScanHistory();
  const updated = history.filter((h) => h.id !== id);
  return safeSetItem(STORAGE_KEYS.HISTORY_V2, updated);
}

export function getSavedJobs(): SavedJobMatch[] {
  return safeGetItem<SavedJobMatch[]>(STORAGE_KEYS.SAVED_JOBS_V2, []);
}

export function saveJobMatch(job: SavedJobMatch): boolean {
  const current = getSavedJobs();
  const filtered = current.filter((j) => j.id !== job.id);
  const updated = [job, ...filtered].slice(0, 30);
  return safeSetItem(STORAGE_KEYS.SAVED_JOBS_V2, updated);
}

export function deleteSavedJob(id: string): boolean {
  const current = getSavedJobs();
  const updated = current.filter((j) => j.id !== id);
  return safeSetItem(STORAGE_KEYS.SAVED_JOBS_V2, updated);
}

export function clearAllLocalData(): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEYS.HISTORY_V2);
      localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS_V2);
      localStorage.removeItem(STORAGE_KEYS.RESUME_VERSIONS_V2);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_HISTORY);
    }
    delete memoryStore[STORAGE_KEYS.HISTORY_V2];
    delete memoryStore[STORAGE_KEYS.SAVED_JOBS_V2];
    delete memoryStore[STORAGE_KEYS.RESUME_VERSIONS_V2];
    delete memoryStore[STORAGE_KEYS.LEGACY_HISTORY];
  } catch (err) {
    console.error('Failed to clear local data', err);
  }
}

export function exportAllDataAsJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    scanHistory: getScanHistory(),
    savedJobs: getSavedJobs(),
  };
  return JSON.stringify(data, null, 2);
}
