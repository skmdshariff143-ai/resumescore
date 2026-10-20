import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as analyze } from '@/app/api/analyze/route';
import { POST as extract } from '@/app/api/extract-job/route';
import { POST as rewrite } from '@/app/api/ai/rewrite/route';
import { resetRateLimitStore } from '@/lib/rate-limit';
import { validateResumeFile } from '@/lib/parsing/file-validation';
import { HeuristicAIProvider } from '@/lib/ai/provider';
import * as providers from '@/lib/ai/provider';
import { parseResume } from '@/lib/parsing/resume-parser';

function request(path: string, body: string, headers = {}) {
  return new NextRequest(`http://localhost:3000/api/${path}`, {
    method: 'POST', body, headers: { 'content-type': 'application/json', ...headers },
  });
}

describe('V2 privacy and adversarial boundaries', () => {
  beforeEach(() => { resetRateLimitStore(); vi.restoreAllMocks(); });
  it.each(['http://127.0.0.1', 'http://169.254.169.254/latest/meta-data', 'http://[::1]',
    'http://2130706433', 'https://public.example/redirect-to-private', 'http://rebind.example',
    'file:///etc/passwd', 'http://10.0.0.1', 'http://user:pass@localhost'])('never fetches %s', async url => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const response = await extract(request('extract-job', JSON.stringify({ url })));
    expect([400, 503]).toContain(response.status);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('rejects invalid JSON with 400', async () => {
    expect((await analyze(request('analyze', '{'))).status).toBe(400);
  });
  it('rejects oversized bytes without trusting Content-Length', async () => {
    expect((await analyze(request('analyze', JSON.stringify({ resumeText: 'a'.repeat(300000) })))).status).toBe(413);
  });
  it('rejects deeply nested JSON', async () => {
    expect((await analyze(request('analyze', '['.repeat(20) + '0' + ']'.repeat(20)))).status).toBe(400);
  });
  it('rejects cross-origin submissions', async () => {
    expect((await analyze(request('analyze', '{}', { origin: 'https://evil.example' }))).status).toBe(403);
  });
  it('does not select an external provider without explicit consent', async () => {
    const select = vi.spyOn(providers, 'getAIProvider').mockImplementation(() => { throw new Error('must not run'); });
    const response = await rewrite(request('ai/rewrite', JSON.stringify({ bullet: 'Assisted with data entry.' })));
    expect(response.status).toBe(200);
    expect(select).not.toHaveBeenCalled();
    expect((await response.json()).isLLMGenerated).toBe(false);
  });
  it('preserves scope and metrics in heuristic rewrites', async () => {
    const bullet = 'Assisted with 12 invoices using Excel.';
    const output = await new HeuristicAIProvider().rewriteBullet(bullet, ['Python'], 'Accountant');
    expect(output.xyzFormula).toBe(bullet);
    expect(output.metricsDriven).toBe(bullet);
    expect(output.leadership).toBe(bullet);
  });
  it('does not invent a career for a fresher cover letter', async () => {
    const resume = parseResume('Jane Doe\njane@example.com\nEDUCATION\nBachelor of Arts\nSKILLS\nWriting', 'resume.txt');
    const output = await new HeuristicAIProvider().generateCoverLetter({ resume, tone: 'confident' });
    expect(output.bodyParagraphs.join(' ')).not.toMatch(/scalable systems|proven track|engineering rigor|leading technology/i);
  });
});

describe('File validation', () => {
  const bytes = (text: string) => new TextEncoder().encode(text);
  it('accepts UTF-8 text', () => expect(validateResumeFile('resume.TXT', bytes('José — résumé'))).toBe('txt'));
  it('rejects a renamed executable', () => expect(() => validateResumeFile('resume.pdf', bytes('MZ executable'))).toThrow());
  it('rejects unsupported formats', () => expect(() => validateResumeFile('resume.docx', bytes('PK archive'))).toThrow());
  it('rejects binary text', () => expect(() => validateResumeFile('resume.txt', bytes('hello\u0000world'))).toThrow());
  it('rejects huge files', () => expect(() => validateResumeFile('resume.pdf', new Uint8Array(6 * 1024 * 1024))).toThrow());
});
