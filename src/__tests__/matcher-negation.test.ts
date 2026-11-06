import { describe, expect, it } from 'vitest';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { buildSkillMatrix } from '@/lib/matching/semantic-matcher';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';

function item(resumeText: string, skill: string) {
  const resume = parseResume(resumeText);
  return Object.values(buildSkillMatrix(resume.skills, resume.allSkills, resume.rawText, [skill])).flat()[0];
}

describe('matcher negation and skill-name hedges', () => {
  it('treats a skill mentioned only in negated lines as missing, with no score credit', () => {
    const text = 'Sam\nEXPERIENCE\n- No experience with Kubernetes yet; deployments use managed VMs.\nSKILLS\nPython';
    const result = item(text, 'Kubernetes');
    expect(result.status).toBe('missing');
    expect(result.evidenceLevel).toBe('missing');
    expect(result.reasoning).toMatch(/negat/i);
    expect(calculateResumeScore(parseResume(text), parseJobDescription('Required: Kubernetes'), 'job_match').skillMatchScore).toBe(0);
  });

  it('still credits a skill when at least one line is a genuine, non-negated mention', () => {
    const result = item('Sam\n- Never used Docker before 2020.\n- Built CI images using Docker.', 'Docker');
    expect(result.status).toBe('matched');
    expect(result.evidenceLevel).toBe('demonstrated');
  });

  it('does not read "Learning" inside "Machine Learning" as a hedge', () => {
    const result = item('Sam\nEXPERIENCE\n- Developed Machine Learning models to forecast delays.', 'Machine Learning');
    expect(result.evidenceLevel).toBe('demonstrated');
    expect(result.status).toBe('matched');
  });

  it('still treats "Learning Python" as a hedge', () => {
    expect(item('Sam\n- Learning Python; developed a sample.', 'Python').evidenceLevel).not.toBe('demonstrated');
  });
});
