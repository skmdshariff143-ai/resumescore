import { readRequestJSON, requestErrorResponse } from '@/lib/validation/request';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { controlledAI } from '@/lib/ai/controlled';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { ResumeParsedSchema, JobParsedSchema } from '@/lib/validation/schemas';
import type { ResumeParsed, JobParsed } from '@/types';

const CritiqueRequestSchema = z.object({
  resumeText: z.string().min(20, 'Resume text is too brief to analyze.').optional().nullable(),
  resume: ResumeParsedSchema.optional().nullable(),
  jobText: z.string().optional().nullable(),
  job: JobParsedSchema.optional().nullable(),
  fileName: z.string().default('resume.txt'),
}).strict();

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 10 req/min per IP
  const rateLimitResult = checkRateLimit(req, { limit: 10, windowMs: 60_000, keyPrefix: 'ai-critique' });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await readRequestJSON(req);
    const validated = CritiqueRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid critique request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { resumeText, resume, jobText, job, fileName } = validated.data;

    let parsedResume: ResumeParsed | undefined = resume as unknown as ResumeParsed | undefined;
    if (!parsedResume && resumeText) {
      parsedResume = parseResume(resumeText, fileName);
    }

    if (!parsedResume) {
      return NextResponse.json(
        { error: 'No resume content provided for critique.' },
        { status: 400 }
      );
    }

    let parsedJob: JobParsed | undefined = job as unknown as JobParsed | undefined;
    if (!parsedJob && jobText && jobText.trim().length > 20) {
      parsedJob = parseJobDescription(jobText);
    }

    const result = await controlledAI(req.headers.get('x-ai-consent') === 'true', provider => provider.generateCritique(parsedResume!, parsedJob), JSON.stringify(validated.data));

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: unknown) {
    return requestErrorResponse(err);
  }
}
