/**
 * Custom error classes for resumescore-core.
 */

export class ResumeScoreError extends Error {
  constructor(message: string, public readonly code: string = 'RESUME_SCORE_ERROR') {
    super(message);
    this.name = 'ResumeScoreError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResumeParserError extends ResumeScoreError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'RESUME_PARSER_ERROR');
    this.name = 'ResumeParserError';
  }
}

export class ScoringError extends ResumeScoreError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'SCORING_ERROR');
    this.name = 'ScoringError';
  }
}

export class JobMatchError extends ResumeScoreError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'JOB_MATCH_ERROR');
    this.name = 'JobMatchError';
  }
}
