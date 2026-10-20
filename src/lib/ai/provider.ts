/**
 * AI Provider Architecture & Prompt Injection Defense.
 * - Delimits untrusted candidate & job inputs with XML tags (<user_resume_untrusted>).
 * - Implements strict Zod validation on every response with safe fallbacks.
 * - Supports HeuristicAIProvider (no external model; API execution is server-based) and ClaudeAIProvider.
 * - Zero secrets exposed to client.
 */

import { z } from 'zod';
import type {
  CoverLetterRequest,
  CoverLetterResponse,
  JobParsed,
  ResumeCritique,
  ResumeParsed,
} from '@/types';
import { ClaudeAIProvider } from './claude-provider';
import { GeminiAIProvider } from './gemini-provider';

// Strict Zod Schemas
export const RewriteResponseSchema = z.object({
  xyzFormula: z.string().min(10).max(4000),
  metricsDriven: z.string().min(10).max(4000),
  leadership: z.string().min(10).max(4000),
  reasoning: z.string().min(5).max(4000),
  placeholders: z.array(z.string().max(200)).max(20),
});

export type RewriteResponse = z.infer<typeof RewriteResponseSchema>;

export const CoverLetterResponseSchema = z.object({
  recipientTitle: z.string().max(300),
  companyName: z.string().max(300),
  roleTitle: z.string().max(300),
  salutation: z.string().max(600),
  bodyParagraphs: z.array(z.string().max(4000)).min(3).max(8),
  closing: z.string().max(300),
  candidateName: z.string().max(300),
  groundingFactCount: z.number().int().min(0).max(300),
  generatedAt: z.string().max(100),
});

export interface AIProvider {
  rewriteBullet(original: string, technologies: string[], roleContext?: string): Promise<RewriteResponse>;
  generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse>;
  generateCritique(resume: ResumeParsed, job?: JobParsed): Promise<ResumeCritique>;
}

/**
 * Heuristic AI Provider: Deterministic, privacy-first, local execution.
 * Anti-hallucination design with candidate metric placeholders.
 */
export class HeuristicAIProvider implements AIProvider {
  async rewriteBullet(
    original: string,
    _technologies: string[] = [],
    roleContext: string = 'Software Engineer'
  ): Promise<RewriteResponse> {
    void _technologies;
    // Preserve scope, seniority, technologies and metrics exactly as supplied.
    const clean = original.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '').trim();
    return {
      xyzFormula: clean,
      metricsDriven: clean,
      leadership: clean,
      reasoning: `Heuristic review for ${roleContext}: original facts preserved. Add an outcome or metric only if you can verify it. No leadership or technology claims were added.`,
      placeholders: [],
    };
  }

  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    const { resume, job } = request;
    const company = job?.company || 'Hiring Team';
    const role = job?.title || 'available position';
    const experience = resume.experience[0];
    const project = resume.projects[0];
    const sourceIncludes = (value: string) => Boolean(value.trim()) && resume.rawText.toLowerCase().includes(value.trim().toLowerCase());
    const listedSkills = resume.allSkills.filter(sourceIncludes).slice(0, 5);
    const evidence = [
      experience && sourceIncludes(experience.role) && sourceIncludes(experience.company)
        ? `My resume lists ${experience.role} at ${experience.company}. ${sourceIncludes(experience.bullets[0] || '') ? experience.bullets[0] : ''}` : '',
      project && sourceIncludes(project.name)
        ? `My projects include ${project.name}. ${sourceIncludes(project.description || '') ? project.description : ''}` : '',
      listedSkills.length ? `Skills listed in my resume include ${listedSkills.join(', ')}.` : '',
    ].filter(Boolean);
    return {
      recipientTitle: 'Hiring Manager', companyName: company, roleTitle: role,
      salutation: `Dear Hiring Team at ${company},`,
      bodyParagraphs: [
        `I am writing to apply for the ${role} role.`,
        evidence.join(' ') || 'Please see my attached resume for details of my background.',
        'Thank you for considering my application. I welcome the opportunity to discuss the role.',
      ],
      closing: 'Sincerely,', candidateName: sourceIncludes(resume.personalInfo.name) ? resume.personalInfo.name : 'Candidate',
      generatedAt: new Date().toISOString(), groundingFactCount: evidence.length,
    };
  }
  async generateCritique(resume: ResumeParsed, job?: JobParsed): Promise<ResumeCritique> {
    const hasExp = resume.experience.length > 0;
    const hasSkills = resume.allSkills.length > 0;
    const hasProjects = resume.projects.length > 0;
    const bulletsCount = resume.experience.reduce((acc, e) => acc + e.bullets.length, 0);

    const sections: ResumeCritique['sections'] = [
      {
        name: 'Work Experience',
        feedback: hasExp
          ? `Contains ${resume.experience.length} roles with ${bulletsCount} bullet points. Ensure each bullet highlights quantifiable outcomes rather than task lists.`
          : 'No standard work experience section detected. Consider adding prior roles, internships, or freelance engagements.',
        rating: hasExp && bulletsCount >= 4 ? 'strong' : hasExp ? 'adequate' : 'needs_work',
      },
      {
        name: 'Technical & Domain Skills',
        feedback: hasSkills
          ? `Detected ${resume.allSkills.length} industry skills across categorized domains. Skills appear well-indexed for ATS discovery.`
          : 'Skills section is sparse or missing. Group technical proficiencies into languages, frameworks, databases, and tools.',
        rating: resume.allSkills.length >= 8 ? 'strong' : resume.allSkills.length >= 4 ? 'adequate' : 'needs_work',
      },
      {
        name: 'Projects & Practical Evidence',
        feedback: hasProjects
          ? `Found ${resume.projects.length} showcase projects demonstrating practical implementation.`
          : 'Adding 1-2 featured projects with live links or GitHub repositories provides concrete evidence of technical capability.',
        rating: hasProjects ? 'strong' : 'adequate',
      },
      {
        name: 'Format & Structure',
        feedback: resume.metadata.hasTwoColumns
          ? 'Two-column layout detected. While human-readable, some legacy ATS parsers may misorder text columns.'
          : 'Single-column structure detected, but original document layout requires visual review.',
        rating: resume.metadata.hasTwoColumns ? 'adequate' : 'strong',
      },
    ];

    const atsRisks: ResumeCritique['atsRisks'] = [];
    if (resume.metadata.hasTwoColumns) {
      atsRisks.push({
        issue: 'Multi-column layout detected',
        severity: 'warning',
        suggestion: 'Convert to a single-column layout to reduce the risk of reading-order errors; verify extracted text.',
      });
    }
    if (!resume.personalInfo.email) {
      atsRisks.push({
        issue: 'Missing contact email',
        severity: 'critical',
        suggestion: 'Place a professional email at the top of your resume.',
      });
    }
    if (!resume.personalInfo.linkedin) {
      atsRisks.push({
        issue: 'Missing LinkedIn profile link',
        severity: 'info',
        suggestion: 'Include a customized LinkedIn profile URL to increase recruiter verification confidence.',
      });
    }

    const keyStrengths = [
      hasSkills ? `Broad technical foundation in ${resume.allSkills.slice(0, 4).join(', ')}` : 'Clean resume baseline',
      hasExp ? `Demonstrated track record across ${resume.experience.length} professional positions` : 'Clear educational background',
      `Structured document organization with ${resume.sectionHeadersFound.length} standard sections`,
    ];

    const immediateImprovements = [
      'Replace passive phrasing with active action verbs (e.g. Engineered, Spearheaded, Accelerated)',
      'Include measurable outcomes only when supported by your actual work',
      job ? `Incorporate high-priority keywords from target role: ${job.requiredSkills.slice(0, 3).join(', ')}` : 'Tailor core skills to each target job application',
    ];

    return {
      sections,
      atsRisks,
      overallNarrative: hasExp
        ? `Resume presents a solid background with clear technical proficiencies. Further emphasis on measurable business impact will elevate candidate competitiveness.`
        : 'Resume provides a well-organized entry profile. Focusing on project demonstrations and skill evidence will strengthen positioning.',
      keyStrengths,
      immediateImprovements,
      isLLMGenerated: false,
      modelUsed: 'deterministic-heuristic',
    };
  }
}

/** Singleton default Heuristic AI Provider */
export const defaultAIProvider: AIProvider = new HeuristicAIProvider();

/**
 * Factory function to retrieve the active AI Provider.
 * Returns ClaudeAIProvider when ANTHROPIC_API_KEY is configured,
 * returns GeminiAIProvider when GEMINI_API_KEY or GOOGLE_API_KEY is configured,
 * otherwise returns HeuristicAIProvider.
 */
export function getAIProvider(): AIProvider {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey && anthropicKey.trim().length > 0) {
    return new ClaudeAIProvider(anthropicKey, process.env.ANTHROPIC_MODEL);
  }
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0) {
    return new GeminiAIProvider(geminiKey);
  }
  return defaultAIProvider;
}

/** Check if an external LLM AI provider is currently active based on environment */
export function isAIConfigured(): boolean {
  return Boolean(
    (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0) ||
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) ||
    (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim().length > 0)
  );
}
