import { describe, it, expect } from 'vitest';
import { parseResume } from '../lib/parsing/resume-parser';

describe('Structured Resume Parser & Intermediate Representation', () => {
  const sampleResume = `Alex Morgan
San Francisco, CA | alex.morgan@email.com | +1 (555) 019-2834 | linkedin.com/in/alexmorgan | github.com/alexmorgan

SUMMARY
Senior Full-Stack Software Engineer with 6+ years of experience building distributed systems.

WORK EXPERIENCE
Senior Software Engineer | Stripe | San Francisco, CA | 03/2021 – Present
• Architected and deployed a multi-region payment routing service in Go and PostgreSQL, processing $45M+ monthly.
• Reduced API p99 latency by 34% through Redis caching and query plan optimizations.
• Mentored 5 junior engineers and instituted automated CI/CD pipelines via GitHub Actions.

Full-Stack Software Engineer | Cloudflare | Austin, TX | 06/2018 – 02/2021 (Remote)
• Engineered real-time security dashboard using React, TypeScript, Next.js, and GraphQL, serving 40,000+ active users.
• Developed automated penetration testing workflows and integrated OWASP security scanning into build steps.

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript, Python, Go, SQL, HTML, CSS
• Frameworks: React, Next.js, Node.js, Express, FastAPI, Tailwind CSS, GraphQL
• Databases: PostgreSQL, Redis, MongoDB, DynamoDB
• Cloud & DevOps: AWS (EC2, S3, ECS, Lambda), Docker, Kubernetes, Terraform, CI/CD, GitHub Actions

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2014 – 2018
• GPA: 3.8 / 4.0 | Dean's Honors List

PROJECTS
Distributed Task Queue | github.com/alexmorgan/task-queue
• Built a fault-tolerant distributed worker queue in Go and Redis with automatic retries.
`;

  it('correctly extracts candidate personal info, email, and social links', () => {
    const parsed = parseResume(sampleResume, 'alex-resume.txt');
    expect(parsed.personalInfo.name).toBe('Alex Morgan');
    expect(parsed.personalInfo.email).toBe('alex.morgan@email.com');
    expect(parsed.personalInfo.phone).toBe('+1 (555) 019-2834');
    expect(parsed.personalInfo.linkedin).toContain('linkedin.com/in/alexmorgan');
    expect(parsed.personalInfo.github).toContain('github.com/alexmorgan');
  });

  it('extracts structured work experiences with international date formats and remote flags', () => {
    const parsed = parseResume(sampleResume, 'alex-resume.txt');
    expect(parsed.experience.length).toBe(2);

    const stripeExp = parsed.experience[0];
    expect(stripeExp.role).toContain('Senior Software Engineer');
    expect(stripeExp.company).toContain('Stripe');
    expect(stripeExp.isCurrent).toBe(true);
    expect(stripeExp.bullets.length).toBe(3);
    expect(stripeExp.achievements.length).toBeGreaterThanOrEqual(1);

    const cloudflareExp = parsed.experience[1];
    expect(cloudflareExp.role).toContain('Full-Stack Software Engineer');
    expect(cloudflareExp.isRemote).toBe(true);
  });

  it('extracts education credentials and GPA', () => {
    const parsed = parseResume(sampleResume, 'alex-resume.txt');
    expect(parsed.education.length).toBeGreaterThanOrEqual(1);
    expect(parsed.education[0].institution).toContain('University of California');
    expect(parsed.education[0].gpa).toContain('3.8');
  });

  it('categorizes technical skills across multiple taxonomies', () => {
    const parsed = parseResume(sampleResume, 'alex-resume.txt');
    expect(parsed.skills.languages).toContain('TypeScript');
    expect(parsed.skills.languages).toContain('Go');
    expect(parsed.skills.frameworks).toContain('React');
    expect(parsed.skills.databases).toContain('PostgreSQL');
    expect(parsed.skills.cloud).toContain('AWS');
    expect(parsed.skills.devops).toContain('Docker');
  });

  it('builds valid ResumeDocument intermediate sections with line metadata', () => {
    const parsed = parseResume(sampleResume, 'alex-resume.txt');
    expect(parsed.sections.length).toBeGreaterThanOrEqual(4);
    const expSection = parsed.sections.find((s) => s.type === 'experience');
    expect(expSection).toBeDefined();
    expect(expSection?.confidence).toBeGreaterThanOrEqual(0.9);
  });
});
