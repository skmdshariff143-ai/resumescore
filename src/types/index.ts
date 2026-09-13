/**
 * Domain type definitions for the ResumeScore AI Platform.
 * Built for accuracy, explainability, security, and strict data validation.
 */

export type AnalysisMode = 'general' | 'job_match';
export type FeedbackType = 'success' | 'warning' | 'error' | 'info';
export type ExtractionQuality = 'excellent' | 'good' | 'degraded' | 'failed';

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  category: string;
  title: string;
  message: string;
  actionableTip?: string;
  impactWeight?: 'high' | 'medium' | 'low';
}

export interface DimensionEvidence {
  detected: string[];
  expected: string[];
  matched: string[];
  missing: string[];
  impactExplanation: string;
  recommendedAction: string;
}

export interface DimensionScore {
  key: string;
  name: string;
  score: number;
  weight: number;
  contribution: number; // score * weight, deterministic
  icon: string;
  color: string;
  feedback: string;
  reason: string;
  tips: string[];
  evidence: DimensionEvidence;
}

export interface LinkItem {
  type: 'linkedin' | 'github' | 'portfolio' | 'website' | 'email' | 'phone' | 'other';
  url: string;
  label?: string;
}

export interface PersonalInfo {
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

export interface ExperienceItem {
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

export interface EducationItem {
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

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  metrics?: string[];
  link?: string;
  github?: string;
  confidence: number;
}

export interface CertificationItem {
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
  confidence: number;
}

export type SkillCategory =
  | 'languages'
  | 'frameworks'
  | 'databases'
  | 'cloud'
  | 'devops'
  | 'ai_ml'
  | 'testing'
  | 'security'
  | 'tools'
  | 'soft_skills'
  | 'domain_knowledge';

export type CategorizedSkills = Record<SkillCategory, string[]>;

export type SectionType =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'publications'
  | 'other';

export interface ParsedSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  startLine: number;
  endLine: number;
  confidence: number;
}

export interface ResumeDocument {
  metadata: {
    fileName: string;
    fileType: 'pdf' | 'txt' | 'paste' | 'sample';
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

export interface ResumeParsed extends ResumeDocument {
  wordCount: number;
  pageCountEstimate: number;
  sectionHeadersFound: string[];
}

export type RequirementImportance = 'required' | 'preferred' | 'bonus';
export type RequirementCategory =
  | 'skill'
  | 'experience'
  | 'education'
  | 'certification'
  | 'responsibility'
  | 'domain'
  | 'softSkill';

export interface JobRequirementItem {
  id: string;
  text: string;
  category: RequirementCategory;
  importance: RequirementImportance;
  minYears?: number;
  extractedSkills: string[];
}

export interface JobParsed {
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

export type SkillMatchStatus = 'matched' | 'partial' | 'missing' | 'unknown';
export type MatchLevel =
  | 'level_1_exact'
  | 'level_2_normalized'
  | 'level_3_alias'
  | 'level_4_taxonomy'
  | 'level_5_context'
  | 'level_6_evidence';

export interface SkillMatchItem {
  skill: string;
  category: SkillCategory;
  status: SkillMatchStatus;
  importance: RequirementImportance;
  confidence: number; // 0.00 to 1.00
  matchLevel?: MatchLevel;
  evidence?: string; // Concrete quote from resume
  evidenceQuote?: string;
  reasoning: string; // Transparent explanation
  suggestion?: string;
  aliasMatched?: string;
  taxonomyRelationship?: string;
}

export type SkillMatrix = Record<SkillCategory, SkillMatchItem[]>;

export interface ATSCheckItem {
  id: string;
  name: string;
  category: 'formatting' | 'contact' | 'headings' | 'content' | 'layout';
  passed: boolean;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  whyItMatters: string;
  fix: string;
}

export type ATSGrade = 'Excellent' | 'Strong' | 'Needs Improvement' | 'High Risk';

export interface ATSAnalysis {
  score: number;
  grade: ATSGrade;
  checks: ATSCheckItem[];
  criticalIssuesCount: number;
  warningsCount: number;
  passedCount: number;
  summary: string;
}

export type BulletStrength = 'Weak' | 'Developing' | 'Strong' | 'Excellent';

export interface BulletAnalysis {
  id: string;
  original: string;
  score: number; // 0-100
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

export interface ImpactAnalysis {
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

export interface TopActionItem {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  dimension: string;
  reason: string;
  evidence: string;
  howToFix: string;
  expectedScoreBoost: number; // Mathematically derived points
  expectedScoreBoostLabel: string; // e.g. '+8 to +12 pts'
  confidence: number;
}

export interface ResumeScore {
  id: string;
  mode: AnalysisMode;
  overall: number;
  grade: string;
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

export interface ScanHistory {
  id: string;
  fileName: string;
  overallScore: number;
  grade: string;
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

export interface SavedJobMatch {
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

export type CoverLetterTone = 'professional' | 'confident' | 'concise' | 'startup' | 'technical';

export interface CoverLetterRequest {
  resume: ResumeParsed;
  job?: JobParsed;
  tone: CoverLetterTone;
  customNotes?: string;
}

export interface CoverLetterResponse {
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

export interface ResumeCritiqueSection {
  name: string;
  feedback: string;
  rating: 'strong' | 'adequate' | 'needs_work';
}

export interface ResumeATSRisk {
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  suggestion: string;
}

export interface ResumeCritique {
  sections: ResumeCritiqueSection[];
  atsRisks: ResumeATSRisk[];
  overallNarrative: string;
  keyStrengths: string[];
  immediateImprovements: string[];
  isLLMGenerated: boolean;
  modelUsed?: string;
}
