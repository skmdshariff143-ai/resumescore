import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';

const AnalyzeRequestSchema = z.object({
  resumeText: z.string().min(20, 'Resume text is too brief to analyze.'),
  jobText: z.string().optional(),
  mode: z.enum(['general', 'job_match']).default('general'),
  fileName: z.string().default('resume.txt'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AnalyzeRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid analysis request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { resumeText, jobText, mode, fileName } = validated.data;
    const parsedResume = parseResume(resumeText, fileName);

    let parsedJob = undefined;
    if (mode === 'job_match' && jobText && jobText.trim().length > 20) {
      parsedJob = parseJobDescription(jobText);
    }

    const score = calculateResumeScore(parsedResume, parsedJob, mode);

    return NextResponse.json({ success: true, data: score });
  } catch (err: unknown) {
    console.error('Analysis error:', err);
    return NextResponse.json(
      { error: 'Failed to process resume analysis', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
