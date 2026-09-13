import { describe, it, expect } from 'vitest';
import { analyzeBullet } from '../lib/impact/impact-evaluator';

describe('Impact Evaluator & Anti-Hallucination Rewrites', () => {
  it('classifies strong bullets with action verbs and quantifiable metrics as Excellent/Strong', () => {
    const bullet = 'Architected a distributed payment gateway in Go, reducing latency by 45% for 1M users.';
    const analysis = analyzeBullet(bullet, 0);

    expect(analysis.strength).toMatch(/Strong|Excellent/);
    expect(analysis.hasQuantifiableMetric).toBe(true);
    expect(analysis.actionVerb).toBe('architected');
  });

  it('never fabricates candidate metrics when rewriting weak bullets', () => {
    const weakBullet = 'Worked on backend APIs with Node.js.';
    const analysis = analyzeBullet(weakBullet, 1);

    expect(analysis.strength).toMatch(/Weak|Developing/);
    expect(analysis.hasQuantifiableMetric).toBe(false);
    // Verified placeholder inclusion
    expect(analysis.rewritten).toContain('[Add genuine metric');
    expect(analysis.placeholdersNeeded?.length).toBeGreaterThan(0);
  });
});
