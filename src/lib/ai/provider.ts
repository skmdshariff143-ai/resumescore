/**
 * AI Provider Architecture & Prompt Injection Defense.
 * - Delimits untrusted candidate & job inputs with XML tags (<user_resume_untrusted>).
 * - Implements strict Zod validation on every response with safe fallbacks.
 * - Supports HeuristicAIProvider (100% offline & privacy-safe) and ClaudeAIProvider.
 * - Zero secrets exposed to client.
 */

import { z } from 'zod';
import type {
  CoverLetterRequest,
  CoverLetterResponse,
  CoverLetterTone,
  JobParsed,
  ResumeCritique,
  ResumeParsed,
} from '@/types';
import { ClaudeAIProvider } from './claude-provider';

// Strict Zod Schemas
export const RewriteResponseSchema = z.object({
  xyzFormula: z.string().min(10),
  metricsDriven: z.string().min(10),
  leadership: z.string().min(10),
  reasoning: z.string().min(5),
  placeholders: z.array(z.string()),
});

export type RewriteResponse = z.infer<typeof RewriteResponseSchema>;

export const CoverLetterResponseSchema = z.object({
  recipientTitle: z.string(),
  companyName: z.string(),
  roleTitle: z.string(),
  salutation: z.string(),
  bodyParagraphs: z.array(z.string()).min(3),
  closing: z.string(),
  candidateName: z.string(),
  groundingFactCount: z.number(),
  generatedAt: z.string(),
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
    technologies: string[] = [],
    roleContext: string = 'Software Engineer'
  ): Promise<RewriteResponse> {
    const clean = original
      .replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '')
      .replace(/^(responsible for|worked on|helped with|assisted in)\s+/i, '')
      .trim();

    const techStr = technologies.length > 0 ? ` utilizing ${technologies.slice(0, 3).join(', ')}` : '';

    return {
      xyzFormula: `Architected and deployed ${clean}${techStr}, delivering [Add genuine metric: e.g. 30% performance boost or $X revenue impact].`,
      metricsDriven: `Boosted system throughput by [Add genuine metric: e.g. 40%] through re-engineering ${clean}${techStr}.`,
      leadership: `Spearheaded the technical delivery of ${clean}${techStr}, coordinating across engineering teams to achieve [Add measurable milestone].`,
      reasoning: `Applied structured action-oriented frameworks with explicit candidate metric placeholders for ${roleContext}.`,
      placeholders: ['[Add genuine metric: e.g. 30% performance boost]'],
    };
  }

  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    const { resume, job, tone } = request;
    const candidateName = resume.personalInfo.name || 'Candidate';
    const company = job?.company || 'Hiring Team';
    const role = job?.title || 'Software Professional';
    const topSkills = resume.allSkills.slice(0, 5).join(', ');
    const topExp = resume.experience[0];

    const openingByTone: Record<CoverLetterTone, string> = {
      professional: `I am writing to express my enthusiastic interest in the ${role} position at ${company}. With a proven track record across ${topSkills || 'modern software engineering'}, I am excited about the opportunity to contribute to your engineering organization.`,
      confident: `I am excited to apply for the ${role} role at ${company}. Having successfully delivered scalable systems at ${topExp?.company || 'leading technology teams'}, I bring immediate technical proficiency and engineering rigor to this position.`,
      concise: `Please accept this application for the ${role} opportunity at ${company}. My core background in ${topSkills || 'full-stack engineering'} aligns directly with your technical requirements.`,
      startup: `I was energized to discover the ${role} opening at ${company}. I thrive in high-velocity environments where shipping robust code and driving measurable product outcomes are paramount.`,
      technical: `I am applying for the ${role} opening at ${company}. My technical expertise encompasses ${topSkills || 'distributed systems and software development'}, demonstrated through hands-on architecture and high-reliability deployments.`,
    };

    const expSentence = topExp
      ? `In my recent role as ${topExp.role} at ${topExp.company}, I ${topExp.bullets[0] || 'engineered scalable services and collaborated with cross-functional teams'}.`
      : `Throughout my career, I have focused on delivering clean, maintainable architecture and reliable software systems.`;

    const projectSentence = resume.projects.length > 0
      ? `Additionally, through projects like ${resume.projects[0].name}, I have designed solutions utilizing ${resume.projects[0].technologies.join(', ') || 'modern stacks'}.`
      : 'I take pride in continuous technical learning and applying best engineering practices.';

    const closingByTone: Record<CoverLetterTone, string> = {
      professional: `Thank you for your time and consideration. I welcome the opportunity to discuss how my background and skills can benefit ${company}.`,
      confident: `I look forward to discussing how my experience can drive tangible results for ${company}'s engineering objectives.`,
      concise: `Thank you for reviewing my qualifications. I look forward to connecting.`,
      startup: `I would love to connect and discuss how I can help ${company} scale and build high-impact products.`,
      technical: `I look forward to discussing the technical challenges at ${company} and how my skill set can support your roadmap.`,
    };

    const bodyParagraphs = [
      openingByTone[tone],
      `${expSentence} ${projectSentence}`,
      `My core competencies in ${topSkills || 'software engineering'} directly align with your requirements. I am committed to engineering excellence, rigorous testing, and collaborative problem solving.`,
      closingByTone[tone],
    ];

    return {
      recipientTitle: `Hiring Manager, ${role}`,
      companyName: company,
      roleTitle: role,
      salutation: `Dear Hiring Team at ${company},`,
      bodyParagraphs,
      closing: 'Sincerely,',
      candidateName,
      generatedAt: new Date().toISOString(),
      groundingFactCount: (topExp ? 2 : 1) + (resume.projects.length > 0 ? 1 : 0) + resume.allSkills.slice(0, 5).length,
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
          : 'Single-column structure detected, ensuring optimal compatibility with parsing systems.',
        rating: resume.metadata.hasTwoColumns ? 'adequate' : 'strong',
      },
    ];

    const atsRisks: ResumeCritique['atsRisks'] = [];
    if (resume.metadata.hasTwoColumns) {
      atsRisks.push({
        issue: 'Multi-column layout detected',
        severity: 'warning',
        suggestion: 'Convert to a single-column layout to guarantee left-to-right reading order across all ATS parsers.',
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
      'Add at least 2 quantifiable metrics (% latency improvement, $ revenue, or scale) per role',
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
 * otherwise returns HeuristicAIProvider.
 */
export function getAIProvider(): AIProvider {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return new ClaudeAIProvider(apiKey);
  }
  return defaultAIProvider;
}

/** Check if Claude AI is currently active based on environment */
export function isAIConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);
}
