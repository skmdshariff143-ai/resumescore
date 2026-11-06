import type { PDFExtractionResult } from '@/lib/parsing/pdf-extractor';
import type { CareerLevel } from './rubric';
import type { AnalysisMode, ResumeScore } from '@/types';

/** Browser-only deterministic analysis shared by /analyze and /tailor. Modules load on demand. */
export async function analyzeLocally(input: {
  text: string; fileName: string; jobText: string; mode: AnalysisMode; careerLevel: CareerLevel; extraction?: PDFExtractionResult;
}): Promise<ResumeScore> {
  const [{ parseResume }, { parseJobDescription }, { calculateResumeScore }] = await Promise.all([
    import('@/lib/parsing/resume-parser'), import('@/lib/jobs/job-parser'), import('./scoring-engine'),
  ]);
  const parsed = parseResume(input.text, input.fileName);
  if (input.extraction) Object.assign(parsed.metadata, {
    pageCountEstimate: input.extraction.pageCount, extractionQuality: input.extraction.extractionQuality,
    hasTwoColumns: input.extraction.diagnostics.twoColumnDetected, isScanned: input.extraction.isScanned,
  });
  return calculateResumeScore(parsed, input.mode === 'job_match' ? parseJobDescription(input.jobText) : undefined,
    input.mode, input.careerLevel);
}
