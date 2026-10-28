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

import type {
  AnalysisMode,
  DimensionScore,
  FeedbackItem,
  JobParsed,
  ResumeParsed,
  ResumeScore,
    TopActionItem,
} from '../types';

import { runATSChecks } from '../ats/ats-checker';
import { analyzeBullet, evaluateResumeImpact } from '../impact/impact-evaluator';
import { parseResume } from '../parser/resume-parser';
import { buildSkillMatrix } from '../matching/semantic-matcher';
import { RUBRIC_WEIGHTS, type CareerLevel } from './rubric';

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
  mode: AnalysisMode = 'general',
  careerLevel: CareerLevel = 'experienced'
): ResumeScore {
  const isJobMatch = mode === 'job_match' && Boolean(job);

  // 1. ATS Readability Estimate (15%)
  const atsAnalysis = runATSChecks(resume);
  const atsScoreVal = atsAnalysis.score;
  const atsDimension: DimensionScore = {
    key: 'ats',
    name: 'ATS Readability Estimate',
    score: atsScoreVal,
    weight: 0.15,
    contribution: Number((atsScoreVal * 0.15).toFixed(1)),
    icon: '🤖',
    color: 'text-indigo-400',
    feedback: atsAnalysis.summary,
    reason: `${atsAnalysis.passedCount} of ${atsAnalysis.checks.length} readability checks passed.`,
    tips: atsAnalysis.checks.filter((c) => !c.passed).map((c) => c.fix).slice(0, 3),
    evidence: {
      detected: resume.sectionHeadersFound,
      expected: ['Work Experience', 'Education', 'Skills', 'Projects'],
      matched: resume.sectionHeadersFound,
      missing: atsAnalysis.checks.filter((c) => !c.passed && c.severity === 'critical').map((c) => c.name),
      impactExplanation: 'ATS parsers strip complex styling to extract structured records. These checks cannot certify compatibility with every ATS.',
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
          allMatched += item.evidenceLevel === 'mentioned' ? 0.3 : 0.6;
          matchedSkillsList.push(`${item.skill} (Partial)`);
        } else {
          missingRequiredList.push(item.skill);
        }
      }
    }
  }

  let skillScoreVal: number;
  const hasJobSkills = Boolean(job && job.requiredSkills.length + job.preferredSkills.length + job.bonusSkills.length);
  if (isJobMatch) {
    const requirements = hasJobSkills ? Object.values(skillMatrix).flat() : [];
    const weight = { required: 1, preferred: 0.5, bonus: 0.25 };
    const total = requirements.reduce((sum, item) => sum + weight[item.importance], 0);
    const supported = requirements.reduce((sum, item) => sum + weight[item.importance] *
      (item.status === 'matched' ? 1 : item.status === 'partial' ? item.evidenceLevel === 'mentioned' ? 0.3 : 0.6 : 0), 0);
    skillScoreVal = total ? Math.round(100 * supported / total) : 0;
    if (!hasJobSkills) for (const items of Object.values(skillMatrix)) items.length = 0;
  } else {
    // Mention-only lists cannot earn more than 30. Reward practical evidence.
    const items = Object.values(skillMatrix).flat();
    const demonstrated = items.filter(item => item.evidenceLevel === 'demonstrated').length;
    skillScoreVal = clamp(Math.min(30, items.length * 5) + demonstrated * 15, 0, 95);
  }

  const skillDimension: DimensionScore = {
    key: 'skill_match',
    name: isJobMatch ? 'Job Skill Match' : 'Skill Evidence',
    score: skillScoreVal,
    weight: 0.25,
    contribution: Number((skillScoreVal * 0.25).toFixed(1)),
    icon: '⚡',
    color: 'text-cyan-400',
    feedback: isJobMatch
      ? hasJobSkills ? `${Math.round(allMatched * 10) / 10} evidence-weighted matches across ${allRequired} required skills; preferred and optional skills also contribute.` : 'No recognized job skill requirements. Match score is unavailable.'
      : `Identified ${resume.allSkills.length} skills across ${Object.values(resume.skills).filter((s) => s.length > 0).length} recognized categories.`,
    reason: isJobMatch
      ? 'Recognized required/preferred/optional terms carry weights 1/0.5/0.25. Demonstrated/transferable/mentioned evidence earns 100%/60%/30% credit. Other requirements need manual review.'
      : 'Mentioned terms earn limited credit; practical action evidence earns additional credit. This heuristic does not verify proficiency.',
    tips: missingRequiredList.slice(0, 3).map((s) => `Add evidence for missing skill: ${s}`),
    evidence: {
      detected: resume.allSkills.slice(0, 10),
      expected: job?.requiredSkills?.slice(0, 10) || ['Skills relevant to your chosen profession', 'Practical examples'],
      matched: matchedSkillsList.slice(0, 8),
      missing: missingRequiredList.slice(0, 6),
      impactExplanation: 'This editorial rubric gives partial credit to mentions and more credit to detected practical evidence; it does not measure proficiency.',
      recommendedAction: missingRequiredList.length > 0
        ? `Integrate genuine practical experience for "${missingRequiredList[0]}" into your work history.`
        : 'Describe how you applied relevant skills in genuine work, projects or study.',
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
  if (careerLevel === 'student' || careerLevel === 'internship') {
    const projectEvidence = resume.projects.filter(project => project.description.trim().length >= 30).length;
    const educationEvidence = resume.education.filter(item => item.institution && item.degree).length;
    expScoreVal = Math.max(expScoreVal, Math.min(100, projectEvidence * 30 + educationEvidence * 20));
  }

  const expDimension: DimensionScore = {
    key: 'experience',
    name: 'Experience Relevance',
    score: expScoreVal,
    weight: 0.20,
    contribution: Number((expScoreVal * 0.20).toFixed(1)),
    icon: '💼',
    color: 'text-purple-400',
    feedback: `${expCount} career position(s) documented with ${totalExpBullets} detailed achievement bullets.`,
    reason: 'Counts detected roles and bullets; student and internship profiles also receive project and education credit.',
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
    reason: 'Explicit outcomes help explain work; numbers alone do not prove value.',
    tips: [
      'Describe outcomes you can substantiate; include measurements only when known.',
      'Describe scope accurately without inventing numerical results.',
    ],
    evidence: {
      detected: impactAnalysis.detectedMetrics,
      expected: ['Clear action', 'Accurate scope', 'Substantiated outcome'],
      matched: impactAnalysis.detectedMetrics,
      missing: impactAnalysis.metricsCount === 0 ? ['No measurable outcomes detected; qualitative outcomes may still be useful'] : [],
      impactExplanation: 'Genuine measurements can clarify scope and outcomes. This score does not predict interview rates.',
      recommendedAction: 'Clarify your contribution and a substantiated outcome. Add numbers only when known; never invent them.',
    },
  };

  // 5. Projects & Portfolio (10%)
  const projectCount = resume.projects.length;
  const hasGitHub = Boolean(resume.personalInfo.github);
  const hasPortfolio = Boolean(resume.personalInfo.portfolio || resume.personalInfo.website);
  let projectScoreVal = 40;
  if (projectCount >= 2) projectScoreVal += 35;
  else if (projectCount === 1) projectScoreVal += 20;
  if (hasGitHub || hasPortfolio) projectScoreVal += 25;
  projectScoreVal = clamp(projectScoreVal, 20, 100);

  const projectDimension: DimensionScore = {
    key: 'projects',
    name: 'Projects & Portfolio',
    score: projectScoreVal,
    weight: 0.10,
    contribution: Number((projectScoreVal * 0.10).toFixed(1)),
    icon: '🚀',
    color: 'text-amber-400',
    feedback: `${projectCount} project(s) documented. ${hasGitHub || hasPortfolio ? 'Supporting profile or portfolio link detected.' : 'A relevant portfolio link is optional.'}`,
    reason: 'Recognizes practical projects, academic work and professional case studies. Links are supporting evidence, not verification.',
    tips: ['Describe your contribution and outcome; include a suitable public example only if you can share it.'],
    evidence: {
      detected: resume.projects.map((p) => p.name),
      expected: ['Relevant project or case study', 'Contribution and outcome'],
      matched: resume.projects.slice(0, 3).map((p) => p.name),
      missing: projectCount === 0 ? ['Dedicated projects section'] : [],
      impactExplanation: 'Projects can demonstrate applied skills across professions. Public links do not establish ownership or proficiency.',
      recommendedAction: 'Describe a relevant project, academic assignment or case study with your actual contribution.',
    },
  };

  // 6. Structure & Readability (10%)
  const wordCount = resume.wordCount;
  let readScoreVal: number;
  const earlyCareer = careerLevel === 'student' || careerLevel === 'internship' || careerLevel === 'entry';
  const minimumWords = earlyCareer ? 180 : 350;
  if (wordCount >= minimumWords && wordCount <= 900) readScoreVal = 95;
  else if (wordCount >= (earlyCareer ? 100 : 250) && wordCount <= 1200) readScoreVal = 75;
  else readScoreVal = 45;

  const readDimension: DimensionScore = {
    key: 'readability',
    name: 'Structure & Readability',
    score: readScoreVal,
    weight: 0.10,
    contribution: Number((readScoreVal * 0.10).toFixed(1)),
    icon: '📐',
    color: 'text-sky-400',
    feedback: `Resume word count is ${wordCount} words (editorial full-credit band for this career profile: ${minimumWords}-900 words).`,
    reason: 'Uses a documented word-count heuristic, not a measured recruiter reading-time model.',
    tips: ['Keep paragraphs concise and bullet-focused.'],
    evidence: {
      detected: [`${wordCount} words`, `Estimated ${resume.pageCountEstimate} page(s)`],
      expected: [`${minimumWords}-900 words in this editorial rubric; content relevance matters more than length`],
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
  dimensions.forEach((dimension, index) => {
    dimension.weight = RUBRIC_WEIGHTS[careerLevel][index];
    dimension.contribution = Number((dimension.score * dimension.weight).toFixed(1));
    dimension.confidence = ['degraded', 'failed'].includes(resume.metadata.extractionQuality) ||
      dimension.evidence.detected.length === 0 ? 'low' : 'medium';
  });
  if (careerLevel === 'student' || careerLevel === 'internship') {
    expDimension.name = 'Practical & Academic Evidence';
    expDimension.reason = 'Projects and education can substitute for professional experience in this rubric.';
    expDimension.evidence.detected = [
      ...resume.experience.map(item => item.role),
      ...resume.projects.map(item => item.name),
      ...resume.education.map(item => item.degree),
    ];
    expDimension.evidence.recommendedAction = 'Describe your actual contribution to a project, internship, or academic assignment.';
    expDimension.feedback = `${resume.projects.length} project(s), ${resume.education.length} education entry/entries and ${expCount} role(s) detected.`;
    expDimension.evidence.missing = expDimension.evidence.detected.length ? [] : ['No practical or academic evidence detected'];
  }

  const overall = Math.round(dimensions.reduce((sum, d) => sum + d.contribution, 0));
  const grade = assignGrade(overall);

  // Generate Bullet Analyses
  const allBullets: string[] = [];
  for (const exp of resume.experience) {
    allBullets.push(...exp.bullets);
  }
  allBullets.push(...resume.projects.map(project => project.description).filter(Boolean));
  const bulletAnalyses = allBullets.map((b, i) => analyzeBullet(b, i));

  // Prioritized Top 3 Actions with mathematically justified score boost estimates
  const topActions: TopActionItem[] = [];

  if (missingRequiredList.length > 0) {
    // Adding 2 required skills improves skill dimension from X to X + (2/allRequired)*100
    topActions.push({
      id: 'action-skills',
      title: `Add evidence for missing required skill(s): ${missingRequiredList.slice(0, 2).join(', ')}`,
      impact: 'High',
      dimension: 'Job Skill Match',
      reason: `Job requires ${missingRequiredList.slice(0, 2).join(', ')} which are currently missing from resume text.`,
      evidence: `Target job required list specifies ${missingRequiredList[0]}.`,
      howToFix: `If you possess genuine experience with ${missingRequiredList[0]}, add bullet points detailing its practical usage.`,
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: 'Re-analyze after editing; no guaranteed increase',
      confidence: 0.95,
    });
  }

  if (impactAnalysis.metricsCount < 3) {
    topActions.push({
      id: 'action-metrics',
      title: 'Clarify the outcome of a work or project contribution',
      impact: 'High',
      dimension: 'Impact & Metrics',
      reason: `${impactAnalysis.metricsCount} measured outcomes detected in work and project descriptions.`,
      evidence: impactAnalysis.detectedMetrics.join('; ') || 'No measured outcomes detected; this does not establish that the work had no impact.',
      howToFix: 'Explain the problem, your action and an outcome you can substantiate. Qualitative outcomes are useful; numbers are optional.',
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: 'Re-analyze after editing; no guaranteed increase',
      confidence: 0.92,
    });
  }

  if (atsAnalysis.criticalIssuesCount > 0) {
    const issue = atsAnalysis.checks.find((c) => !c.passed && c.severity === 'critical');
    topActions.push({
      id: 'action-ats',
      title: `Fix critical ATS issue: ${issue?.name || 'Standard Headings'}`,
      impact: 'Medium',
      dimension: 'ATS Readability Estimate',
      reason: issue?.whyItMatters || 'Ensure clean machine readability across recruiting systems.',
      evidence: issue?.message || 'Missing standard structural headers.',
      howToFix: issue?.fix || 'Use standard section titles.',
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: 'Re-analyze after editing; no guaranteed increase',
      confidence: 0.95,
    });
  }

  // Top Strengths and Critical Issues
  const topStrengths: string[] = [];
  if (atsScoreVal >= 85) topStrengths.push('Detected readable text with standard machine-readable section headings');
  if (skillScoreVal >= 80) topStrengths.push(`Strong coverage of recognized competencies (${resume.allSkills.length} skills identified)`);
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
          ? 'Strong coverage under the selected editorial rubric. Review the evidence and extraction limitations.'
          : overall >= 70
          ? 'Several rubric dimensions have supporting evidence. Review the prioritized improvements.'
          : 'Some rubric dimensions have limited detected evidence. Check extraction and add only truthful, relevant detail.',
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

  // Rank existing evidence-backed actions by the corresponding rubric deficit.
  topActions.sort((a, b) => {
    const deficit = (action: TopActionItem) => {
      const dimension = dimensions.find(item => item.name === action.dimension);
      return dimension ? (100 - dimension.score) * dimension.weight : 0;
    };
    return deficit(b) - deficit(a);
  });
  if (lowestPillar && !topActions.some(action => action.dimension === lowestPillar.name)) {
    topActions.unshift({
      id: `action-${lowestPillar.key}`, title: lowestPillar.evidence.recommendedAction,
      dimension: lowestPillar.name, impact: 'High', reason: lowestPillar.reason,
      evidence: lowestPillar.evidence.detected.join('; ') || 'No supporting evidence detected.',
      howToFix: lowestPillar.evidence.recommendedAction, expectedScoreBoost: 0,
      expectedScoreBoostLabel: 'Recalculate after editing; no guaranteed increase',
      confidence: lowestPillar.confidence === 'low' ? 0.3 : 0.6,
    });
  }
  const topPriority =
    topActions[0]?.title ||
    lowestPillar?.evidence.recommendedAction ||
    lowestPillar?.tips[0] ||
    `Optimize ${lowestPillar?.name || 'resume content'} to gain maximum score improvement.`;

  return {
    id: 'score-' + Date.now(),
    mode,
    overall,
    careerLevel,
    generalQualityScore: isJobMatch ? calculateResumeScore(resume, undefined, 'general', careerLevel).overall : overall,
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
