import { describe, it, expect, beforeEach } from 'vitest';
import type { ScanHistory } from '@/types';
import {
  getScanHistory,
  saveScanHistory,
  deleteScanHistory,
  clearAllLocalData,
  exportAllDataAsJSON,
} from '../lib/storage/history-store';

describe('Resilient Storage Layer', () => {
  beforeEach(() => {
    clearAllLocalData();
  });

  it('saves and retrieves scan histories with versioning', () => {
    const mockScan: ScanHistory = {
      id: 'scan-1',
      fileName: 'test.pdf',
      overallScore: 85,
      grade: 'A',
      atsScore: 90,
      mode: 'general',
      analyzedAt: new Date().toISOString(),
      dimensions: [],
      topActions: [],
      skillGapsCount: 0,
      resumePreview: 'Preview',
      resumeText: 'Text',
    };

    saveScanHistory(mockScan);
    const history = getScanHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('scan-1');
  });

  it('deletes scan entries and clears local data properly', () => {
    const mockScan: ScanHistory = {
      id: 'scan-2',
      fileName: 'test2.pdf',
      overallScore: 75,
      grade: 'B',
      atsScore: 80,
      mode: 'general',
      analyzedAt: new Date().toISOString(),
      dimensions: [],
      topActions: [],
      skillGapsCount: 0,
      resumePreview: 'Preview',
      resumeText: 'Text',
    };

    saveScanHistory(mockScan);
    deleteScanHistory('scan-2');
    expect(getScanHistory().length).toBe(0);
  });

  it('exports structured JSON backup', () => {
    const jsonStr = exportAllDataAsJSON();
    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe('2.0');
    expect(Array.isArray(parsed.scanHistory)).toBe(true);
  });
});
