import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider, isAIConfigured } from '@/lib/ai/provider';

const CoverLetterRequestSchema = z.object({
  resume: z.any(),
  job: z.any().optional(),
  tone: z.enum(['professional', 'confident', 'concise', 'startup', 'technical']).default('professional'),
  customNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CoverLetterRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid cover letter request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const coverLetter = await provider.generateCoverLetter(validated.data as unknown as Parameters<typeof provider.generateCoverLetter>[0]);
    return NextResponse.json({
      success: true,
      data: coverLetter,
      isLLMGenerated: isAIConfigured(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to generate cover letter', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
