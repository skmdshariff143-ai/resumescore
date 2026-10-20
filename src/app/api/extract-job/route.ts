import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { readRequestJSON, requestErrorResponse } from '@/lib/validation/request';
import { z } from 'zod';

// No user URL is fetched until connection-pinned, restricted egress is available.
export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, { limit: 10, windowMs: 60_000, keyPrefix: 'extract-job' });
  if (!limit.success) return createRateLimitResponse(limit);
  try {
    const result = z.object({ url: z.string().max(2048).url() }).strict().safeParse(await readRequestJSON(req));
    if (!result.success) return NextResponse.json({ error: 'Invalid URL supplied.' }, { status: 400 });
    const url = new URL(result.data.url);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return NextResponse.json({ error: 'Use an HTTP or HTTPS job URL without credentials.' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'URL import is unavailable. Copy and paste the job description to match your resume.',
      code: 'URL_IMPORT_UNAVAILABLE',
    }, { status: 503 });
  } catch (error) { return requestErrorResponse(error); }
}
