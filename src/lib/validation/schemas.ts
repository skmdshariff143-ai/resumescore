/**
 * Strict domain validation schemas matching ResumeParsed and JobParsed types.
 * Replaces any z.any() usage to enforce input integrity at the API boundary.
 */

import { z } from 'zod';
import type { CategorizedSkills } from '@/types';

export const SectionTypeSchema = z.enum([
  'header',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'publications',
  'other',
]);

export const ParsedSectionSchema = z.object({
  id: z.string().max(60000),
  type: SectionTypeSchema,
  title: z.string().max(60000),
  content: z.string().max(60000),
  startLine: z.number().optional(),
  endLine: z.number().optional(),
  confidence: z.number().optional(),
});

export const PersonalInfoSchema = z.object({
  name: z.string().max(60000).min(1, 'Candidate name is required.'),
  email: z.string().max(60000).email().optional().or(z.literal('')),
  phone: z.string().max(60000).optional(),
  location: z.string().max(60000).optional(),
  linkedin: z.string().max(60000).optional(),
  github: z.string().max(60000).optional(),
  portfolio: z.string().max(60000).optional(),
  website: z.string().max(60000).optional(),
  links: z.array(z.string().max(60000)).default([]),
  structuredLinks: z.array(z.object({ type: z.enum(['linkedin', 'github', 'portfolio', 'website', 'email', 'phone', 'other']), url: z.string().max(60000).max(2048), label: z.string().max(60000).max(200).optional() }).strict()).max(30).optional(),
  confidence: z.number().optional(),
});

export const ExperienceItemSchema = z.object({
  company: z.string().max(60000).min(1, 'Company name is required.'),
  role: z.string().max(60000).min(1, 'Role title is required.'),
  location: z.string().max(60000).optional(),
  isRemote: z.boolean().optional(),
  isHybrid: z.boolean().optional(),
  isContract: z.boolean().optional(),
  isInternship: z.boolean().optional(),
  startDate: z.string().max(60000).default(''),
  endDate: z.string().max(60000).default(''),
  isCurrent: z.boolean().default(false),
  durationMonths: z.number().optional(),
  bullets: z.array(z.string().max(60000)).default([]),
  achievements: z.array(z.string().max(60000)).optional().default([]),
  technologies: z.array(z.string().max(60000)).optional().default([]),
  rawText: z.string().max(60000).optional(),
  confidence: z.number().optional(),
});

export const EducationItemSchema = z.object({
  institution: z.string().max(60000).min(1, 'Educational institution is required.'),
  degree: z.string().max(60000).min(1, 'Degree title is required.'),
  field: z.string().max(60000).optional(),
  startDate: z.string().max(60000).optional(),
  endDate: z.string().max(60000).optional(),
  gpa: z.string().max(60000).optional(),
  honors: z.array(z.string().max(60000)).optional(),
  coursework: z.array(z.string().max(60000)).optional(),
  confidence: z.number().optional(),
});

export const ProjectItemSchema = z.object({
  name: z.string().max(60000).min(1, 'Project name is required.'),
  description: z.string().max(60000).default(''),
  technologies: z.array(z.string().max(60000)).default([]),
  metrics: z.array(z.string().max(60000)).optional(),
  link: z.string().max(60000).optional(),
  github: z.string().max(60000).optional(),
  confidence: z.number().optional(),
});

export const CertificationItemSchema = z.object({
  name: z.string().max(60000).min(1, 'Certification name is required.'),
  issuer: z.string().max(60000).optional(),
  date: z.string().max(60000).optional(),
  url: z.string().max(60000).optional(),
  confidence: z.number().optional(),
});

export const ResumeParsedSchema = z.object({
  metadata: z
    .object({
      fileName: z.string().max(60000),
      fileType: z.enum(['pdf', 'docx', 'txt', 'paste', 'sample']).default('txt'),
      extractedCharCount: z.number().default(0),
      wordCount: z.number().default(0),
      pageCountEstimate: z.number().default(1),
      extractionQuality: z.enum(['excellent', 'good', 'degraded', 'failed']).default('good'),
      isScanned: z.boolean().default(false),
      hasTwoColumns: z.boolean().default(false),
    })
    .strip()
    .default({
      fileName: 'resume.txt',
      fileType: 'txt',
      extractedCharCount: 0,
      wordCount: 0,
      pageCountEstimate: 1,
      extractionQuality: 'good',
      isScanned: false,
      hasTwoColumns: false,
    }),
  sections: z.array(ParsedSectionSchema).default([]),
  personalInfo: PersonalInfoSchema,
  summary: z.string().max(60000).optional(),
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  skills: z.record(z.string().max(60000), z.array(z.string().max(60000))).default({}) as unknown as z.ZodType<CategorizedSkills>,
  allSkills: z.array(z.string().max(60000)).default([]),
  achievements: z.array(z.string().max(60000)).default([]),
  rawText: z.string().max(60000).min(1, 'Resume raw text cannot be empty.'),
  wordCount: z.number().default(0),
  pageCountEstimate: z.number().default(1),
  sectionHeadersFound: z.array(z.string().max(60000)).default([]),
});

export const JobRequirementItemSchema = z.object({
  id: z.string().max(60000),
  text: z.string().max(60000),
  category: z.enum(['skill', 'experience', 'education', 'certification', 'responsibility', 'domain', 'softSkill']),
  importance: z.enum(['required', 'preferred', 'bonus']),
  minYears: z.number().optional(),
  extractedSkills: z.array(z.string().max(60000)).default([]),
});

export const JobParsedSchema = z.object({
  id: z.string().max(60000).default('job-extracted'),
  title: z.string().max(60000).min(1, 'Job title is required.'),
  company: z.string().max(60000).min(1, 'Company name is required.'),
  location: z.string().max(60000).optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite', 'unspecified']).default('unspecified'),
  seniority: z.enum(['intern', 'entry', 'mid', 'senior', 'lead', 'principal', 'executive', 'unspecified']).default('unspecified'),
  minYearsExperience: z.number().default(0),
  requiredSkills: z.array(z.string().max(60000)).default([]),
  preferredSkills: z.array(z.string().max(60000)).default([]),
  bonusSkills: z.array(z.string().max(60000)).default([]),
  requirementsList: z.array(JobRequirementItemSchema).optional(),
  educationRequirements: z.array(z.string().max(60000)).default([]),
  certifications: z.array(z.string().max(60000)).default([]),
  responsibilities: z.array(z.string().max(60000)).default([]),
  softSkills: z.array(z.string().max(60000)).default([]),
  domainKnowledge: z.array(z.string().max(60000)).default([]),
  categorizedSkills: z.record(z.string().max(60000), z.array(z.string().max(60000))).default({}) as unknown as z.ZodType<CategorizedSkills>,
  rawText: z.string().max(60000).default(''),
});
