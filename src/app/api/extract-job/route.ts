import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseJobDescription } from '@/lib/jobs/job-parser';

const ExtractJobSchema = z.object({
  url: z.string().url('Please enter a valid URL.'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ExtractJobSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid URL supplied', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { url } = validated.data;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch job page (HTTP ${response.status}). Please paste the job description directly.` },
        { status: 422 }
      );
    }

    const html = await response.text();
    // Clean HTML tags and scripts
    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (textOnly.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract job text from the URL. Please copy and paste the job description directly.' },
        { status: 422 }
      );
    }

    const parsedJob = parseJobDescription(textOnly.slice(0, 8000));
    return NextResponse.json({ success: true, data: parsedJob, rawText: textOnly.slice(0, 8000) });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Could not retrieve job URL. Please paste the job text directly.', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
