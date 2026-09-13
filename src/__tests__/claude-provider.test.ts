import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAIProvider,
  isAIConfigured,
  defaultAIProvider,
  RewriteResponseSchema,
} from '../lib/ai/provider';
import { ClaudeAIProvider, CritiqueResponseSchema } from '../lib/ai/claude-provider';
import { parseResume } from '../lib/parsing/resume-parser';

describe('AI Provider Architecture & Claude Integration', () => {
  const originalApiKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
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

  it('gracefully falls back to heuristic provider when Claude API fails', async () => {
    // Instantiate with dummy key so network call fails
    const claudeProvider = new ClaudeAIProvider('invalid-key');
    const resume = parseResume('John Doe\njohn@example.com\n\nEXPERIENCE\nDeveloper at Tech Co\n• Built backend APIs in Node.js', 'resume.txt');

    // Should not throw, should return fallback heuristic output
    const fallbackRewrite = await claudeProvider.rewriteBullet('Built backend APIs in Node.js', ['Node.js']);
    expect(fallbackRewrite).toBeDefined();
    expect(fallbackRewrite.xyzFormula).toContain('Node.js');
    expect(fallbackRewrite.placeholders.length).toBeGreaterThan(0);

    const fallbackCritique = await claudeProvider.generateCritique(resume);
    expect(fallbackCritique).toBeDefined();
    expect(fallbackCritique.isLLMGenerated).toBe(false);
  });
});
