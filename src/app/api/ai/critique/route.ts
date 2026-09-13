import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider, isAIConfigured } from '@/lib/ai/provider';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';

const CritiqueRequestSchema = z.object({
  resumeText: z.string().min(20, 'Resume text is too brief to analyze.').optional(),
  resume: z.any().optional(),
  jobText: z.string().optional(),
  job: z.any().optional(),
  fileName: z.string().default('resume.txt'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CritiqueRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid critique request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { resumeText, resume, jobText, job, fileName } = validated.data;

    let parsedResume = resume;
    if (!parsedResume && resumeText) {
      parsedResume = parseResume(resumeText, fileName);
    }

    if (!parsedResume) {
      return NextResponse.json(
        { error: 'No resume content provided for critique.' },
        { status: 400 }
      );
    }

    let parsedJob = job;
    if (!parsedJob && jobText && jobText.trim().length > 20) {
      parsedJob = parseJobDescription(jobText);
    }

    const provider = getAIProvider();
    const critique = await provider.generateCritique(parsedResume, parsedJob);

    return NextResponse.json({
      success: true,
      data: critique,
      isLLMGenerated: isAIConfigured(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to generate resume critique',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
