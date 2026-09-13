import { describe, it, expect } from 'vitest';
import { HeuristicAIProvider } from '../lib/ai/provider';
import { parseResume } from '../lib/parsing/resume-parser';
import { parseJobDescription } from '../lib/jobs/job-parser';

describe('Resume Critique & Qualitative Narrative Generation', () => {
  const provider = new HeuristicAIProvider();

  it('evaluates resume sections and provides ratings across standard categories', async () => {
    const resumeText = `Alex Rivera
alex@tech.co | (555) 234-5678 | linkedin.com/in/alexrivera

SUMMARY
Staff Systems Engineer with 8 years building distributed infrastructure.

EXPERIENCE
Senior Infrastructure Engineer | CloudScale Inc | 2021 - Present
• Designed multi-region Kubernetes clusters handling 50k requests per second with 99.99% uptime.
• Reduced infrastructure cloud expenditure by $320k annually through automated spot instance scaling.
• Mentored 6 junior engineers across SRE and platform teams.

Software Engineer | FinPlatform | 2017 - 2021
• Engineered Go microservices for real-time transaction processing.
• Optimized PostgreSQL query execution plans, reducing p99 latency from 450ms to 65ms.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2017
GPA: 3.8 / 4.0

SKILLS
Go, Python, Kubernetes, Docker, AWS, Terraform, PostgreSQL, Redis, Linux, CI/CD, Prometheus

PROJECTS
OpenSource Raft Consensus: Implemented distributed consensus algorithm in Go with 95% test coverage.
`;

    const parsedResume = parseResume(resumeText, 'alex.txt');
    const jobText = `Staff Platform Engineer at DataCorp. Looking for Kubernetes, Go, Terraform, and distributed systems experience.`;
    const parsedJob = parseJobDescription(jobText);

    const critique = await provider.generateCritique(parsedResume, parsedJob);

    expect(critique).toBeDefined();
    expect(critique.isLLMGenerated).toBe(false);
    expect(critique.sections.length).toBeGreaterThanOrEqual(4);

    const expSection = critique.sections.find((s) => s.name === 'Work Experience');
    expect(expSection).toBeDefined();
    expect(expSection?.rating).toBe('strong');

    const skillsSection = critique.sections.find((s) => s.name === 'Technical & Domain Skills');
    expect(skillsSection?.rating).toBe('strong');

    expect(critique.keyStrengths.length).toBeGreaterThan(0);
    expect(critique.immediateImprovements.length).toBeGreaterThan(0);
    expect(critique.overallNarrative.length).toBeGreaterThan(20);
  });

  it('identifies critical contact and formatting ATS risks', async () => {
    const poorResumeText = `John Doe
No contact information provided here.

EXPERIENCE
Did some coding and helped with website maintenance.
`;

    const parsedResume = parseResume(poorResumeText, 'poor.txt');
    const critique = await provider.generateCritique(parsedResume);

    const emailRisk = critique.atsRisks.find((r) => r.issue.includes('email'));
    expect(emailRisk).toBeDefined();
    expect(emailRisk?.severity).toBe('critical');

    const expSection = critique.sections.find((s) => s.name === 'Work Experience');
    expect(expSection?.rating).toBe('needs_work');
  });
});
