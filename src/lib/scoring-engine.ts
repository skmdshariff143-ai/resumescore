/**
 * Core resume scoring engine.
 *
 * Analyses plain-text resume content across six weighted dimensions and
 * returns a {@link ResumeScore} with detailed, actionable feedback.
 */

import type {
  ResumeScore,
  DimensionScore,
  FeedbackItem,
} from '@/types';

import {
  ACTION_VERBS,
  TECHNICAL_SKILLS,
  SOFT_SKILLS,
  EDUCATION_KEYWORDS,
  SECTION_HEADERS,
  WEAK_WORDS,
  QUANTIFIABLE_PATTERNS,
} from './keywords';

// ── helpers ────────────────────────────────────────────────────────────────

/** Clamp a number between `min` and `max`. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Count how many items from `list` appear in `text` (case-insensitive). */
function countMatches(text: string, list: readonly string[]): string[] {
  const lower = text.toLowerCase();
  return list.filter((item) => {
    // Use word-boundary matching for short items to avoid false positives
    // e.g. "r" inside "resume", "c" inside "contact".
    if (item.length <= 2) {
      const re = new RegExp(`\\b${escapeRegex(item)}\\b`, 'i');
      return re.test(lower);
    }
    return lower.includes(item.toLowerCase());
  });
}

/** Escape special regex characters in a string. */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Count regex pattern matches in `text`. */
function countPatternMatches(text: string, patterns: readonly RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    const global = new RegExp(pattern.source, 'gi');
    const matches = text.match(global);
    if (matches) count += matches.length;
  }
  return count;
}

/** Word count. */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── dimension scorers ──────────────────────────────────────────────────────

/**
 * Dimension 1 — Contact Information (weight 0.10).
 *
 * Awards 20 pts each for: email, phone, LinkedIn, GitHub, portfolio/website.
 */
function scoreContactInfo(text: string): DimensionScore {
  const checks = {
    email: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(text),
    phone: /(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(text),
    linkedin: /linkedin\.com\/in\//i.test(text),
    github: /github\.com\//i.test(text),
    portfolio: /(?:portfolio|website|(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,})/i.test(text) &&
      !/linkedin\.com|github\.com/i.test(text.match(/https?:\/\/[^\s]+/)?.[0] ?? ''),
  };

  const found = Object.values(checks).filter(Boolean).length;
  const score = clamp(found * 20, 0, 100);

  const missing: string[] = [];
  if (!checks.email) missing.push('email address');
  if (!checks.phone) missing.push('phone number');
  if (!checks.linkedin) missing.push('LinkedIn URL');
  if (!checks.github) missing.push('GitHub URL');
  if (!checks.portfolio) missing.push('portfolio / website');

  let feedback: string;
  if (score === 100) {
    feedback = 'Excellent! All key contact details are present, making it easy for recruiters to reach you.';
  } else if (score >= 60) {
    feedback = `Good contact section, but you are missing: ${missing.join(', ')}.`;
  } else {
    feedback = `Your contact information is incomplete. Missing: ${missing.join(', ')}. Recruiters need easy ways to contact you.`;
  }

  const tips: string[] = [];
  if (!checks.email) tips.push('Add a professional email address (preferably firstname.lastname@domain.com).');
  if (!checks.phone) tips.push('Include a phone number with country code for international applications.');
  if (!checks.linkedin) tips.push('Add your LinkedIn profile URL — recruiters check LinkedIn for 87% of candidates.');
  if (!checks.github && !checks.portfolio) tips.push('Include a GitHub or portfolio link to showcase your work.');

  return {
    name: 'Contact Info',
    score,
    weight: 0.10,
    icon: '📇',
    color: 'text-blue-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

/**
 * Dimension 2 — Experience Quality (weight 0.25).
 *
 * Evaluates action verb usage, date ranges, job titles, and bullet structure.
 */
function scoreExperience(text: string): DimensionScore {
  const matchedVerbs = countMatches(text, ACTION_VERBS);
  const verbCount = matchedVerbs.length;

  // Date ranges like "Jan 2020 - Present", "2019-2022", "March 2018 – June 2021"
  const dateRangePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?\d{4}\s*[-–—]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?\d{0,4}\s*(?:present|current)?/gi;
  const dateMatches = text.match(dateRangePattern) ?? [];

  // Job-title-like patterns (heuristic: capitalised multi-word phrases near dates)
  const titlePatterns = /(?:senior|junior|lead|principal|staff|chief|head|manager|director|vp|intern|engineer|developer|analyst|designer|architect|consultant|specialist|coordinator|administrator|associate|officer|executive|president)/gi;
  const titleMatches = text.match(titlePatterns) ?? [];

  // Bullet structure: lines starting with •, -, *, or ▪
  const bulletLines = text.split('\n').filter((l) => /^\s*[•\-*▪►◦‣⁃]/.test(l));

  // Weak words penalty
  const weakMatches = countMatches(text, WEAK_WORDS);

  // Scoring
  let score = 0;
  score += clamp(verbCount * 3, 0, 35);         // up to 35 pts for action verbs
  score += clamp(dateMatches.length * 10, 0, 20); // up to 20 pts for date ranges
  score += clamp(titleMatches.length * 5, 0, 20); // up to 20 pts for job titles
  score += clamp(bulletLines.length * 2, 0, 25);  // up to 25 pts for bullet structure

  // Penalise weak words
  score -= clamp(weakMatches.length * 3, 0, 20);
  score = clamp(score, 0, 100);

  let feedback: string;
  if (score >= 80) {
    feedback = `Strong experience section with ${verbCount} action verbs and clear chronological structure. Well done!`;
  } else if (score >= 50) {
    feedback = `Decent experience section (${verbCount} action verbs found), but there is room to strengthen impact and structure.`;
  } else {
    feedback = `Your experience section needs work. Only ${verbCount} action verbs detected, and the structure could be improved.`;
  }

  const tips: string[] = [];
  if (verbCount < 8) tips.push('Start each bullet point with a strong action verb (e.g., "Architected", "Spearheaded", "Optimized").');
  if (dateMatches.length < 2) tips.push('Include clear date ranges (e.g., "Jan 2021 – Present") for each role.');
  if (bulletLines.length < 5) tips.push('Use bullet points (•) to list achievements — aim for 3-5 bullets per role.');
  if (weakMatches.length > 3) tips.push(`Avoid weak phrases like "${weakMatches[0]}". Replace with specific, measurable accomplishments.`);
  if (tips.length === 0) tips.push('Consider adding more quantifiable results to each bullet point.');

  return {
    name: 'Experience',
    score,
    weight: 0.25,
    icon: '💼',
    color: 'text-purple-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

/**
 * Dimension 3 — Skills (weight 0.20).
 *
 * Matches against technical and soft skill databases; rewards breadth.
 */
function scoreSkills(text: string): DimensionScore {
  const techMatches = countMatches(text, TECHNICAL_SKILLS);
  const softMatches = countMatches(text, SOFT_SKILLS);
  const totalSkills = techMatches.length + softMatches.length;

  // Breadth bonus: reward having both tech and soft skills
  const hasBoth = techMatches.length > 0 && softMatches.length > 0;

  let score = 0;
  score += clamp(techMatches.length * 3, 0, 55);  // up to 55 pts
  score += clamp(softMatches.length * 4, 0, 30);  // up to 30 pts
  score += hasBoth ? 15 : 0;                       // breadth bonus
  score = clamp(score, 0, 100);

  let feedback: string;
  if (score >= 80) {
    feedback = `Impressive skills profile with ${techMatches.length} technical and ${softMatches.length} soft skills identified. Great breadth and depth.`;
  } else if (score >= 50) {
    feedback = `Solid skills section (${totalSkills} skills detected). Consider adding more ${techMatches.length < softMatches.length ? 'technical' : 'soft'} skills for balance.`;
  } else {
    feedback = `Only ${totalSkills} recognisable skills found. A dedicated skills section with categorised competencies will improve your score.`;
  }

  const tips: string[] = [];
  if (techMatches.length < 5) tips.push('List specific technologies (languages, frameworks, tools) rather than generic terms.');
  if (softMatches.length < 3) tips.push('Include relevant soft skills like leadership, communication, or project management.');
  if (!hasBoth) tips.push('Balance your resume with both technical and interpersonal skills.');
  if (totalSkills >= 10) tips.push('Group skills by category (e.g., Languages, Frameworks, Cloud) for better readability.');
  if (tips.length === 0) tips.push('Keep your skills section updated with your most recent and relevant competencies.');

  return {
    name: 'Skills',
    score,
    weight: 0.20,
    icon: '🛠️',
    color: 'text-green-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

/**
 * Dimension 4 — Education (weight 0.15).
 *
 * Checks for degree keywords, GPA, certifications, and relevant coursework.
 */
function scoreEducation(text: string): DimensionScore {
  const eduMatches = countMatches(text, EDUCATION_KEYWORDS);

  const hasGPA = /\bgpa\b/i.test(text) || /\d\.\d{1,2}\s*\/\s*4/i.test(text);
  const hasDegree = /\b(bachelor|master|doctor|associate|b\.s\.|b\.a\.|m\.s\.|m\.a\.|mba|ph\.d|phd)\b/i.test(text);
  const hasCertification = /\b(certified|certification|certificate|license|accredited)\b/i.test(text);
  const hasInstitution = /\b(university|college|institute|school|academy)\b/i.test(text);

  let score = 0;
  score += hasDegree ? 30 : 0;
  score += hasInstitution ? 15 : 0;
  score += hasGPA ? 15 : 0;
  score += hasCertification ? 15 : 0;
  score += clamp(eduMatches.length * 3, 0, 25);
  score = clamp(score, 0, 100);

  let feedback: string;
  if (score >= 80) {
    feedback = 'Comprehensive education section with degree details, institution, and additional credentials.';
  } else if (score >= 50) {
    feedback = 'Education section is present but could include more detail like GPA, relevant coursework, or certifications.';
  } else {
    feedback = 'Education section is thin or missing. Even experienced professionals should list their highest degree and any certifications.';
  }

  const tips: string[] = [];
  if (!hasDegree) tips.push('Clearly state your degree type (e.g., "Bachelor of Science in Computer Science").');
  if (!hasInstitution) tips.push('Include the name of your university or educational institution.');
  if (!hasGPA && hasDegree) tips.push('Consider adding your GPA if it is 3.0/4.0 or above.');
  if (!hasCertification) tips.push('List relevant certifications (AWS, PMP, Scrum Master, etc.) to strengthen credibility.');
  if (tips.length === 0) tips.push('Add relevant coursework or academic projects that align with your target role.');

  return {
    name: 'Education',
    score,
    weight: 0.15,
    icon: '🎓',
    color: 'text-yellow-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

/**
 * Dimension 5 — Formatting & Structure (weight 0.15).
 *
 * Evaluates length, section headers, and structural signals.
 */
function scoreFormatting(text: string): DimensionScore {
  const words = wordCount(text);
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0);

  // Check section headers present
  const matchedHeaders = countMatches(text, SECTION_HEADERS);
  const headerCount = matchedHeaders.length;

  // Ideal word count: 400–800 for a single-page resume
  let lengthScore: number;
  if (words >= 400 && words <= 800) {
    lengthScore = 30;
  } else if (words >= 300 && words <= 1000) {
    lengthScore = 20;
  } else if (words >= 200 && words <= 1200) {
    lengthScore = 10;
  } else {
    lengthScore = 0;
  }

  // Excessive whitespace: ratio of empty lines to total lines
  const emptyLineRatio = 1 - nonEmptyLines.length / Math.max(lines.length, 1);
  const whitespaceScore = emptyLineRatio > 0.4 ? 0 : emptyLineRatio > 0.25 ? 10 : 20;

  // Section header score
  const headerScore = clamp(headerCount * 6, 0, 30);

  // Consistency signals: bullet usage
  const bulletLines = nonEmptyLines.filter((l) => /^\s*[•\-*▪►]/.test(l));
  const consistencyScore = bulletLines.length >= 3 ? 20 : bulletLines.length >= 1 ? 10 : 0;

  const score = clamp(lengthScore + whitespaceScore + headerScore + consistencyScore, 0, 100);

  let feedback: string;
  if (score >= 80) {
    feedback = `Well-structured resume with ${headerCount} clear sections and an ideal length of ${words} words.`;
  } else if (score >= 50) {
    feedback = `Formatting is acceptable (${words} words, ${headerCount} sections), but structural improvements would help readability.`;
  } else {
    feedback = `Formatting needs attention. Your resume is ${words} words with ${headerCount} identifiable sections — aim for clearer structure.`;
  }

  const tips: string[] = [];
  if (words < 400) tips.push(`Your resume is only ${words} words. Aim for 400-800 words to fill a single page effectively.`);
  if (words > 800) tips.push(`At ${words} words your resume may exceed one page. Trim to the most relevant content.`);
  if (headerCount < 3) tips.push('Use clear section headers (Experience, Education, Skills, Projects) to improve scannability.');
  if (whitespaceScore < 20) tips.push('Reduce excessive blank lines — keep whitespace consistent and purposeful.');
  if (bulletLines.length < 3) tips.push('Use bullet points to list achievements; they are easier to scan than paragraphs.');
  if (tips.length === 0) tips.push('Ensure consistent font sizing and spacing across all sections.');

  return {
    name: 'Formatting',
    score,
    weight: 0.15,
    icon: '📐',
    color: 'text-orange-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

/**
 * Dimension 6 — Impact & Achievements (weight 0.15).
 *
 * Counts quantifiable achievements: numbers, percentages, dollar amounts.
 */
function scoreImpact(text: string): DimensionScore {
  const quantifiableCount = countPatternMatches(text, QUANTIFIABLE_PATTERNS);

  // Results-oriented language
  const resultsKeywords = [
    'achieved', 'delivered', 'generated', 'increased', 'decreased',
    'reduced', 'improved', 'saved', 'grew', 'boosted', 'expanded',
    'exceeded', 'surpassed', 'outperformed', 'doubled', 'tripled',
    'maximized', 'minimized', 'launched', 'shipped', 'completed',
  ] as const;
  const resultsMatches = countMatches(text, resultsKeywords);

  let score = 0;
  score += clamp(quantifiableCount * 8, 0, 60);   // up to 60 pts
  score += clamp(resultsMatches.length * 5, 0, 40); // up to 40 pts
  score = clamp(score, 0, 100);

  let feedback: string;
  if (score >= 80) {
    feedback = `Outstanding! ${quantifiableCount} quantifiable achievements detected. Your resume clearly demonstrates measurable impact.`;
  } else if (score >= 50) {
    feedback = `Good start with ${quantifiableCount} quantifiable metrics. Adding more numbers and percentages will make your impact undeniable.`;
  } else {
    feedback = `Only ${quantifiableCount} quantifiable achievements found. Recruiters spend 7 seconds scanning — numbers catch the eye.`;
  }

  const tips: string[] = [];
  if (quantifiableCount < 3) tips.push('Add metrics to your achievements: "Reduced load time by 40%" is stronger than "Improved performance".');
  if (quantifiableCount < 5) tips.push('Quantify scope: team size, budget managed, users served, revenue impacted.');
  if (resultsMatches.length < 3) tips.push('Use results-oriented verbs like "delivered", "generated", "achieved" instead of "worked on" or "helped".');
  if (tips.length === 0) tips.push('Consider adding before/after comparisons to highlight the magnitude of your impact.');

  return {
    name: 'Impact',
    score,
    weight: 0.15,
    icon: '🎯',
    color: 'text-red-500',
    feedback,
    tips: tips.slice(0, 3),
  };
}

// ── grade assignment ───────────────────────────────────────────────────────

/** Map an overall score (0-100) to a letter grade. */
function assignGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 55) return 'D';
  return 'F';
}

// ── feedback generation ────────────────────────────────────────────────────

/** Generate top-level feedback items from dimension results and text. */
function generateFeedback(
  text: string,
  dimensions: DimensionScore[],
): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  // Successes
  for (const dim of dimensions) {
    if (dim.score >= 80) {
      items.push({
        type: 'success',
        category: dim.name,
        message: `Your ${dim.name.toLowerCase()} section is strong — keep it up!`,
      });
    }
  }

  // Warnings
  for (const dim of dimensions) {
    if (dim.score >= 50 && dim.score < 80) {
      items.push({
        type: 'warning',
        category: dim.name,
        message: `${dim.name} scored ${dim.score}/100. ${dim.tips[0] ?? 'Review this section for improvements.'}`,
      });
    }
  }

  // Errors (critical issues)
  for (const dim of dimensions) {
    if (dim.score < 50) {
      items.push({
        type: 'error',
        category: dim.name,
        message: `${dim.name} is critically low at ${dim.score}/100. This section needs significant improvement.`,
      });
    }
  }

  // Weak-word warning
  const weakMatches = countMatches(text, WEAK_WORDS);
  if (weakMatches.length > 5) {
    items.push({
      type: 'warning',
      category: 'Language',
      message: `Found ${weakMatches.length} weak phrases (e.g., "${weakMatches[0]}", "${weakMatches[1]}"). Replace them with specific, results-oriented language.`,
    });
  } else if (weakMatches.length > 0) {
    items.push({
      type: 'info',
      category: 'Language',
      message: `Found ${weakMatches.length} weak phrase(s). Consider replacing "${weakMatches[0]}" with a stronger alternative.`,
    });
  }

  // Length check
  const words = wordCount(text);
  if (words < 200) {
    items.push({
      type: 'error',
      category: 'Length',
      message: `Your resume is only ${words} words. Most effective resumes are 400-800 words for a single page.`,
    });
  } else if (words > 1200) {
    items.push({
      type: 'warning',
      category: 'Length',
      message: `At ${words} words your resume may be too long. Aim to keep it concise and under two pages unless you have 10+ years of experience.`,
    });
  } else if (words >= 400 && words <= 800) {
    items.push({
      type: 'success',
      category: 'Length',
      message: `Resume length (${words} words) is ideal for a single-page format.`,
    });
  }

  // Overall encouragement or push
  const avgScore = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0);
  if (avgScore >= 85) {
    items.push({
      type: 'success',
      category: 'Overall',
      message: 'Your resume is in great shape! Fine-tune the weaker areas for a perfect score.',
    });
  } else if (avgScore < 50) {
    items.push({
      type: 'error',
      category: 'Overall',
      message: 'Your resume needs substantial work across multiple areas. Focus on the lowest-scoring dimensions first.',
    });
  }

  return items;
}

// ── public API ─────────────────────────────────────────────────────────────

/**
 * Analyse a resume from its plain-text content and return a comprehensive
 * {@link ResumeScore} with per-dimension breakdowns and actionable feedback.
 *
 * @param text - The full plain-text content of the resume.
 * @returns A complete scoring result.
 */
export function analyzeResume(text: string): ResumeScore {
  const dimensions: DimensionScore[] = [
    scoreContactInfo(text),
    scoreExperience(text),
    scoreSkills(text),
    scoreEducation(text),
    scoreFormatting(text),
    scoreImpact(text),
  ];

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  const grade = assignGrade(overall);
  const feedback = generateFeedback(text, dimensions);
  const analyzedAt = new Date().toISOString();
  const resumePreview = text.slice(0, 200).replace(/\s+/g, ' ').trim();

  return {
    overall,
    grade,
    dimensions,
    feedback,
    analyzedAt,
    resumePreview,
  };
}
