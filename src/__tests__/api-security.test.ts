import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as critiqueHandler } from '@/app/api/ai/critique/route';
import { POST as rewriteHandler } from '@/app/api/ai/rewrite/route';
import { POST as coverLetterHandler } from '@/app/api/ai/cover-letter/route';
import { resetRateLimitStore, checkRateLimit } from '@/lib/rate-limit';
import { parseResume } from '@/lib/parsing/resume-parser';
import * as providerModule from '@/lib/ai/provider';
import * as budgetModule from '@/lib/ai/budget';

describe('P0 Security Protections: Rate Limiting, Strict Schema Validation, and Error Sanitization', () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. RATE LIMITING TESTS
  // =========================================================================
  describe('Per-IP Sliding-Window Rate Limiting', () => {
    it('allows requests up to the threshold and returns 429 on burst limit breach', async () => {
      const clientIp = '198.51.100.25';
      const limit = 5;
      const windowMs = 60_000;

      // Make 5 permitted requests
      for (let i = 0; i < limit; i++) {
        const dummyReq = new NextRequest('http://localhost:3000/api/ai/critique', {
          method: 'POST',
          headers: { 'x-forwarded-for': clientIp },
        });
        const result = checkRateLimit(dummyReq, { limit, windowMs, keyPrefix: 'test-bucket' });
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(limit - (i + 1));
      }

      // 6th burst request must be blocked
      const burstReq = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        headers: { 'x-forwarded-for': clientIp },
      });
      const blockedResult = checkRateLimit(burstReq, { limit, windowMs, keyPrefix: 'test-bucket' });
      expect(blockedResult.success).toBe(false);
      expect(blockedResult.remaining).toBe(0);
      expect(blockedResult.retryAfterSeconds).toBeGreaterThan(0);

      // A different IP is NOT blocked
      const differentIpReq = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        headers: { 'x-forwarded-for': '198.51.100.26' },
      });
      const allowedOtherIp = checkRateLimit(differentIpReq, { limit, windowMs, keyPrefix: 'test-bucket' });
      expect(allowedOtherIp.success).toBe(true);
    });

    it('returns HTTP 429 with correct headers from critique route upon burst exhaustion', async () => {
      const testIp = '203.0.113.10';
      const reqBody = JSON.stringify({
        resumeText: 'Experienced Senior Engineer with 10 years distributed systems background.',
      });

      // /api/ai/critique has limit 10
      for (let i = 0; i < 10; i++) {
        const req = new NextRequest('http://localhost:3000/api/ai/critique', {
          method: 'POST',
          body: reqBody,
          headers: { 'Content-Type': 'application/json', 'x-forwarded-for': testIp },
        });
        const res = await critiqueHandler(req);
        expect(res.status).toBe(200);
      }

      // 11th request must return 429
      const burstReq = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        body: reqBody,
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': testIp },
      });
      const burstRes = await critiqueHandler(burstReq);
      expect(burstRes.status).toBe(429);

      const headers = burstRes.headers;
      expect(headers.get('Retry-After')).toBeDefined();
      expect(headers.get('X-RateLimit-Limit')).toBe('10');
      expect(headers.get('X-RateLimit-Remaining')).toBe('0');

      const data = await burstRes.json();
      expect(data.error).toBe('Too Many Requests');
      expect(data.message).toContain('Rate limit exceeded');
    });

    it('enforces rate limiting on rewrite route', async () => {
      const testIp = '203.0.113.99';

      // Rewrite route: limit 15
      for (let i = 0; i < 15; i++) {
        const req = new NextRequest('http://localhost:3000/api/ai/rewrite', {
          method: 'POST',
          body: JSON.stringify({ bullet: 'Built distributed caching system with Redis' }),
          headers: { 'Content-Type': 'application/json', 'x-forwarded-for': testIp },
        });
        const res = await rewriteHandler(req);
        expect(res.status).toBe(200);
      }
      const rewriteBurst = new NextRequest('http://localhost:3000/api/ai/rewrite', {
        method: 'POST',
        body: JSON.stringify({ bullet: 'Built distributed caching system with Redis' }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': testIp },
      });
      const rewriteBurstRes = await rewriteHandler(rewriteBurst);
      expect(rewriteBurstRes.status).toBe(429);
    });
  });

  // =========================================================================
  // 2. SCHEMA VALIDATION & REJECTION TESTS
  // =========================================================================
  describe('Zod Schema Validation & Rejection of Malformed Payloads', () => {
    it('rejects malformed resume object in /api/ai/critique with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        body: JSON.stringify({
          resume: { malformedField: 'not a valid resume parsed object' },
        }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
      });

      const res = await critiqueHandler(req);
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body.details).toBeDefined();
    });

    it('rejects malformed job object in /api/ai/critique with 400', async () => {
      const sampleResume = parseResume('Jane Doe\njane@example.com\nExperience: Software Engineer at Acorn', 'sample.txt');
      const req = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        body: JSON.stringify({
          resume: sampleResume,
          job: { brokenJob: 12345 },
        }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.2' },
      });

      const res = await critiqueHandler(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    it('rejects malformed resume in /api/ai/cover-letter with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          resume: { experience: 'should be an array' },
          tone: 'professional',
        }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
      });

      const res = await coverLetterHandler(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.details).toBeDefined();
    });

    it('accepts valid parsed resume and generates response cleanly', async () => {
      const sampleResume = parseResume(
        'Sarah Connor\nsarah@defense.net | 555-123-4567\n\nEXPERIENCE\nStaff Engineer | CyberOrg | 2020 - Present\n• Built autonomous monitoring pipeline with Go and Kubernetes.\n\nSKILLS\nGo, Python, Docker, Kubernetes',
        'sarah.txt'
      );

      const req = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        body: JSON.stringify({
          resume: sampleResume,
        }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.4' },
      });

      const res = await critiqueHandler(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.sections).toBeDefined();
    });
  });

  // =========================================================================
  // 3. ERROR SANITIZATION TESTS
  // =========================================================================
  describe('Provider failure fallback and error sanitization', () => {
    beforeEach(() => {
      vi.spyOn(providerModule, 'isAIConfigured').mockReturnValue(true);
      vi.spyOn(budgetModule, 'configuredBudget').mockReturnValue({ reserve: async () => ({ release: async () => {} }) });
    });
    it('sanitizes upstream external provider errors and never leaks raw error strings in critique route', async () => {
      const secretLeak = 'SECRET_CLAUDE_API_KEY_EXPOSED: Upstream 502 Bad Gateway with stack trace at /var/secrets/key.pem';

      // Mock getAIProvider to throw a provider error with sensitive details
      vi.spyOn(providerModule, 'getAIProvider').mockReturnValue({
        generateCritique: vi.fn().mockRejectedValue(new Error(secretLeak)),
        rewriteBullet: vi.fn(),
        generateCoverLetter: vi.fn(),
      });

      // Suppress console.error in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const req = new NextRequest('http://localhost:3000/api/ai/critique', {
        method: 'POST',
        body: JSON.stringify({
          resumeText: 'Software Engineer with 5 years experience in building APIs and scalable systems.',
        }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.10', 'x-ai-consent': 'true' },
      });

      const res = await critiqueHandler(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.isLLMGenerated).toBe(false);
      expect(body.providerStatus).toBe('heuristic-provider-unavailable');
      expect(providerModule.getAIProvider).toHaveBeenCalled();
      // Must NOT leak raw error text or stack trace to client
      expect(JSON.stringify(body)).not.toContain('SECRET_CLAUDE_API_KEY_EXPOSED');

      // Must return a generic, safe client-facing message

      // Logs must contain only a safe event, never the provider payload
      expect(JSON.stringify(body)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
      expect(body.isLLMGenerated).toBe(false);
      expect(JSON.stringify(consoleSpy.mock.calls)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
    });

    it('sanitizes external provider errors in rewrite route', async () => {
      const geminiLeak = 'GEMINI_QUOTA_EXCEEDED: Resource has been exhausted (e.g. check quota at https://cloud.google.com/billing)';

      vi.spyOn(providerModule, 'getAIProvider').mockReturnValue({
        rewriteBullet: vi.fn().mockRejectedValue(new Error(geminiLeak)),
        generateCritique: vi.fn(),
        generateCoverLetter: vi.fn(),
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const req = new NextRequest('http://localhost:3000/api/ai/rewrite', {
        method: 'POST',
        body: JSON.stringify({ bullet: 'Worked on database queries and caching' }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.11', 'x-ai-consent': 'true' },
      });

      const res = await rewriteHandler(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(JSON.stringify(body)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
      expect(body.isLLMGenerated).toBe(false);
      expect(JSON.stringify(consoleSpy.mock.calls)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
    });

    it('sanitizes errors in cover letter route', async () => {
      const sampleResume = parseResume('John Doe\njohn@example.com\nExperience: Developer', 'sample.txt');
      vi.spyOn(providerModule, 'getAIProvider').mockReturnValue({
        generateCoverLetter: vi.fn().mockRejectedValue(new Error('ANTHROPIC_TIMEOUT: upstream socket hang up')),
        generateCritique: vi.fn(),
        rewriteBullet: vi.fn(),
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const req = new NextRequest('http://localhost:3000/api/ai/cover-letter', {
        method: 'POST',
        body: JSON.stringify({ resume: sampleResume }),
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.12', 'x-ai-consent': 'true' },
      });

      const res = await coverLetterHandler(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(JSON.stringify(body)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
      expect(body.isLLMGenerated).toBe(false);
      expect(JSON.stringify(consoleSpy.mock.calls)).not.toMatch(/SECRET_CLAUDE|GEMINI_QUOTA|ANTHROPIC_TIMEOUT/);
    });
  });
});
