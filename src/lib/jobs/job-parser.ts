/**
 * Job description parser with classified requirements (Required / Preferred / Bonus)
 * across skills, experience, education, certifications, and responsibilities.
 */

import type {
  JobParsed,
    JobRequirementItem,
  RequirementImportance,
  RequirementCategory,
} from '@/types';

import { extractCategorizedSkills } from '../parsing/resume-parser';
import { SKILL_ALIASES } from '../keywords';

function extractJobTitle(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 3 && line.length < 60 && !/summary|overview|about|responsibilities/i.test(line)) {
      if (/(engineer|developer|architect|designer|manager|lead|specialist|analyst|consultant|director|vp)/i.test(line)) {
        return line;
      }
    }
  }
  return lines[0]?.slice(0, 50) || 'Target Role';
}

function extractCompanyName(text: string): string {
  const match = text.match(/\b(?:at|with|join|about)\s+([A-Z][a-zA-Z0-9&\s]{2,30}?)(?:\s+is|,|\.|\n)/);
  if (match) return match[1].trim();
  return 'Target Company';
}

function extractWorkMode(text: string): 'remote' | 'hybrid' | 'onsite' | 'unspecified' {
  if (/\b(remote|work from home|wfh|anywhere)\b/i.test(text)) return 'remote';
  if (/\b(hybrid|flexible)\b/i.test(text)) return 'hybrid';
  if (/\b(on-site|onsite|in-office|in office)\b/i.test(text)) return 'onsite';
  return 'unspecified';
}

function extractSeniority(text: string): 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive' | 'unspecified' {
  if (/\b(intern|internship)\b/i.test(text)) return 'intern';
  if (/\b(entry|junior|associate|grad)\b/i.test(text)) return 'entry';
  if (/\b(principal|staff|distinguished)\b/i.test(text)) return 'principal';
  if (/\b(lead|team lead|tech lead)\b/i.test(text)) return 'lead';
  if (/\b(senior|sr\.?)\b/i.test(text)) return 'senior';
  if (/\b(director|vp|head of|chief)\b/i.test(text)) return 'executive';
  if (/\b(mid|intermediate)\b/i.test(text)) return 'mid';
  return 'unspecified';
}

function extractMinYears(text: string): number {
  const match = text.match(/(\d+)\+?\s*(?:to\s*\d+)?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

export function parseJobDescription(rawText: string): JobParsed {
  const trimmed = rawText.trim();
  const { categorized, all: allSkills } = extractCategorizedSkills(trimmed);

  const lines = trimmed.split(/\r?\n/);
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  const bonusSkills: string[] = [];
  const requirementsList: JobRequirementItem[] = [];

  let currentImportance: RequirementImportance = 'required';

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();
    if (!line) continue;

    // Check header keywords
    if (/\b(minimum|must have|required|requirements|what you need|qualifications)\b/i.test(line)) {
      currentImportance = 'required';
      continue;
    } else if (/\b(bonus|extra credit)\b/i.test(line)) {
      currentImportance = 'bonus';
      continue;
    } else if (/\b(preferred|nice to have|plus|ideal|good to have)\b/i.test(line)) {
      currentImportance = 'preferred';
      continue;
    }

    const isBullet = /^\s*[•\-*▪►◦‣⁃]/.test(rawLine);
    if (isBullet || line.length > 20) {
      const { all: lineSkills } = extractCategorizedSkills(line);
      let category: RequirementCategory = 'skill';

      if (/\b(degree|bachelor|master|phd)\b/i.test(line)) category = 'education';
      else if (/\b(certified|certification|license)\b/i.test(line)) category = 'certification';
      else if (/\b(years? of experience|track record)\b/i.test(line)) category = 'experience';
      else if (/\b(responsible for|manage|deliver|build|lead)\b/i.test(line)) category = 'responsibility';

      requirementsList.push({
        id: `req-${idx}`,
        text: line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '').trim(),
        category,
        importance: currentImportance,
        extractedSkills: lineSkills,
      });

      for (const sk of lineSkills) {
        const canonical = SKILL_ALIASES[sk.toLowerCase()] || sk;
        if (currentImportance === 'required' && !requiredSkills.includes(canonical)) {
          requiredSkills.push(canonical);
        } else if (currentImportance === 'preferred' && !preferredSkills.includes(canonical)) {
          preferredSkills.push(canonical);
        } else if (currentImportance === 'bonus' && !bonusSkills.includes(canonical)) {
          bonusSkills.push(canonical);
        }
      }
    }
  }

  // If no sections were delineated, populate allSkills as required
  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    requiredSkills.push(...allSkills);
  }

  return {
    id: 'job-' + Date.now(),
    title: extractJobTitle(trimmed),
    company: extractCompanyName(trimmed),
    workMode: extractWorkMode(trimmed),
    seniority: extractSeniority(trimmed),
    minYearsExperience: extractMinYears(trimmed),
    requiredSkills,
    preferredSkills,
    bonusSkills,
    requirementsList,
    educationRequirements: requirementsList.filter((r) => r.category === 'education').map((r) => r.text),
    certifications: requirementsList.filter((r) => r.category === 'certification').map((r) => r.text),
    responsibilities: requirementsList.filter((r) => r.category === 'responsibility').map((r) => r.text),
    softSkills: categorized.soft_skills,
    domainKnowledge: categorized.domain_knowledge,
    categorizedSkills: categorized,
    rawText: trimmed,
  };
}
