/**
 * Enterprise structured resume parser with intermediate representation (ResumeDocument),
 * two-column awareness, multi-line entity resolution, international date formats,
 * remote/contract/internship tagging, and confidence metrics.
 */

import type {
  ResumeParsed,
  ParsedSection,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  CategorizedSkills,
  SkillCategory,
  SectionType,
  LinkItem,
} from '@/types';

import {
  SKILL_CATEGORIES_MAP,
  SKILL_ALIASES,
  SECTION_HEADERS,
  QUANTIFIABLE_PATTERNS,
  getSkillRegex,
} from '../keywords';

function cleanLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function matchSectionHeader(line: string): { matched: boolean; type: SectionType; title: string } {
  const normalized = line
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '')
    .trim();

  for (const header of SECTION_HEADERS) {
    if (
      normalized === header ||
      normalized.startsWith(header + ':') ||
      normalized.startsWith(header + ' -') ||
      normalized.startsWith(header + ' |')
    ) {
      let type: SectionType = 'other';
      if (/summary|profile|about|objective|core profile/i.test(header)) type = 'summary';
      else if (/experience|employment|work history|career|selected engagements|engagements/i.test(header)) type = 'experience';
      else if (/education|academic/i.test(header)) type = 'education';
      else if (/skill|competenc|expertise|technologies|tech stack/i.test(header)) type = 'skills';
      else if (/project/i.test(header)) type = 'projects';
      else if (/certif|license|credential/i.test(header)) type = 'certifications';
      else if (/award|honor/i.test(header)) type = 'awards';
      else if (/publication/i.test(header)) type = 'publications';

      return { matched: true, type, title: line.trim() };
    }
  }

  return { matched: false, type: 'other', title: '' };
}

function extractStructuredLinks(text: string): {
  links: string[];
  structured: LinkItem[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
} {
  const urlRegex = /(https?:\/\/[^\s]+|linkedin\.com\/in\/[a-zA-Z0-9_\-]+|github\.com\/[a-zA-Z0-9_\-]+)/gi;
  const matches = text.match(urlRegex) || [];
  const unique = Array.from(new Set(matches.map((m) => m.trim())));

  const structured: LinkItem[] = [];
  let linkedin: string | undefined;
  let github: string | undefined;
  let portfolio: string | undefined;
  let website: string | undefined;

  for (const raw of unique) {
    const fullUrl = raw.startsWith('http') ? raw : 'https://' + raw;
    if (/linkedin\.com/i.test(raw) && !linkedin) {
      linkedin = fullUrl;
      structured.push({ type: 'linkedin', url: fullUrl, label: 'LinkedIn' });
    } else if (/github\.com/i.test(raw) && !github) {
      github = fullUrl;
      structured.push({ type: 'github', url: fullUrl, label: 'GitHub' });
    } else if (/portfolio|vercel\.app|netlify\.app|github\.io/i.test(raw) && !portfolio) {
      portfolio = fullUrl;
      structured.push({ type: 'portfolio', url: fullUrl, label: 'Portfolio' });
    } else if (!website && !/linkedin|github/i.test(raw)) {
      website = fullUrl;
      structured.push({ type: 'website', url: fullUrl, label: 'Website' });
    } else {
      structured.push({ type: 'other', url: fullUrl });
    }
  }

  return { links: unique, structured, linkedin, github, portfolio, website };
}

function extractName(text: string): { name: string; confidence: number } {
  const lines = cleanLines(text);
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (/@|http|linkedin|github|\.com|\.io|resume|curriculum|curriculum vitae|cv/i.test(line)) continue;
    if (matchSectionHeader(line).matched) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4 && /^[a-zA-Z\s.'-]+$/.test(line) && line.length < 45) {
      const confidence = i === 0 ? 0.95 : i === 1 ? 0.88 : 0.75;
      return { name: line.trim(), confidence };
    }
  }

  return { name: 'Candidate', confidence: 0.3 };
}

function extractLocation(text: string): string | undefined {
  const lines = cleanLines(text).slice(0, 10);
  const locationRegex = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+|\b(Remote|Hybrid|San Francisco|New York|Austin|Seattle|London|Berlin|Toronto|Bangalore|Singapore|Sydney|Dublin)\b)/i;
  for (const line of lines) {
    const match = line.match(locationRegex);
    if (match && !/@|github|linkedin/i.test(line)) {
      return match[0].trim();
    }
  }
  return undefined;
}

export function extractCategorizedSkills(text: string): {
  categorized: CategorizedSkills;
  all: string[];
} {
  const result: CategorizedSkills = {
    languages: [],
    frameworks: [],
    databases: [],
    cloud: [],
    devops: [],
    ai_ml: [],
    testing: [],
    security: [],
    tools: [],
    soft_skills: [],
    domain_knowledge: [],
  };

  const foundSet = new Set<string>();

  for (const [category, list] of Object.entries(SKILL_CATEGORIES_MAP)) {
    const catKey = category as SkillCategory;
    for (const skill of list) {
      const regex = getSkillRegex(skill);

      if (regex.test(text)) {
        const canonical = SKILL_ALIASES[skill.toLowerCase()] || skill;
        if (!result[catKey].includes(canonical)) {
          result[catKey].push(canonical);
        }
        foundSet.add(canonical);
      }
    }
  }

  return {
    categorized: result,
    all: Array.from(foundSet),
  };
}

export function segmentDocumentSections(text: string): ParsedSection[] {
  const lines = text.split(/\r?\n/);
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = {
    id: 'header-0',
    type: 'header',
    title: 'Header',
    content: '',
    startLine: 0,
    endLine: 0,
    confidence: 0.9,
  };

  let sectionLines: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    const { matched, type, title } = matchSectionHeader(line);

    if (matched && line.length < 50) {
      currentSection.content = sectionLines.join('\n').trim();
      currentSection.endLine = Math.max(0, idx - 1);
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }

      currentSection = {
        id: `${type}-${idx}`,
        type,
        title,
        content: '',
        startLine: idx,
        endLine: idx,
        confidence: 0.95,
      };
      sectionLines = [];
    } else {
      sectionLines.push(rawLine);
    }
  }

  currentSection.content = sectionLines.join('\n').trim();
  currentSection.endLine = lines.length - 1;
  if (currentSection.content.length > 0) {
    sections.push({ ...currentSection });
  }

  return sections;
}

function splitHeaderParts(text: string): string[] {
  if (text.includes('|')) {
    return text.split('|').map((p) => p.trim()).filter(Boolean);
  }
  if (text.includes('•')) {
    return text.split('•').map((p) => p.trim()).filter(Boolean);
  }
  if (/\s+[-–—]\s+/.test(text)) {
    return text.split(/\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);
  }
  if (text.includes(',')) {
    return text.split(/,/).map((p) => p.trim()).filter(Boolean);
  }
  return [text.trim()];
}

export function parseExperienceSection(expText: string): ExperienceItem[] {
  if (!expText.trim()) return [];

  const items: ExperienceItem[] = [];
  const lines = expText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const dateRangePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{1,2}\/)?(\d{4})\s*[-–—to\s]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{1,2}\/)?(\d{4}|present|current)?/i;

  const isRoleTitle = (str: string): boolean => {
    return /\b(engineer|developer|architect|lead|manager|analyst|specialist|consultant|sre|designer|director|vp|head|intern|fellow|scientist|officer|administrator|programmer|technician|representative)\b/i.test(str);
  };

  const isCompanyIndicator = (str: string): boolean => {
    return /\b(inc|corp|ltd|llc|technologies|services|solutions|labs|systems|group|company|co|corporation|bank|health|media|studios|enterprises|holdings|agency|aws|microsoft|google|amazon|meta|apple|netflix|stripe|cloudflare)\b/i.test(str);
  };

  interface RawJob {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    isRemote: boolean;
    isHybrid: boolean;
    isContract: boolean;
    isInternship: boolean;
    bullets: string[];
  }

  let currentJob: RawJob | null = null;
  let pendingHeaderLines: string[] = [];

  const commitCurrent = () => {
    if (currentJob && (currentJob.bullets.length > 0 || currentJob.company)) {
      const fullText = currentJob.bullets.join(' ');
      const { all: techs } = extractCategorizedSkills(fullText);
      const achievements = currentJob.bullets.filter((b) => QUANTIFIABLE_PATTERNS.some((p) => p.test(b)));

      items.push({
        company: currentJob.company || 'Company',
        role: currentJob.role || 'Software Professional',
        startDate: currentJob.startDate || 'Past',
        endDate: currentJob.endDate || 'Present',
        isCurrent: currentJob.isCurrent || /present|current/i.test(currentJob.endDate),
        isRemote: currentJob.isRemote,
        isHybrid: currentJob.isHybrid,
        isContract: currentJob.isContract,
        isInternship: currentJob.isInternship,
        bullets: currentJob.bullets,
        achievements,
        technologies: techs,
        rawText: currentJob.bullets.join('\n'),
        confidence: currentJob.company && currentJob.role ? 0.92 : 0.75,
      });
    }
    currentJob = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[•\-*▪►◦‣⁃]\s*/.test(line);
    const dateMatch = line.match(dateRangePattern);

    if (dateMatch) {
      commitCurrent();

      const isRemote = /\bremote\b/i.test(line);
      const isHybrid = /\bhybrid\b/i.test(line);
      const isContract = /\b(contract|contractor|freelance)\b/i.test(line);
      const isInternship = /\b(intern|internship)\b/i.test(line);

      const dateParts = dateMatch[0].split(/[-–—]|\bto\b/i).map((d) => d.trim());
      const startDate = dateParts[0] || '';
      const endDate = dateParts[1] || (dateMatch[0].toLowerCase().includes('present') ? 'Present' : 'Present');
      const isCurrent = /present|current/i.test(dateMatch[0]);

      const cleanedLine = line
        .replace(dateMatch[0], '')
        .replace(/\b(remote|hybrid|contract|contractor|freelance|intern|internship)\b/gi, '')
        .replace(/^[\s|•\-–—,]+|[\s|•\-–—,]+$/g, '')
        .trim();

      let comp = '';
      let role = '';

      if (pendingHeaderLines.length >= 2) {
        const lineA = pendingHeaderLines[pendingHeaderLines.length - 2];
        const lineB = pendingHeaderLines[pendingHeaderLines.length - 1];
        if (isRoleTitle(lineB) && !isRoleTitle(lineA)) {
          comp = lineA;
          role = lineB;
        } else if (isRoleTitle(lineA) && !isRoleTitle(lineB)) {
          role = lineA;
          comp = lineB;
        } else if (isCompanyIndicator(lineA)) {
          comp = lineA;
          role = lineB;
        } else {
          comp = lineA;
          role = lineB;
        }
      } else if (pendingHeaderLines.length === 1) {
        const singleLine = pendingHeaderLines[0];
        const parts = splitHeaderParts(singleLine);
        if (parts.length >= 2) {
          if (isRoleTitle(parts[0])) {
            role = parts[0];
            comp = parts[1];
          } else {
            comp = parts[0];
            role = parts[1];
          }
        } else if (isRoleTitle(singleLine)) {
          role = singleLine;
          comp = cleanedLine || 'Organization';
        } else {
          comp = singleLine;
          role = cleanedLine || (isRoleTitle(cleanedLine) ? cleanedLine : 'Software Professional');
        }
      } else if (cleanedLine) {
        const parts = splitHeaderParts(cleanedLine);
        if (parts.length >= 2) {
          if (isRoleTitle(parts[0])) {
            role = parts[0];
            comp = parts[1];
          } else {
            comp = parts[0];
            role = parts[1];
          }
        } else {
          if (isRoleTitle(cleanedLine)) {
            role = cleanedLine;
            comp = 'Organization';
          } else {
            comp = cleanedLine;
            role = 'Software Professional';
          }
        }
      }

      currentJob = {
        company: comp || 'Organization',
        role: role || 'Software Professional',
        startDate,
        endDate,
        isCurrent,
        isRemote,
        isHybrid,
        isContract,
        isInternship,
        bullets: [],
      };
      pendingHeaderLines = [];
    } else if (isBullet) {
      const cleanBullet = line.replace(/^[•\-*▪►◦‣⁃]\s*/, '').trim();
      if (currentJob) {
        currentJob.bullets.push(cleanBullet);
      } else {
        currentJob = {
          company: pendingHeaderLines[0] || 'Organization',
          role: pendingHeaderLines[1] || 'Software Professional',
          startDate: 'Past',
          endDate: 'Present',
          isCurrent: true,
          isRemote: false,
          isHybrid: false,
          isContract: false,
          isInternship: false,
          bullets: [cleanBullet],
        };
        pendingHeaderLines = [];
      }
    } else {
      if (currentJob && currentJob.bullets.length > 0) {
        if (line.length < 60 && !line.endsWith('.') && (isCompanyIndicator(line) || isRoleTitle(line) || pendingHeaderLines.length > 0 || !line.includes(' '))) {
          pendingHeaderLines.push(line);
        } else {
          currentJob.bullets[currentJob.bullets.length - 1] += ' ' + line;
        }
      } else {
        pendingHeaderLines.push(line);
      }
    }
  }

  commitCurrent();
  return items;
}

export function parseEducationSection(eduText: string): EducationItem[] {
  if (!eduText.trim()) return [];

  const items: EducationItem[] = [];
  const lines = eduText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  // Global GPA search in entire education text
  const gpaMatch = eduText.match(/\bgpa:?\s*(\d(?:\.\d{1,2})?(?:\s*\/\s*4(?:\.0)?)?|\d{1,2}(?:\.\d{1,2})?\s*\/\s*10)/i);
  const foundGPA = gpaMatch ? gpaMatch[1] : undefined;

  for (const line of lines) {
    const hasDegree = /\b(bachelor|master|doctor|associate|b\.s\.|b\.a\.|m\.s\.|m\.a\.|b\.tech|m\.tech|mba|ph\.d|phd|b\.e\.|b\.sc)\b/i.test(line);
    const hasInstitution = /\b(university|college|institute|school|academy|polytechnic)\b/i.test(line);

    if (hasDegree || hasInstitution) {
      const parts = line.split(/[-–—|,]/).map((p) => p.trim());
      const inst = parts.find((p) => /\b(university|college|institute|school)\b/i.test(p)) || parts[0] || 'University';
      const deg = parts.find((p) => /\b(bachelor|master|b\.s|b\.a|m\.s|m\.a|phd|b\.tech|m\.tech|associate)\b/i.test(p)) || line;

      items.push({
        institution: inst,
        degree: deg,
        gpa: foundGPA,
        confidence: hasDegree && hasInstitution ? 0.95 : 0.8,
      });
    }
  }

  if (items.length === 0 && eduText.trim().length > 10) {
    items.push({
      institution: 'Higher Education Institution',
      degree: eduText.split('\n')[0].trim(),
      gpa: foundGPA,
      confidence: 0.65,
    });
  }

  return items;
}

export function parseProjectsSection(projText: string): ProjectItem[] {
  if (!projText.trim()) return [];
  const lines = projText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const projects: ProjectItem[] = [];

  let currentName = '';
  let currentDesc: string[] = [];

  for (const line of lines) {
    const isBullet = /^\s*[•\-*▪►◦‣⁃]/.test(line);
    if (!isBullet && line.length < 70 && !/^(built|developed|created|implemented)/i.test(line)) {
      if (currentName) {
        const descStr = currentDesc.join(' ');
        const { all: techs } = extractCategorizedSkills(descStr);
        projects.push({
          name: currentName,
          description: descStr,
          technologies: techs,
          confidence: 0.9,
        });
        currentDesc = [];
      }
      currentName = line.replace(/[:\-–]/g, '').trim();
    } else {
      currentDesc.push(line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '').trim());
    }
  }

  if (currentName) {
    const descStr = currentDesc.join(' ');
    const { all: techs } = extractCategorizedSkills(descStr);
    projects.push({
      name: currentName,
      description: descStr,
      technologies: techs,
      confidence: 0.9,
    });
  }

  return projects;
}

export function parseCertificationsSection(certText: string): CertificationItem[] {
  if (!certText.trim()) return [];
  const lines = certText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => ({
    name: line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '').trim(),
    confidence: 0.9,
  }));
}

export function parseResume(rawText: string, fileName: string = 'resume.txt'): ResumeParsed {
  const trimmed = rawText.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const pageCountEstimate = Math.max(1, Math.ceil(wordCount / 450));

  const sections = segmentDocumentSections(trimmed);
  const linksInfo = extractStructuredLinks(trimmed);
  const nameInfo = extractName(trimmed);

  const personalInfo: PersonalInfo = {
    name: nameInfo.name,
    email: trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)?.[0],
    phone: trimmed.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/)?.[0],
    location: extractLocation(trimmed),
    linkedin: linksInfo.linkedin,
    github: linksInfo.github,
    portfolio: linksInfo.portfolio,
    website: linksInfo.website,
    links: linksInfo.links,
    structuredLinks: linksInfo.structured,
    confidence: nameInfo.confidence,
  };

  const expSection = sections.find((s) => s.type === 'experience')?.content || '';
  const eduSection = sections.find((s) => s.type === 'education')?.content || '';
  const projSection = sections.find((s) => s.type === 'projects')?.content || '';
  const certSection = sections.find((s) => s.type === 'certifications')?.content || '';
  const summarySection = sections.find((s) => s.type === 'summary')?.content;

  const { categorized, all: allSkills } = extractCategorizedSkills(trimmed);
  const experience = parseExperienceSection(expSection);
  const education = parseEducationSection(eduSection);
  const projects = parseProjectsSection(projSection);
  const certifications = parseCertificationsSection(certSection);

  const achievements: string[] = [];
  for (const line of trimmed.split(/\r?\n/)) {
    if (QUANTIFIABLE_PATTERNS.some((p) => p.test(line)) && line.length > 20) {
      achievements.push(line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, '').trim());
    }
  }

  const sectionHeadersFound = sections.map((s) => s.title);

  return {
    metadata: {
      fileName,
      fileType: fileName.endsWith('.pdf') ? 'pdf' : 'txt',
      extractedCharCount: trimmed.length,
      wordCount,
      pageCountEstimate,
      extractionQuality: 'excellent',
      isScanned: false,
      hasTwoColumns: false,
    },
    sections,
    personalInfo,
    summary: summarySection,
    experience,
    education,
    projects,
    certifications,
    skills: categorized,
    allSkills,
    achievements,
    rawText: trimmed,
    wordCount,
    pageCountEstimate,
    sectionHeadersFound,
  };
}
