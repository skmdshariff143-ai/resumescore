/**
 * Layered 6-Level Semantic Matching Architecture with Evidence & Confidence:
 * Level 1: Exact String Match (1.00)
 * Level 2: Normalized / Token-Folded Match (0.95)
 * Level 3: Canonical Alias / Synonym Match (0.90)
 * Level 4: Skill Taxonomy Relationship / Subsumption (0.75-0.85)
 * Level 5: Context-Aware Co-occurrence & Responsibility Match (0.60-0.70)
 * Level 6: Section Evidence Verification (Experience vs Skills section)
 */

import type {
  CategorizedSkills,
  SkillCategory,
  SkillMatchItem,
  SkillMatrix,
  RequirementImportance,
} from '@/types';

import {
  SKILL_ALIASES,
  SKILL_CATEGORIES_MAP,
  TAXONOMY_RELATIONSHIPS,
  getSkillRegex,
} from '../keywords';

/** Find the primary skill category for a given skill */
export function getCategoryForSkill(skill: string): SkillCategory {
  const norm = skill.toLowerCase();
  for (const [cat, skills] of Object.entries(SKILL_CATEGORIES_MAP)) {
    if (skills.some((s) => s.toLowerCase() === norm)) {
      return cat as SkillCategory;
    }
  }
  return 'tools';
}

/** Normalize skill string for Level 2 matching */
function normalizeSkill(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, '')
    .trim();
}

/** Find a relevant text snippet in the resume that contains the term */
function findEvidenceSnippet(resumeText: string, searchTerms: string[]): string | undefined {
  const lines = resumeText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 15) continue;
    for (const term of searchTerms) {
      const regex = getSkillRegex(term);
      if (regex.test(trimmed)) {
        return trimmed.replace(/^[^a-zA-Z0-9]+/, '');
      }
    }
  }
  return undefined;
}

/** Match a single job requirement skill against the candidate resume */
export function matchSingleSkill(
  targetSkill: string,
  resumeSkills: CategorizedSkills,
  resumeAllSkills: string[],
  resumeText: string,
  importance: RequirementImportance = 'required'
): SkillMatchItem {
  const category = getCategoryForSkill(targetSkill);
  const targetNorm = normalizeSkill(targetSkill);

  // Level 1: Exact Match (Case-insensitive exact token)
  const exactFound = resumeAllSkills.find((s) => s.toLowerCase() === targetSkill.toLowerCase());
  if (exactFound) {
    const evidence = findEvidenceSnippet(resumeText, [targetSkill, exactFound]);
    return {
      skill: targetSkill,
      category,
      status: 'matched',
      importance,
      confidence: 1.0,
      matchLevel: 'level_1_exact',
      evidenceQuote: evidence,
      evidence: evidence || `Direct exact match for "${targetSkill}" found in resume profile.`,
      reasoning: `Verified direct exact match for "${targetSkill}".`,
    };
  }

  // Level 2: Normalized / Token-folded match (e.g. React.js <-> React, Node.js <-> Nodejs)
  const normFound = resumeAllSkills.find((s) => normalizeSkill(s) === targetNorm);
  if (normFound) {
    const evidence = findEvidenceSnippet(resumeText, [normFound, targetSkill]);
    return {
      skill: targetSkill,
      category,
      status: 'matched',
      importance,
      confidence: 0.95,
      matchLevel: 'level_2_normalized',
      evidenceQuote: evidence,
      evidence: evidence || `Normalized token match ("${normFound}") aligns with "${targetSkill}".`,
      reasoning: `Normalized match ("${normFound}") matches required "${targetSkill}".`,
    };
  }

  // Level 3: Canonical Alias / Synonym Match (e.g. Postgres -> PostgreSQL, K8s -> Kubernetes)
  const aliasTarget = SKILL_ALIASES[targetSkill.toLowerCase()];
  if (aliasTarget) {
    const aliasFound = resumeAllSkills.find(
      (s) => (SKILL_ALIASES[s.toLowerCase()] || s).toLowerCase() === aliasTarget.toLowerCase()
    );
    if (aliasFound) {
      const evidence = findEvidenceSnippet(resumeText, [aliasFound, aliasTarget]);
      return {
        skill: targetSkill,
        category,
        status: 'matched',
        importance,
        confidence: 0.9,
        matchLevel: 'level_3_alias',
        aliasMatched: aliasFound,
        evidenceQuote: evidence,
        evidence: evidence || `Standard industry alias ("${aliasFound}") matches "${targetSkill}".`,
        reasoning: `Candidate's "${aliasFound}" is an established industry synonym for "${targetSkill}".`,
      };
    }
  }

  // Level 4: Skill Taxonomy Relationship / Subsumption
  for (const rel of TAXONOMY_RELATIONSHIPS) {
    if (rel.generalOrEcosystem.toLowerCase() === targetSkill.toLowerCase()) {
      const matchedSpecific = resumeAllSkills.find((s) =>
        rel.specific.some((spec) => spec.toLowerCase() === s.toLowerCase())
      );
      if (matchedSpecific) {
        const evidence = findEvidenceSnippet(resumeText, [matchedSpecific]);
        return {
          skill: targetSkill,
          category,
          status: 'partial',
          importance,
          confidence: rel.partialConfidence,
          matchLevel: 'level_4_taxonomy',
          taxonomyRelationship: rel.relationship,
          evidenceQuote: evidence,
          evidence: evidence || `Candidate demonstrates "${matchedSpecific}", which ${rel.relationship}.`,
          reasoning: `Related experience: "${matchedSpecific}" ${rel.relationship}, providing strong foundational familiarity for "${targetSkill}".`,
          suggestion: `Highlight direct experience with ${targetSkill} in addition to ${matchedSpecific}.`,
        };
      }
    }
  }

  // Level 5: Context-Aware Co-occurrence Search in Resume Text
  const contextRegex = getSkillRegex(targetSkill);
  if (contextRegex.test(resumeText)) {
    const evidence = findEvidenceSnippet(resumeText, [targetSkill]);
    return {
      skill: targetSkill,
      category,
      status: 'matched',
      importance,
      confidence: 0.75,
      matchLevel: 'level_5_context',
      evidenceQuote: evidence,
      evidence: evidence || `Referenced within work experience context.`,
      reasoning: `Mentioned in project or experience narratives.`,
    };
  }

  // Missing: Explicitly clarify that missing evidence does NOT mean candidate lacks the skill
  return {
    skill: targetSkill,
    category,
    status: 'missing',
    importance,
    confidence: 0.95,
    evidenceQuote: undefined,
    evidence: 'No explicit evidence detected in parsed resume text.',
    reasoning: `The resume does not contain explicit evidence of "${targetSkill}". If you have genuine experience with this skill, add it to your relevant projects or work history.`,
    suggestion: `If you possess ${targetSkill} expertise, add 1-2 bullet points demonstrating practical application.`,
  };
}

/** Build the 11-category Semantic Skill Matrix */
export function buildSkillMatrix(
  resumeSkills: CategorizedSkills,
  resumeAllSkills: string[],
  resumeText: string,
  requiredSkills: string[],
  preferredSkills: string[] = [],
  bonusSkills: string[] = []
): SkillMatrix {
  const matrix: SkillMatrix = {
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

  const processedSkills = new Set<string>();

  const processList = (list: string[], importance: RequirementImportance) => {
    for (const skill of list) {
      const canonical = SKILL_ALIASES[skill.toLowerCase()] || skill;
      if (processedSkills.has(canonical.toLowerCase())) continue;
      processedSkills.add(canonical.toLowerCase());

      const item = matchSingleSkill(skill, resumeSkills, resumeAllSkills, resumeText, importance);
      matrix[item.category].push(item);
    }
  };

  processList(requiredSkills, 'required');
  processList(preferredSkills, 'preferred');
  processList(bonusSkills, 'bonus');

  // If no job requirements were supplied (General Mode), populate from candidate's detected skills
  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    for (const [cat, skills] of Object.entries(resumeSkills)) {
      const category = cat as SkillCategory;
      for (const skill of skills) {
        if (!matrix[category].some((m) => m.skill.toLowerCase() === skill.toLowerCase())) {
          const evidence = findEvidenceSnippet(resumeText, [skill]);
          matrix[category].push({
            skill,
            category,
            status: 'matched',
            importance: 'required',
            confidence: 1.0,
            matchLevel: 'level_1_exact',
            evidenceQuote: evidence,
            evidence: evidence || `Identified in candidate skills inventory.`,
            reasoning: `Verified competence in ${skill}.`,
          });
        }
      }
    }
  }

  return matrix;
}
