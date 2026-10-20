import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getAIProvider,
  isAIConfigured,
  defaultAIProvider,
  RewriteResponseSchema,
} from '../lib/ai/provider';
import { ClaudeAIProvider, CritiqueResponseSchema } from '../lib/ai/claude-provider';
import { parseResume } from '../lib/parsing/resume-parser';

const { createMessage } = vi.hoisted(() => ({ createMessage: vi.fn() }));
vi.mock('@anthropic-ai/sdk', () => ({
  default: class { messages = { create: createMessage }; },
}));

describe('AI Provider Architecture & Claude Integration', () => {
  const originalApiKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    createMessage.mockReset();
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalApiKey) {
      process.env.ANTHROPIC_API_KEY = originalApiKey;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  it('defaults to HeuristicAIProvider when ANTHROPIC_API_KEY is not set', () => {
    expect(isAIConfigured()).toBe(false);
    const provider = getAIProvider();
    expect(provider).toBe(defaultAIProvider);
  });

  it('instantiates ClaudeAIProvider when ANTHROPIC_API_KEY is present', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-12345';
    expect(isAIConfigured()).toBe(true);
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(ClaudeAIProvider);
  });

  it('validates rewrite response schema properly', () => {
    const validRewrite = {
      xyzFormula: 'Architected system X delivering 30% performance boost by doing Y.',
      metricsDriven: 'Increased throughput by 40% through caching redesign.',
      leadership: 'Spearheaded team migration across 3 services.',
      reasoning: 'Applied strong action verbs and quantified impact.',
      placeholders: ['[Add metric: % or $]'],
    };

    const parsed = RewriteResponseSchema.parse(validRewrite);
    expect(parsed.xyzFormula).toBe(validRewrite.xyzFormula);
  });

  it('validates critique response schema properly', () => {
    const validCritique = {
      sections: [
        { name: 'Experience', feedback: 'Strong achievements listed.', rating: 'strong' as const },
        { name: 'Skills', feedback: 'Adequate coverage.', rating: 'adequate' as const },
      ],
      atsRisks: [
        { issue: 'Two columns', severity: 'warning' as const, suggestion: 'Use single column.' },
      ],
      overallNarrative: 'Well rounded profile with good trajectory.',
      keyStrengths: ['Python', 'PostgreSQL'],
      immediateImprovements: ['Add more metrics'],
    };

    const parsed = CritiqueResponseSchema.parse(validCritique);
    expect(parsed.sections.length).toBe(2);
    expect(parsed.atsRisks[0].severity).toBe('warning');
  });

  it('sanitizes the error when Claude API fails', async () => {
    // Reject at the SDK boundary: invalid keys must never trigger real requests.
    createMessage.mockRejectedValue(new Error('private provider failure with test-only credential'));
    const network = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected HTTP in offline test'));
    const logging = vi.spyOn(console, 'error').mockImplementation(() => {});
    const claudeProvider = new ClaudeAIProvider('invalid-key');
    const resume = parseResume('John Doe\njohn@example.com\n\nEXPERIENCE\nDeveloper at Tech Co\n• Built backend APIs in Node.js', 'resume.txt');

    await expect(claudeProvider.rewriteBullet('Built backend APIs in Node.js', ['Node.js'])).rejects.toThrow(
      'AI provider unavailable. Please try again later.'
    );

    await expect(claudeProvider.generateCritique(resume)).rejects.toThrow(
      'AI provider unavailable. Please try again later.'
    );
    expect(createMessage).toHaveBeenCalledTimes(2);
    expect(network).not.toHaveBeenCalled();
    expect(logging.mock.calls).toEqual([
      [JSON.stringify({ event: 'ai_provider_failed' })],
      [JSON.stringify({ event: 'ai_provider_failed' })],
    ]);
  });
});
