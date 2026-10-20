import { inventoryFacts, verifyRewrite } from '@/lib/ai/factuality';
import { readRequestJSON, requestErrorResponse } from '@/lib/validation/request';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { controlledAI } from '@/lib/ai/controlled';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

const RewriteRequestSchema = z.object({
  bullet: z.string().max(4000).min(5, 'Bullet text is too short.'),
  technologies: z.array(z.string().max(100)).max(40).default([]),
  roleContext: z.string().max(200).default('Target role'),
}).strict();

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 15 req/min per IP
  const rateLimitResult = checkRateLimit(req, { limit: 15, windowMs: 60_000, keyPrefix: 'ai-rewrite' });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await readRequestJSON(req);
    const validated = RewriteRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid rewrite request', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { bullet, technologies, roleContext } = validated.data;
    const sourceInventory = inventoryFacts(bullet);
    const result = await controlledAI(req.headers.get('x-ai-consent') === 'true', provider => provider.rewriteBullet(bullet, technologies.filter(t => bullet.toLowerCase().includes(t.toLowerCase())), roleContext), JSON.stringify(validated.data));
    const verification = verifyRewrite(bullet, { xyzFormula: result.data.xyzFormula, metricsDriven: result.data.metricsDriven, leadership: result.data.leadership });
    // Contradicted candidates never leave the API as usable rewrites.
    for (const key of ['xyzFormula', 'metricsDriven', 'leadership'] as const) {
      if (verification.statements[key].status === 'contradicted') result.data[key] = bullet;
    }

    return NextResponse.json({
      success: true,
      ...result,
      verification,
      sourceInventory,
    });
  } catch (err: unknown) {
    return requestErrorResponse(err);
  }
}
