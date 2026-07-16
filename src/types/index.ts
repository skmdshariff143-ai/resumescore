/**
 * Core type definitions for the ResumeScore application.
 *
 * These interfaces define the shape of resume analysis results,
 * individual dimension scores, feedback items, and scan history entries.
 */

/** Complete result of a resume analysis. */
export interface ResumeScore {
  /** Overall score from 0–100, computed as a weighted average of dimensions. */
  overall: number;
  /** Letter grade: A+, A, B+, B, C+, C, D, or F. */
  grade: string;
  /** Per-dimension breakdown of the score. */
  dimensions: DimensionScore[];
  /** Actionable feedback items surfaced by the analysis. */
  feedback: FeedbackItem[];
  /** ISO-8601 timestamp of when the analysis was performed. */
  analyzedAt: string;
  /** First 200 characters of the parsed resume text (used for previews). */
  resumePreview: string;
}

/** Score and metadata for a single scoring dimension (e.g. "Experience"). */
export interface DimensionScore {
  /** Human-readable dimension name. */
  name: string;
  /** Score from 0–100 for this dimension. */
  score: number;
  /** Weight of this dimension in the overall score (0–1). */
  weight: number;
  /** Emoji icon representing this dimension. */
  icon: string;
  /** Tailwind CSS color class for UI rendering. */
  color: string;
  /** 1–2 sentence summary of findings for this dimension. */
  feedback: string;
  /** 2–3 actionable improvement tips. */
  tips: string[];
}

export type FeedbackType = 'success' | 'warning' | 'error' | 'info';

/** A single feedback item generated during analysis. */
export interface FeedbackItem {
  /** Severity / category of the feedback. */
  type: FeedbackType;
  /** Which area of the resume this feedback relates to. */
  category: string;
  /** Human-readable feedback message. */
  message: string;
}

/** A persisted record of a past resume scan (flat structure for easy access). */
export interface ScanHistory {
  /** Unique identifier (UUID v4). */
  id: string;
  /** Original file name that was uploaded. */
  fileName: string;
  /** Overall score 0-100. */
  overallScore: number;
  /** Letter grade. */
  grade: string;
  /** ISO-8601 timestamp of when the scan was saved. */
  analyzedAt: string;
  /** Per-dimension breakdown. */
  dimensions: DimensionScore[];
}
