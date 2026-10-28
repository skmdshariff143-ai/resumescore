/**
 * resumescore-core
 *
 * Framework-agnostic deterministic resume parser, 7-pillar scoring engine,
 * and semantic job matcher. Pure TypeScript with zero runtime dependencies.
 */

import { parseResume as internalParseResume } from './parser/resume-parser';
import { parseJobDescription as internalParseJob } from './parser/job-parser';
import { calculateResumeScore as internalScoreResume } from './scoring/scoring-engine';
import { buildSkillMatrix } from './matching/semantic-matcher';
import { ResumeParserError, ScoringError, JobMatchError } from './errors';
import type {
  ResumeParsed,
  ResumeScore,
  JobParsed,
  SkillMatrix,
  ParseResumeOptions,
  ScoreResumeOptions,
  AnalysisMode,
  CareerLevel,
} from './types';

/**
 * Parses raw resume text into an intermediate structured representation (ResumeParsed).
 *
 * Extracts personal contact info, multi-section content (experience, education, skills,
 * projects, certifications, awards, publications), normalized dates, and diagnostics.
 *
 * @param text The plain text content of the resume.
 * @param options Optional parsing configuration (e.g. fileName).
 * @returns Structured ResumeParsed document.
 * @throws {ResumeParserError} If input text is invalid.
 */
export function parseResume(text: string, options?: ParseResumeOptions | string): ResumeParsed {
  if (typeof text !== 'string') {
    throw new ResumeParserError('Resume text must be a string.');
  }

  try {
    const fileName = typeof options === 'string' ? options : options?.fileName || 'resume.txt';
    return internalParseResume(text, fileName);
  } catch (error) {
    throw new ResumeParserError(
      `Failed to parse resume: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}

/**
 * Computes a 100% deterministic 7-pillar quality and ATS score for a parsed resume.
 *
 * Pillars:
 * 1. ATS Readability Estimate (15%)
 * 2. Job Skill Match (25%)
 * 3. Experience Relevance (20%)
 * 4. Impact & Metrics (15%)
 * 5. Projects & Portfolio (10%)
 * 6. Structure & Readability (10%)
 * 7. Profile & Contact (5%)
 *
 * @param parsed The structured resume parsed via `parseResume()`.
 * @param options Scoring configuration (target job, analysis mode, career profile).
 * @returns Comprehensive ResumeScore analysis.
 * @throws {ScoringError} If scoring calculation encounters unexpected inputs.
 */
export function scoreResume(
  parsed: ResumeParsed,
  options: ScoreResumeOptions = {}
): ResumeScore {
  if (!parsed || typeof parsed !== 'object') {
    throw new ScoringError('A valid ResumeParsed object is required for scoring.');
  }

  try {
    let job: JobParsed | undefined;
    if (typeof options.job === 'string') {
      job = internalParseJob(options.job);
    } else if (options.job && typeof options.job === 'object') {
      job = options.job;
    }

    const mode: AnalysisMode = options.mode || (job ? 'job_match' : 'general');
    const careerLevel: CareerLevel = options.careerLevel || 'experienced';

    return internalScoreResume(parsed, job, mode, careerLevel);
  } catch (error) {
    throw new ScoringError(
      `Failed to calculate resume score: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}

/**
 * Compares a parsed resume against target job requirements using a 6-level
 * layered semantic matching architecture (exact, normalized, alias, taxonomy, context, evidence).
 *
 * @param parsed The structured resume parsed via `parseResume()`.
 * @param jobTextOrParsed Target job description (plain text string or pre-parsed JobParsed).
 * @returns Detailed SkillMatrix categorizing matched, partial, and missing skills.
 * @throws {JobMatchError} If inputs are invalid.
 */
export function matchJob(
  parsed: ResumeParsed,
  jobTextOrParsed: string | JobParsed
): SkillMatrix {
  if (!parsed || !parsed.skills) {
    throw new JobMatchError('A valid ResumeParsed object with extracted skills is required.');
  }

  try {
    const job: JobParsed =
      typeof jobTextOrParsed === 'string'
        ? internalParseJob(jobTextOrParsed)
        : jobTextOrParsed;

    return buildSkillMatrix(
      parsed.skills,
      parsed.allSkills,
      parsed.rawText,
      job.requiredSkills || [],
      job.preferredSkills || [],
      job.bonusSkills || []
    );
  } catch (error) {
    throw new JobMatchError(
      `Failed to match job requirements: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}

/**
 * Parses raw job description text into structured requirements, classifications, and metadata.
 */
export function parseJob(text: string): JobParsed {
  if (typeof text !== 'string') {
    throw new JobMatchError('Job description text must be a string.');
  }
  return internalParseJob(text);
}

// Re-export core helper functions
export { calculateResumeScore } from './scoring/scoring-engine';
export { parseJobDescription } from './parser/job-parser';
export { compareResumeVersions } from './scoring/comparison';
export { runATSChecks } from './ats/ats-checker';
export { analyzeBullet, evaluateResumeImpact } from './impact/impact-evaluator';
export { CAREER_LEVELS, RUBRIC_WEIGHTS } from './scoring/rubric';
export { getCategoryForSkill, buildSkillMatrix } from './matching/semantic-matcher';

// Re-export error classes
export * from './errors';

// Re-export all domain types
export * from './types';
