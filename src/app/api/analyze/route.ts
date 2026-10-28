import { readRequestJSON, requestErrorResponse } from '@/lib/validation/request';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseResume, scoreResume, parseJob } from 'resumescore-core';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

const AnalyzeRequestSchema = z.object({
  resumeText: z.string().min(20, 'Resume text is too brief to analyze.'),
  jobText: z.string().optional(),
  mode: z.enum(['general', 'job_match']).default('general'),
  fileName: z.string().default('resume.txt'),
  careerLevel: z.enum(['student', 'internship', 'entry', 'experienced', 'senior', 'switcher']).default('experienced'),
  extraction: z.object({
    pageCountEstimate: z.number().int().min(1).max(20),
    extractionQuality: z.enum(['excellent', 'good', 'degraded', 'failed']),
    hasTwoColumns: z.boolean(),
    isScanned: z.boolean(),
  }).strict().optional(),
});

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 20 req/min per IP
  const rateLimitResult = checkRateLimit(req, { limit: 20, windowMs: 60_000, keyPrefix: 'analyze' });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await readRequestJSON(req);
    const validated = AnalyzeRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid analysis request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { resumeText, jobText, mode, fileName, careerLevel } = validated.data;
    if (mode === 'job_match' && (!jobText || jobText.trim().length < 20)) {
      return NextResponse.json({ error: 'Paste a job description of at least 20 characters.' }, { status: 400 });
    }
    const parsedResume = parseResume(resumeText, { fileName });
    if (validated.data.extraction) Object.assign(parsedResume.metadata, validated.data.extraction);

    let parsedJob = undefined;
    if (mode === 'job_match' && jobText && jobText.trim().length > 20) {
      parsedJob = parseJob(jobText);
    }

    const score = scoreResume(parsedResume, { job: parsedJob, mode, careerLevel });

    return NextResponse.json({ success: true, data: score });
  } catch (err: unknown) {
    return requestErrorResponse(err);
  }
}
