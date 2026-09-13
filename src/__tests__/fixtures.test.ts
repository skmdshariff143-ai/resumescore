import { describe, it, expect } from 'vitest';
import { parseResume } from '../lib/parsing/resume-parser';
import { calculateResumeScore } from '../lib/scoring/scoring-engine';
import { parseJobDescription } from '../lib/jobs/job-parser';

describe('Real-World Resume Fixtures & Extreme Cases', () => {
  it('handles Fresh Graduate resumes with high academic honors and zero prior company experience', () => {
    const gradResume = `Sarah Jenkins
sarah.j@alumni.stanford.edu | (555) 444-3333 | github.com/sarahj

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2020 - 2024
• GPA: 3.95 / 4.0 | Summa Cum Laude
• Coursework: Operating Systems, Compilers, Distributed Systems, Machine Learning

SKILLS
C++, Python, Rust, Linux, Algorithms, Git

PROJECTS
Mini Raft Consensus Engine | github.com/sarahj/raft-engine
• Implemented Raft consensus protocol in C++ with automated network partition tests.
`;

    const parsed = parseResume(gradResume, 'grad.txt');
    expect(parsed.education.length).toBeGreaterThanOrEqual(1);
    expect(parsed.education[0].gpa).toContain('3.95');
    expect(parsed.experience.length).toBe(0);

    const score = calculateResumeScore(parsed, undefined, 'general');
    expect(score.overall).toBeGreaterThanOrEqual(40);
    expect(score.dimensions.find((d) => d.key === 'experience')?.score).toBeLessThanOrEqual(50);
  });

  it('handles Senior Staff Architect resumes with multi-year tenure and executive achievements', () => {
    const staffResume = `Marcus Vance
Austin, TX | marcus@vance.io | (555) 888-9999 | linkedin.com/in/marcusvance

SUMMARY
Principal Systems Architect with 12+ years designing mission-critical distributed infrastructure.

WORK EXPERIENCE
Principal Architect | CloudScale Global | 01/2019 – Present
• Architected enterprise multi-cloud mesh across AWS, Azure, and GCP supporting $150M annual transaction volume.
• Slashed cloud egress costs by $420k per year through custom eBPF packet routing.
• Led architectural review board of 45 senior and staff engineers across 8 global locations.

Staff Infrastructure Engineer | DataCorp | 05/2014 – 12/2018
• Re-engineered core messaging bus from RabbitMQ to Kafka, processing 5M events per second with 99.999% availability.
• Spearheaded Kubernetes container migration for 250+ backend microservices.

SKILLS
Go, C++, Rust, Python, AWS, Azure, GCP, Kubernetes, Kafka, Terraform, Distributed Systems, System Design

PROJECTS
Global Service Mesh | github.com/marcusvance/mesh
• Open source eBPF traffic optimizer used by 12,000 developers.

EDUCATION
Master of Science in Computer Engineering | University of Texas at Austin | 2012 - 2014
`;

    const parsed = parseResume(staffResume, 'staff.txt');
    expect(parsed.experience.length).toBe(2);
    expect(parsed.experience[0].achievements.length).toBeGreaterThanOrEqual(2);

    const score = calculateResumeScore(parsed, undefined, 'general');
    expect(score.overall).toBeGreaterThanOrEqual(80);
    expect(score.grade).toMatch(/A|B\+/);
  });

  it('correctly compares job match requirements between Senior Role and Candidate', () => {
    const jobDescription = `Senior Distributed Systems Engineer
Company: OpenAI
Requirements:
• 5+ years of experience with Go or Rust
• Strong experience with Kubernetes and distributed consensus
• Deep understanding of high-throughput message streaming (Kafka)
Preferred:
• Experience with eBPF or low-level Linux kernel networking
`;
    const parsedJob = parseJobDescription(jobDescription);
    expect(parsedJob.requiredSkills.length).toBeGreaterThanOrEqual(2);
  });
});
