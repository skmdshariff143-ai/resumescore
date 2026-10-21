import { NextRequest, NextResponse } from 'next/server';

export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Bound bytes before JSON parsing; do not trust Content-Length. */
export async function readRequestJSON(req: NextRequest): Promise<unknown> {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) {
    throw new RequestError(403, 'Cross-origin requests are not allowed.');
  }
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    throw new RequestError(403, 'Cross-site requests are not allowed.');
  }
  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new RequestError(415, 'Send application/json.');
  }
  const reader = req.body?.getReader();
  if (!reader) throw new RequestError(400, 'A JSON request body is required.');
  const chunks: Uint8Array[] = [];
  let length = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel(); }, 10_000);
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > 256_000) {
        await reader.cancel();
        throw new RequestError(413, 'Request is too large.');
      }
      chunks.push(part.value);
    }
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
  if (timedOut) throw new RequestError(408, 'Request timed out.');
  let value: unknown;
  try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { throw new RequestError(400, 'Invalid JSON request.'); }
  validateShape(value);
  return value;
}

function validateShape(value: unknown, depth = 0): void {
  if (depth > 12) throw new RequestError(400, 'Request nesting is too deep.');
  if (typeof value === 'string' && value.length > 60_000) throw new RequestError(413, 'Text is too long.');
  if (Array.isArray(value)) {
    if (value.length > 300) throw new RequestError(413, 'Too many items.');
    value.forEach(item => validateShape(item, depth + 1));
  } else if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length > 80) throw new RequestError(413, 'Too many fields.');
    for (const [key, item] of entries) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new RequestError(400, 'Invalid field.');
      validateShape(item, depth + 1);
    }
  }
}

export function requestErrorResponse(error: unknown): NextResponse {
  const status = error instanceof RequestError ? error.status : 500;
  if (status === 500) console.error(JSON.stringify({ event: 'api_request_failed', status }));
  return NextResponse.json({
    error: error instanceof RequestError ? error.message : 'Unable to process the request. Please try again.',
  }, { status, headers: { 'Cache-Control': 'no-store' } });
}
