/**
 * Experience bullet analyzer and anti-hallucination rewrite generator.
 * Employs X-Y-Z formula, metrics-driven, and leadership frameworks while
 * strictly preventing metric fabrication using candidate placeholders.
 */

import type { BulletAnalysis, BulletStrength, ImpactAnalysis, ResumeParsed } from '@/types';
import { ACTION_VERBS, QUANTIFIABLE_PATTERNS, WEAK_WORDS } from '../keywords';
import { extractCategorizedSkills } from '../parsing/resume-parser';

function findActionVerb(text: string): string | undefined {
  const words = text.toLowerCase().split(/\s+/);
  const firstWord = words[0]?.replace(/[^a-z]/g, '');
  if ((ACTION_VERBS as readonly string[]).includes(firstWord)) {
    return firstWord;
  }
  for (let i = 0; i < Math.min(3, words.length); i++) {
    const w = words[i]?.replace(/[^a-z]/g, '');
    if ((ACTION_VERBS as readonly string[]).includes(w)) {
      return w;
    }
  }
  return undefined;
}

function classifyBulletStrength(score: number): BulletStrength {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Developing';
  return 'Weak';
}

export function analyzeBullet(bullet: string, index: number): BulletAnalysis {
  const trimmed = bullet.trim();
  const lower = trimmed.toLowerCase();
  const actionVerb = findActionVerb(trimmed);
  const { all: technologies } = extractCategorizedSkills(trimmed);
  const metricMatch = QUANTIFIABLE_PATTERNS.find((p) => p.test(trimmed));
  const hasQuantifiableMetric = Boolean(metricMatch);
  const metricFound = metricMatch ? trimmed.match(metricMatch)?.[0] : undefined;

  const issues: string[] = [];
  const suggestions: string[] = [];

  let score = 40;

  if (actionVerb) {
    score += 25;
  } else {
    issues.push('Does not start with a strong action verb.');
    suggestions.push('Begin with a high-impact verb (e.g. "Architected", "Engineered", "Optimized").');
  }

  if (hasQuantifiableMetric) {
    score += 30;
  } else {
    issues.push('Lacks measurable data or quantifiable impact.');
    suggestions.push('Add a specific metric (e.g., latency reduction %, user scale, or time saved).');
  }

  if (technologies.length > 0) {
    score += 15;
  }

  const weakWordFound = WEAK_WORDS.find((w) => lower.includes(w));
  if (weakWordFound) {
    score -= 15;
    issues.push(`Contains passive phrasing ("${weakWordFound}").`);
    suggestions.push('Replace passive phrases with active responsibility statements.');
  }

  score = Math.max(20, Math.min(100, score));
  const strength = classifyBulletStrength(score);

  // Generate 3 anti-hallucination rewrite variants
  const verbToUse = actionVerb
    ? actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)
    : 'Engineered';

  const techClause = technologies.length > 0 ? ` utilizing ${technologies.slice(0, 3).join(', ')}` : '';

  // Clean core description
  const cleanDesc = trimmed
    .replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '')
    .replace(/^(responsible for|worked on|helped with|assisted in)\s+/i, '');

  const xyzFormula = `${verbToUse} ${cleanDesc}${techClause}, resulting in [Add genuine metric: e.g. 25% efficiency gain or $X cost savings].`;
  const metricsDriven = `Accelerated performance by [Add genuine metric: e.g. 35%] by ${verbToUse.toLowerCase()}ing ${cleanDesc}${techClause}.`;
  const leadership = `Spearheaded the initiative to ${cleanDesc}${techClause}, aligning with cross-functional teams to deliver [Add measurable outcome].`;

  return {
    id: `bullet-${index}`,
    original: trimmed,
    score,
    strength,
    actionVerb,
    technologies,
    hasQuantifiableMetric,
    metricFound,
    taskComplexity: technologies.length >= 2 ? 'high' : 'medium',
    ownershipLevel: actionVerb && ['led', 'spearheaded', 'orchestrated', 'architected'].includes(actionVerb) ? 'lead' : 'individual',
    issues,
    suggestions,
    rewritten: xyzFormula,
    rewriteVariants: {
      xyzFormula,
      metricsDriven,
      leadership,
    },
    rewriteReason: hasQuantifiableMetric
      ? 'Strengthened phrasing and syntax while maintaining verified metric.'
      : 'Added structured X-Y-Z outcome framework with a candidate-supplied metric placeholder.',
    rewriteType: hasQuantifiableMetric ? 'improved_existing' : 'needs_candidate_info',
    placeholdersNeeded: hasQuantifiableMetric ? [] : ['[Add genuine metric: e.g. 25% efficiency gain]'],
  };
}

export function evaluateResumeImpact(resume: ResumeParsed): ImpactAnalysis {
  const allBullets: string[] = [];
  for (const exp of resume.experience) {
    allBullets.push(...exp.bullets);
  }

  const analyzed = allBullets.map((b, i) => analyzeBullet(b, i));
  const metricsCount = analyzed.filter((a) => a.hasQuantifiableMetric).length;
  const actionVerbsCount = analyzed.filter((a) => Boolean(a.actionVerb)).length;
  const strongBulletsCount = analyzed.filter((a) => a.score >= 70).length;
  const weakBulletsCount = analyzed.filter((a) => a.score < 50).length;

  let overallImpactScore = 50;
  if (allBullets.length > 0) {
    const metricRatio = metricsCount / allBullets.length;
    const verbRatio = actionVerbsCount / allBullets.length;
    overallImpactScore = Math.round(metricRatio * 50 + verbRatio * 35 + (strongBulletsCount / allBullets.length) * 15);
  }

  const quantificationOpportunities = analyzed
    .filter((a) => !a.hasQuantifiableMetric && a.original.length > 20)
    .slice(0, 4)
    .map((a) => ({
      bullet: a.original,
      suggestedMetricType: 'Efficiency / Performance / Scale',
      exampleMetric: 'Reduced processing latency by [X]% or supported [Y] active users',
    }));

  const detectedMetrics: string[] = [];
  for (const a of analyzed) {
    if (a.metricFound) {
      detectedMetrics.push(a.metricFound);
    }
  }

  return {
    overallImpactScore: Math.max(25, Math.min(100, overallImpactScore)),
    metricsCount,
    actionVerbsCount,
    strongBulletsCount,
    weakBulletsCount,
    quantificationOpportunities,
    detectedMetrics,
  };
}
