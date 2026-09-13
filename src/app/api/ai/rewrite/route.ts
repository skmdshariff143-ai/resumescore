import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider, isAIConfigured } from '@/lib/ai/provider';

const RewriteRequestSchema = z.object({
  bullet: z.string().min(5, 'Bullet text is too short.'),
  technologies: z.array(z.string()).default([]),
  roleContext: z.string().default('Software Engineer'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RewriteRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid rewrite request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { bullet, technologies, roleContext } = validated.data;
    const provider = getAIProvider();
    const rewrite = await provider.rewriteBullet(bullet, technologies, roleContext);

    return NextResponse.json({
      success: true,
      data: rewrite,
      isLLMGenerated: isAIConfigured(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to rewrite bullet', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
