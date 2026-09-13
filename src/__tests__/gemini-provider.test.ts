import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAIProvider,
  isAIConfigured,
  defaultAIProvider,
  RewriteResponseSchema,
} from '../lib/ai/provider';
import { ClaudeAIProvider } from '../lib/ai/claude-provider';
import { GeminiAIProvider, GeminiCritiqueResponseSchema } from '../lib/ai/gemini-provider';
import { parseResume } from '../lib/parsing/resume-parser';

describe('AI Provider Architecture & Gemini Integration', () => {
  const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;
  const originalGoogleKey = process.env.GOOGLE_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
  });

  afterEach(() => {
    if (originalAnthropicKey) process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
    else delete process.env.ANTHROPIC_API_KEY;

    if (originalGeminiKey) process.env.GEMINI_API_KEY = originalGeminiKey;
    else delete process.env.GEMINI_API_KEY;

    if (originalGoogleKey) process.env.GOOGLE_API_KEY = originalGoogleKey;
    else delete process.env.GOOGLE_API_KEY;
  });

  it('defaults to HeuristicAIProvider when no API keys are set', () => {
    expect(isAIConfigured()).toBe(false);
    const provider = getAIProvider();
    expect(provider).toBe(defaultAIProvider);
  });

  it('instantiates GeminiAIProvider when GEMINI_API_KEY is present', () => {
    process.env.GEMINI_API_KEY = 'AIzaSyTestKey-12345';
    expect(isAIConfigured()).toBe(true);
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(GeminiAIProvider);
  });

  it('instantiates GeminiAIProvider when GOOGLE_API_KEY is present', () => {
    process.env.GOOGLE_API_KEY = 'AIzaSyGoogleKey-67890';
    expect(isAIConfigured()).toBe(true);
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(GeminiAIProvider);
  });

  it('prioritizes ANTHROPIC_API_KEY over GEMINI_API_KEY when both exist', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
    process.env.GEMINI_API_KEY = 'AIzaSyTestKey';
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

  it('validates Gemini critique response schema properly', () => {
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

    const parsed = GeminiCritiqueResponseSchema.parse(validCritique);
    expect(parsed.sections.length).toBe(2);
    expect(parsed.atsRisks[0].severity).toBe('warning');
  });

  it('captures and re-throws the real error when Gemini API fails', async () => {
    const geminiProvider = new GeminiAIProvider('invalid-gemini-key');
    const resume = parseResume(
      'John Doe\njohn@example.com\n\nEXPERIENCE\nDeveloper at Tech Co\n• Built backend APIs in Node.js',
      'resume.txt'
    );

    await expect(geminiProvider.rewriteBullet('Built backend APIs in Node.js', ['Node.js'])).rejects.toThrow(
      /Gemini AI API failure/
    );

    await expect(geminiProvider.generateCritique(resume)).rejects.toThrow(
      /Gemini AI API failure/
    );
  });
});
