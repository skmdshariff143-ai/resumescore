import { readRequestJSON, requestErrorResponse } from '@/lib/validation/request';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { controlledAI } from '@/lib/ai/controlled';
import { inventoryFacts, verifyStatement } from '@/lib/ai/factuality';
import { defaultAIProvider } from '@/lib/ai/provider';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { ResumeParsedSchema, JobParsedSchema } from '@/lib/validation/schemas';
import type { CoverLetterRequest } from '@/types';

const CoverLetterRequestSchema = z.object({
  resume: ResumeParsedSchema,
  job: JobParsedSchema.optional().nullable(),
  tone: z.enum(['professional', 'confident', 'concise', 'startup', 'technical']).default('professional'),
  customNotes: z.string().optional().nullable(),
}).strict();

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 10 req/min per IP
  const rateLimitResult = checkRateLimit(req, { limit: 10, windowMs: 60_000, keyPrefix: 'ai-cover-letter' });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await readRequestJSON(req);
    const validated = CoverLetterRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid cover letter request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const request = validated.data as unknown as CoverLetterRequest;
    const result = await controlledAI(req.headers.get('x-ai-consent') === 'true', provider => provider.generateCoverLetter(request), JSON.stringify(validated.data));
    const inventory = inventoryFacts(request.resume.rawText);
    const verification = result.data.bodyParagraphs.map(paragraph => verifyStatement(paragraph, inventory));
    // Free-form letters cannot be safely verified by lexical matching. Never
    // release unsupported external claims as a finished candidate document.
    if (result.isLLMGenerated && verification.some(item => item.status !== 'supported')) {
      result.data = await defaultAIProvider.generateCoverLetter(request);
      result.isLLMGenerated = false;
      result.providerStatus = 'heuristic-external-claims-unverified';
    }
    return NextResponse.json({
      success: true,
      ...result,
      verification,
    });
  } catch (err: unknown) {
    return requestErrorResponse(err);
  }
}
