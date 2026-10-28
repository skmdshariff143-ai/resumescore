declare const CAREER_LEVELS: {
    readonly student: "Student / Fresher";
    readonly internship: "Internship Applicant";
    readonly entry: "Entry-Level Professional";
    readonly experienced: "Experienced Professional";
    readonly senior: "Senior Professional";
    readonly switcher: "Career Switcher";
};
type CareerLevel = keyof typeof CAREER_LEVELS;
declare const RUBRIC_WEIGHTS: Record<CareerLevel, readonly number[]>;

/**
 * Domain type definitions for the ResumeScore AI Platform.
 * Built for accuracy, explainability, security, and strict data validation.
 */
type AnalysisMode = 'general' | 'job_match';
type FeedbackType = 'success' | 'warning' | 'error' | 'info';
type ExtractionQuality = 'excellent' | 'good' | 'degraded' | 'failed';
interface FeedbackItem {
    id: string;
    type: FeedbackType;
    category: string;
    title: string;
    message: string;
    actionableTip?: string;
    impactWeight?: 'high' | 'medium' | 'low';
}
interface DimensionEvidence {
    detected: string[];
    expected: string[];
    matched: string[];
    missing: string[];
    impactExplanation: string;
    recommendedAction: string;
}
interface DimensionScore {
    confidence?: 'low' | 'medium' | 'high';
    key: string;
    name: string;
    score: number;
    weight: number;
    contribution: number;
    icon: string;
    color: string;
    feedback: string;
    reason: string;
    tips: string[];
    evidence: DimensionEvidence;
}
interface LinkItem {
    type: 'linkedin' | 'github' | 'portfolio' | 'website' | 'email' | 'phone' | 'other';
    url: string;
    label?: string;
}
interface PersonalInfo {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
    links: string[];
    structuredLinks?: LinkItem[];
    confidence: number;
}
interface ExperienceItem {
    company: string;
    role: string;
    location?: string;
    isRemote?: boolean;
    isHybrid?: boolean;
    isContract?: boolean;
    isInternship?: boolean;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    durationMonths?: number;
    bullets: string[];
    achievements: string[];
    technologies: string[];
    rawText?: string;
    confidence: number;
}
interface EducationItem {
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    honors?: string[];
    coursework?: string[];
    confidence: number;
}
interface ProjectItem {
    name: string;
    description: string;
    technologies: string[];
    metrics?: string[];
    link?: string;
    github?: string;
    confidence: number;
}
interface CertificationItem {
    name: string;
    issuer?: string;
    date?: string;
    url?: string;
    confidence: number;
}
type SkillCategory = 'languages' | 'frameworks' | 'databases' | 'cloud' | 'devops' | 'ai_ml' | 'testing' | 'security' | 'tools' | 'soft_skills' | 'domain_knowledge';
type CategorizedSkills = Record<SkillCategory, string[]>;
type SectionType = 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'awards' | 'publications' | 'other';
interface ParsedSection {
    id: string;
    type: SectionType;
    title: string;
    content: string;
    startLine: number;
    endLine: number;
    confidence: number;
}
interface ResumeDocument {
    metadata: {
        fileName: string;
        fileType: 'pdf' | 'docx' | 'txt' | 'paste' | 'sample';
        extractedCharCount: number;
        wordCount: number;
        pageCountEstimate: number;
        extractionQuality: ExtractionQuality;
        isScanned: boolean;
        hasTwoColumns: boolean;
    };
    sections: ParsedSection[];
    personalInfo: PersonalInfo;
    summary?: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    certifications: CertificationItem[];
    skills: CategorizedSkills;
    allSkills: string[];
    achievements: string[];
    rawText: string;
}
interface ResumeParsed extends ResumeDocument {
    wordCount: number;
    pageCountEstimate: number;
    sectionHeadersFound: string[];
}
type RequirementImportance = 'required' | 'preferred' | 'bonus';
type RequirementCategory = 'skill' | 'experience' | 'education' | 'certification' | 'responsibility' | 'domain' | 'softSkill';
interface JobRequirementItem {
    id: string;
    text: string;
    category: RequirementCategory;
    importance: RequirementImportance;
    minYears?: number;
    extractedSkills: string[];
}
interface JobParsed {
    id: string;
    title: string;
    company: string;
    location?: string;
    workMode: 'remote' | 'hybrid' | 'onsite' | 'unspecified';
    seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive' | 'unspecified';
    minYearsExperience: number;
    requiredSkills: string[];
    preferredSkills: string[];
    bonusSkills: string[];
    requirementsList?: JobRequirementItem[];
    educationRequirements: string[];
    certifications: string[];
    responsibilities: string[];
    softSkills: string[];
    domainKnowledge: string[];
    categorizedSkills: CategorizedSkills;
    rawText: string;
}
type SkillMatchStatus = 'matched' | 'partial' | 'missing' | 'unknown';
type MatchLevel = 'level_1_exact' | 'level_2_normalized' | 'level_3_alias' | 'level_4_taxonomy' | 'level_5_context' | 'level_6_evidence';
interface SkillMatchItem {
    evidenceLevel?: 'demonstrated' | 'mentioned' | 'transferable' | 'missing';
    skill: string;
    category: SkillCategory;
    status: SkillMatchStatus;
    importance: RequirementImportance;
    confidence: number;
    matchLevel?: MatchLevel;
    evidence?: string;
    evidenceQuote?: string;
    reasoning: string;
    suggestion?: string;
    aliasMatched?: string;
    taxonomyRelationship?: string;
}
type SkillMatrix = Record<SkillCategory, SkillMatchItem[]>;
interface ATSCheckItem {
    id: string;
    name: string;
    category: 'formatting' | 'contact' | 'headings' | 'content' | 'layout';
    passed: boolean;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    whyItMatters: string;
    fix: string;
}
type ATSGrade = 'Excellent' | 'Strong' | 'Needs Improvement' | 'High Risk';
interface ATSAnalysis {
    score: number;
    grade: ATSGrade;
    checks: ATSCheckItem[];
    criticalIssuesCount: number;
    warningsCount: number;
    passedCount: number;
    summary: string;
}
type BulletStrength = 'Weak' | 'Developing' | 'Strong' | 'Excellent';
interface BulletAnalysis {
    id: string;
    original: string;
    score: number;
    strength: BulletStrength;
    actionVerb?: string;
    technologies: string[];
    hasQuantifiableMetric: boolean;
    metricFound?: string;
    taskComplexity?: 'low' | 'medium' | 'high';
    ownershipLevel?: 'team' | 'individual' | 'lead' | 'unspecified';
    issues: string[];
    suggestions: string[];
    rewritten?: string;
    rewriteVariants?: {
        xyzFormula: string;
        metricsDriven: string;
        leadership: string;
    };
    rewriteReason?: string;
    rewriteType?: 'improved_existing' | 'needs_candidate_info';
    placeholdersNeeded?: string[];
}
interface ImpactAnalysis {
    overallImpactScore: number;
    metricsCount: number;
    actionVerbsCount: number;
    strongBulletsCount: number;
    weakBulletsCount: number;
    quantificationOpportunities: {
        bullet: string;
        suggestedMetricType: string;
        exampleMetric: string;
    }[];
    detectedMetrics: string[];
}
interface TopActionItem {
    id: string;
    title: string;
    impact: 'High' | 'Medium' | 'Low';
    dimension: string;
    reason: string;
    evidence: string;
    howToFix: string;
    expectedScoreBoost: number;
    expectedScoreBoostLabel: string;
    confidence: number;
}
interface ResumeScore {
    careerLevel?: CareerLevel;
    generalQualityScore?: number;
    id: string;
    mode: AnalysisMode;
    overall: number;
    grade: string;
    topPriority: string;
    atsScore: number;
    skillMatchScore: number;
    experienceScore: number;
    impactScore: number;
    projectScore: number;
    readabilityScore: number;
    profileScore: number;
    dimensions: DimensionScore[];
    feedback: FeedbackItem[];
    atsAnalysis: ATSAnalysis;
    skillMatrix: SkillMatrix;
    impactAnalysis: ImpactAnalysis;
    bulletAnalyses: BulletAnalysis[];
    topStrengths: string[];
    criticalIssues: string[];
    topActions: TopActionItem[];
    parsedResume: ResumeParsed;
    parsedJob?: JobParsed;
    analyzedAt: string;
    fileName: string;
    resumePreview: string;
    critique?: ResumeCritique;
}
interface ScanHistory {
    id: string;
    fileName: string;
    overallScore: number;
    grade: string;
    topPriority?: string;
    atsScore: number;
    jobMatchScore?: number;
    mode: AnalysisMode;
    jobTitle?: string;
    company?: string;
    analyzedAt: string;
    dimensions: DimensionScore[];
    topActions: TopActionItem[];
    skillGapsCount: number;
    resumePreview: string;
    resumeText: string;
    versionNumber?: number;
    label?: string;
}
interface SavedJobMatch {
    id: string;
    company: string;
    role: string;
    matchScore: number;
    atsScore: number;
    missingSkills: string[];
    topRecommendation: string;
    date: string;
    rawJobText?: string;
}
type CoverLetterTone = 'professional' | 'confident' | 'concise' | 'startup' | 'technical';
interface CoverLetterRequest {
    resume: ResumeParsed;
    job?: JobParsed;
    tone: CoverLetterTone;
    customNotes?: string;
}
interface CoverLetterResponse {
    recipientTitle: string;
    companyName: string;
    roleTitle: string;
    salutation: string;
    bodyParagraphs: string[];
    closing: string;
    candidateName: string;
    generatedAt: string;
    groundingFactCount: number;
}
interface ResumeCritiqueSection {
    name: string;
    feedback: string;
    rating: 'strong' | 'adequate' | 'needs_work';
}
interface ResumeATSRisk {
    issue: string;
    severity: 'critical' | 'warning' | 'info';
    suggestion: string;
}
interface ResumeCritique {
    sections: ResumeCritiqueSection[];
    atsRisks: ResumeATSRisk[];
    overallNarrative: string;
    keyStrengths: string[];
    immediateImprovements: string[];
    isLLMGenerated: boolean;
    modelUsed?: string;
}
interface ParseResumeOptions {
    fileName?: string;
}
interface ScoreResumeOptions {
    job?: JobParsed | string;
    mode?: AnalysisMode;
    careerLevel?: CareerLevel;
    fileName?: string;
}

/**
 * 7-Pillar Transparent Scoring Engine:
 * 1. ATS Readability Estimate (15%)
 * 2. Job Skill Match (25%)
 * 3. Experience Relevance (20%)
 * 4. Impact & Metrics (15%)
 * 5. Projects & Portfolio (10%)
 * 6. Structure & Readability (10%)
 * 7. Profile & Contact (5%)
 *
 * Mathematically deterministic score contributions and justified score boost estimates.
 */

declare function calculateResumeScore(resume: ResumeParsed, job?: JobParsed, mode?: AnalysisMode, careerLevel?: CareerLevel): ResumeScore;

/**
 * Job description parser with classified requirements (Required / Preferred / Bonus)
 * across skills, experience, education, certifications, and responsibilities.
 */

declare function parseJobDescription(rawText: string): JobParsed;

/** Same profile/job/rubric on both versions; no AI or predicted point boosts. */
declare function compareResumeVersions(original: string, edited: string, context: ResumeScore): {
    before: number;
    after: number;
    dimensions: {
        key: string;
        name: string;
        before: number;
        after: number;
        delta: number;
        explanation: string;
        previousEvidence: string[];
        currentEvidence: string[];
    }[];
    skills: SkillMatchItem[];
};

/**
 * ATS Compliance and machine-readability auditor with actionable diagnostics,
 * severity classifications, and remediation steps.
 */

declare function runATSChecks(resume: ResumeParsed): ATSAnalysis;

/**
 * Experience bullet analyzer and anti-hallucination rewrite generator.
 * Employs X-Y-Z formula, metrics-driven, and leadership frameworks while
 * strictly preventing metric fabrication using candidate placeholders.
 */

declare function analyzeBullet(bullet: string, index: number): BulletAnalysis;
declare function evaluateResumeImpact(resume: ResumeParsed): ImpactAnalysis;

/**
 * Layered 6-Level Semantic Matching Architecture with Evidence & Confidence:
 * Level 1: Exact String Match (1.00)
 * Level 2: Normalized / Token-Folded Match (0.95)
 * Level 3: Canonical Alias / Synonym Match (0.90)
 * Level 4: Skill Taxonomy Relationship / Subsumption (0.75-0.85)
 * Level 5: Context-Aware Co-occurrence & Responsibility Match (0.60-0.70)
 * Level 6: Section Evidence Verification (Experience vs Skills section)
 */

/** Find the primary skill category for a given skill */
declare function getCategoryForSkill(skill: string): SkillCategory;
/** Build the 11-category Semantic Skill Matrix */
declare function buildSkillMatrix(resumeSkills: CategorizedSkills, resumeAllSkills: string[], resumeText: string, requiredSkills: string[], preferredSkills?: string[], bonusSkills?: string[]): SkillMatrix;

/**
 * Custom error classes for @REPLACE_ME/resumescore-core.
 */
declare class ResumeScoreError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
declare class ResumeParserError extends ResumeScoreError {
    readonly details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}
declare class ScoringError extends ResumeScoreError {
    readonly details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}
declare class JobMatchError extends ResumeScoreError {
    readonly details?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined);
}

/**
 * @REPLACE_ME/resumescore-core
 *
 * Framework-agnostic deterministic resume parser, 7-pillar scoring engine,
 * and semantic job matcher. Pure TypeScript with zero runtime dependencies.
 */

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
declare function parseResume(text: string, options?: ParseResumeOptions): ResumeParsed;
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
declare function scoreResume(parsed: ResumeParsed, options?: ScoreResumeOptions): ResumeScore;
/**
 * Compares a parsed resume against target job requirements using a 6-level
 * layered semantic matching architecture (exact, normalized, alias, taxonomy, context, evidence).
 *
 * @param parsed The structured resume parsed via `parseResume()`.
 * @param jobTextOrParsed Target job description (plain text string or pre-parsed JobParsed).
 * @returns Detailed SkillMatrix categorizing matched, partial, and missing skills.
 * @throws {JobMatchError} If inputs are invalid.
 */
declare function matchJob(parsed: ResumeParsed, jobTextOrParsed: string | JobParsed): SkillMatrix;
/**
 * Parses raw job description text into structured requirements, classifications, and metadata.
 */
declare function parseJob(text: string): JobParsed;

export { CAREER_LEVELS, JobMatchError, RUBRIC_WEIGHTS, ResumeParserError, ResumeScoreError, ScoringError, analyzeBullet, buildSkillMatrix, calculateResumeScore, compareResumeVersions, evaluateResumeImpact, getCategoryForSkill, matchJob, parseJob, parseJobDescription, parseResume, runATSChecks, scoreResume };
export type { ATSAnalysis, ATSCheckItem, ATSGrade, AnalysisMode, BulletAnalysis, BulletStrength, CareerLevel, CategorizedSkills, CertificationItem, CoverLetterRequest, CoverLetterResponse, CoverLetterTone, DimensionEvidence, DimensionScore, EducationItem, ExperienceItem, ExtractionQuality, FeedbackItem, FeedbackType, ImpactAnalysis, JobParsed, JobRequirementItem, LinkItem, MatchLevel, ParseResumeOptions, ParsedSection, PersonalInfo, ProjectItem, RequirementCategory, RequirementImportance, ResumeATSRisk, ResumeCritique, ResumeCritiqueSection, ResumeDocument, ResumeParsed, ResumeScore, SavedJobMatch, ScanHistory, ScoreResumeOptions, SectionType, SkillCategory, SkillMatchItem, SkillMatchStatus, SkillMatrix, TopActionItem };
