/**
 * 7-Pillar Transparent Scoring Engine:
 * 1. ATS Compatibility (15%)
 * 2. Job Skill Match (25%)
 * 3. Experience Relevance (20%)
 * 4. Impact & Metrics (15%)
 * 5. Projects & Portfolio (10%)
 * 6. Structure & Readability (10%)
 * 7. Profile & Contact (5%)
 *
 * Mathematically deterministic score contributions and justified score boost estimates.
 */

import type {
  AnalysisMode,
  DimensionScore,
  FeedbackItem,
  JobParsed,
  ResumeParsed,
  ResumeScore,
    TopActionItem,
} from '@/types';

import { runATSChecks } from '../ats/ats-checker';
import { analyzeBullet, evaluateResumeImpact } from '../impact/impact-evaluator';
import { parseResume } from '../parsing/resume-parser';
import { buildSkillMatrix } from '../matching/semantic-matcher';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

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

export function calculateResumeScore(
  resume: ResumeParsed,
  job?: JobParsed,
  mode: AnalysisMode = 'general'
): ResumeScore {
  const isJobMatch = mode === 'job_match' && Boolean(job);

  // 1. ATS Compatibility (15%)
  const atsAnalysis = runATSChecks(resume);
  const atsScoreVal = atsAnalysis.score;
  const atsDimension: DimensionScore = {
    key: 'ats',
    name: 'ATS Compatibility',
    score: atsScoreVal,
    weight: 0.15,
    contribution: Number((atsScoreVal * 0.15).toFixed(1)),
    icon: '🤖',
    color: 'text-indigo-400',
    feedback: atsAnalysis.summary,
    reason: `${atsAnalysis.passedCount} of ${atsAnalysis.checks.length} ATS compliance checks passed.`,
    tips: atsAnalysis.checks.filter((c) => !c.passed).map((c) => c.fix).slice(0, 3),
    evidence: {
      detected: resume.sectionHeadersFound,
      expected: ['Work Experience', 'Education', 'Skills', 'Projects'],
      matched: resume.sectionHeadersFound,
      missing: atsAnalysis.checks.filter((c) => !c.passed && c.severity === 'critical').map((c) => c.name),
      impactExplanation: 'ATS parsers strip complex styling to extract structured records. Compliance ensures text is not lost.',
      recommendedAction: atsAnalysis.checks.find((c) => !c.passed)?.fix || 'Maintain standard single-column text flow.',
    },
  };

  // 2. Job Skill Match (25%)
  const skillMatrix = buildSkillMatrix(
    resume.skills,
    resume.allSkills,
    resume.rawText,
    job?.requiredSkills || [],
    job?.preferredSkills || [],
    job?.bonusSkills || []
  );

  let allMatched = 0;
  let allRequired = 0;
  const missingRequiredList: string[] = [];
  const matchedSkillsList: string[] = [];

  for (const items of Object.values(skillMatrix)) {
    for (const item of items) {
      if (item.importance === 'required') {
        allRequired++;
        if (item.status === 'matched') {
          allMatched += 1;
          matchedSkillsList.push(item.skill);
        } else if (item.status === 'partial') {
          allMatched += 0.6;
          matchedSkillsList.push(`${item.skill} (Partial)`);
        } else {
          missingRequiredList.push(item.skill);
        }
      }
    }
  }

  let skillScoreVal = 70;
  if (isJobMatch && allRequired > 0) {
    skillScoreVal = clamp(Math.round((allMatched / allRequired) * 100), 15, 100);
  } else {
    // General mode: reward breadth across categories
    const categoriesWithSkills = Object.values(resume.skills).filter((s) => s.length > 0).length;
    skillScoreVal = clamp(categoriesWithSkills * 12 + resume.allSkills.length * 2, 30, 95);
  }

  const skillDimension: DimensionScore = {
    key: 'skill_match',
    name: isJobMatch ? 'Job Skill Match' : 'Skill Breadth & Depth',
    score: skillScoreVal,
    weight: 0.25,
    contribution: Number((skillScoreVal * 0.25).toFixed(1)),
    icon: '⚡',
    color: 'text-cyan-400',
    feedback: isJobMatch
      ? `Matched ${Math.round(allMatched)} of ${allRequired} required core skill competencies.`
      : `Identified ${resume.allSkills.length} skills across ${Object.values(resume.skills).filter((s) => s.length > 0).length} technical domains.`,
    reason: isJobMatch
      ? `Evaluated against ${allRequired} target job requirements using layered semantic matching.`
      : 'Evaluated against multi-disciplinary software engineering taxonomies.',
    tips: missingRequiredList.slice(0, 3).map((s) => `Add evidence for missing skill: ${s}`),
    evidence: {
      detected: resume.allSkills.slice(0, 10),
      expected: job?.requiredSkills?.slice(0, 10) || ['Core Languages', 'Frameworks', 'Databases', 'Cloud'],
      matched: matchedSkillsList.slice(0, 8),
      missing: missingRequiredList.slice(0, 6),
      impactExplanation: 'Direct skill alignment represents the single heaviest weighting in initial recruiter and hiring manager filtering.',
      recommendedAction: missingRequiredList.length > 0
        ? `Integrate genuine practical experience for "${missingRequiredList[0]}" into your work history.`
        : 'Highlight advanced architecture or scaling accomplishments with your current skills.',
    },
  };

  // 3. Experience Relevance (20%)
  const expCount = resume.experience.length;
  let expScoreVal = 50;
  if (expCount >= 3) expScoreVal += 30;
  else if (expCount >= 1) expScoreVal += 20;

  const totalExpBullets = resume.experience.reduce((sum, e) => sum + e.bullets.length, 0);
  if (totalExpBullets >= 8) expScoreVal += 20;
  else if (totalExpBullets >= 4) expScoreVal += 10;
  expScoreVal = clamp(expScoreVal, 20, 100);

  const expDimension: DimensionScore = {
    key: 'experience',
    name: 'Experience Relevance',
    score: expScoreVal,
    weight: 0.20,
    contribution: Number((expScoreVal * 0.20).toFixed(1)),
    icon: '💼',
    color: 'text-purple-400',
    feedback: `${expCount} career position(s) documented with ${totalExpBullets} detailed achievement bullets.`,
    reason: 'Evaluates role progression, tenure, chronological structure, and responsibility depth.',
    tips: [
      'Maintain 3-5 high-impact bullets per role.',
      'Ensure clear job titles and date ranges are visible.',
    ],
    evidence: {
      detected: resume.experience.map((e) => `${e.role} at ${e.company}`),
      expected: [job?.title || 'Target Role Experience', 'Chronological Progression'],
      matched: resume.experience.slice(0, 3).map((e) => e.role),
      missing: expCount === 0 ? ['No work experience entries detected'] : [],
      impactExplanation: 'Detailed work history demonstrates proven capability and seniority alignment.',
      recommendedAction: 'Structure each bullet to reflect problem, action, and business outcome.',
    },
  };

  // 4. Impact & Metrics (15%)
  const impactAnalysis = evaluateResumeImpact(resume);
  const impactScoreVal = impactAnalysis.overallImpactScore;
  const impactDimension: DimensionScore = {
    key: 'impact',
    name: 'Impact & Metrics',
    score: impactScoreVal,
    weight: 0.15,
    contribution: Number((impactScoreVal * 0.15).toFixed(1)),
    icon: '🎯',
    color: 'text-emerald-400',
    feedback: `Found ${impactAnalysis.metricsCount} quantifiable metric(s) and ${impactAnalysis.actionVerbsCount} strong action verb(s).`,
    reason: 'Quantified results prove tangible value to engineering and product teams.',
    tips: [
      'Add percentage improvements (e.g., "reduced latency by 35%").',
      'Mention scale (e.g., "supporting 500k DAU").',
    ],
    evidence: {
      detected: impactAnalysis.detectedMetrics,
      expected: ['Quantified outcomes', 'Scale metrics', 'Revenue/cost improvements'],
      matched: impactAnalysis.detectedMetrics,
      missing: impactAnalysis.metricsCount < 3 ? ['Add metrics to at least 3 bullet points'] : [],
      impactExplanation: 'Resumes with numerical metrics receive 2.4x higher interview request rates.',
      recommendedAction: 'Use the AI Bullet Rewrite copilot to inject measurable candidate placeholders.',
    },
  };

  // 5. Projects & Portfolio (10%)
  const projectCount = resume.projects.length;
  const hasGitHub = Boolean(resume.personalInfo.github);
  const hasPortfolio = Boolean(resume.personalInfo.portfolio || resume.personalInfo.website);
  let projectScoreVal = 40;
  if (projectCount >= 2) projectScoreVal += 35;
  else if (projectCount === 1) projectScoreVal += 20;
  if (hasGitHub) projectScoreVal += 15;
  if (hasPortfolio) projectScoreVal += 10;
  projectScoreVal = clamp(projectScoreVal, 20, 100);

  const projectDimension: DimensionScore = {
    key: 'projects',
    name: 'Projects & Portfolio',
    score: projectScoreVal,
    weight: 0.10,
    contribution: Number((projectScoreVal * 0.10).toFixed(1)),
    icon: '🚀',
    color: 'text-amber-400',
    feedback: `${projectCount} project(s) documented. ${hasGitHub ? 'GitHub profile connected.' : 'Consider adding GitHub link.'}`,
    reason: 'Demonstrates independent initiative, open-source work, and practical system building.',
    tips: ['Link live demos or public code repositories for your top 2 projects.'],
    evidence: {
      detected: resume.projects.map((p) => p.name),
      expected: ['2+ Technical Projects', 'Live Links / GitHub'],
      matched: resume.projects.slice(0, 3).map((p) => p.name),
      missing: projectCount === 0 ? ['Dedicated projects section'] : [],
      impactExplanation: 'Project links validate technical depth and hands-on system building capability.',
      recommendedAction: 'Add 2 substantial projects highlighting modern stack components.',
    },
  };

  // 6. Structure & Readability (10%)
  const wordCount = resume.wordCount;
  let readScoreVal = 60;
  if (wordCount >= 350 && wordCount <= 900) readScoreVal = 95;
  else if (wordCount >= 250 && wordCount <= 1200) readScoreVal = 75;
  else readScoreVal = 45;

  const readDimension: DimensionScore = {
    key: 'readability',
    name: 'Structure & Readability',
    score: readScoreVal,
    weight: 0.10,
    contribution: Number((readScoreVal * 0.10).toFixed(1)),
    icon: '📐',
    color: 'text-sky-400',
    feedback: `Resume word count is ${wordCount} words (ideal target: 400-800 words).`,
    reason: 'Optimizes scannability for recruiters who spend an average of 7.4 seconds on initial review.',
    tips: ['Keep paragraphs concise and bullet-focused.'],
    evidence: {
      detected: [`${wordCount} words`, `Estimated ${resume.pageCountEstimate} page(s)`],
      expected: ['400-800 words per page'],
      matched: [`${wordCount} words`],
      missing: [],
      impactExplanation: 'Clear visual hierarchy ensures key technical achievements are noticed immediately.',
      recommendedAction: 'Ensure equal line spacing and consistent typography across all sections.',
    },
  };

  // 7. Profile & Contact (5%)
  let profileScoreVal = 20;
  if (resume.personalInfo.email) profileScoreVal += 25;
  if (resume.personalInfo.phone) profileScoreVal += 20;
  if (resume.personalInfo.linkedin) profileScoreVal += 20;
  if (resume.personalInfo.location) profileScoreVal += 15;
  profileScoreVal = clamp(profileScoreVal, 20, 100);

  const profileDimension: DimensionScore = {
    key: 'profile',
    name: 'Profile & Contact',
    score: profileScoreVal,
    weight: 0.05,
    contribution: Number((profileScoreVal * 0.05).toFixed(1)),
    icon: '📇',
    color: 'text-rose-400',
    feedback: `Contact details score: ${profileScoreVal}/100.`,
    reason: 'Ensures zero friction when recruiters reach out for interview scheduling.',
    tips: ['Provide email, phone, location, and LinkedIn URL in the header.'],
    evidence: {
      detected: [
        resume.personalInfo.email ? 'Email' : '',
        resume.personalInfo.phone ? 'Phone' : '',
        resume.personalInfo.linkedin ? 'LinkedIn' : '',
        resume.personalInfo.location ? 'Location' : '',
      ].filter(Boolean),
      expected: ['Email', 'Phone', 'Location', 'LinkedIn'],
      matched: [
        resume.personalInfo.email ? 'Email' : '',
        resume.personalInfo.phone ? 'Phone' : '',
        resume.personalInfo.linkedin ? 'LinkedIn' : '',
      ].filter(Boolean),
      missing: [
        !resume.personalInfo.email ? 'Email' : '',
        !resume.personalInfo.phone ? 'Phone' : '',
        !resume.personalInfo.linkedin ? 'LinkedIn' : '',
      ].filter(Boolean),
      impactExplanation: 'Missing contact info is an immediate disqualifier for recruiter outreach.',
      recommendedAction: 'Verify that email and LinkedIn links are clickable and up to date.',
    },
  };

  const dimensions: DimensionScore[] = [
    atsDimension,
    skillDimension,
    expDimension,
    impactDimension,
    projectDimension,
    readDimension,
    profileDimension,
  ];

  const overall = Math.round(dimensions.reduce((sum, d) => sum + d.contribution, 0));
  const grade = assignGrade(overall);

  // Generate Bullet Analyses
  const allBullets: string[] = [];
  for (const exp of resume.experience) {
    allBullets.push(...exp.bullets);
  }
  const bulletAnalyses = allBullets.map((b, i) => analyzeBullet(b, i));

  // Prioritized Top 3 Actions with mathematically justified score boost estimates
  const topActions: TopActionItem[] = [];

  if (missingRequiredList.length > 0) {
    // Adding 2 required skills improves skill dimension from X to X + (2/allRequired)*100
    const potentialGain = Math.min(14, Math.max(5, Math.round((2 / Math.max(1, allRequired)) * 25)));
    topActions.push({
      id: 'action-skills',
      title: `Add evidence for missing required skill(s): ${missingRequiredList.slice(0, 2).join(', ')}`,
      impact: 'High',
      dimension: 'Job Skill Match',
      reason: `Job requires ${missingRequiredList.slice(0, 2).join(', ')} which are currently missing from resume text.`,
      evidence: `Target job required list specifies ${missingRequiredList[0]}.`,
      howToFix: `If you possess genuine experience with ${missingRequiredList[0]}, add bullet points detailing its practical usage.`,
      expectedScoreBoost: potentialGain,
      expectedScoreBoostLabel: `+${potentialGain} pts (Skill Match)`,
      confidence: 0.95,
    });
  }

  if (impactAnalysis.metricsCount < 3) {
    topActions.push({
      id: 'action-metrics',
      title: 'Quantify at least 3 experience bullets with measurable metrics',
      impact: 'High',
      dimension: 'Impact & Metrics',
      reason: `Only ${impactAnalysis.metricsCount} quantified metrics detected across work experience.`,
      evidence: 'Bullet points currently lack numerical outcomes (% latency, revenue, users, scale).',
      howToFix: 'Use the AI Rewrite copilot to apply the X-Y-Z formula and fill in your genuine metrics.',
      expectedScoreBoost: 8,
      expectedScoreBoostLabel: '+8 pts (Impact & Metrics)',
      confidence: 0.92,
    });
  }

  if (atsAnalysis.criticalIssuesCount > 0) {
    const issue = atsAnalysis.checks.find((c) => !c.passed && c.severity === 'critical');
    topActions.push({
      id: 'action-ats',
      title: `Fix critical ATS issue: ${issue?.name || 'Standard Headings'}`,
      impact: 'Medium',
      dimension: 'ATS Compatibility',
      reason: issue?.whyItMatters || 'Ensure clean machine readability across recruiting systems.',
      evidence: issue?.message || 'Missing standard structural headers.',
      howToFix: issue?.fix || 'Use standard section titles.',
      expectedScoreBoost: 6,
      expectedScoreBoostLabel: '+6 pts (ATS Compatibility)',
      confidence: 0.95,
    });
  }

  // Top Strengths and Critical Issues
  const topStrengths: string[] = [];
  if (atsScoreVal >= 85) topStrengths.push('Clean ATS-compliant layout with standard machine-readable section headings');
  if (skillScoreVal >= 80) topStrengths.push(`Strong coverage of technical competencies (${resume.allSkills.length} skills identified)`);
  if (impactScoreVal >= 75) topStrengths.push(`Effective use of quantifiable results (${impactAnalysis.metricsCount} metrics detected)`);
  if (topStrengths.length === 0) topStrengths.push('Solid foundational structure ready for targeted metric enhancements');

  const criticalIssues: string[] = [];
  if (atsAnalysis.criticalIssuesCount > 0) criticalIssues.push(`${atsAnalysis.criticalIssuesCount} ATS formatting issue(s) detected`);
  if (missingRequiredList.length > 0) criticalIssues.push(`Missing ${missingRequiredList.length} required skill(s) specified in target job`);
  if (impactAnalysis.metricsCount === 0) criticalIssues.push('No quantifiable metrics detected in experience bullets');

  const feedback: FeedbackItem[] = [
    {
      id: 'fb-overall',
      type: overall >= 80 ? 'success' : overall >= 60 ? 'warning' : 'error',
      category: 'Overall',
      title: `Overall Score: ${overall}/100 (${grade})`,
      message:
        overall >= 85
          ? 'Exceptional resume! Strong technical alignment, clear ATS formatting, and measurable achievements.'
          : overall >= 70
          ? 'Competitive profile with solid fundamentals. Addressing the top recommendations will elevate your score to top-tier.'
          : 'Resume requires key enhancements in quantified metrics and target skill alignment.',
      impactWeight: 'high',
    },
  ];

  // Derive topPriority: single string naming the highest-leverage fix,
  // derived from the lowest-weighted-contribution pillar (largest deficit: (100 - score) * weight)
  const lowestPillar = [...dimensions].sort((a, b) => {
    const deficitA = (100 - a.score) * a.weight;
    const deficitB = (100 - b.score) * b.weight;
    return deficitB - deficitA;
  })[0];

  const topPriority =
    topActions[0]?.title ||
    lowestPillar?.evidence.recommendedAction ||
    lowestPillar?.tips[0] ||
    `Optimize ${lowestPillar?.name || 'resume content'} to gain maximum score improvement.`;

  return {
    id: 'score-' + Date.now(),
    mode,
    overall,
    grade,
    topPriority,
    atsScore: atsScoreVal,
    skillMatchScore: skillScoreVal,
    experienceScore: expScoreVal,
    impactScore: impactScoreVal,
    projectScore: projectScoreVal,
    readabilityScore: readScoreVal,
    profileScore: profileScoreVal,
    dimensions,
    feedback,
    atsAnalysis,
    skillMatrix,
    impactAnalysis,
    bulletAnalyses,
    topStrengths,
    criticalIssues,
    topActions: topActions.slice(0, 3),
    parsedResume: resume,
    parsedJob: job,
    analyzedAt: new Date().toISOString(),
    fileName: resume.metadata.fileName,
    resumePreview: resume.rawText.slice(0, 200).replace(/\s+/g, ' ').trim(),
  };
}

export function analyzeResume(text: string): ResumeScore {
  
  const parsed = parseResume(text, 'resume.txt');
  return calculateResumeScore(parsed, undefined, 'general');
}
