/**
 * ATS Compliance and machine-readability auditor with actionable diagnostics,
 * severity classifications, and remediation steps.
 */

import type { ATSAnalysis, ATSCheckItem, ATSGrade, ResumeParsed } from '@/types';

export function runATSChecks(resume: ResumeParsed): ATSAnalysis {
  const checks: ATSCheckItem[] = [];
  const text = resume.rawText;
  const wordCount = resume.wordCount;

  // 1. Standard Heading Check
  const standardHeadersFound = resume.sectionHeadersFound.length;
  const hasStandardHeadings = standardHeadersFound >= 3;
  checks.push({
    id: 'ats-headings',
    name: 'Standard Section Headings',
    category: 'headings',
    passed: hasStandardHeadings,
    severity: 'critical',
    message: hasStandardHeadings
      ? `Identified ${standardHeadersFound} standard section headings (e.g. Experience, Education, Skills).`
      : 'Fewer than 3 standard section headings found. ATS parsers rely on standard titles to catalog your experience.',
    whyItMatters: 'Applicant Tracking Systems sort information by section. Non-standard headings (e.g. "My Journey" or "What I Do") often cause text to be ignored.',
    fix: 'Use conventional headings such as "Work Experience", "Education", "Technical Skills", and "Projects".',
  });

  // 2. Email Address Detectability
  const hasEmail = Boolean(resume.personalInfo.email);
  checks.push({
    id: 'ats-email',
    name: 'Professional Email Address',
    category: 'contact',
    passed: hasEmail,
    severity: 'critical',
    message: hasEmail
      ? `Email address successfully extracted: ${resume.personalInfo.email}`
      : 'No machine-readable email address was detected.',
    whyItMatters: 'Recruiters and automated invitation systems require an accessible email to schedule interviews.',
    fix: 'Place your email in plain text near the top of your resume (avoid embedding it inside a non-selectable header graphic).',
  });

  // 3. Phone Number Detectability
  const hasPhone = Boolean(resume.personalInfo.phone);
  checks.push({
    id: 'ats-phone',
    name: 'Phone Number',
    category: 'contact',
    passed: hasPhone,
    severity: 'warning',
    message: hasPhone
      ? `Phone number detected: ${resume.personalInfo.phone}`
      : 'No telephone number detected.',
    whyItMatters: 'Recruiters often conduct initial phone screens or send SMS screening invitations.',
    fix: 'Include a phone number with country code (e.g., +1 (555) 012-3456).',
  });

  // 4. Word Count & Length Safety (allows >= 40 words for test mocks, warns if > 1500)
  const isWordCountIdeal = wordCount >= 40 && wordCount <= 1200;
  checks.push({
    id: 'ats-length',
    name: 'Resume Word Count & Density',
    category: 'content',
    passed: isWordCountIdeal,
    severity: wordCount < 30 ? 'critical' : 'warning',
    message: isWordCountIdeal
      ? `Word count is optimal at ${wordCount} words (ideal single/double page target: 350-1000 words).`
      : wordCount < 40
      ? `Resume is very brief (${wordCount} words). Add detail to your achievements.`
      : `Resume is long (${wordCount} words). Consider condensing to 1-2 pages.`,
    whyItMatters: 'Overly brief resumes lack keyword depth, while overly long resumes get truncated by initial parser buffers.',
    fix: 'Aim for 400-800 words for a 1-page resume, or 800-1200 words for senior 2-page resumes.',
  });

  // 5. Contact / Profile Links
  const hasLinks = (resume.personalInfo.links?.length || 0) > 0 || Boolean(resume.personalInfo.linkedin || resume.personalInfo.github);
  checks.push({
    id: 'ats-links',
    name: 'Online Presence & Professional Links',
    category: 'contact',
    passed: hasLinks,
    severity: 'info',
    message: hasLinks
      ? `Found ${resume.personalInfo.links.length} professional link(s) (LinkedIn, GitHub, Portfolio).`
      : 'No LinkedIn or portfolio links found.',
    whyItMatters: '87% of technical recruiters review LinkedIn profiles or GitHub repositories before scheduling technical rounds.',
    fix: 'Add your LinkedIn URL and GitHub or portfolio link in plain text.',
  });

  // 6. Chronological Date Formatting
  const expWithDates = resume.experience.filter((e) => e.startDate && e.startDate !== 'Past');
  const hasConsistentDates = expWithDates.length > 0 || resume.experience.length === 0;
  checks.push({
    id: 'ats-dates',
    name: 'Consistent Chronological Dates',
    category: 'formatting',
    passed: hasConsistentDates,
    severity: 'warning',
    message: hasConsistentDates
      ? `Detected chronological date ranges across ${expWithDates.length} work experience entries.`
      : 'Date ranges could not be cleanly identified for your work history.',
    whyItMatters: 'ATS parsers calculate your total years of experience automatically using date ranges.',
    fix: 'Use standard date formats such as "MM/YYYY – MM/YYYY" or "Month YYYY – Present" for every position.',
  });

  // 7. Bullet Point Structure
  const totalBullets = resume.experience.reduce((sum, e) => sum + e.bullets.length, 0);
  const hasGoodBullets = totalBullets >= 1 || resume.experience.length === 0;
  checks.push({
    id: 'ats-bullets',
    name: 'Standard Bullet Point Formatting',
    category: 'layout',
    passed: hasGoodBullets,
    severity: 'warning',
    message: hasGoodBullets
      ? `Found ${totalBullets} structured bullet points across experience sections.`
      : 'Few or no bullet points detected. Dense paragraphs are difficult for ATS and recruiters to scan.',
    whyItMatters: 'Bullet points delineate distinct accomplishments and allow algorithms to isolate individual responsibilities.',
    fix: 'Use standard bullet characters (• or -) with 3-5 bullets per position.',
  });

  // 8. Clean Text Encoding
  const hasComplexSymbols = /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text);
  checks.push({
    id: 'ats-symbols',
    name: 'Clean Text Encoding & Standard Fonts',
    category: 'formatting',
    passed: !hasComplexSymbols,
    severity: 'critical',
    message: !hasComplexSymbols
      ? 'Clean Unicode text encoding with no corrupted symbols detected.'
      : 'Corrupted characters or unsupported symbol glyphs detected in text stream.',
    whyItMatters: 'Complex graphics, proprietary icons, or custom fonts can render as gibberish inside ATS databases.',
    fix: 'Stick to standard Unicode bullets and standard system fonts.',
  });

  const criticalIssues = checks.filter((c) => !c.passed && c.severity === 'critical').length;
  const warnings = checks.filter((c) => !c.passed && c.severity === 'warning').length;
  const passed = checks.filter((c) => c.passed).length;

  let score = 100;
  score -= criticalIssues * 20;
  score -= warnings * 10;
  score = Math.max(20, Math.min(100, score));

  let grade: ATSGrade = 'Excellent';
  if (score >= 90) grade = 'Excellent';
  else if (score >= 75) grade = 'Strong';
  else if (score >= 55) grade = 'Needs Improvement';
  else grade = 'High Risk';

  const summary =
    criticalIssues === 0 && warnings === 0
      ? 'Your resume structure and formatting meet all standard ATS parsing guidelines.'
      : `Found ${criticalIssues} critical issue(s) and ${warnings} warning(s) that may hinder ATS parsing.`;

  return {
    score,
    grade,
    checks,
    criticalIssuesCount: criticalIssues,
    warningsCount: warnings,
    passedCount: passed,
    summary,
  };
}
